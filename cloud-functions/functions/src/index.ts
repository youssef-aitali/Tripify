/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//import { setGlobalOptions } from "firebase-functions";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
//setGlobalOptions({ maxInstances: 10 });

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import { onSchedule } from "firebase-functions/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";

admin.initializeApp();

export const checkScheduledDeletions = onSchedule(
  {
    schedule: "every day 00:00",
    timeZone: "UTC",
    maxInstances: 2,
  },
  async () => {
    try {
      const now = admin.firestore.Timestamp.now();
      logger.log(`Starting scheduled deletions check at ${now.toDate()}`);

      const usersSnapshot = await admin
        .firestore()
        .collection("users")
        .where("pendingDeletion.scheduledFor", "<=", now)
        .get();

      if (usersSnapshot.empty) {
        logger.log("No users scheduled for deletions today!");
        return;
      }

      const deletionPromises = usersSnapshot.docs.map(async (userDoc) => {
        const userId = userDoc.id;
        //const userData = userDoc.data();

        try {
          logger.log(`Processing deletion for user: ${userId}`);

          await admin.auth().deleteUser(userId);
          logger.log(`Deleted auth record for user: ${userId}`);

          await userDoc.ref.update({
            email: `deleted_${userId}@anonymized.com`,
            fullname: `[Deleted User]`,
            username: `[Deleted User]`,
            pendingDeletion: admin.firestore.FieldValue.delete(),
            deletedAt: now,
          });
          logger.log(`Anonymized Firestore data for user: ${userId}`);
        } catch (error) {
          logger.error(`Failed to delete user ${userId}:`, error);
        }
      });

      await Promise.all(deletionPromises);
      logger.log(`Completed processing ${usersSnapshot.size} user deletions`);
    } catch (error) {
      logger.log(error);
    }
  }
);

const gmailEmail = defineSecret("GMAIL_EMAIL");
const gmailPassword = defineSecret("GMAIL_PASSWORD");

// Create email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail.value(),
    pass: gmailPassword.value(),
  },
});

// Helper function to send emails
async function sendEmail(to: string, subject: string, text: string) {
  const mailOptions = {
    from: "support@tripify.com",
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}

export const sendDeletionEmails = onDocumentUpdated(
  {
    document: "users/{userId}",
    region: "us-central1", // Specify your preferred region
    secrets: [gmailEmail, gmailPassword],
    maxInstances: 2, // Limit concurrent executions
  },
  async (event) => {
    try {
      // 1. Get snapshots with proper null checks
      const beforeSnap = event.data?.before;
      const afterSnap = event.data?.after;

      if (!beforeSnap || !afterSnap) {
        logger.error("Missing document snapshots");
        return;
      }

      // 2. Get data with type safety
      const before = beforeSnap.data();
      const after = afterSnap.data();

      // 3. Validate required fields
      if (!after?.email) {
        logger.error("No email found in document");
        return;
      }

      // 4. Check if pendingDeletion was just added
      if (!before?.pendingDeletion && after?.pendingDeletion) {
        await sendEmail(
          after.email,
          "Account Deletion Scheduled",
          `Your account will be deleted on ${after.pendingDeletion.scheduledFor.toDate()}.`
        );
        return;
      }

      // 5. Check for 24-hour warning
      if (after.pendingDeletion && !after.pendingDeletion.notificationSent) {
        const now = new Date();
        const deletionTime = after.pendingDeletion.scheduledFor.toDate();
        const timeLeft = deletionTime.getTime() - now.getTime();

        if (timeLeft <= 24 * 60 * 60 * 1000) {
          await sendEmail(
            after.email,
            "Final Warning: Account Deletion Tomorrow",
            "Your account will be deleted in 24 hours."
          );

          // Mark notification as sent to prevent duplicates
          await afterSnap.ref.update({
            "pendingDeletion.notificationSent": true,
          });
        }
      }
    } catch (error) {
      logger.error("Error in sendDeletionEmails:", error);
      throw error;
    }
  }
);

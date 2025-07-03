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

import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import * as nodemailer from "nodemailer";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Timestamp } from "firebase-admin/firestore";
import { beforeUserSignedIn } from "firebase-functions/v2/identity";
import { HttpsError } from "firebase-functions/v2/https";

initializeApp();

export const beforeUserSignIn = beforeUserSignedIn(async (event) => {
  const user = event.data;

  logger.info("user: ", user);
  logger.info("user.email: ", user?.email);
  logger.info(
    "is sign up method Google: ",
    event.eventType.includes("google.com")
  );
  if (user?.email && event.eventType.includes("google.com")) {
    try {
      const existingUser = await admin.auth().getUserByEmail(user.email);
      const providers = existingUser.providerData.map(
        (provider) => provider.providerId
      );

      if (providers.length === 1 && providers.includes("password")) {
        if (!existingUser?.emailVerified) {
          logger.info(
            `User with email ${user.email} has an existing unverified account: `,
            existingUser
          );

          const httpError = new HttpsError(
            "failed-precondition",
            "auth/existing-unverified-email"
          );

          throw httpError;
        } else {
          logger.info("Allow sign in and Inform user about accounts linking");
        }
      }
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        error.message === "auth/existing-unverified-email"
      ) {
        // Rethrow other admin.auth errors to fail sign-in
        throw error;
      }
      // No existing user, allow sign-in
      logger.info("No existing user, allow sign-in");
      return;
    }
  }
});

export const checkScheduledDeletions = onSchedule(
  {
    schedule: "every day 00:00",
    timeZone: "UTC",
    maxInstances: 2,
  },
  async () => {
    try {
      const now = Timestamp.now();
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

        try {
          logger.log(`Processing deletion for user: ${userId}`);

          await admin.auth().deleteUser(userId);
          logger.log(`Deleted auth record for user: ${userId}`);

          await userDoc.ref.update({
            email: `deleted_${userId}@anonymized.com`,
            fullname: `[Deleted User]`,
            username: `[Deleted User]`,
            photoURL: `[Deleted User]`,
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

setGlobalOptions({
  secrets: [gmailEmail, gmailPassword], // Register secrets
  region: "us-central1",
});

// Helper function to send emails
async function sendEmail(to: string, subject: string, html: string) {
  // Create email transporter (configure with your email service)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailEmail.value(),
      pass: gmailPassword.value(),
    },
  });

  const mailOptions = {
    from: '"Tripify Support" <support@tripify.com>',
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.log(`Email sent to ${to}`);
  } catch (error) {
    logger.error("Email sending failed:", error);
    throw error;
  }
}

export const sendDeletionEmails = onDocumentUpdated(
  {
    document: "users/{userId}",
    secrets: [gmailEmail, gmailPassword],
    maxInstances: 2, // Limit concurrent executions
  },
  async (event) => {
    try {
      // 1. Get snapshots with proper null checks
      const beforeSnap = event.data?.before;
      const afterSnap = event.data?.after;

      if (!beforeSnap || !afterSnap) {
        logger.log("Missing document snapshots");
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
        const htmlContent = `
          <p>Hello ${after.fullname ?? after.username},</p>
          <p>Account scheduled to be deleted in 10 days. After that, it will be
              permanently removed and cannot be recovered. You can change your
              mind any time before <strong> ${format(
                toZonedTime(
                  after.pendingDeletion.scheduledFor.toDate(),
                  after.pendingDeletion.timeZone
                ),

                "EEEE, MMMM d, yyyy h:mm a"
              )}</strong>. 
          </p>
          <br/>
          <p>Your Tripify team</p>
        `;

        await sendEmail(
          after.email,
          "Urgent: Account Deletion Scheduled",
          htmlContent
        );
        return;
      }

      // 5. Check for 24-hour warning
      if (after.pendingDeletion && !after.pendingDeletion.notificationSent) {
        const now = new Date();
        const deletionTime = after.pendingDeletion.scheduledFor.toDate();
        const timeLeft = deletionTime.getTime() - now.getTime();

        if (timeLeft <= 24 * 60 * 60 * 1000) {
          const htmlContent = `
          <p>Hello ${after.fullname ?? after.username},</p>
          <p>Your account will be deleted in <strong>24 hours.</strong>. 
          </p>
          <br/>
          <p>Your Tripify team</p>
        `;

          await sendEmail(
            after.email,
            "Final Warning: Account Deletion Tomorrow",
            htmlContent
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

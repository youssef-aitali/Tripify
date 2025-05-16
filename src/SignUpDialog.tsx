import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

import { Label } from "@radix-ui/react-label";
import { Input } from "./components/ui/input";

import GoogleLogo from "@/assets/icons/google.svg?react";
import FacebookLogo from "@/assets/icons/facebook.svg?react";

type SignUpDialogProps = {
  isSignUpDialogOpen: boolean;
  onSignUpDialogOpenChange: (open: boolean) => void;
};

const SignUpDialog = ({
  isSignUpDialogOpen,
  onSignUpDialogOpenChange,
}: SignUpDialogProps) => {
  return (
    <Dialog open={isSignUpDialogOpen} onOpenChange={onSignUpDialogOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Card className="border-none shadow-none py-1">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Sign up to Tripify</CardTitle>
            <CardDescription>
              Sign up with your Google or Facebook account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid gap-4">
                <div className="flex flex-col gap-4 text-white">
                  <Button variant="outline" className="w-full bg-cyan-900/90">
                    <GoogleLogo className="fill-white" />
                    Sign up with Google
                  </Button>
                  <Button variant="outline" className="w-full bg-cyan-900/90">
                    <FacebookLogo className="fill-white" />
                    Sign up with Facebook
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="grid gap-1 text-sm">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" required />
                  </div>
                  <Button type="submit" className="w-full bg-cyan-900/90">
                    Sign up
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="underline underline-offset-4 font-medium"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;

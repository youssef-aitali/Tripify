import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import GoogleLogo from "@/assets/icons/google.svg?react";
import FacebookLogo from "@/assets/icons/facebook.svg?react";

type LogInDialogProps = {
  isLogInDialogOpen: boolean;
  onSignUpDialogOpenChange: (open: boolean) => void;
  onLogInDialogOpenChange: (open: boolean) => void;
};

const LogInDialog = ({
  isLogInDialogOpen,
  onSignUpDialogOpenChange,
  onLogInDialogOpenChange,
}: LogInDialogProps) => {
  const switchToSignUpDialogHandler = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    onLogInDialogOpenChange(false);
    onSignUpDialogOpenChange(true);
  };
  return (
    <Dialog open={isLogInDialogOpen} onOpenChange={onLogInDialogOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Card className="border-none shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Log in to Tripify</CardTitle>
            <CardDescription>
              Log in with your Google or Facebook account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid gap-4">
                <div className="flex flex-col gap-2 text-white">
                  <Button
                    variant="outline"
                    className="w-full bg-cyan-900/90 hover:bg-cyan-900 hover:text-white"
                  >
                    <GoogleLogo className="fill-white" />
                    Log in with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-cyan-900/90 hover:bg-cyan-900 hover:text-white"
                  >
                    <FacebookLogo className="fill-white" />
                    Log in with Facebook
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="grid gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-cyan-900/90 mt-2 hover:bg-cyan-900 hover:text-white"
                  >
                    Log in
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Button
                    variant="link"
                    className="underline cursor-pointer p-0"
                    onClick={switchToSignUpDialogHandler}
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default LogInDialog;

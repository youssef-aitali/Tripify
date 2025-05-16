import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import facebookIcon from "@/assets/icons/facebook.svg";
import googleIcon from "@/assets/icons/google.svg";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LogInDialogProps = {
  isLogInDialogOpen: boolean;
  onLogInDialogOpenChange: (open: boolean) => void;
};

const LogInDialog = ({
  isLogInDialogOpen,
  onLogInDialogOpenChange,
}: LogInDialogProps) => {
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
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button variant="outline" className="w-full">
                    <img src={googleIcon} alt="Google Icon" className="w-4" />
                    Log in with Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <img
                      src={facebookIcon}
                      alt="Facebook Icon"
                      className="w-4"
                    />
                    Log in with Facebook
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="grid gap-6">
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
                  <Button type="submit" className="w-full">
                    Log in
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a
                    href="#"
                    className="underline underline-offset-4 font-medium"
                  >
                    Sign up
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

export default LogInDialog;

import Navbar from "@/components/custom/Navbar";
import { useState } from "react";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

const HomeLayout = () => {
  const [isLogInDialogOpen, setIsLogInDialogOpen] = useState(false);

  return (
    <>
      <Navbar
        isLogInDialogOpen={isLogInDialogOpen}
        setIsLogInDialogOpen={setIsLogInDialogOpen}
      />
      <div className="px-[20%] pt-6 grow">
        <Outlet context={setIsLogInDialogOpen} />
        <Toaster richColors />
      </div>
    </>
  );
};

export default HomeLayout;

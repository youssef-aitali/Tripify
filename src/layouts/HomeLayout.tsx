import { useState } from "react";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

import Navbar from "@/components/custom/Navbar";

const HomeLayout = () => {
  const [isLogInDialogOpen, setIsLogInDialogOpen] = useState(false);

  return (
    <>
      <Navbar
        isLogInDialogOpen={isLogInDialogOpen}
        setIsLogInDialogOpen={setIsLogInDialogOpen}
      />
      <div className="px-[20%] pt-4 grow">
        <Outlet context={setIsLogInDialogOpen} />
        <Toaster richColors />
      </div>
    </>
  );
};

export default HomeLayout;

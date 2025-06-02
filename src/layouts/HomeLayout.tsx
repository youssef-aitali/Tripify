import Navbar from "@/components/custom/Navbar/Navbar";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

const HomeLayout = () => {
  return (
    <>
      <Navbar />
      <div className="px-[20%] pt-6 grow">
        <Outlet />
        <Toaster richColors />
      </div>
    </>
  );
};

export default HomeLayout;

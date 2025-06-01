import Navbar from "@/components/custom/Navbar/Navbar";
import { Toaster } from "sonner";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-svh px-[20%]">
      <Navbar />
      <div className="bg-gray-200 grow">Content</div>
      <Toaster richColors />
    </div>
  );
};

export default HomePage;

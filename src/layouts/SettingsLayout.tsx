import { Outlet } from "react-router";

import SettingsNavbar from "@/features/settings/components/SettingsNavbar";

const SettingsLayout = () => {
  return (
    <div className="px-[20%]">
      <div className="text-3xl font-semibold mb-8">Settings</div>
      <div className="flex">
        <SettingsNavbar />
        <div className="px-[20%] w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;

import { Outlet } from "react-router";

import SettingsNavbar from "@/features/settings/components/SettingsNavbar";

const SettingsLayout = () => {
  return (
    <div className="px-[20%]">
      <p className="text-2xl font-semibold mb-8">Settings</p>
      <div className="flex gap-20">
        <SettingsNavbar />
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;

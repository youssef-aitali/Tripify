import { Outlet } from "react-router";

import SettingsNavbar from "@/features/settings/components/SettingsNavbar";

const SettingsLayout = () => {
  return (
    <>
      <p className="text-2xl font-semibold mb-8">Settings</p>
      <div className="flex gap-20">
        <SettingsNavbar />
        <Outlet />
      </div>
    </>
  );
};

export default SettingsLayout;

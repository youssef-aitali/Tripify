import TButton from "@/components/custom/TButton";
import { ROUTE_PATHS } from "@/routes/routePaths";
import { Link, NavLink } from "react-router";

const SettingsNavbar = () => {
  return (
    <div className="flex flex-col w-20 items-start gap-6">
      <TButton variant="link" className="text-lg">
        <NavLink to={ROUTE_PATHS.ACCOUNT}>Account</NavLink>
      </TButton>
      <TButton variant="link" className="text-lg">
        <NavLink to={ROUTE_PATHS.PREFERENCES}>Preferences</NavLink>
      </TButton>
    </div>
  );
};

export default SettingsNavbar;

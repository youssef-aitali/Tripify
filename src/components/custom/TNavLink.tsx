import { NavLink } from "react-router";

import TButton from "@/components/custom/TButton";
import { ROUTE_PATHS } from "@/routes/routePaths";

const TNavLink = ({ label }: { label: string }) => {
  const pathKey = label.toUpperCase() as keyof typeof ROUTE_PATHS;
  const routePath = ROUTE_PATHS[pathKey];

  return (
    <TButton variant="link" className="text-lg font-medium">
      <NavLink
        to={routePath}
        className={({ isActive }) =>
          isActive ? "text-accent underline" : "text-primary"
        }
      >
        {label}
      </NavLink>
    </TButton>
  );
};

export default TNavLink;

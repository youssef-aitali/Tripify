import TNavLink from "@/components/custom/TNavLink";

const SettingsNavbar = () => {
  return (
    <div className="flex flex-col w-20 items-start gap-6">
      <TNavLink label="Account" />
      <TNavLink label="Preferences" />
    </div>
  );
};

export default SettingsNavbar;

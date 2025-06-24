import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

const PreferencesPage = () => {
  const { i18n, t } = useTranslation("common");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng); // Persist choice
  };

  return (
    <div className="flex flex-col gap-6">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
      <h1>{t("welcome")}</h1>
      <div className="flex flex-col gap-4">
        <div className="font-medium">Language</div>
        <RadioGroup defaultValue="System">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="System" id="system" />
            <Label htmlFor="system" className="font-normal">
              Use system settings
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="English" id="english" />
            <Label htmlFor="english" className="font-normal">
              English
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="French" id="french" />
            <Label htmlFor="french" className="font-normal">
              French
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="flex flex-col gap-4">
        <Label>Appearance</Label>
        <RadioGroup defaultValue="System">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="System" id="system" />
            <Label htmlFor="system" className="font-normal">
              Use system settings
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Light" id="light" />
            <Label htmlFor="light" className="font-normal">
              Light
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Dark" id="dark" />
            <Label htmlFor="dark" className="font-normal">
              Dark
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="flex flex-col gap-4">
        <Label>Notifications</Label>
        <div className="flex items-center gap-2">
          <Checkbox id="notifications" defaultChecked />
          <Label htmlFor="notifications" className="font-normal">
            Reminders about your upcomings trips
          </Label>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;

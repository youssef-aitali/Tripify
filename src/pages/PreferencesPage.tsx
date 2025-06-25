import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { updateUserPreferredLanguage } from "@/features/settings/services/settingsService";

const PreferencesPage = () => {
  const { currentUser } = useAuthUser();
  const { i18n } = useTranslation("common");

  const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);
    await updateUserPreferredLanguage(currentUser!.uid, lng);
    //localStorage.setItem("appLng", lng); // Persist choice
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="font-medium">Language</div>
        <RadioGroup defaultValue="en" onValueChange={changeLanguage}>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="en" id="english" />
            <Label htmlFor="english" className="font-normal">
              English
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="fr" id="french" />
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

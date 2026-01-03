import { DangerZone } from "@/components/settings/danger-zone";
import { GithubSection } from "@/components/settings/github-section";
import { PreferencesSection } from "@/components/settings/preferences-section";
import { ProfileSection } from "@/components/settings/profile-section";
import { SubscriptionSection } from "@/components/settings/subscription-section";

export default function SettingsPage() {
  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-1">
          Manage your account, integrations, and preferences.
        </p>
      </div>

      <ProfileSection />
      <GithubSection />
      {/* <SubscriptionSection /> */}
      <PreferencesSection />
      <DangerZone />
    </div>
  );
}

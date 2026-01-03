import { Card } from "@/components/ui/card";

import { ProfileForm } from "./profile-form";
import { getUserProfile } from "@/module/settings/actions";

export async function ProfileSection() {
  const user = await getUserProfile();

  if (!user) return null;

  return (
    <Card className="bg-black border-white/10 p-6">
      <h2 className="text-lg font-semibold text-gray-200 mb-4">Profile</h2>

      <ProfileForm user={user} />
    </Card>
  );
}

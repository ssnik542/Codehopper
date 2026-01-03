"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export function PreferencesSection() {
  const [darkMode, setDarkMode] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  return (
    <Card className="bg-black border-white/10 p-6">
      <h2 className="text-lg font-semibold text-gray-200">Preferences</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Dark mode</span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} disabled />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Email notifications</span>
          <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
        </div>
      </div>
    </Card>
  );
}

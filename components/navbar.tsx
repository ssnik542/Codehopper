import Link from "next/link";
import Image from "next/image";

import { getSession } from "@/module/auth/utils/auth-utils";
import { LogoutButton } from "@/module/auth/components/Logout";

export async function Navbar() {
  const user = await getSession();
  console.log("Navbar user:", user);
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* LEFT: Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-500" />
          <span className="text-lg font-semibold text-white">CodeHopper</span>
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {!user ? (
            <Link
              href="/login"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200"
            >
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="flex items-center gap-3">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold">
                    {user.name?.[0] ?? "U"}
                  </div>
                )}

                <span className="text-sm text-white">{user.name}</span>
              </div>

              {/* Logout */}
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

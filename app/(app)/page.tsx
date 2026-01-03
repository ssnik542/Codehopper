import LandingPage from "@/components/landing-page";
import { getSession } from "@/module/auth/utils/auth-utils";
import { redirect } from "next/navigation";
export default async function Home() {
  const session = await getSession();
  console.log("Session in page.tsx:", session);
  if (session) {
    redirect("/dashboard");
  }
  return <LandingPage />;
}

import LoginUi from "@/module/auth/components/LoginUi";
import { requireUnAuth } from "@/module/auth/utils/auth-utils";

async function LoginPage() {
  await requireUnAuth();
  return (
    <div>
      <LoginUi />
    </div>
  );
}

export default LoginPage;

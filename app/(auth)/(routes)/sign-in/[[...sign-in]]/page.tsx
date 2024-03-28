import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="h-screen">
      <SignIn />
    </div>
  );
}

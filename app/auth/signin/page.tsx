import { Button } from "@/components/ui/button";
import { signIn } from "@/app/auth";
export default function SignIn() {
  return (
    <div className="h-screen flex items-center justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <Button type="submit">Sign in with Google</Button>
      </form>
    </div>
  );
}

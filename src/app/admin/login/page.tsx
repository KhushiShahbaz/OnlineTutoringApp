import type { Metadata } from "next";
import { StaffLoginForm } from "@/components/sections/staff-login-form";

export const metadata: Metadata = {
  title: "Staff Login — Global Teaching Hub",
};

export default function StaffLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/20 px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Staff Login</h1>
          <p className="mt-3 text-muted-foreground">
            Login to the Admin or Teacher portal.
          </p>
        </div>

        <div className="mt-10">
          <StaffLoginForm />
        </div>
      </div>
    </main>
  );
}

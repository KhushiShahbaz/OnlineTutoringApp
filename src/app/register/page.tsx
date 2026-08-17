import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RegisterForm } from "@/components/sections/register-form";

export const metadata: Metadata = {
  title: "Sign Up — Global Teaching Hub",
  description: "Create your Global Teaching Hub student account.",
};

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Create Your Account
            </h1>
            <p className="mt-3 text-muted-foreground">
              Sign up to book classes and track your learning journey.
            </p>
          </div>

          <div className="mt-10">
            <RegisterForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

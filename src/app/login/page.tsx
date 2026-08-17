import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LoginForm } from "@/components/sections/login-form";

export const metadata: Metadata = {
  title: "Login — Global Teaching Hub",
  description: "Login to your Global Teaching Hub student account.",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Login
            </h1>
            <p className="mt-3 text-muted-foreground">
              Welcome back! Login to access your student dashboard.
            </p>
          </div>

          <div className="mt-10">
            <LoginForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { PopularCourses } from "@/components/sections/popular-courses";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { Teachers } from "@/components/sections/teachers";
import { Testimonials } from "@/components/sections/testimonials";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Pricing } from "@/components/sections/pricing";
import { AppDownload } from "@/components/sections/app-download";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <PopularCourses />
        <WhyChooseUs />
        <Teachers />
        <Testimonials />
        <HowItWorks />
        <Pricing />
        <AppDownload />
      </main>
      <Footer />
    </>
  );
}

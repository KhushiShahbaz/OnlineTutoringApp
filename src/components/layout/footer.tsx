import Link from "next/link";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/icons/social";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "How It Works", href: "/#how-it-works" },
];

const RESOURCES = [
  { label: "FAQs", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const SUPPORT = [
  { label: "Contact Us", href: "/contact" },
  { label: "Help Center", href: "/faq" },
  { label: "Live Chat", href: "/contact" },
  // { label: "Staff Login", href: "/admin/login" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-background">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span>Global Teaching Hub</span>
             
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-background/70">
            Empowering students through quality education. Learn, grow, and
            achieve your dreams with us.
          </p>
          {/* <div className="mt-5 flex gap-3">
            {[FacebookIcon, InstagramIcon, YoutubeIcon, LinkedinIcon].map(
              (Icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background/80 transition hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </span>
              )
            )}
          </div> */}
        </div>

        <FooterColumn title="Quick Links" links={QUICK_LINKS} />
        <FooterColumn title="Resources" links={RESOURCES} />
        <FooterColumn title="Support" links={SUPPORT} />
      </div>

      <div className="border-t border-background/10 py-6 text-center text-xs text-background/60">
        © {new Date().getFullYear()} Global Teaching Hub. All Rights Reserved.
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-background">{title}</h4>
      <ul className="mt-4 flex flex-col gap-3 text-sm text-background/70">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="hover:text-background">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

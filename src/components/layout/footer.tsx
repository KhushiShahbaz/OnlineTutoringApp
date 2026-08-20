import Link from "next/link";
import Image from "next/image";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/icons/social";
import { Phone, Mail, MapPin } from "lucide-react";
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
            <Image
              src="/logo-icon.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span>Global Teaching Hub</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-background/70">
            Empowering students through quality education. Learn, grow, and
            achieve your dreams with us.
          </p>
          <div className="mt-6 space-y-3 text-sm text-background/70">
            <div className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <a
                href="tel:+923195459398"
                className="transition hover:text-background hover:underline"
              >
                +92 319 5459398
              </a>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <a
                href="mailto:globalteachinghub1@gmail.com"
                className="break-all transition hover:text-background hover:underline"
              >
                globalteachinghub1@gmail.com
              </a>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <a
                href="https://maps.google.com/?q=Lahore,Pakistan"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-background hover:underline"
              >
                Lahore, Pakistan
              </a>
            </div>
          </div>
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

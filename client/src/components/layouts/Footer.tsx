import { Link } from 'react-router-dom';

import { Trophy, Mail } from 'lucide-react';
import { FaGithub, FaXTwitter } from "react-icons/fa6";

const footerLinks = {
  Product: [
    {
      label: 'Features',
      href: '#features',
    },

    {
      label: 'How It Works',
      href: '#how-it-works',
    },

    {
      label: 'FAQ',
      href: '#faq',
    },
  ],

  Company: [
    {
      label: 'About',
      to: '/about',
    },

    {
      label: 'Contact',
      to: '/contact',
    },
  ],

  Resources: [
    {
      label: 'GitHub',
      href: 'https://github.com',
    },

    {
      label: 'Documentation',
      href: '#',
    },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="space-y-6 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Trophy className="h-5 w-5" />
              </div>

              <span className="text-2xl font-bold quizblitz-text-gradient">
                QuizBlitz
              </span>
            </Link>

            <p className="max-w-md leading-relaxed text-muted-foreground">
              Challenge friends, classmates, and communities through exciting
              real-time quizzes designed for learning and fun.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border p-2 transition-colors hover:bg-muted"
              >
                <FaGithub className="h-5 w-5" />
              </a>

              <a
                href="#"
                className="rounded-lg border p-2 transition-colors hover:bg-muted"
              >
                <FaXTwitter className="h-5 w-5" />
              </a>

              <a
                href="mailto:hello@quizblitz.com"
                className="rounded-lg border p-2 transition-colors hover:bg-muted"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-6 font-semibold">Product</h3>

            <ul className="space-y-4">
              {footerLinks.Product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-6 font-semibold">Company</h3>

            <ul className="space-y-4">
              {footerLinks.Company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-6 font-semibold">Resources</h3>

            <ul className="space-y-4">
              {footerLinks.Resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} QuizBlitz. All rights reserved.</p>

          <p>Built with ❤️ by Shubham</p>
        </div>
      </div>
    </footer>
  );
}
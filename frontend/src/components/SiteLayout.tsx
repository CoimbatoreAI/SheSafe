import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Home, LayoutGrid, Target, User, ShieldCheck } from "lucide-react";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col pb-16 sm:pb-0 relative">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Mobile Sticky Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-border/60 bg-white px-2 py-2 sm:hidden shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
        {[
          { to: "/", icon: Home, label: "Home" },
          { to: "/shop", icon: LayoutGrid, label: "Shop" },
          { to: "/awareness", icon: Target, label: "Awareness" },
          { to: "/login", icon: User, label: "Account" },
        ].map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? "text-pink" : "text-navy/60 hover:text-navy"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

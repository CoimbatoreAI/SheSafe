import { API_URL } from "@/lib/api";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/api/users/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <footer className="mt-24 border-t border-border/60 bg-gradient-to-b from-background to-pink-soft/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              By women, for women. We commit to protecting and earning the trust of one million
              women in India by 2029 through reliable safety products and expert-led awareness
              programs.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold text-navy">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["/", "Home"],
                ["/shop", "Shop"],
                ["/awareness", "Awareness Programs"],
                ["/certified", "Certified Products"],
                ["/about", "About Us"],
                ["/contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-navy/70 transition-colors hover:text-pink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold text-navy">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-navy/80">
              <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pink" /> 40, P&amp;K Gem field avenue, Vellakinar, Coimbatore 641029</li>
              <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 text-pink" /> 9363941141</li>
              <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-pink" /> ms.shesafein@gmail.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold text-navy">Subscribe</h4>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground mb-4">
              Get updates on new safety products and exclusive offers straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-navy outline-none focus:border-pink"
              />
              <button 
                type="submit" 
                disabled={status === "loading"}
                className="bg-navy hover:bg-navy-light text-white font-bold py-2 rounded-md text-sm transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
              {status === "success" && <p className="text-green-600 text-xs mt-1 font-semibold">Subscribed successfully!</p>}
              {status === "error" && <p className="text-red-500 text-xs mt-1 font-semibold">Subscription failed.</p>}
            </form>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Shesafein. A women proprietorship firm.</p>
          <p>Owner: M. Savithiri</p>
        </div>
      </div>
    </footer>
  );
}

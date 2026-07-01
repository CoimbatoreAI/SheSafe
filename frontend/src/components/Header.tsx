import { API_URL } from "@/lib/api";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, Search, ShoppingBag, User, X, Zap, ArrowLeft } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";

const desktopNav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop Sprays" },
  { to: "/awareness", label: "Awareness" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const mobileNav = [
  { to: "/shop", label: "All Products" },
  { to: "/shop?section=Best+Sellers", label: "Best Sellers" },
  { to: "/shop?section=New+Launches", label: "New Launches" },
  { to: "/shop?section=Essentials", label: "Summer Essentials" },
  { to: "/about", label: "About Page" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [offers, setOffers] = useState<any[]>([]);
  const { count } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/offers`)
      .then(res => res.json())
      .then(data => setOffers(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const translateEl = document.getElementById("google_translate_element");
      const mobileContainer = document.getElementById("mobile_translate_container");
      const desktopContainer = document.getElementById("desktop_translate_container");

      if (window.innerWidth < 1024) {
        if (translateEl && mobileContainer && translateEl.parentElement !== mobileContainer) {
          mobileContainer.appendChild(translateEl);
        }
      } else {
        if (translateEl && desktopContainer && translateEl.parentElement !== desktopContainer) {
          desktopContainer.appendChild(translateEl);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    // Give it a tiny delay to ensure the DOM is ready on first load
    const timer = setTimeout(handleResize, 100);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      {offers.length > 0 && (
        <div className="bg-pink px-4 py-2 text-sm font-bold text-white tracking-wide overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-[marquee_20s_linear_infinite]">
            {offers.map((offer, index) => (
              <span key={offer._id} className="mx-8">
                Use code <span className="bg-white text-pink px-2 py-0.5 rounded shadow-sm">{offer.code}</span> for {offer.discountPercentage}% OFF!
              </span>
            ))}
          </div>
        </div>
      )}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-white shadow-sm">
        <div className="mx-auto flex h-20 sm:h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Mobile Hamburger (Left) */}
          <div className="flex flex-1 items-center justify-start lg:hidden">
            <button
              onClick={() => setOpen(true)}
              aria-label="Toggle menu"
              className="flex items-center gap-1 text-navy transition-colors hover:text-pink font-semibold text-sm"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Logo (Center on mobile, Left on desktop) */}
          <div className="flex flex-1 items-center justify-center lg:justify-start">
            <Logo className="scale-90 sm:scale-100" />
          </div>
          
          {/* Desktop Nav (Center) */}
          <nav className="hidden items-center justify-center gap-8 lg:flex flex-[2]">
            {desktopNav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) => 
                  `text-sm transition-colors hover:text-pink ${isActive ? "text-pink font-semibold border-b-2 border-pink pb-1" : "text-navy/70 font-medium"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions (Right) */}
          <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
            {/* Language Translation Element Container (Desktop) */}
            <div id="desktop_translate_container" className="hidden lg:flex items-center text-sm">
              <div id="google_translate_element" className="flex items-center text-sm"></div>
            </div>

            <button onClick={() => setSearchOpen(!searchOpen)} className="text-navy hover:text-pink transition-colors">
              <Search className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <Link to="/login" className="hidden sm:block text-navy hover:text-pink transition-colors relative">
              <User className="h-6 w-6" />
              <Zap className="h-3 w-3 text-[#ff9900] fill-[#ff9900] absolute -bottom-1 -right-1" />
            </Link>

            <Link
              to="/cart"
              aria-label="View cart"
              className="relative flex items-center text-navy transition-colors hover:text-pink p-1"
            >
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-[16px] min-w-[16px] place-items-center rounded-full bg-[#ff9900] px-1 text-[9px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-border p-4 shadow-md z-50">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative flex items-center">
              <input
                type="text"
                autoFocus
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm text-navy outline-none transition focus:border-pink pr-12"
              />
              <button type="submit" className="absolute right-4 text-navy/50 hover:text-pink">
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Full Screen Mobile Menu */}
      <div 
        className={`fixed inset-0 z-50 bg-white lg:hidden flex flex-col h-[100dvh] overflow-y-auto transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
          {/* Menu Header */}
          <div className="flex h-20 items-center justify-between px-4 border-b border-border/40">
             <button onClick={() => setOpen(false)} className="text-navy p-1">
               <ArrowLeft className="h-6 w-6" />
             </button>
             <Logo className="scale-90" />
             <Link to="/cart" onClick={() => setOpen(false)} className="relative text-navy p-1">
               <ShoppingBag className="h-6 w-6" />
               {count > 0 && (
                 <span className="absolute -right-1 -top-1 grid h-[16px] min-w-[16px] place-items-center rounded-full bg-[#ff9900] px-1 text-[9px] font-bold text-white">
                   {count}
                 </span>
               )}
             </Link>
          </div>

          {/* User Profile Banner */}
          <div className="bg-[#fff0f3] flex items-center gap-4 px-6 py-5">
             <div className="relative">
               <User className="h-8 w-8 text-navy" />
               <Zap className="h-4 w-4 text-[#ff9900] fill-[#ff9900] absolute -bottom-1 -right-1" />
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-semibold text-navy">
                 {localStorage.getItem('token') ? "Hey, Taboo Breaker" : "Hello Guest"}
               </span>
               <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-bold text-navy underline decoration-1 underline-offset-2 hover:text-pink mb-2">
                 My Account
               </Link>
               <div id="mobile_translate_container" className="flex items-center"></div>
             </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col px-6 py-4">
             {mobileNav.map((n) => (
               <NavLink
                 key={n.to}
                 to={n.to}
                 onClick={() => setOpen(false)}
                 className="py-5 text-base font-medium text-navy border-b border-border/40 hover:text-pink transition-colors"
               >
                 {n.label}
               </NavLink>
             ))}
          </nav>
        </div>
    </>
  );
}

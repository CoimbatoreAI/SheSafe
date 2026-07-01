import { Link } from "react-router-dom";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group relative inline-block ${className}`}>
      <img 
        src="/logo.png" 
        alt="Shesafein Logo" 
        className="relative z-10 h-10 lg:h-12 w-auto object-contain transition-transform group-hover:scale-105" 
      />
    </Link>
  );
}

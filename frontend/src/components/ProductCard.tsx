import { CheckCircle2, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart";

export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  reviews?: number;
  badge?: string;
  description?: string;
  affiliateUrl?: string;
  stock?: number;
  questions?: { q: string; a: string }[];
};

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm hover:shadow-md transition-shadow">
      
      {/* Top Left Tags */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1 items-start">
        {product.badge && (
          <span className="bg-[#ffb3c6] px-2 py-0.5 text-[10px] font-bold text-[#800020] rounded-sm shadow-sm">
            {product.badge}
          </span>
        )}

      </div>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#f0f5f9]">
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center">
            <span className="bg-red-600 text-white font-black px-4 py-1.5 uppercase text-xs tracking-wider rounded shadow-md transform -rotate-12">Out of Stock</span>
          </div>
        )}
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${product.stock === 0 ? 'grayscale opacity-50' : ''}`}
        />
      </Link>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        
        {/* Rating */}
        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-navy/70 mb-2">
          <span className="text-[#ffb300] text-sm leading-none">★</span>
          <strong className="text-navy">{(product.rating || 0).toFixed(2)}</strong>
          <span>|</span>
          <span>{product.reviewsCount || 0} Reviews</span>
        </div>

        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-navy text-sm sm:text-base leading-tight line-clamp-2 hover:text-pink transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Highlight Box */}
        {product.features && product.features.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5 rounded bg-[#fdfaf0] border border-[#f5ead2] px-2 py-1.5 text-[10px] sm:text-xs text-navy font-medium w-fit">
            <CheckCircle2 className="h-3 w-3 text-navy fill-transparent" />
            {product.features[0]}
          </div>
        )}

        <div className="mt-auto pt-3">
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold text-navy">₹ {product.price.toLocaleString()}</span>
          </div>

          {/* Promo Box */}
          {product.activeOffer && (
            <div className="mt-1 flex items-center gap-1.5 rounded-full bg-[#eef7ec] px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-[#1e7b34] w-fit">
               <Tag className="h-3 w-3" />
               {product.activeOffer}
            </div>
          )}

          {/* CTA Button */}
          {product.stock === 0 ? (
            <button
              disabled
              className="mt-3 block w-full rounded-md bg-gray-300 py-2.5 text-center text-sm font-bold text-gray-500 cursor-not-allowed shadow-sm"
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={() => add({ id: product.id, title: product.title, price: product.price, image: product.image, stock: product.stock || 0 })}
              className="mt-3 block w-full rounded-md bg-black py-2.5 text-center text-sm font-bold text-white transition-opacity hover:opacity-90 shadow-md"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

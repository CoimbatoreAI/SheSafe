import { API_URL } from "@/lib/api";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Star, Truck, ShieldAlert,
  CreditCard, HandCoins, Leaf, Rabbit, HeartHandshake, ShieldCheck, Tag, ShoppingBag, Copy
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [openAccordion, setOpenAccordion] = useState<string | null>("Description");
  
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Fetch product details
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => p._id === id);
        setProduct(found);
        setRelated(data.filter((p: any) => p._id !== id).slice(0, 4));
        setLoading(false);
        setSelectedSize(found?.sizes?.[0] || null);
        setQuantity(1);
        setCurrentImageIndex(0);
      });

    // Fetch active offers
    fetch(`${API_URL}/api/offers`)
      .then(res => res.json())
      .then(data => setOffers(data))
      .catch(err => console.error(err));
  }, [id]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code ${code} copied to clipboard!`);
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold text-navy">Loading product details...</h2>
        </div>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold text-navy">Product not found</h2>
          <Link to="/shop" className="mt-4 text-pink hover:underline">Return to Shop</Link>
        </div>
      </SiteLayout>
    );
  }

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-32 overflow-x-hidden">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-semibold text-navy/70 transition-colors hover:text-pink mb-4"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/5] sm:aspect-square w-full bg-[#f8f9fa] rounded-xl overflow-hidden">
               {product.badge && (
                 <span className="absolute left-4 top-4 bg-[#ffb3c6] px-3 py-1 text-xs font-bold text-[#800020] rounded shadow-sm z-10">
                   {product.badge}
                 </span>
               )}
               {product.images.length > 1 && (
                 <>
                   <button onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : product.images.length - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md z-10 hover:bg-white text-navy font-bold">{"<"}</button>
                   <button onClick={() => setCurrentImageIndex(prev => prev < product.images.length - 1 ? prev + 1 : 0)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md z-10 hover:bg-white text-navy font-bold">{">"}</button>
                 </>
               )}
               <img src={`${API_URL}${product.images[currentImageIndex]}`} alt={product.title} className="h-full w-full object-cover mix-blend-multiply" />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2 hide-scrollbar">
                 {product.images.map((img: string, idx: number) => (
                   <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-16 h-16 rounded border ${idx === currentImageIndex ? 'border-pink' : 'border-border'} overflow-hidden bg-white flex-shrink-0`}>
                     <img src={`${API_URL}${img}`} className="w-full h-full object-contain p-1" alt="thumb" />
                   </button>
                 ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Add to Cart */}
          <div className="flex flex-col">
             {/* Rating */}
             <div className="flex items-center gap-1.5 text-sm text-navy/60 font-medium mb-3 flex-wrap">
               <Star className="h-4 w-4 fill-[#ffb300] text-[#ffb300]" />
               <span className="text-navy font-bold">{product.rating?.toFixed(1) || 5.0}</span>
               <span>|</span>
               <span>{product.reviewsCount || 0} Reviews</span>
             </div>

             {/* Title */}
             <h1 className="text-2xl sm:text-4xl font-bold text-navy leading-tight mb-4 break-words">
               {product.title}
             </h1>

             {/* Highlight Feature Boxes */}
             {product.features && product.features.length > 0 && (
               <div className="flex flex-wrap gap-2 mb-6">
                  {product.features.map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5 rounded bg-[#fdfaf0] border border-[#f5ead2] px-3 py-1.5 text-xs text-navy font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-navy fill-transparent" />
                      {feat}
                    </div>
                  ))}
               </div>
             )}

             {/* Price Block */}
             <div className="flex items-baseline gap-2 mb-1 flex-wrap">
               <span className="text-3xl font-black text-navy">₹{product.price.toLocaleString()}</span>
               {product.mrp > product.price && (
                 <span className="text-sm text-navy/50 line-through">₹{product.mrp.toLocaleString()}</span>
               )}
             </div>
             <p className="text-[10px] text-navy/50 mb-4">MRP(Inclusive all taxes)</p>

             {/* Active Offers Banner */}
             {product.activeOffer && (
               <div className="bg-[#eef7ec] rounded p-3 flex justify-between items-center mb-6 flex-wrap gap-2">
                 <div className="flex items-center gap-2 text-sm font-semibold text-[#1e7b34]">
                   <Tag className="h-4 w-4 shrink-0" /> <span className="break-words">{product.activeOffer}</span>
                 </div>
               </div>
             )}

             {/* Global Offers List (Swipeable) */}
             {offers.length > 0 && (
               <div className="mb-6">
                 <p className="text-sm text-navy mb-2 font-bold">Available Offers</p>
                 <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
                   {offers.map(offer => (
                     <div key={offer._id} className="min-w-[200px] bg-pink-soft border border-pink/20 rounded-lg p-3 snap-start shrink-0 flex flex-col gap-2 relative shadow-sm">
                       <div className="flex items-center justify-between">
                         <span className="font-black text-pink text-lg">{offer.discountPercentage}% OFF</span>
                         <Tag className="h-4 w-4 text-pink" />
                       </div>
                       <p className="text-xs text-navy/70">Use code at checkout</p>
                       <button onClick={() => copyCode(offer.code)} className="mt-1 flex items-center justify-center gap-1.5 bg-white border border-pink border-dashed text-pink font-bold py-1.5 rounded text-sm hover:bg-pink hover:text-white transition-colors">
                         {offer.code} <Copy className="h-3.5 w-3.5" />
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {/* Variants */}
             {product.sizes && product.sizes.length > 0 && (
               <div className="mb-6 bg-[#f8f9fa] p-4 rounded-xl">
                 <p className="text-sm text-navy mb-3">Choose Your <strong className="text-pink">Size/Pack</strong></p>
                 <div className="flex flex-wrap gap-2">
                   {product.sizes.map((s: string, idx: number) => (
                     <button 
                       key={idx} 
                       onClick={() => setSelectedSize(s)}
                       className={`border-2 ${s === selectedSize ? 'border-pink' : 'border-border/50'} text-navy font-bold px-4 py-2 rounded bg-white shadow-sm text-sm`}
                     >
                       {s}
                     </button>
                   ))}
                 </div>
               </div>
             )}

          {/* CTA Box */}
          <div className="bg-white p-4 border-t border-border mt-6">
            <div className="flex items-center gap-4 mb-4">
               <span className="text-sm font-bold text-navy">Quantity:</span>
               <div className="flex items-center bg-[#f8f9fa] rounded border border-border overflow-hidden h-10">
                 <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 h-full text-navy font-bold hover:bg-slate-200 transition-colors">-</button>
                 <span className="px-4 h-full flex items-center justify-center text-navy font-bold">{quantity}</span>
                 <button onClick={() => setQuantity(q => q + 1)} className="px-4 h-full text-navy font-bold hover:bg-slate-200 transition-colors">+</button>
               </div>
            </div>
            {product.stock === 0 ? (
              <button 
                disabled
                className="w-full bg-gray-300 text-gray-500 font-bold py-4 rounded text-lg uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed shadow-sm"
              >
                OUT OF STOCK
              </button>
            ) : (
              <button 
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    add({ id: product._id, title: `${product.title} ${selectedSize ? `(${selectedSize})` : ''}`, price: product.price, image: `${API_URL}${product.images[0]}`, stock: product.stock || 0 });
                  }
                  alert(`Added ${quantity} item(s) to cart!`);
                }} 
                className="w-full bg-pink text-white font-bold py-4 rounded text-lg hover:bg-[#d81b60] transition-colors shadow-md shadow-pink/30 uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                ADD TO CART
              </button>
            )}
            
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-navy/60 font-medium">
                <div className="flex items-center gap-2 text-xs font-semibold text-navy/80">
                   <Truck className="h-5 w-5 text-pink shrink-0" />
                   <span>Shipping Across India</span>
                </div>
             </div>
          </div>

             {/* Accordions */}
             <div className="flex flex-col gap-3">
               {["Description", "Benefits", "How To Use", "Product Specifications"].map((section) => (
                 <div key={section} className="bg-[#f8f9fa] rounded-xl overflow-hidden">
                   <button 
                     onClick={() => toggleAccordion(section)}
                     className="w-full flex justify-between items-center p-4 font-bold text-navy text-sm sm:text-base"
                   >
                     {section}
                     {openAccordion === section ? <ChevronUp className="h-5 w-5 text-navy/50 shrink-0" /> : <ChevronDown className="h-5 w-5 text-navy/50 shrink-0" />}
                   </button>
                   {openAccordion === section && (
                     <div className="p-4 pt-0 text-xs sm:text-sm text-navy/70 leading-relaxed bg-white border-t border-border/40 whitespace-pre-wrap">
                       {section === "Description" && (product.description || "No description provided.")}
                       {section === "Benefits" && (product.benefits || "No benefits listed.")}
                       {section === "How To Use" && (product.howToUse || "No usage instructions provided.")}
                       {section === "Product Specifications" && (product.specifications || "No specifications listed.")}
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* You May Also Like */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-border/60 pt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={{
                  id: p._id,
                  title: p.title,
                  price: p.price,
                  image: `${API_URL}${p.images[0]}`,
                  badge: p.badge,
                  category: p.vertical,
                  rating: p.rating,
                  reviewsCount: p.reviewsCount,
                  stock: p.stock,
                  activeOffer: p.activeOffer,
                  features: p.features
                }} />
              ))}
            </div>
          </div>
        )}



      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#eef7ec] border-t-2 border-[#1e7b34] p-3 flex justify-between items-center sm:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.1)] pb-safe">
         <div className="flex items-center gap-2 text-[10px] font-bold text-[#1e7b34]">
           <Tag className="h-4 w-4 shrink-0" />
           <span className="truncate max-w-[150px]">{product.activeOffer || "Buy 2 Get 4"}</span>
         </div>
         {product.stock === 0 ? (
           <button 
             disabled
             className="bg-gray-300 text-gray-500 px-6 py-2 rounded font-bold text-sm shrink-0 cursor-not-allowed"
           >
             OUT OF STOCK
           </button>
         ) : (
           <button 
             onClick={() => {
               for (let i = 0; i < quantity; i++) {
                 add({ id: product._id, title: `${product.title} ${selectedSize ? `(${selectedSize})` : ''}`, price: product.price, image: `${API_URL}${product.images[0]}`, stock: product.stock || 0 });
               }
               alert(`Added ${quantity} item(s) to cart!`);
             }} 
             className="bg-black text-white px-6 py-2 rounded font-bold text-sm shrink-0"
           >
             ADD TO CART
           </button>
         )}
      </div>

    </SiteLayout>
  );
}

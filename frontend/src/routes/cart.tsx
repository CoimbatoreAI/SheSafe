import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Minus, Plus, Trash2, X, Percent, Tag, Copy } from "lucide-react";
import { useCart } from "@/lib/cart";
import { API_URL } from "@/lib/api";
import { SiteLayout } from "@/components/SiteLayout";

export default function CartPage() {
  const { items, setQty, remove, total } = useCart();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<any[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/offers`)
      .then(res => res.json())
      .then(data => setOffers(data))
      .catch(err => console.error(err));
  }, []);

  const handleApplyCoupon = (code?: string) => {
    const toApply = code || couponInput;
    if (!toApply) return;
    const offer = offers.find(o => o.code.toUpperCase() === toApply.toUpperCase());
    if (offer) {
      setAppliedCoupon({ code: offer.code, discount: offer.discountPercentage });
      alert(`Coupon ${offer.code} applied successfully!`);
    } else {
      alert("Invalid coupon code.");
    }
  };

  const discountAmount = appliedCoupon ? (total * appliedCoupon.discount) / 100 : 0;
  const finalTotal = total - discountAmount;

  // If we wanted to make this a true drawer, we wouldn't use SiteLayout. 
  // But since it's a full page, we'll style it to look like the mobile full-screen cart in the image.

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col relative font-sans">
      {/* Top Header */}
      <div className="bg-[#f3f4f6] flex items-center justify-between px-4 py-4">
        <h1 className="text-gray-600 font-medium text-[15px]">Your Cart ({items.length} items)</h1>
        <button onClick={() => navigate(-1)} className="p-1">
          <X className="h-5 w-5 text-black" />
        </button>
      </div>

      {/* Global Offers List (Swipeable) */}
      {offers.length > 0 && (
        <div className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm">
          <p className="text-sm text-navy mb-2 font-bold">Available Offers</p>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
            {offers.map(offer => (
              <div key={offer._id} className="min-w-[200px] bg-pink-soft border border-pink/20 rounded-lg p-3 snap-start shrink-0 flex flex-col gap-2 relative shadow-sm cursor-pointer" onClick={() => handleApplyCoupon(offer.code)}>
                <div className="flex items-center justify-between">
                  <span className="font-black text-pink text-lg">{offer.discountPercentage}% OFF</span>
                  <Tag className="h-4 w-4 text-pink" />
                </div>
                <button className="mt-1 flex items-center justify-center gap-1.5 bg-white border border-pink border-dashed text-pink font-bold py-1.5 rounded text-sm hover:bg-pink hover:text-white transition-colors w-full">
                  Tap to Apply {offer.code}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Items Area */}
      <div className="flex-1 overflow-y-auto pb-32">
        {items.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <p>Your cart is empty.</p>
            <Link to="/shop" className="text-[#c8102e] font-bold mt-4 inline-block">Shop Now</Link>
          </div>
        ) : (
          <>
            {/* Items */}
            {items.map((item) => (
              <div key={item.id} className="bg-white p-4 border-b border-gray-200 flex gap-4">
                <div className="w-20 h-20 shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <span className="text-[13px] font-bold whitespace-nowrap">₹{item.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-end mt-2">

                    <div className="flex items-center gap-6">
                      {/* Qty Selector */}
                      <div className="flex items-center border border-border/60 rounded-md shadow-sm bg-white overflow-hidden">
                        <button onClick={() => setQty(item.id, item.qty - 1)} className="px-3 py-1.5 text-navy/70 hover:bg-slate-100 transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                        <span className="px-3 py-1.5 bg-white text-sm font-bold border-x border-border/60 min-w-[36px] text-center text-navy">{item.qty}</span>
                        <button 
                          onClick={() => setQty(item.id, item.qty + 1)} 
                          disabled={item.qty >= item.stock}
                          className={`px-3 py-1.5 transition-colors ${item.qty >= item.stock ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-navy/70 hover:bg-slate-100'}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      
                      {/* Trash */}
                      <button onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon Section */}
            <div className="p-4 mt-2">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      {appliedCoupon.code} applied (-{appliedCoupon.discount}%)
                    </div>
                    <button onClick={() => setAppliedCoupon(null)} className="text-red-500 font-bold hover:underline">Remove</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2">
                      <Percent className="h-4 w-4 text-teal-500" />
                      <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Enter Coupon Code" className="flex-1 text-sm outline-none placeholder-gray-400" />
                    </div>
                    <button onClick={() => handleApplyCoupon()} className="bg-navy text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-navy-light transition-colors">Apply</button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky Bottom Checkout Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe z-50">
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm font-medium text-gray-500">Subtotal</div>
            <span className="text-sm font-medium">₹{total.toFixed(2)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between items-center mb-1 text-green-600">
              <div className="text-sm font-medium">Discount ({appliedCoupon.discount}%)</div>
              <span className="text-sm font-bold">-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center mb-3 mt-2 border-t border-gray-100 pt-2">
            <div className="flex items-center gap-2 text-[15px] font-bold text-gray-800">
              <span className="bg-black text-white text-xs px-1.5 py-0.5 rounded font-mono">₹</span>
              Estimated Total
            </div>
            <span className="text-[17px] font-black">₹{finalTotal.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#333333] hover:bg-black text-white font-bold py-3.5 rounded-lg flex justify-between items-center px-6 transition-colors"
          >
            <span className="mx-auto">Checkout</span>
            <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-purple-500 -ml-1"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 -ml-1"></div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

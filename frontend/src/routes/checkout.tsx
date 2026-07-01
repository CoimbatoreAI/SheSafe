import { API_URL } from "@/lib/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { useCart } from "@/lib/cart";
import { ShieldCheck, Truck } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Shipping State
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const storedUser = localStorage.getItem("userData");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userData", JSON.stringify(data));
        setIsAuthenticated(true);
        setUser(data);
      } else {
        alert(data.message || "Authentication failed");
      }
    } catch (err) {
      alert("Server error. Try again.");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!address || !city || !postalCode) {
      return alert("Please fill in shipping details");
    }

    const res = await loadRazorpayScript();
    if (!res) {
      return alert("Razorpay SDK failed to load. Are you online?");
    }

    try {
      const token = localStorage.getItem("userToken");
      const orderData = {
        orderItems: items.map(i => ({ product: i.id, title: i.title, qty: i.qty, price: i.price })),
        shippingAddress: { address, city, postalCode, country: "India" },
        paymentMethod: "Razorpay",
        itemsPrice: total,
        taxPrice: 0,
        shippingPrice: total > 999 ? 0 : 50,
        totalPrice: total + (total > 999 ? 0 : 50)
      };

      const result = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderData),
      });

      if (!result.ok) throw new Error("Order creation failed");

      const { orderId, razorpayOrderId, amount, currency } = await result.json();

      const configRes = await fetch(`${API_URL}/api/config/razorpay`);
      const { keyId } = await configRes.json();

      const options = {
        key: keyId,
        amount: amount.toString(),
        currency: currency,
        name: "SheSafeIn",
        description: "Safety Products Order",
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          const verifyRes = await fetch(`${API_URL}/api/orders/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            alert("Payment Successful!");
            clearCart();
            navigate("/");
          } else {
            alert("Payment Verification Failed: " + verifyData.message);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: { color: "#fe75a1" }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      alert("Error initiating payment.");
    }
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 min-h-[70vh]">
        <h1 className="text-3xl font-display font-bold text-navy mb-8 text-center border-b border-border/50 pb-4">
          Secure Checkout
        </h1>

        {!isAuthenticated ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-navy mb-2 text-center">Welcome!</h2>
            <p className="text-center text-navy/70 text-sm mb-6">Please log in or register to complete your order.</p>
            
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-navy/80 mb-1">Full Name</label>
                  <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full border border-border rounded px-4 py-2" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-navy/80 mb-1">Email Address</label>
                <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full border border-border rounded px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy/80 mb-1">Phone Number</label>
                <input required value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="w-full border border-border rounded px-4 py-2" />
              </div>
              <button type="submit" className="w-full bg-pink text-white font-bold py-3 rounded mt-4 hover:bg-pink-soft hover:text-pink transition-colors">
                {authMode === "login" ? "Login to Checkout" : "Create Account"}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-navy/60">
              {authMode === "login" ? (
                <>New here? <button onClick={() => setAuthMode("register")} className="text-pink font-bold hover:underline">Create an account</button></>
              ) : (
                <>Already have an account? <button onClick={() => setAuthMode("login")} className="text-pink font-bold hover:underline">Login</button></>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="text-pink h-6 w-6" />
                <h2 className="text-xl font-bold text-navy">Shipping Details</h2>
              </div>
              <div className="space-y-4">
                 <div>
                  <label className="block text-sm font-medium text-navy/80 mb-1">Street Address</label>
                  <input required value={address} onChange={e => setAddress(e.target.value)} type="text" className="w-full border border-border rounded px-4 py-2" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-navy/80 mb-1">City</label>
                    <input required value={city} onChange={e => setCity(e.target.value)} type="text" className="w-full border border-border rounded px-4 py-2" />
                   </div>
                   <div>
                    <label className="block text-sm font-medium text-navy/80 mb-1">PIN Code</label>
                    <input required value={postalCode} onChange={e => setPostalCode(e.target.value)} type="text" className="w-full border border-border rounded px-4 py-2" />
                   </div>
                 </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-border/50 h-fit">
               <h2 className="text-xl font-bold text-navy mb-4">Order Summary</h2>
               <div className="space-y-3 mb-6">
                 {items.map(item => (
                   <div key={item.id} className="flex justify-between text-sm text-navy/80">
                     <span>{item.title} x {item.qty}</span>
                     <span>₹{item.price * item.qty}</span>
                   </div>
                 ))}
               </div>
               <div className="border-t border-border/50 pt-4 space-y-2 text-sm">
                 <div className="flex justify-between">
                   <span>Subtotal</span>
                   <span className="font-semibold text-navy">₹{total}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Shipping</span>
                   <span className="font-semibold text-pink">{total > 999 ? "Free" : "₹50"}</span>
                 </div>
                 <div className="flex justify-between text-lg font-bold text-navy pt-2">
                   <span>Total</span>
                   <span>₹{total + (total > 999 ? 0 : 50)}</span>
                 </div>
               </div>

               <button onClick={handlePayment} className="w-full bg-[#1c1c1c] text-white font-bold py-4 rounded mt-8 flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg">
                 Pay Securely <ShieldCheck className="h-5 w-5 text-green-400" />
               </button>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

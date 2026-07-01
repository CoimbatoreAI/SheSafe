import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, LogOut, Image as ImageIcon, LayoutTemplate, Trash2, Tag } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products"); // "products", "hero", "offers"

  // Product Form State
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");
  const [howToUse, setHowToUse] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [sections, setSections] = useState<string[]>([]);
  const [vertical, setVertical] = useState("Safety Products");
  const [badge, setBadge] = useState("");
  const [activeOffer, setActiveOffer] = useState("");
  const [stock, setStock] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Hero Form State
  const [heroUploads, setHeroUploads] = useState<FileList | null>(null);

  // Offer Form State
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [offerCode, setOfferCode] = useState("");
  const [offerDiscount, setOfferDiscount] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [prodRes, heroRes, offerRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/hero`),
        fetch(`${API_URL}/api/offers`)
      ]);
      const prodData = await prodRes.json();
      const heroData = await heroRes.json();
      const offerData = await offerRes.json();
      setProducts(prodData);
      setHeroImages(heroData);
      setOffers(offerData);
    } catch (error) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setTitle(""); setPrice(""); setMrp(""); setDescription("");
    setBenefits(""); setHowToUse(""); setSpecifications("");
    setSections([]); setBadge(""); setActiveOffer("");
    setStock(""); setFeatures([]); setFeatureInput(""); setSizes([]); setSizeInput(""); setImages(null);
    setExistingImages([]);
  };

  const handleAddSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };

  const handleRemoveSize = (s: string) => {
    setSizes(sizes.filter(size => size !== s));
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (f: string) => {
    setFeatures(features.filter(feature => feature !== f));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("mrp", mrp);
    formData.append("description", description);
    formData.append("benefits", benefits);
    formData.append("howToUse", howToUse);
    formData.append("specifications", specifications);
    formData.append("sections", sections.join(','));
    formData.append("vertical", vertical);
    formData.append("badge", badge);
    formData.append("activeOffer", activeOffer);
    formData.append("stock", stock);
    formData.append("features", features.join(", "));
    formData.append("sizes", sizes.join(", "));

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    try {
      const url = editingProductId ? `${API_URL}/api/products/${editingProductId}` : `${API_URL}/api/products`;
      const method = editingProductId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      if (res.ok) {
        alert(`Product ${editingProductId ? "Updated" : "Created"} Successfully!`);
        resetProductForm();
        setIsProductFormOpen(false);
        fetchData();
      } else {
        alert(`Failed to ${editingProductId ? "update" : "create"} product`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProduct = (p: any) => {
    setEditingProductId(p._id);
    setTitle(p.title);
    setPrice(p.price.toString());
    setMrp(p.mrp.toString());
    setDescription(p.description);
    setBenefits(p.benefits || "");
    setHowToUse(p.howToUse || "");
    setSpecifications(p.specifications || "");
    setSections(p.sections || []);
    setVertical(p.vertical || "Safety Products");
    setBadge(p.badge || "");
    setActiveOffer(p.activeOffer || "");
    setStock(p.stock.toString());
    setFeatures(p.features || []);
    setSizes(p.sizes || []);
    setExistingImages(p.images || []);
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadHero = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    if (heroUploads) {
      for (let i = 0; i < heroUploads.length; i++) {
        formData.append("images", heroUploads[i]);
      }
    }

    try {
      const res = await fetch(`${API_URL}/api/hero`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        alert("Hero Images Uploaded!");
        setHeroUploads(null);
        // Reset the file input visually
        (document.getElementById('hero-upload-input') as HTMLInputElement).value = "";
        fetchData();
      } else {
        alert("Failed to upload hero banners");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteHero = async (id: string) => {
    if(!window.confirm("Delete this hero image?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/api/hero/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if(res.ok) fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    try {
      const url = editingOfferId ? `${API_URL}/api/offers/${editingOfferId}` : `${API_URL}/api/offers`;
      const method = editingOfferId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ code: offerCode, discountPercentage: offerDiscount })
      });
      if (res.ok) {
        alert(`Offer ${editingOfferId ? "updated" : "created"}!`);
        setEditingOfferId(null);
        setOfferCode("");
        setOfferDiscount("");
        fetchData();
      } else {
        const data = await res.json();
        alert(data.message || `Failed to ${editingOfferId ? "update" : "create"} offer`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditOffer = (offer: any) => {
    setEditingOfferId(offer._id);
    setOfferCode(offer.code);
    setOfferDiscount(offer.discountPercentage.toString());
  };

  const handleDeleteOffer = async (id: string) => {
    if (!window.confirm("Delete this offer?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      await fetch(`${API_URL}/api/offers/${id}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-navy text-white min-h-screen p-6 hidden md:flex flex-col">
        <h2 className="text-2xl font-display font-bold text-pink mb-10">Admin Panel</h2>
        <nav className="flex-1 space-y-4">
          <button onClick={() => setActiveTab("products")} className={`flex items-center gap-3 w-full text-left transition-colors ${activeTab === "products" ? "text-pink font-bold" : "text-white/80 hover:text-white"}`}>
            <Package className="h-5 w-5" /> Products
          </button>
          <button onClick={() => setActiveTab("hero")} className={`flex items-center gap-3 w-full text-left transition-colors ${activeTab === "hero" ? "text-pink font-bold" : "text-white/80 hover:text-white"}`}>
            <LayoutTemplate className="h-5 w-5" /> Hero Banners
          </button>
          <button onClick={() => setActiveTab("offers")} className={`flex items-center gap-3 w-full text-left transition-colors ${activeTab === "offers" ? "text-pink font-bold" : "text-white/80 hover:text-white"}`}>
            <Tag className="h-5 w-5" /> Discount Offers
          </button>
        </nav>
        <button onClick={logout} className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold text-navy capitalize">{activeTab} Management</h1>
          <button onClick={logout} className="md:hidden flex items-center gap-2 text-sm text-navy/60">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        {activeTab === "products" && (
          <div className="w-full">
            {!isProductFormOpen ? (
              <div className="bg-white p-6 rounded-xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-navy">Current Products ({products.length})</h3>
                  <button onClick={() => { resetProductForm(); setIsProductFormOpen(true); }} className="bg-pink text-white px-4 py-2 rounded font-bold hover:bg-pink-soft hover:text-pink transition-colors flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Product
                  </button>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-navy/60">
                        <th className="pb-3 font-medium">Product</th>
                        <th className="pb-3 font-medium">Sections</th>
                        <th className="pb-3 font-medium">Stock</th>
                        <th className="pb-3 font-medium">Price</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p: any) => (
                        <tr key={p._id} className="border-b border-border/30 hover:bg-slate-50">
                          <td className="py-3 font-semibold text-navy flex items-center gap-3">
                            <img src={`${API_URL}${p.images[0]}`} alt="" className="w-10 h-10 rounded object-cover bg-slate-100" />
                            <div className="max-w-[200px] truncate">{p.title}</div>
                          </td>
                          <td className="py-3 text-navy/80">
                            <div className="flex flex-wrap gap-1">
                              {p.sections?.map((s: string) => <span key={s} className="bg-slate-100 px-2 py-1 rounded text-xs">{s}</span>)}
                            </div>
                          </td>
                          <td className="py-3 text-navy/80"><span className={`px-2 py-1 rounded text-xs font-bold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.stock}</span></td>
                          <td className="py-3 text-navy/80">
                            ₹{p.price} <span className="line-through text-xs text-navy/40 pl-1">₹{p.mrp}</span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                               <button onClick={() => handleEditProduct(p)} className="text-blue-500 hover:text-blue-700 font-medium text-xs">Edit</button>
                               <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 hover:text-red-700">
                                 <Trash2 className="h-4 w-4" />
                               </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {products.length === 0 && <p className="text-center text-navy/50 py-10">No products uploaded yet.</p>}
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl border border-border/50 shadow-sm max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6 border-b border-border/40 pb-4">
                  <h3 className="text-xl font-bold text-navy flex items-center gap-2">
                    <Package className="h-6 w-6 text-pink" /> {editingProductId ? "Edit Product" : "Add New Product"}
                  </h3>
                  <button onClick={() => { resetProductForm(); setIsProductFormOpen(false); }} className="text-navy/50 hover:text-red-500 font-bold text-sm">Cancel</button>
                </div>
                
                <form onSubmit={handleSaveProduct} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Product Title</label>
                    <input required value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full border border-border rounded px-4 py-3 text-sm" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Selling Price (₹)</label>
                      <input required value={price} onChange={e => setPrice(e.target.value)} type="number" className="w-full border border-border rounded px-4 py-3 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">MRP (₹)</label>
                      <input required value={mrp} onChange={e => setMrp(e.target.value)} type="number" className="w-full border border-border rounded px-4 py-3 text-sm" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Sections (Multiple)</label>
                      <div className="flex flex-col gap-2 border border-border rounded px-4 py-3 bg-white h-32 overflow-y-auto">
                        {['Best Sellers', 'New Launches', 'Essentials', 'Uncategorized'].map(s => (
                          <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={sections.includes(s)}
                              onChange={(e) => {
                                if (e.target.checked) setSections([...sections, s]);
                                else setSections(sections.filter(sec => sec !== s));
                              }}
                            />
                            {s}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Vertical</label>
                      <select value={vertical} onChange={e => setVertical(e.target.value)} className="w-full border border-border rounded px-4 py-3 text-sm h-12 mb-4">
                        <option>Safety Products</option>
                        <option>Referral Products</option>
                        <option>Awareness Sessions</option>
                      </select>
                      
                      <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Stock Qty</label>
                      <input required value={stock} onChange={e => setStock(e.target.value)} type="number" min="0" placeholder="0" className="w-full border border-border rounded px-4 py-3 text-sm h-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Features (Optional)</label>
                      <div className="flex gap-2 mb-2">
                        <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }} placeholder="e.g. Aloe strip" type="text" className="flex-1 border border-border rounded px-4 py-3 text-sm" />
                        <button type="button" onClick={handleAddFeature} className="bg-navy text-white px-4 py-3 rounded font-bold hover:bg-navy-light transition-colors flex items-center justify-center"><Plus className="h-4 w-4" /></button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {features.map(f => (
                          <span key={f} className="bg-slate-100 text-navy px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-border/50 shadow-sm">
                            {f} <button type="button" onClick={() => handleRemoveFeature(f)} className="text-red-500 hover:text-red-700 ml-1 leading-none rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-50 transition-colors">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Sizes (Optional)</label>
                      <div className="flex gap-2 mb-2">
                        <input value={sizeInput} onChange={e => setSizeInput(e.target.value)} onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); handleAddSize(); } }} placeholder="e.g. Pack of 1" type="text" className="flex-1 border border-border rounded px-4 py-3 text-sm" />
                        <button type="button" onClick={handleAddSize} className="bg-navy text-white px-4 py-3 rounded font-bold hover:bg-navy-light transition-colors flex items-center justify-center"><Plus className="h-4 w-4" /></button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map(s => (
                          <span key={s} className="bg-slate-100 text-navy px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-border/50 shadow-sm">
                            {s} <button type="button" onClick={() => handleRemoveSize(s)} className="text-red-500 hover:text-red-700 ml-1 leading-none rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-50 transition-colors">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Badge (Optional)</label>
                      <select value={badge} onChange={e => setBadge(e.target.value)} className="w-full border border-border rounded px-4 py-3 text-sm bg-white">
                        <option value="">No Badge</option>
                        <option value="Best Seller">Best Seller</option>
                        <option value="New Launch">New Launch</option>
                        <option value="Trending">Trending</option>
                        <option value="Limited Edition">Limited Edition</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Active Offer (Optional)</label>
                      <select value={activeOffer} onChange={e => setActiveOffer(e.target.value)} className="w-full border border-border rounded px-4 py-3 text-sm bg-white">
                        <option value="">No Active Offer</option>
                        {offers.map((offer: any) => (
                          <option key={offer._id} value={offer.code}>{offer.code} ({offer.discountPercentage}% OFF)</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Description</label>
                    <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border border-border rounded px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Benefits (Optional)</label>
                    <textarea value={benefits} onChange={e => setBenefits(e.target.value)} rows={2} className="w-full border border-border rounded px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">How To Use (Optional)</label>
                    <textarea value={howToUse} onChange={e => setHowToUse(e.target.value)} rows={2} className="w-full border border-border rounded px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Specifications (Optional)</label>
                    <textarea value={specifications} onChange={e => setSpecifications(e.target.value)} rows={2} className="w-full border border-border rounded px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Images (Upload replacing existing)</label>
                    {existingImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {existingImages.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img src={`${API_URL}${img}`} alt="existing" className="h-16 w-16 object-cover rounded border border-border/50 shadow-sm" />
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="flex items-center gap-2 border-2 border-dashed border-border p-6 rounded-lg bg-slate-50 justify-center text-navy/50 text-sm cursor-pointer hover:bg-slate-100 transition-colors">
                      <ImageIcon className="h-6 w-6 text-pink/50" />
                      <span className="font-medium text-navy">{images ? `${images.length} files selected` : "Click to select images"}</span>
                      <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="hidden" />
                    </label>
                  </div>
                  
                  <div className="pt-4 border-t border-border/40 flex justify-end">
                    <button type="submit" className="bg-pink text-white font-bold px-8 py-3 rounded hover:bg-pink-soft hover:text-pink transition-colors">
                      {editingProductId ? "Save Changes" : "Publish Product"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === "hero" && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Add Hero Banner */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-border/50 shadow-sm h-fit">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-pink" /> Upload Hero Banners
              </h3>
              <form onSubmit={handleUploadHero} className="space-y-4">
                <div>
                  <label htmlFor="hero-upload-input" className="flex flex-col items-center gap-3 border-2 border-dashed border-border p-8 rounded bg-slate-50 justify-center text-navy/50 text-sm cursor-pointer hover:bg-slate-100 transition-colors">
                    <ImageIcon className="h-10 w-10 text-pink/50" />
                    <p className="text-center">Select multiple images for your home page auto-slider.</p>
                    <p className="text-pink font-bold">{heroUploads ? `${heroUploads.length} files selected` : "Click to select files"}</p>
                    <input id="hero-upload-input" type="file" multiple accept="image/*" onChange={e => setHeroUploads(e.target.files)} className="hidden" />
                  </label>
                </div>
                <button type="submit" disabled={!heroUploads || heroUploads.length === 0} className="w-full bg-navy text-white font-bold py-3 rounded mt-4 hover:bg-navy-light transition-colors disabled:opacity-50">
                  Upload Banners
                </button>
              </form>
            </div>

            {/* Hero Banners List */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-border/50 shadow-sm">
              <h3 className="text-lg font-bold text-navy mb-4">Active Hero Banners ({heroImages.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heroImages.map((hero: any) => (
                  <div key={hero._id} className="relative group rounded-lg overflow-hidden border border-border">
                    <img src={`${API_URL}${hero.image}`} alt="Hero" className="w-full h-32 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={() => handleDeleteHero(hero._id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                         <Trash2 className="h-5 w-5" />
                       </button>
                    </div>
                  </div>
                ))}
                {heroImages.length === 0 && <p className="col-span-full text-center text-navy/50 py-10">No hero images uploaded yet.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === "offers" && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Create Offer Form */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-border/50 shadow-sm h-fit">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-pink" /> Add New Offer
              </h3>
              <form onSubmit={handleSaveOffer} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Offer Code</label>
                    <input required value={offerCode} onChange={e => setOfferCode(e.target.value)} type="text" placeholder="e.g. SUMMER20" className="w-full border border-border rounded px-3 py-2 text-sm uppercase" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy/70 mb-1 uppercase tracking-wider">Discount %</label>
                    <input required value={offerDiscount} onChange={e => setOfferDiscount(e.target.value)} type="number" min="1" max="100" placeholder="e.g. 20" className="w-full border border-border rounded px-3 py-2 text-sm" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="submit" className="flex-1 bg-navy text-white font-bold py-3 rounded hover:bg-navy-light transition-colors">
                      {editingOfferId ? "Save Changes" : "Create Offer"}
                    </button>
                    {editingOfferId && (
                      <button type="button" onClick={() => { setEditingOfferId(null); setOfferCode(""); setOfferDiscount(""); }} className="bg-slate-200 text-navy font-bold px-4 py-3 rounded hover:bg-slate-300 transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
            </div>

            {/* Offers List */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-border/50 shadow-sm">
              <h3 className="text-lg font-bold text-navy mb-4">Active Offers ({offers.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-navy/60">
                      <th className="pb-3 font-medium">Code</th>
                      <th className="pb-3 font-medium">Discount</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {offers.map((offer: any) => (
                      <tr key={offer._id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-bold text-pink tracking-widest">{offer.code}</td>
                          <td className="py-3 font-bold text-navy">{offer.discountPercentage}% OFF</td>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                               <button onClick={() => handleEditOffer(offer)} className="text-blue-500 hover:text-blue-700 font-medium text-xs">Edit</button>
                               <button onClick={() => handleDeleteOffer(offer._id)} className="text-red-500 hover:text-red-700 transition-colors" title="Delete Offer">
                                 <Trash2 className="h-4 w-4" />
                               </button>
                            </div>
                          </td>
                      </tr>
                    ))}
                    {offers.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-navy/50">No offers created yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

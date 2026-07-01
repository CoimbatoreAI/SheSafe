import { API_URL } from "@/lib/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { UploadCloud, CheckCircle } from "lucide-react";

export function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [vertical, setVertical] = useState("Safety Products");
  const [images, setImages] = useState<FileList | null>(null);
  const [badge, setBadge] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("vertical", vertical);
    if (badge) formData.append("badge", badge);
    if (affiliateUrl) formData.append("affiliateUrl", affiliateUrl);
    
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        setTitle("");
        setPrice("");
        setDescription("");
        setImages(null);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to upload product.");
      }
    } catch (err) {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-navy">Admin Dashboard</h1>
          <button onClick={handleLogout} className="text-sm font-semibold text-pink hover:underline">
            Logout
          </button>
        </div>

        <div className="rounded-2xl border border-border/60 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2">
            <UploadCloud className="text-pink" /> Upload New Product
          </h2>
          
          {success && (
            <div className="mt-4 flex items-center gap-2 rounded bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle className="h-4 w-4" /> Product uploaded successfully!
            </div>
          )}
          {error && <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleUpload} className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-navy">Product Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full rounded-md border border-border p-2 focus:border-pink outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy">Price (₹)</label>
              <input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 w-full rounded-md border border-border p-2 focus:border-pink outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy">Vertical</label>
              <select value={vertical} onChange={e => setVertical(e.target.value)} className="mt-1 w-full rounded-md border border-border p-2 focus:border-pink outline-none">
                <option value="Safety Products">Safety Products</option>
                <option value="Referral Products">Referral Products</option>
                <option value="Awareness Sessions">Awareness Sessions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy">Badge (Optional)</label>
              <input value={badge} onChange={e => setBadge(e.target.value)} placeholder="e.g. Amazon, Bestseller" className="mt-1 w-full rounded-md border border-border p-2 focus:border-pink outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy">Affiliate URL (Optional)</label>
              <input value={affiliateUrl} onChange={e => setAffiliateUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-md border border-border p-2 focus:border-pink outline-none" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-navy">Description</label>
              <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full rounded-md border border-border p-2 focus:border-pink outline-none" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-navy">Product Images (Local Upload)</label>
              <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="mt-1 block w-full text-sm text-navy/70 file:mr-4 file:rounded-full file:border-0 file:bg-pink-soft file:px-4 file:py-2 file:text-sm file:font-semibold file:text-pink hover:file:bg-pink/20" />
            </div>

            <div className="sm:col-span-2">
              <button disabled={loading} type="submit" className="btn-pink w-full rounded-lg py-3 font-semibold disabled:opacity-50">
                {loading ? "Uploading..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}

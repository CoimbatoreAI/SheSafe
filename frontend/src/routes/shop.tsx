import { API_URL } from "@/lib/api";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SlidersHorizontal, ArrowDownAZ } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { HeroSlider } from "@/components/HeroSlider";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All"); // Kept for mobile basic nav
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Read from URL if present
    const params = new URLSearchParams(location.search);
    const sectionParam = params.get("section");
    if (sectionParam) {
      setSelectedSections([sectionParam]);
    } else {
      setSelectedSections([]);
    }

    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, [location.search]);

  const categories = Array.from(new Set(products.map((p: any) => p.vertical))).filter(Boolean) as string[];
  const sections = ['Best Sellers', 'New Launches', 'Essentials', 'Uncategorized'];

  const filteredProducts = products.filter((p: any) => {
    const vMatch = selectedVerticals.length === 0 || selectedVerticals.includes(p.vertical);
    const sMatch = selectedSections.length === 0 || selectedSections.some(s => p.sections?.includes(s) || p.section === s);
    const pMatch = p.price <= maxPrice;
    
    // Support legacy mobile basic nav
    const mobileCatMatch = activeCategory === "All" || p.vertical === activeCategory;

    return vMatch && sMatch && pMatch && mobileCatMatch;
  });

  const toggleVertical = (v: string) => {
    setSelectedVerticals(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  };
  
  const toggleSection = (s: string) => {
    setSelectedSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  return (
    <SiteLayout>
      <HeroSlider />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex items-center justify-between pb-2 border-b border-border">
            <span className="text-navy font-bold text-lg">Filters</span>
            <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="bg-navy text-white px-4 py-1.5 rounded text-sm font-bold">
              {showMobileFilters ? "Hide" : "Show"}
            </button>
          </div>

          {/* Sidebar */}
          <aside className={`${showMobileFilters ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
              <h2 className="font-display text-lg font-bold text-navy flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" /> Filters
              </h2>
              {/* Clear All */}
              {(selectedVerticals.length > 0 || selectedSections.length > 0 || maxPrice < 5000) && (
                <button onClick={() => { setSelectedVerticals([]); setSelectedSections([]); setMaxPrice(5000); setActiveCategory("All"); }} className="text-xs text-pink hover:underline font-bold">
                  Clear All
                </button>
              )}
            </div>
            
            <div className="space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-bold text-navy mb-3 uppercase tracking-wider text-sm">Categories</h3>
                <div className="space-y-2.5">
                  {categories.map((cat: string) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-4 h-4 rounded border border-border group-hover:border-pink transition-colors shrink-0">
                        <input 
                          type="checkbox" 
                          className="peer sr-only" 
                          checked={selectedVerticals.includes(cat)}
                          onChange={() => toggleVertical(cat)}
                        />
                        <div className="absolute inset-0 bg-pink scale-0 peer-checked:scale-100 transition-transform rounded-[2px]" />
                      </div>
                      <span className={`text-sm ${selectedVerticals.includes(cat) ? 'text-navy font-bold' : 'text-navy/70'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sections */}
              <div>
                <h3 className="font-bold text-navy mb-3 uppercase tracking-wider text-sm">Collections</h3>
                <div className="space-y-2.5">
                  {sections.map((sec: string) => (
                    <label key={sec} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-4 h-4 rounded border border-border group-hover:border-pink transition-colors shrink-0">
                        <input 
                          type="checkbox" 
                          className="peer sr-only" 
                          checked={selectedSections.includes(sec)}
                          onChange={() => toggleSection(sec)}
                        />
                        <div className="absolute inset-0 bg-pink scale-0 peer-checked:scale-100 transition-transform rounded-[2px]" />
                      </div>
                      <span className={`text-sm ${selectedSections.includes(sec) ? 'text-navy font-bold' : 'text-navy/70'}`}>
                        {sec}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-bold text-navy mb-3 uppercase tracking-wider text-sm">Max Price: ₹{maxPrice}</h3>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-pink h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-navy/50 mt-2 font-medium">
                  <span>₹0</span>
                  <span>₹5000+</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-medium text-navy/60">
                Showing <span className="text-navy">{filteredProducts.length}</span> products
              </p>
            </div>

            {loading ? (
              <div className="py-20 text-center text-navy/50">Loading products...</div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product: any) => (
                  <ProductCard key={product._id} product={{
                    id: product._id,
                    title: product.title,
                    price: product.price,
                    image: `${API_URL}${product.images[0]}`,
                    badge: product.badge,
                    category: product.vertical,
                    rating: product.rating,
                    reviewsCount: product.reviewsCount,
                    stock: product.stock,
                    activeOffer: product.activeOffer,
                    features: product.features
                  }} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </SiteLayout>
  );
}

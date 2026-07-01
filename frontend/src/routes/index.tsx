import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { HeroSlider } from "@/components/HeroSlider";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/products`).then(r => r.json())
    .then(prods => setProducts(prods))
    .catch(err => console.error("Error fetching data:", err));
  }, []);

  const bestSellers = products.filter((p: any) => p.sections?.includes("Best Sellers") || p.section === "Best Sellers");
  const essentials = products.filter((p: any) => p.sections?.includes("Essentials") || p.section === "Essentials");
  const newLaunches = products.filter((p: any) => p.sections?.includes("New Launches") || p.section === "New Launches");

  return (
    <SiteLayout>
      {/* Hero Section Auto Slider */}
      <HeroSlider />

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-20">
        
        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">Best Sellers</h2>
                <p className="mt-2 text-sm text-navy/70">Top rated protection trusted by women across India.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {bestSellers.map((product: any) => (
                <div key={product._id}>
                  <ProductCard product={{
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
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Women Quote Section */}
        <section className="bg-gradient-to-r from-pink-soft to-white py-16 px-8 rounded-3xl text-center shadow-sm border border-pink/20">
           <h3 className="text-xl md:text-3xl font-display font-bold text-[#800020] italic leading-relaxed">
             "A woman's safety should never be a luxury. It is her fundamental right to walk with confidence."
           </h3>
           <div className="mt-6 w-16 h-1 bg-pink mx-auto rounded-full"></div>
        </section>

        {/* Essentials */}
        {essentials.length > 0 && (
          <section>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">Everyday Essentials</h2>
                <p className="mt-2 text-sm text-navy/70">Must-have items for your daily commute.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {essentials.map((product: any) => (
                <div key={product._id}>
                  <ProductCard product={{
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
                </div>
              ))}
            </div>
          </section>
        )}

        {/* New Launches */}
        {newLaunches.length > 0 && (
          <section>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">New Launches</h2>
                <p className="mt-2 text-sm text-navy/70">The latest innovations in personal safety.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {newLaunches.map((product: any) => (
                <div key={product._id}>
                  <ProductCard product={{
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
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </SiteLayout>
  );
}

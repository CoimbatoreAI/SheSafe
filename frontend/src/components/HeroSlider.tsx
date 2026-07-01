import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";

export function HeroSlider() {
  const [heroImages, setHeroImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/hero`)
      .then(r => r.json())
      .then(data => setHeroImages(data))
      .catch(err => console.error("Error fetching hero images:", err));
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  if (heroImages.length === 0) return null;

  return (
    <section className="relative w-full bg-slate-900 overflow-hidden">
      {/* Invisible placeholder image to naturally set the container height to the image's true aspect ratio */}
      {heroImages.length > 0 && (
        <img 
          src={`${API_URL}${heroImages[0].image}`} 
          alt="placeholder" 
          className="w-full h-auto opacity-0 block pointer-events-none" 
        />
      )}
      
      {heroImages.map((hero: any, index: number) => (
        <div 
          key={hero._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <img src={`${API_URL}${hero.image}`} alt="Hero Banner" className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {heroImages.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${index === currentSlide ? 'bg-pink w-6' : 'bg-white/70 w-2'}`}
          />
        ))}
      </div>
    </section>
  );
}

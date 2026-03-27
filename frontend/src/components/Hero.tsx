import { useEffect, useState } from 'react';
import { Phone, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeroProps {
  onNavClick: (section: string) => void;
}

export default function Hero({ onNavClick }: HeroProps) {
  const [offset, setOffset] = useState(0);
  const [heroContent, setHeroContent] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setOffset(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);

    const fetchHero = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from('site_images')
        .select('*')
        .eq('section', 'hero')
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setHeroContent(data[0]);
      }
    };

    fetchHero();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultHero = "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop";

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-dark-900">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${offset * 0.5}px)` }}
      >
        {heroContent?.media_type === 'video' ? (
          <video
            src={heroContent.url}
            className="w-full h-full object-cover scale-110 opacity-70"
            autoPlay muted loop playsInline
          />
        ) : (
          <img
            src={heroContent?.url || defaultHero}
            alt="Photography background"
            className="w-full h-full object-cover scale-110 opacity-70"
          />
        )}
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/40 to-dark-900/90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 md:px-12 w-full mt-20">
        <h1 className="font-serif text-[clamp(2.5rem,10vw,5rem)] md:text-8xl font-medium mb-4 md:mb-6 leading-[1.1] md:leading-tight fade-in tracking-tight max-w-4xl mx-auto">
          Vishal Photography
          <span className="block text-[clamp(1.5rem,5vw,3rem)] md:text-5xl font-light text-gold-400 mt-2 md:mt-4 italic tracking-normal">
            Capturing Moments
          </span>
        </h1>

        <div className="w-16 md:w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-8 md:mb-10 opacity-60"></div>

        <p className="font-sans text-base md:text-xl font-light mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed text-gray-200 tracking-wide fade-in px-4" style={{ animationDelay: '0.2s' }}>
          Capturing life's most precious moments with elegance, emotion, and timeless artistry.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 fade-in" style={{ animationDelay: '0.4s' }}>
          <a
            href="tel:9667517894"
            className="w-full sm:w-auto group relative flex items-center justify-center gap-3 bg-gold-600/90 hover:bg-gold-500 text-dark-900 px-8 py-4 rounded-sm font-medium transition-all duration-300 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            <Phone className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10 tracking-wide uppercase text-sm font-semibold">Book a Call</span>
          </a>

          <button
            onClick={() => onNavClick('gallery')}
            className="w-full sm:w-auto group relative flex items-center justify-center gap-3 border border-white/20 hover:border-gold-500/50 bg-white/5 hover:bg-dark-900/50 text-white px-8 py-4 rounded-sm font-medium transition-all duration-300 backdrop-blur-md"
          >
            <span className="tracking-wide uppercase text-sm font-semibold group-hover:text-gold-400 transition-colors">View Portfolio</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => onNavClick('services')}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold-200">Scroll</span>
          <ChevronDown className="w-5 h-5 text-gold-400" />
        </button>
      </div>
    </section>
  );
}
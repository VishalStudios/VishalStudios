import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SERVICE_ITEMS = [
  { title: 'Wedding', img: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Pre-Wedding', img: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Birthday', img: 'https://images.pexels.com/photos/206533/pexels-photo-206533.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Product', img: 'https://images.pexels.com/photos/5804899/pexels-photo-5804899.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Baby', img: 'https://images.pexels.com/photos/2253842/pexels-photo-2253842.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Videography', img: 'https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Reels', img: 'https://images.pexels.com/photos/3352548/pexels-photo-3352548.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Wedding Films', img: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Editing', img: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Photo & Video Editing', img: 'https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Album Design', img: 'https://images.pexels.com/photos/3014853/pexels-photo-3014853.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Custom Album', img: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Backlit Printing', img: 'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Portrait', img: 'https://images.pexels.com/photos/1407106/pexels-photo-1407106.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Commercial', img: 'https://images.pexels.com/photos/1154189/pexels-photo-1154189.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Cinematic Films', img: 'https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg?auto=compress&cs=tinysrgb&w=800' }
];

interface ServicesProps {
  onCategoryClick?: (category: string) => void;
}

export default function Services({ onCategoryClick }: ServicesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dbImages, setDbImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      if (!supabase) return;
      const { data } = await supabase.from('site_images').select('*').eq('section', 'service_covers');
      if (data) setDbImages(data);
    };
    fetchServices();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="pt-24 pb-12 bg-white overflow-hidden">
      <div className="w-full relative px-6 md:px-12">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-serif font-black text-dark-950 uppercase tracking-tighter">Photography / Services</h2>
          <div className="flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-white hover:bg-gold-600 hover:text-white transition-all shadow-md active:scale-95 group"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-white hover:bg-gold-600 hover:text-white transition-all shadow-md active:scale-95 group"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x-mandatory pb-4"
        >
          {SERVICE_ITEMS.map((service, index) => {
            const dbImg = dbImages.find(img => img.category === service.title)?.url;
            return (
              <div
                key={index}
                className="flex-none w-[180px] md:w-[220px] snap-center group cursor-pointer"
                onClick={() => onCategoryClick?.(service.title)}
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-1">
                  <img
                    src={dbImg || service.img}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />

                  {/* Text shadow gradient - Bottom 15% to ensure visibility */}
                  <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-black/70 to-transparent backdrop-blur-[1px]"></div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white text-[13px] md:text-[15px] font-serif font-bold tracking-wide transition-all duration-500 group-hover:-translate-y-0.5">{service.title}</h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Film, X, ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_IMAGES = [
  { url: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Wedding', title: 'Eternal Vows', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Pre-Wedding', title: 'Romantic Sunset', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Wedding', title: 'The Reception', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Wedding', title: 'Bridal Portrait', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Birthday', title: 'First Joy', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/2253842/pexels-photo-2253842.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Baby', title: 'Sweet Innocence', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/5804899/pexels-photo-5804899.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Product', title: 'Luxury Watch', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Wedding', title: 'The Ring', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/206533/pexels-photo-206533.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Wedding', title: 'Celebration', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/3014853/pexels-photo-3014853.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Pre-Wedding', title: 'Lakeside Love', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/1128783/pexels-photo-1128783.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Wedding', title: 'The Dance', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Birthday', title: 'Cake Smash', media_type: 'image' },
  { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', category: 'Portrait', title: 'Studio Fine Art', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/2253844/pexels-photo-2253844.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Baby', title: 'Dreamy Sleep', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/3352548/pexels-photo-3352548.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Product', title: 'Perfume Shot', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/2917380/pexels-photo-2917380.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Pre-Wedding', title: 'City Lights', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/157757/wedding-dresses-fashion-character-bride-157757.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Wedding', title: 'The Gown', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/1964970/pexels-photo-1964970.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Product', title: 'Jewelry Detail', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/1154189/pexels-photo-1154189.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Commercial', title: 'Fashion Shoot', media_type: 'image' },
  { url: 'https://images.pexels.com/photos/3225528/pexels-photo-3225528.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Wedding', title: 'Candid Smile', media_type: 'image' }
];

interface GalleryProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export default function Gallery({ activeFilter, setActiveFilter }: GalleryProps) {
  const [images, setImages] = useState(DEFAULT_IMAGES);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      if (!supabase) return;
      try {
        const { data } = await supabase
          .from('site_images')
          .select('*')
          .eq('section', 'services')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setImages([...data]);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      }
    };
    fetchGallery();
  }, []);

  const filters = [
    'All', 'Wedding', 'Pre-Wedding', 'Birthday', 'Product', 'Baby',
    'Videography', 'Reels', 'Wedding Films', 'Editing', 'Photo & Video Editing',
    'Album Design', 'Custom Album', 'Backlit Printing', 'Portrait', 'Commercial', 'Cinematic Films'
  ];

  const filteredImages = activeFilter === 'All'
    ? images
    : images.filter(img => img.category === activeFilter);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  }, [selectedIndex, filteredImages.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % filteredImages.length);
    }
  }, [selectedIndex, filteredImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  return (
    <section id="gallery" className="py-24 md:py-40 bg-white border-b border-gray-100">
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-24 gap-6 md:gap-8 px-6 md:px-12">
          <div className="space-y-2 md:space-y-4">
            <span className="text-gold-600 font-bold uppercase tracking-[0.3em] text-[10px]">The Showcase</span>
            <h2 className="text-3xl md:text-5xl font-serif text-dark-950 font-medium leading-tight">Collected Masterpieces</h2>
            <div className="w-12 h-[2px] bg-gold-200"></div>
          </div>

          {/* Filter Tabs - Mobile Responsive */}
          <div className="w-full md:w-auto -mx-6 md:mx-0 px-6 md:px-0 overflow-x-auto scrollbar-hide flex">
            <div className="flex bg-gray-50 p-1 rounded-full border border-gray-100 whitespace-nowrap">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 md:px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-full ${activeFilter === filter
                    ? 'bg-gold-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-dark-950'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Elite Gallery Grid - Optimized for Mobile 2-columns */}
        <div className="px-2 md:px-4 lg:px-6">
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 md:gap-4 space-y-2 md:space-y-4">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedIndex(index)}
                className="break-inside-avoid relative group rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 shadow-sm transition-all duration-700 cursor-zoom-in border border-gray-100"
              >
                {image.media_type === 'video' ? (
                  <div className="relative">
                    <video
                      src={image.url}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                      autoPlay muted loop playsInline
                    />
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 w-6 h-6 md:w-8 md:h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center">
                      <Film className="w-3 h-3 text-white/70" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={image.url}
                    alt={image.title}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  />
                )}

                {/* Minimal Luxury Overlay - Simplified for Mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                  <p className="text-gold-400 text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] mb-1">{image.category}</p>
                  <h3 className="text-white text-[10px] md:text-sm font-serif tracking-wide truncate">{image.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Luxury Lightbox / Previewer */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-950/95 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors z-[110]"
            onClick={() => setSelectedIndex(null)}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Buttons - More Prominent */}
          <button
            className="absolute left-2 md:left-8 w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-gold-600 transition-all z-[110] shadow-xl group active:scale-90"
            onClick={handlePrev}
            aria-label="Previous"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:-translate-x-1" />
          </button>
          <button
            className="absolute right-2 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-gold-600 transition-all z-[110] shadow-xl group active:scale-90"
            onClick={handleNext}
            aria-label="Next"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Preview Content */}
          <div
            className="relative max-w-5xl max-h-[80vh] w-full mx-4 md:mx-0 flex flex-col items-center animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black flex items-center justify-center">
              {filteredImages[selectedIndex].media_type === 'video' ? (
                <video
                  src={filteredImages[selectedIndex].url}
                  controls
                  autoPlay
                  className="max-h-[80vh] w-auto h-full"
                />
              ) : (
                <img
                  src={filteredImages[selectedIndex].url}
                  alt={filteredImages[selectedIndex].title}
                  className="max-h-[80vh] w-auto h-full object-contain"
                />
              )}
            </div>

            {/* Overlay Text */}
            <div className="mt-6 text-center">
              <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">
                {filteredImages[selectedIndex].category}
              </span>
              <h3 className="text-white text-xl md:text-2xl font-serif">
                {filteredImages[selectedIndex].title}
              </h3>
            </div>
          </div>

          {/* Pagination Counter */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-black uppercase tracking-widest">
            {selectedIndex + 1} / {filteredImages.length}
          </div>
        </div>
      )}
    </section>
  );
}
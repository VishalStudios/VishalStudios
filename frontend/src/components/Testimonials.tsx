import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Priya & Rahul',
    event: 'Wedding, Patna',
    rating: 5,
    text: 'Vishal Photography captured our special day beautifully. Every moment was perfect!',
    initials: 'PR'
  },
  {
    name: 'Anjali Sharma',
    event: 'Pre-Wedding, Bodhgaya',
    rating: 5,
    text: 'Professional team with amazing creativity. Highly recommend for any occasion!',
    initials: 'AS'
  },
  {
    name: 'Vikash Kumar',
    event: 'Birthday Party, Gaya',
    rating: 5,
    text: 'Excellent service and beautiful photos. They made our celebration memorable.',
    initials: 'VK'
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('*')
          .eq('section', 'testimonials');

        if (error) throw error;

        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            name: item.title,
            event: item.category,
            rating: 5,
            text: item.description || 'Excellent work!',
            initials: item.title.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
            url: item.url
          }));
          setTestimonials(formatted);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-24 md:py-40 bg-white border-b border-gray-100 relative">
      <div className="w-full">
        <div className="text-center mb-24 w-full px-12 space-y-4">
          <span className="text-gold-600 font-bold uppercase tracking-[0.3em] text-[10px]">Kind Words</span>
          <h2 className="text-4xl md:text-5xl font-serif text-dark-950 font-medium leading-tight">Client Love</h2>
          <div className="w-12 h-[2px] bg-gold-200 mx-auto"></div>
        </div>

        {/* Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-10 md:p-12 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-500 flex flex-col items-center text-center relative"
            >
              <Quote className="text-gold-100 w-16 h-16 absolute top-8 left-8 -z-0 opacity-40 transition-colors" />

              <div className="relative z-10 space-y-8">
                <div className="flex justify-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-gold-500 fill-current" />
                  ))}
                </div>

                <p className="text-gray-600 font-light italic leading-relaxed text-lg">
                  "{testimonial.text}"
                </p>

                <div className="pt-8 border-t border-gray-50 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gold-50 border border-gold-100 rounded-full flex items-center justify-center text-gold-700 font-serif font-bold text-xl mb-4 overflow-hidden">
                    {testimonial.url ? (
                      <img src={testimonial.url} alt={testimonial.name} className="w-full h-full object-cover" />
                    ) : (
                      testimonial.initials
                    )}
                  </div>
                  <h4 className="font-bold text-dark-950 text-base">{testimonial.name}</h4>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{testimonial.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
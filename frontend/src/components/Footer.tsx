import { Camera, Instagram, Facebook, Mail, Phone, MapPin, Heart, MessageSquare, Layers } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

export default function Footer() {
  const settings = useSiteSettings();
  const currentYear = new Date().getFullYear();


  return (
    <footer className="bg-dark-900 pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-600/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Camera className="w-8 h-8 text-gold-600" />
              <span className="text-2xl font-serif font-bold text-white">
                Vishal<span className="text-gold-600">Photography</span>
              </span>
            </div>
            <p className="text-gray-400 font-light leading-relaxed">
              Capturing the essence of your most beautiful moments with elegance and artistry. We turn memories into timeless treasures.
            </p>
            <div className="flex gap-4">
              <a href={settings.instagram_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center hover:bg-gold-600 hover:text-dark-900 text-gray-400 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={settings.facebook_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center hover:bg-gold-600 hover:text-dark-900 text-gray-400 transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
            </div>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-serif mb-8 flex items-center gap-2">
              Explore
              <span className="h-px w-8 bg-gold-600"></span>
            </h4>
            <ul className="space-y-4">
              {['Home', 'Services', 'Gallery', 'Packages', 'Testimonials', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()} `} className="text-gray-400 hover:text-gold-500 transition-colors uppercase text-sm tracking-wider">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-lg font-serif mb-8 flex items-center gap-2">
              Services
              <span className="h-px w-8 bg-gold-600"></span>
            </h4>
            <ul className="space-y-4">
              {['Wedding Photography', 'Cinematic Films', 'Candid Photography', 'Pre-Wedding Shoots', 'Event Coverage', 'Product Shoots'].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-gray-400 hover:text-gold-500 transition-colors text-sm font-light">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-lg font-serif mb-8 flex items-center gap-2">
              Contact
              <span className="h-px w-8 bg-gold-600"></span>
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gold-500 flex-shrink-0 mt-1" />
                <span className="text-gray-400 font-light text-sm">Dehri on sone Rattubigha petrol pump near ( Rohtas bihar) Dalmiyanagar, Pin code 821305</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="text-gray-400 hover:text-gold-500 transition-colors font-light text-sm">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-gray-400 hover:text-gold-500 transition-colors font-light text-sm">{settings.email}</a>
              </li>

            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-light">
            © {currentYear} Vishal Photography. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/admin/login" className="text-gray-500 hover:text-gold-500 text-xs transition-colors uppercase tracking-widest">Admin Login</a>
            <p className="text-gray-500 text-sm font-light flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-gold-600 fill-current" /> in Bihar
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Floating Bottom Navigation - Reduced & Polished */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-dark-900/80 backdrop-blur-xl border border-white/10 z-50 rounded-full h-14 flex justify-around items-center px-4 shadow-2xl shadow-black/50">
        <a href={`tel:${settings.phone}`} className="flex flex-col items-center gap-0.5 text-gold-500 transition-transform active:scale-90">
          <Phone className="w-4 h-4" />
          <span className="text-[8px] uppercase font-black tracking-widest">Call</span>
        </a>
        <a href={`https://wa.me/${settings.phone?.replace(/\D/g, '') || '919667517894'}`} className="flex flex-col items-center gap-0.5 text-gray-400 transition-transform active:scale-90">
          <MessageSquare className="w-4 h-4" />
          <span className="text-[8px] uppercase font-black tracking-widest">Wa</span>
        </a>

        <a href="#gallery" className="flex flex-col items-center gap-0.5 text-gray-400 transition-transform active:scale-90">
          <Camera className="w-4 h-4" />
          <span className="text-[8px] uppercase font-black tracking-widest">Work</span>
        </a>
        <a href="#packages" className="flex flex-col items-center gap-0.5 text-gray-400 transition-transform active:scale-90">
          <Layers className="w-4 h-4" />
          <span className="text-[8px] uppercase font-black tracking-widest">Plans</span>
        </a>
      </div>
    </footer>
  );
}
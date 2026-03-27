import { useState, useEffect } from 'react';
import { Menu, X, Camera } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';



interface HeaderProps {
  activeSection: string;
  onNavClick: (section: string) => void;
}

export default function Header({ activeSection, onNavClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navItems = [
    { id: 'hero', label: 'Home', path: '/' },
    { id: 'services', label: 'Services', path: '/#services' },
    { id: 'gallery', label: 'Gallery', path: '/#gallery' },
    { id: 'packages', label: 'Packages', path: '/#packages' },
    { id: 'contact', label: 'Contact', path: '/#contact' },
    { id: 'drive', label: 'Drive', path: '/clients' },
  ];



  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled
        ? 'bg-dark-500/80 backdrop-blur-xl border-white/10 py-4'
        : 'bg-transparent border-transparent py-6'
        }`}
    >
      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className={`p-2 rounded-lg transition-colors duration-300 ${isScrolled ? 'bg-gold-600/10' : 'bg-white/10'}`}>
              <Camera className={`w-6 h-6 ${isScrolled ? 'text-gold-600' : 'text-white'}`} />
            </div>
            <span className={`text-2xl font-serif font-bold tracking-tight ${isScrolled ? 'text-white' : 'text-white'}`}>
              Vishal<span className="text-gold-600">Photography</span>
            </span>
          </Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={(e) => {
                  if (item.path.startsWith('/#')) {
                    e.preventDefault();
                    if (location.pathname !== '/') {
                      navigate(item.path);
                    } else {
                      onNavClick(item.path.replace('/#', ''));
                    }
                  } else if (item.path === '/') {
                    e.preventDefault();
                    if (location.pathname !== '/') {
                      navigate('/');
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }
                }}
                className={`text-sm font-medium tracking-wide transition-all duration-300 relative group py-2 ${activeSection === item.id || (item.id === 'drive' && location.pathname === '/clients')
                  ? 'text-gold-600'
                  : 'text-gray-300 hover:text-white'
                  }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gold-600 transform origin-left transition-transform duration-300 ${activeSection === item.id || (item.id === 'drive' && location.pathname === '/clients') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
              </Link>
            ))}
          </div>



          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:text-gold-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <div className={`md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-3xl transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
          {/* Header inside menu to keep logo and close button visible */}
          <div className="flex items-center justify-between px-6 pt-8 pb-4 border-b border-white/5">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold-600/10 text-gold-600">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-2xl font-serif font-bold text-white">
                Vishal<span className="text-gold-600">Photography</span>
              </span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-white hover:text-gold-600 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="flex flex-col h-[calc(100vh-100px)] overflow-y-auto">
            <div className="flex flex-col space-y-6 px-8 py-12">
              <p className="text-gold-600 text-[10px] font-black uppercase tracking-[0.3em] ml-1">Menu</p>
              {navItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.path}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    if (item.path.startsWith('/#')) {
                      e.preventDefault();
                      if (location.pathname !== '/') {
                        navigate(item.path);
                      } else {
                        onNavClick(item.path.replace('/#', ''));
                      }
                    } else if (item.path === '/') {
                      e.preventDefault();
                      if (location.pathname !== '/') {
                        navigate('/');
                      } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }
                  }}
                  className={`text-5xl font-serif font-bold text-left transition-all duration-500 ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'} ${activeSection === item.id || (item.id === 'drive' && location.pathname === '/clients')
                    ? 'text-gold-600'
                    : 'text-white hover:text-gold-500'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className={`mt-auto p-8 border-t border-white/5 transition-all duration-700 delay-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold-500">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Vishal Photography</p>
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Professional Photography</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic">"Capturing memories that last forever with a touch of gold."</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
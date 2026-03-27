import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Process from './components/Process';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Packages from './components/Packages';
import CTA from './components/CTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ClientPortal from './pages/ClientPortal';
import { useSiteSettings } from './hooks/useSiteSettings';

function MainSite() {
  const settings = useSiteSettings();
  const [activeSection, setActiveSection] = useState('hero');
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('All');

  const handleNavClick = (section: string, filter?: string) => {
    if (filter) {
      setActiveGalleryFilter(filter);
    }
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'services', 'gallery', 'testimonials', 'packages', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHidden = (id: string) => settings.disabled_sections?.includes(id);

  return (
    <div className="min-h-screen bg-white text-dark-900 font-sans selection:bg-gold-500 selection:text-white">
      <Header activeSection={activeSection} onNavClick={handleNavClick} />
      <main>
        {!isHidden('hero') && <Hero onNavClick={handleNavClick} />}
        {!isHidden('services') && <Services onCategoryClick={(cat: string) => handleNavClick('gallery', cat)} />}
        <Process />
        {!isHidden('gallery') && <Gallery activeFilter={activeGalleryFilter} setActiveFilter={setActiveGalleryFilter} />}
        <WhyChooseUs />
        {!isHidden('packages') && <Packages />}
        {!isHidden('about') && <About />}
        {!isHidden('testimonials') && <Testimonials />}
        <CTA />
        {!isHidden('contact') && <Contact />}
      </main>
      <Footer />

      {/* Add bottom padding for mobile bottom bar */}
      <div className="h-20 md:hidden block bg-dark-900"></div>
    </div>
  );
}


function App() {
  console.log('App component rendering...');
  return (

    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/clients" element={
        <>
          <Header activeSection="" onNavClick={() => { }} />
          <ClientPortal />
          <Footer />
        </>
      } />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
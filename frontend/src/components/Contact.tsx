import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

export default function Contact() {
  const settings = useSiteSettings();
  const studioLocation = settings.location || 'Dehri on sone Rattubigha petrol pump near ( Rohtas bihar) Dalmiyanagar, Pin code 821305';
  const mapQuery = encodeURIComponent(studioLocation);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'Wedding',
    date: '',
    budget: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submitting
    const message = `New Inquiry from ${formData.name}%0A
    Phone: ${formData.phone}%0A
    Event: ${formData.eventType}%0A
    Date: ${formData.date}%0A
    Budget: ${formData.budget}%0A
    Message: ${formData.message}`;

    const whatsappPhone = settings.phone?.replace(/\D/g, '') || '919667517894';
    window.open(`https://wa.me/${whatsappPhone}?text=${message}`, '_blank');
  };


  return (
    <section id="contact" className="py-32 bg-dark-900 relative border-t border-white/5">
      <div className="w-full px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Contact Info */}
          <div>
            <div className="mb-12">
              <p className="text-gold-600 font-medium tracking-widest uppercase text-sm mb-3">Get in Touch</p>
              <h2 className="text-4xl md:text-6xl text-white mb-6 font-serif">
                Let's Create Magic Together
              </h2>
              <div className="w-16 h-1 bg-gold-600 rounded-full mb-8"></div>
              <p className="text-gray-300 text-lg font-light leading-relaxed">
                We'd love to hear about your special day. Fill out the form or reach out to us directly.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start group">
                <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center mr-6 group-hover:bg-gold-600 transition-colors duration-300 border border-white/10">
                  <Phone className="w-5 h-5 text-gold-500 group-hover:text-dark-900 transition-colors" />
                </div>
                <div>
                  <h4 className="text-white text-lg font-serif mb-1">Phone</h4>
                  <a href={`tel:${settings.phone}`} className="text-gray-400 hover:text-gold-400 transition-colors">{settings.phone}</a>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center mr-6 group-hover:bg-gold-600 transition-colors duration-300 border border-white/10">
                  <Mail className="w-5 h-5 text-gold-500 group-hover:text-dark-900 transition-colors" />
                </div>
                <div>
                  <h4 className="text-white text-lg font-serif mb-1">Email</h4>
                  <a href={`mailto:${settings.email}`} className="text-gray-400 hover:text-gold-400 transition-colors">{settings.email}</a>
                </div>
              </div>


              <div className="flex items-start group">
                <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center mr-6 group-hover:bg-gold-600 transition-colors duration-300 border border-white/10">
                  <MapPin className="w-5 h-5 text-gold-500 group-hover:text-dark-900 transition-colors" />
                </div>
                <div>
                  <h4 className="text-white text-lg font-serif mb-1">Studio</h4>
                  <p className="text-gray-400">{studioLocation}</p>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="mt-12 h-64 w-full rounded-sm overflow-hidden border border-white/10 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <iframe
                src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-dark-800 p-8 md:p-12 rounded-sm border border-white/5 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-dark-900 border border-white/10 rounded-sm px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gold-600 transition-colors"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-dark-900 border border-white/10 rounded-sm px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gold-600 transition-colors"
                    placeholder="Your Number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Event Type</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full bg-dark-900 border border-white/10 rounded-sm px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gold-600 transition-colors appearance-none"
                >
                  <option>Wedding</option>
                  <option>Pre-Wedding</option>
                  <option>Birthday</option>
                  <option>Corporate</option>
                  <option>Maternity</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-dark-900 border border-white/10 rounded-sm px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gold-600 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Budget</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full bg-dark-900 border border-white/10 rounded-sm px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gold-600 transition-colors appearance-none"
                  >
                    <option value="" disabled>Select Range</option>
                    <option>₹50,000 - ₹1 Lakh</option>
                    <option>₹1 Lakh - ₹3 Lakhs</option>
                    <option>₹3 Lakhs+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-dark-900 border border-white/10 rounded-sm px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gold-600 transition-colors"
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-dark-900 font-bold py-5 rounded-sm hover:shadow-lg hover:shadow-gold-600/20 transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-2 group"
              >
                Send Inquiry
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

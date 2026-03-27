import { Phone } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-24 md:py-40 bg-white relative overflow-hidden">
            {/* Subtle Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-50/50 rounded-full blur-[120px] -z-10"></div>

            <div className="w-full px-12 text-center space-y-12">
                <div className="space-y-6">
                    <span className="text-gold-600 font-black uppercase tracking-[0.4em] text-[10px]">Take the Next Step</span>
                    <h2 className="text-4xl md:text-7xl font-serif text-dark-950 leading-[1.1] max-w-4xl mx-auto">
                        Let's Capture Your <span className="italic text-gold-700">Legacy</span> Together.
                    </h2>
                    <p className="text-gray-500 font-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Ready to turn your most precious moments into high-end visual masterpieces? Our calendars fill up fast—reserve your date today.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a
                        href="tel:9667517894"
                        className="w-full sm:w-auto px-12 py-6 bg-gold-600 hover:bg-gold-700 text-white rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-gold-600/20 active:scale-95 flex items-center justify-center gap-3"
                    >
                        <Phone className="w-4 h-4" />
                        Book Your Shoot
                    </a>
                    <a
                        href="#gallery"
                        className="w-full sm:w-auto px-12 py-6 bg-transparent hover:bg-gray-50 text-dark-900 border border-gray-200 rounded-full font-black uppercase tracking-widest text-[10px] transition-all"
                    >
                        View Portfolio
                    </a>
                </div>

                <div className="pt-12">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Available globally • Based in Bihar, India</p>
                </div>
            </div>
        </section>
    );
}

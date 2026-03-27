export default function Process() {
    const steps = [
        { number: '01', title: 'Consultation', desc: 'A personal meeting to understand your vision, style, and essential details.' },
        { number: '02', title: 'Planning', desc: 'Crafting a unique mood board, scouting locations, and finalizing the schedule.' },
        { number: '03', title: 'Shooting', desc: 'The big day! Seamless documentation with high-performance gear and passion.' },
        { number: '04', title: 'Delivery', desc: 'Masterfully edited photos and films delivered in a premium digital gallery.' }
    ];

    return (
        <section className="py-24 md:py-40 bg-gray-50 border-b border-gray-100 overflow-hidden">
            <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 px-12">
                    <div className="space-y-4">
                        <span className="text-gold-600 font-bold uppercase tracking-[0.3em] text-[10px]">The Journey</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-dark-950 font-medium leading-tight">Our Effortless Process</h2>
                        <div className="w-12 h-[2px] bg-gold-200"></div>
                    </div>
                    <p className="text-gray-500 font-light max-w-sm">From the first call to the final reveal, we ensure a smooth, professional, and luxury experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-0">
                    {steps.map((step, index) => (
                        <div key={index} className="relative p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-200 last:border-0 transition-all duration-500 overflow-hidden">
                            {/* Background Number */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-serif text-gray-100/50 transition-colors duration-500 -z-0">
                                {step.number}
                            </div>

                            <div className="relative z-10 space-y-6">
                                <span className="w-8 h-8 rounded-full border border-gold-400 text-gold-600 flex items-center justify-center text-[10px] font-black transition-all">
                                    {step.number}
                                </span>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-serif font-black text-dark-950 transition-colors">{step.title}</h3>
                                    <p className="text-sm text-gray-500 font-light leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

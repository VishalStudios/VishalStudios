export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-white text-dark-900 border-b border-gray-100">
      <div className="w-full px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Split Layout - Compact Luxury */}
          <div className="relative order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="aspect-[3/4] w-full max-w-md rounded-lg overflow-hidden shadow-xl relative z-10">
              <img
                src="https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-gold-50 shadow-md rounded-lg -z-10 hidden md:block border border-gold-100"></div>
          </div>

          {/* Storytelling Content - Reduced Sizes */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-3">
              <span className="text-gold-600 font-bold uppercase tracking-[0.2em] text-[10px]">Our Heritage</span>
              <h2 className="text-3xl md:text-5xl font-serif text-dark-950 leading-[1.2]">
                Preserving the <span className="italic text-gold-700">Art of Emotion</span>
              </h2>
            </div>

            <div className="space-y-4 text-base md:text-lg text-gray-600 font-light leading-relaxed max-w-xl">
              <p>
                At <span className="text-dark-950 font-medium">Vishal Studios</span>, we archive the soul of every moment. Founded on the principles of luxury and storytelling, we've spent over 6 years refining the alchemy of light and emotion.
              </p>
              <p>
                Whether it's a wedding vow or the joy of a child's laugh, we deliver high-end visuals that transcend time. We believe in minimal distractions and maximum impact.
              </p>
            </div>

            <div className="pt-6 grid grid-cols-2 gap-8 border-t border-gray-100 max-w-sm">
              <div>
                <p className="text-2xl font-serif text-dark-950 mb-0.5">500+</p>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">Events</p>
              </div>
              <div>
                <p className="text-2xl font-serif text-dark-950 mb-0.5">20+</p>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">Cities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

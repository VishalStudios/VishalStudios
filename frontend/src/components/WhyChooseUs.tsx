import { ShieldCheck, Clock, Award, Users, Heart, Camera } from 'lucide-react';

export default function WhyChooseUs() {
    const features = [
        {
            icon: Award,
            title: 'Premium Quality',
            desc: 'Industry-leading 4K equipment and high-end editing for a cinematic feel.'
        },
        {
            icon: Clock,
            title: 'Timely Delivery',
            desc: 'We respect your time. Get your edited memories delivered on schedule, always.'
        },
        {
            icon: Heart,
            title: 'Emotional Detail',
            desc: 'We focus on the candid moments that tell the real story of your celebration.'
        },
        {
            icon: ShieldCheck,
            title: 'Trusted Team',
            desc: 'Over 6 years of experience documenting high-profile weddings and events.'
        },
        {
            icon: Camera,
            title: 'Artistic Vision',
            desc: 'A unique blend of traditional elegance and modern luxury aesthetics.'
        },
        {
            icon: Users,
            title: 'Tailored Service',
            desc: 'Personalized packages designed to fit your specific vision and needs.'
        }
    ];

    return (
        <section className="py-24 md:py-40 bg-white border-b border-gray-100">
            <div className="w-full">
                <div className="text-center mb-24 w-full px-12 space-y-4">
                    <span className="text-gold-600 font-bold uppercase tracking-[0.3em] text-[10px]">The Vishal Guarantee</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-dark-950 font-medium">Why Vishal Photography?</h2>
                    <div className="w-12 h-[2px] bg-gold-200 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                    {features.map((item, index) => (
                        <div key={index} className="flex gap-6">
                            <div className="w-12 h-12 flex-shrink-0 bg-gold-50 shadow-sm border border-gold-100 rounded-xl flex items-center justify-center text-gold-600 transition-all duration-300">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-dark-950 tracking-tight">{item.title}</h3>
                                <p className="text-gray-500 font-light leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

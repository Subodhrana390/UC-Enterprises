import heroBanner from "@/assets/hero-banner.jpg";
import Image from "next/image";

const HeroBanner = () => (
    <section className="relative overflow-hidden">
        <div className="relative h-[350px] md:h-[450px]">
            <Image
                src={heroBanner}
                alt="Robotics and electronics components"
                className="w-full h-full object-cover"
                width={1920}
                height={800}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
            <div className="absolute inset-0 flex items-center">
                <div className="container px-20">
                    <div className="max-w-lg animate-fade-in-up">
                        <span className="inline-block bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                            India's #1 Robotics Store
                        </span>
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-card mb-4 leading-tight">
                            Build the Future<br />
                            <span className="text-accent">With Robotics</span>
                        </h2>
                        <p className="text-card/80 text-sm md:text-base mb-6 max-w-md">
                            Explore 10,000+ components for Arduino, Raspberry Pi, Drones, 3D Printers, IoT and more. Fast shipping across India.
                        </p>
                        <div className="flex gap-3">
                            <a href="/search" className="border border-card/30 text-card px-6 py-3 rounded-lg font-semibold text-sm hover:bg-card/10 transition-colors">
                                Shop Now
                            </a>
                            <a href="/categories" className="border border-card/30 text-card px-6 py-3 rounded-lg font-semibold text-sm hover:bg-card/10 transition-colors">
                                New Arrivals
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default HeroBanner;

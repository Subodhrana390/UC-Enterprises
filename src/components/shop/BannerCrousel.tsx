import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BannerCarousel({ banners }: { banners: any[] }) {

    console.log(banners)
    if (!banners || banners.length === 0) return null;
    return (
        <div className="relative w-full overflow-hidden bg-slate-950">
            {banners.map((banner: any, index: number) => (
                <section key={index} className="relative h-[450px] md:h-[600px] w-full border-b border-slate-900">
                    <Image
                        src={banner.image_url || "/placeholder-industrial.jpg"}
                        alt="Industrial Electronics and Robotics"
                        className="object-cover transition-transform duration-10000 hover:scale-110"
                        fill
                        priority
                    />

                    {/* Industrial Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />

                    {/* Scanline / Grid Effect Overlay */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
                            <div className="max-w-2xl space-y-6">
                                {/* Tagline */}
                                <div className="flex items-center gap-3 animate-fade-in">
                                    <span className="h-[1px] w-10 bg-cyan-500" />
                                    <span className="text-cyan-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">
                                        {banner.subtitle}
                                    </span>
                                </div>

                                {/* Main Headline */}
                                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase">
                                    {banner.title}
                                </h2>

                                {/* Description */}
                                <p className="text-slate-400 text-sm md:text-lg max-w-md leading-relaxed font-medium">
                                    {banner.description}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Link href={`${banner.link_url}`}>
                                        <Button className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 h-14 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-900/20">
                                            Shop Now
                                        </Button>
                                    </Link>

                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
}
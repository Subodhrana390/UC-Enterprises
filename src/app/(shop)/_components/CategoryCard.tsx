import Link from "next/link";
import Image from "next/image";

export default function CategoryCard({
    icon,
    title,
    count,
    slug,
}: {
    icon?: string | null;
    title: string;
    count: string;
    slug: string;
}) {
    return (
        <Link href={`/categories/${slug}`} className="group block">
            <div className="relative w-full h-[140px] p-5 rounded-xl transition-all duration-500 hover:shadow-md overflow-hidden">

                {/* Full Background Icon - Always Visible */}
                <div className="absolute inset-0 transition-all duration-500 group-hover:scale-110">
                    {icon && (
                        <div className="relative w-full h-full">
                            <Image
                                src={icon}
                                alt={title}
                                fill
                                className="object-cover opacity-100 transition-all duration-500"
                            />
                        </div>
                    )}
                </div>

                {/* Overlay Gradient for Readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/60 to-blue-50/50 group-hover:from-white/60 group-hover:via-white/50 group-hover:to-blue-50/40 transition-all duration-500" />

                {/* Content */}
                <div className="relative z-10 space-y-1.5">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {title}
                    </h3>

                    <p className="text-sm text-white-400 group-hover:text-gray-500 transition-colors duration-300">
                        {count} Products
                    </p>
                </div>

                {/* Subtle hover accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none z-5" />
            </div>
        </Link>
    );
}
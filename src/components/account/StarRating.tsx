"use client";
import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function StarRating({ rating, setRating }: { rating: number, setRating: (n: number) => void }) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform active:scale-90"
                >
                    <Star
                        className={cn(
                            "w-8 h-8 transition-colors",
                            (hover || rating) >= star
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-100 text-gray-300"
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
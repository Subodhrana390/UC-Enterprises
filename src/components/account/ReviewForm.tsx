"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface ReviewFormProps {
    productId: string;
    orderId: string;
    userId: string;
    onSuccess?: () => void;
}

export function ReviewForm({ productId, orderId, userId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return toast.error("Please select a rating");

        setIsSubmitting(true);

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from("reviews").insert({
            product_id: productId,
            order_id: orderId,
            user_id: user?.id,
            rating,
            comment,
        });

        setIsSubmitting(false);

        if (error) {
            console.error("Supabase Error:", error);

            if (error.code === '23505') {
                toast.error("You have already submitted a review for this item.");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } else {
            toast.success("Thank you for your feedback!");
            onSuccess?.();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-2xl border border-[#ebebed]">
            <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1a1c1d]">Rate this product</h3>
                <p className="text-xs text-[#616161]">Share your experience with other customers.</p>
            </div>

            <StarRating rating={rating} setRating={setRating} />

            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#616161]">
                    Review Details
                </label>
                <Textarea
                    placeholder="What did you like or dislike? How was the quality?"
                    className="min-h-[120px] resize-none border-[#d2d2d2] focus:border-[#008060] focus:ring-0"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#008060] hover:bg-[#006e52] text-white font-bold h-11"
            >
                {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    );
}
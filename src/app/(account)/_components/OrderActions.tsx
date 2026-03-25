"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ReviewForm } from "@/components/account/ReviewForm";
import { createClient } from "@/lib/supabase/client";

interface OrderActionsProps {
    status: string;
    orderId: string;
    items: any[];
    userId: string;
}

export function OrderActions({ status, orderId, items, userId }: OrderActionsProps) {
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    useEffect(() => {
        const checkReview = async () => {

            const supabase = createClient();

            const { data, error } = await supabase
                .from('reviews')
                .select('id')
                .eq('order_id', orderId)
                .limit(1)
                .maybeSingle();

            if (data) setHasReviewed(true);
            if (error) console.error("Error checking review status:", error);
        };

        if (orderId) checkReview();
    }, [orderId]);

    if (status === 'delivered') {
        return (
            <div className="flex gap-2 w-full">
                {hasReviewed ? (
                    <Button disabled className="flex-1 text-xs bg-gray-100 text-gray-400 font-semibold h-9">
                        Review Submitted
                    </Button>
                ) : (
                    <Button onClick={() => setIsReviewOpen(true)} className="flex-1 text-xs bg-[#008060] text-white hover:bg-[#006e52] font-semibold h-9">
                        Rate Experience
                    </Button>
                )}

                {/* 2. Dialog controlled strictly by state (No DialogTrigger used) */}
                <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                    <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-2xl">
                        <DialogHeader className="p-6 pb-0">
                            <DialogTitle className="text-xl font-bold">Write a Review</DialogTitle>
                        </DialogHeader>

                        <div className="max-h-[80vh] overflow-y-auto p-4">
                            {items.map((item) => (
                                <ReviewForm
                                    key={item.id}
                                    productId={item.product_id}
                                    orderId={orderId}
                                    userId={userId}
                                    onSuccess={() => setIsReviewOpen(false)}
                                />
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Return Items Button */}
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs border-[#babfc3] font-semibold h-9 text-rose-600 hover:bg-rose-50"
                >
                    Return Items
                </Button>
            </div>
        )
    }
    return (
        <div></div>
    );
}   
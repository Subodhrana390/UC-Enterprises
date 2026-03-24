"use client";

import { createClient } from "@/lib/supabase/client"; // MUST be client
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export function ReviewDeleteButton({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Delete this review permanently?")) return;

    setLoading(true);
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

    if (error) {
      toast.error("Failed to delete review");
    } else {
      toast.success("Review deleted");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-semibold text-rose-600 hover:underline disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
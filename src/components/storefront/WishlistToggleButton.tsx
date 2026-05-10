"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

type Props = {
  productId: string;
  className?: string;
  label?: string;
};

export default function WishlistToggleButton({ productId, className, label = "Save" }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [entryId, setEntryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadState() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      setEntryId(data?.id || null);
      setLoading(false);
    }

    loadState();
  }, [productId, supabase]);

  async function handleToggle() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.info("Please login to save wishlist items");
      router.push("/login");
      return;
    }

    if (entryId) {
      const { error } = await supabase.from("wishlist").delete().eq("id", entryId);
      if (error) {
        toast.error(error.message || "Unable to update wishlist");
        return;
      }
      setEntryId(null);
      toast.success("Removed from wishlist");
      return;
    }

    const { data, error } = await supabase
      .from("wishlist")
      .insert([{ user_id: user.id, product_id: productId }])
      .select("id")
      .single();

    if (error) {
      toast.error(error.message || "Unable to update wishlist");
      return;
    }

    setEntryId(data.id);
    toast.success("Saved to wishlist");
  }

  return (
    <Button variant="outline" className={className} disabled={loading} onClick={handleToggle}>
      <Heart className={`mr-2 h-4 w-4 ${entryId ? "fill-current text-primary" : ""}`} />
      {entryId ? "Saved" : label}
    </Button>
  );
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { uploadPublicImage } from "../admin";

export async function getBanners(position?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .is("end_date", null)
    .or("end_date.gt.now()");

  if (position) {
    query = query.eq("position", position);
  }

  return query.order("sort_order", { ascending: true });
}

export async function getAllBanners() {
  const supabase = await createClient();
  return supabase
    .from("banners")
    .select("*, profiles(full_name)")
    .order("sort_order", { ascending: true });
}

export async function createBanner(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  let image_url = ""

  if (file) {
    const upload = await uploadPublicImage(file, "banners", "banner")
    if (upload.error) {
      return { error: upload.error }
    }
    if (upload.data) {
      image_url = upload.data
    }
  }

  const banner = {
    title: formData.get("title") as string,
    subtitle: formData.get("subtitle") as string,
    image_url: image_url,
    link_url: formData.get("link_url") as string || null,
    position: formData.get("position") as string || "homepage",
    is_active: formData.get("is_active") === "on",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    start_date: formData.get("start_date") as string || null,
    end_date: formData.get("end_date") as string || null,
    created_by: user.id,
  };

  const { error } = await supabase.from("banners").insert(banner);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/banners");
  return { success: true };
}

export async function updateBanner(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }
  const file = formData.get("file") as File;
  let image_url = ""

  if (file) {
    const upload = await uploadPublicImage(file, "banners", "banner")
    if (upload.error) {
      return { error: upload.error }
    }
    if (upload.data) {
      image_url = upload.data
    }
  }

  const banner = {
    title: formData.get("title") as string,
    subtitle: formData.get("subtitle") as string,
    image_url: image_url,
    link_url: formData.get("link_url") as string || null,
    position: formData.get("position") as string || "homepage",
    is_active: formData.get("is_active") === "on",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    start_date: formData.get("start_date") as string || null,
    end_date: formData.get("end_date") as string || null,
  };

  const { error } = await supabase
    .from("banners")
    .update(banner)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/banners");
  return { success: true };
}

export async function deleteBanner(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("banners").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/banners");
  return { success: true };
}

export async function toggleBannerStatus(id: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("banners")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/banners");
  return { success: true };
}
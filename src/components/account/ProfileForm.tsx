"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/lib/actions/account";
import { toast } from "sonner";
import Image from "next/image";

export function ProfileForm({
  userId,
  defaultFullName,
  email,
  defaultPhone,
  defaultAvatar = "/placeholder-avatar.png",
}: {
  userId: string;
  defaultFullName?: string;
  email?: string;
  defaultPhone?: string;
  defaultAvatar?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(defaultFullName || "");
  const [phone, setPhone] = useState(defaultPhone || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await updateProfile(userId, fullName, phone, avatarFile);
      if (result.error) {
        toast.error(result.error);
      } else {
        setAvatarPreview("");
        setAvatarFile(null);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
    >

      {/* Avatar Upload */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
          <Image
            src={avatarFile ? avatarPreview : defaultAvatar}
            alt="Avatar"
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="avatarFile"
            className="text-xs font-semibold text-[#1a1c1d]"
          >
            Profile Picture
          </Label>

          <Input
            id="avatarFile"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="h-10 border-[#d2d2d2] focus:border-[#005bd3]"
          />

          <p className="text-xs text-gray-500">
            JPG, PNG or WEBP (max 2MB)
          </p>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-[#1a1c1d]">
          Full Name
        </Label>

        <Input
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          className="h-10 border-[#d2d2d2] focus:border-[#005bd3]"
        />
      </div>

      {/* READ ONLY SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-50">
        <div className="space-y-2">
          <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Registered Email</Label>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="material-symbols-outlined text-lg">mail</span>
            {email}
          </div>
        </div>
      </div>


      {/* Phone */}
      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="text-xs font-semibold text-[#1a1c1d]"
        >
          Phone Number
        </Label>

        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 XXXXX XXXXX"
          className="h-10 border-[#d2d2d2] focus:border-[#005bd3]"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-[#1a1c1d] hover:bg-[#303030] text-white px-6 h-10 rounded-lg"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-sm">
                progress_activity
              </span>
              Saving...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">
                save
              </span>
              Update Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

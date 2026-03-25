"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/lib/actions/account";
import { toast } from "sonner";

export function ProfileForm({
  defaultFirstName,
  defaultLastName,
  defaultPhone,
  defaultAvatar,
}: {
  defaultFirstName?: string;
  defaultLastName?: string;
  defaultPhone?: string;
  defaultAvatar?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState(defaultPhone || "");
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("phone", phone);
    formData.set("avatarUrl", avatarUrl);

    try {
      const result = await updateProfile(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-[#1a1c1d]">First Name</Label>
          <Input 
            name="firstName" 
            defaultValue={defaultFirstName} 
            className="h-10 border-[#d2d2d2] focus:border-[#005bd3]" 
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-[#1a1c1d]">Last Name</Label>
          <Input 
            name="lastName" 
            defaultValue={defaultLastName} 
            className="h-10 border-[#d2d2d2] focus:border-[#005bd3]" 
          />
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-xs font-semibold text-[#1a1c1d]">
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

      {/* Avatar URL */}
      <div className="space-y-2">
        <Label htmlFor="avatar" className="text-xs font-semibold text-[#1a1c1d]">
          Profile Picture URL
        </Label>
        <div className="flex gap-3">
          {avatarUrl && (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          )}
          <Input
            id="avatar"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="h-10 border-[#d2d2d2] focus:border-[#005bd3]"
          />
        </div>
        <p className="text-xs text-gray-500">Enter a URL to your profile picture</p>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#1a1c1d] text-white hover:bg-[#303030] px-6"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-sm mr-2">progress_activity</span>
              Saving...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm mr-2">save</span>
              Update Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateAdminProfile } from "@/lib/actions/admin/settings";

interface AdminSettingsFormProps {
  userId: string;
  defaultFullName: string;
  defaultPhone: string;
  defaultAvatar: string;
}

export function AdminSettingsForm({
  userId,
  defaultFullName,
  defaultPhone,
  defaultAvatar,
}: AdminSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(defaultFullName);
  const [phone, setPhone] = useState(defaultPhone);
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateAdminProfile({
        userId,
        fullName,
        phone,
        avatarUrl,
      });

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
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-xs font-semibold text-[#1a1c1d]">
            Full Name
          </Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="h-10 border-[#d2d2d2] focus:border-[#005bd3]"
            required
          />
        </div>

        {/* Phone */}
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
      </div>

      {/* Avatar URL */}
      <div className="space-y-2">
        <Label htmlFor="avatar" className="text-xs font-semibold text-[#1a1c1d]">
          Avatar URL
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

      {/* Submit Button */}
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
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

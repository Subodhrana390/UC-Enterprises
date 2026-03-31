"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { changePassword, signOut } from "@/lib/actions/admin/settings";

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await changePassword(newPassword);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        await signOut();
      }
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-xs font-semibold text-[#1a1c1d]">
            Current Password
          </Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="h-10 border-[#d2d2d2] focus:border-[#005bd3]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-xs font-semibold text-[#1a1c1d]">
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="h-10 border-[#d2d2d2] focus:border-[#005bd3]"
            required
            minLength={8}
          />
          <p className="text-xs text-gray-500">Must be at least 8 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-xs font-semibold text-[#1a1c1d]">
            Confirm New Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="h-10 border-[#d2d2d2] focus:border-[#005bd3]"
            required
          />
        </div>
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
              Changing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm mr-2">lock</span>
              Change Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

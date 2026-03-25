"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createAdminUser } from "@/lib/actions/admin/settings";

export function CreateAdminUserForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createAdminUser(email, password, fullName);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Admin user created successfully");
        router.push("/admin/users");
      }
    } catch (error) {
      toast.error("Failed to create admin user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-xs font-semibold text-[#1a1c1d]">
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
            className="h-10 border-[#d2d2d2] focus:border-[#005bd3]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-semibold text-[#1a1c1d]">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="h-10 border-[#d2d2d2] focus:border-[#005bd3]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-semibold text-[#1a1c1d]">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="h-10 border-[#d2d2d2] focus:border-[#005bd3]"
            required
            minLength={8}
          />
          <p className="text-xs text-gray-500">Must be at least 8 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-xs font-semibold text-[#1a1c1d]">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="h-10 border-[#d2d2d2] focus:border-[#005bd3]"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#1a1c1d] text-white hover:bg-[#303030] px-6"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-sm mr-2">progress_activity</span>
              Creating...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm mr-2">person_add</span>
              Create Admin
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

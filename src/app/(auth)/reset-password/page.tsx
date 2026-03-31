"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner"; // Or your preferred toast library

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
        } else {
            toast.success("Password updated successfully");
            // Redirect to login or dashboard
            router.push("/login?message=Password updated. Please sign in.");
        }
    };

    return (
        <div className="min-h-screen bg-[#FCFCFC] flex flex-col justify-center items-center p-6">
            <Card className="w-full max-w-[420px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden">
                {/* Subtle Progress Bar-like Top Decor */}
                <div className="h-2 bg-slate-900 w-full" />

                <CardHeader className="pt-10 px-8 text-center">
                    <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                        <ShieldCheck className="w-6 h-6 text-indigo-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                        Set New Password
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-sm mt-2">
                        Please choose a strong password for your corporate account.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-4">
                    <form onSubmit={handleUpdate} className="space-y-5">
                        {/* New Password */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                                New Password
                            </Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 pl-11 pr-11 bg-slate-50 border-slate-100 rounded-xl focus:bg-white focus:ring-0 transition-all text-sm font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                                Confirm New Password
                            </Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-12 pl-11 pr-11 bg-slate-50 border-slate-100 rounded-xl focus:bg-white focus:ring-0 transition-all text-sm font-mono"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all mt-4 active:scale-[0.98] shadow-lg shadow-slate-200"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <p className="mt-8 text-slate-400 text-[11px] font-bold uppercase tracking-widest text-center max-w-[300px] leading-loose">
                Secured by Corporate Identity Protocol
            </p>
        </div>
    );
}
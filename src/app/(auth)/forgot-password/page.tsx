"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { KeyRound, ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const supabase = createClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
            setLoading(false);
        } else {
            setIsSubmitted(true);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FCFCFC] flex flex-col justify-center items-center p-6">
            <Link
                href="/login"
                className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="w-3 h-3" />
                Back to Sign In
            </Link>

            <Card className="w-full max-w-[400px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden">

                <CardHeader className="pt-10 px-8 text-center">
                    <div className="mx-auto w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                        <KeyRound className="w-6 h-6 text-slate-900" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                        Account Recovery
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-sm mt-2">
                        {isSubmitted
                            ? "We've sent recovery instructions to your inbox."
                            : "Enter your registered email to receive a password reset link."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-4">
                    {!isSubmitted ? (
                        <form onSubmit={handleReset} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                    Email Address
                                </Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 pl-11 bg-slate-50 border-slate-100 rounded-xl focus:bg-white focus:ring-0 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {message?.type === 'error' && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                                    {message.text}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="flex justify-center">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Check <b>{email}</b> for an email from us and follow the instructions to reset your password.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-bold"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Didn't get the email? Try again
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
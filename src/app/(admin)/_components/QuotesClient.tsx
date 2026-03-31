"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { User, IndianRupee, Eye, Reply, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { respondToQuote } from "@/lib/actions/admin";
import { toast } from "sonner";

export function QuotesClient({ quotes }: { quotes: any[] }) {
    const [selectedQuote, setSelectedQuote] = useState<any>(null);
    const [mode, setMode] = useState<"view" | "respond" | null>(null);
    const [offeredPrice, setOfferedPrice] = useState("");
    console.log(quotes)

    const closeModal = () => {
        setSelectedQuote(null);
        setMode(null);
        setOfferedPrice("");
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "open":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "closed":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const handleRespond = async () => {
        const res = await respondToQuote(selectedQuote.id, Number(offeredPrice));
        if (res.error) return toast.error(res.error);
        toast.success("Quote responded successfully");
        closeModal();
    };

    return (
        <>
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100">
                        <TableHead className="w-[120px] text-xs font-bold text-slate-500 uppercase px-6">ID</TableHead>
                        <TableHead className="text-xs font-bold text-slate-500 uppercase">Subject & Customer</TableHead>
                        <TableHead className="text-xs font-bold text-slate-500 uppercase">Offered Price</TableHead>
                        <TableHead className="text-xs font-bold text-slate-500 uppercase">Status</TableHead>
                        <TableHead className="text-xs font-bold text-slate-500 uppercase text-right px-6">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {quotes?.map((quote) => (
                        <TableRow key={quote.id} className="group hover:bg-slate-50/30 border-slate-50 transition-colors">
                            <TableCell className="px-6 font-mono text-xs text-slate-400">
                                #{quote.id.toString().substring(0, 6).toUpperCase()}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900">{quote.subject}</span>
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                        <User className="h-3 w-3" /> {quote.profiles?.full_name || "Guest"}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                                    <IndianRupee className="h-3 w-3" />
                                    {quote.offered_price ? Number(quote.offered_price).toLocaleString() : "—"}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={cn("px-2 py-0.5", getStatusBadge(quote.status))}>
                                    {quote.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => { setSelectedQuote(quote); setMode("view"); }}
                                    >
                                        <Eye className="h-4 w-4 mr-2" /> View
                                    </Button>
                                    {quote.status === "open" && (
                                        <Button
                                            size="sm"
                                            className="bg-slate-900"
                                            onClick={() => { setSelectedQuote(quote); setMode("respond"); }}
                                        >
                                            <Reply className="h-4 w-4 mr-2" /> Respond
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Unified Modal (Sheet) for View/Respond */}
            <Sheet open={!!selectedQuote} onOpenChange={(open) => !open && closeModal()}>
                <SheetContent className="sm:max-w-md bg-white border-l">
                    <SheetHeader className="space-y-1">
                        <SheetTitle className="text-xl font-bold">
                            {mode === "view" ? "Quotation Details" : "Respond to Quotation"}
                        </SheetTitle>
                        <SheetDescription>
                            ID: #{selectedQuote?.id.toString().substring(0, 8).toUpperCase()}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-6 p-4">
                        {/* Customer Info Card */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400 font-medium">Customer</span>
                                <span className="text-slate-900 font-semibold">{selectedQuote?.profiles?.full_name}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400 font-medium">Received On</span>
                                <span className="text-slate-900 font-semibold">
                                    {selectedQuote?.created_at && new Date(selectedQuote.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Package className="h-4 w-4" /> Requested Items
                            </h4>
                            <div className="space-y-2">
                                {selectedQuote?.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between p-3 border rounded-lg bg-white text-sm">
                                        <span className="font-medium text-slate-700">{item.productName}</span>
                                        <span className="text-slate-400 text-xs">Qty: {item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Conditional Form: Respond Mode */}
                        {mode === "respond" ? (
                            <div className="pt-4 border-t border-slate-100 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Your Offered Price (INR)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            className="pl-9 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                                            value={offeredPrice}
                                            onChange={(e) => setOfferedPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-200" onClick={handleRespond}>
                                    Submit & Send Quotation
                                </Button>
                            </div>
                        ) : (
                            /* Conditional Info: View Mode */
                            selectedQuote?.offered_price && (
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Offered Price</p>
                                    <div className="text-2xl font-black text-slate-900 flex items-center gap-1">
                                        <IndianRupee className="h-5 w-5" />
                                        {Number(selectedQuote.offered_price).toLocaleString()}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
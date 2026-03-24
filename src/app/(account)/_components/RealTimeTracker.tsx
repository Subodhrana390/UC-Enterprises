"use client";


import { cn } from "@/lib/utils";

export function RealTimeTracker({ status, updatedAt }: { status: string; updatedAt: string }) {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];

    const STATUS_CONFIG: Record<string, any> = {
        pending: { label: 'Order Placed', desc: 'We have received your order.', icon: 'pending_actions' },
        processing: { label: 'Processing', desc: 'Your order is being prepared.', icon: 'inventory_2' },
        shipped: { label: 'Shipped', desc: 'Your order is on the way.', icon: 'local_shipping' },
        delivered: { label: 'Delivered', desc: 'Order has been handed over.', icon: 'check_circle' },
        cancelled: { label: 'Cancelled', desc: 'This order was cancelled.', icon: 'cancel' },
        returned: { label: 'Returned', desc: 'This order was returned.', icon: 'keyboard_return' },
    };

    if (status === 'cancelled' || status === 'returned') {
        return (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center gap-4">
                <span className="material-symbols-outlined text-red-600 text-3xl">
                    {STATUS_CONFIG[status].icon}
                </span>
                <div>
                    <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider">
                        Order {status}
                    </h3>
                    <p className="text-xs text-red-700">{STATUS_CONFIG[status].desc}</p>
                </div>
            </div>
        );
    }

    const currentIdx = steps.indexOf(status);

    return (
        <div className="bg-white border border-[#ebebeb] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f1f1f1] flex justify-between items-center bg-[#fafafa]">
                <h3 className="text-[10px] font-black text-[#1a1c1d] uppercase tracking-[0.2em]">
                    Timeline
                </h3>
                <p className="text-[10px] font-bold text-[#616161]">
                    Last updated: {new Date(updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            <div className="p-8 space-y-0">
                {steps.map((step, index) => {
                    // Logic: If the order is delivered, ALL steps (including delivered) show as completed
                    const isDelivered = status === 'delivered';
                    const isCompleted = isDelivered ? index <= currentIdx : index < currentIdx;
                    const isCurrent = isDelivered ? false : index === currentIdx;

                    const config = STATUS_CONFIG[step];

                    return (
                        <div key={step} className="relative flex gap-6 pb-10 last:pb-0">
                            {/* Connector Line */}
                            {index !== steps.length - 1 && (
                                <div className={cn(
                                    "absolute left-[11px] top-[28px] w-[1.5px] h-full z-0",
                                    index < currentIdx || isDelivered ? "bg-[#008060]" : "bg-[#f1f1f1]"
                                )} />
                            )}

                            {/* Indicator Dot/Check */}
                            <div className="relative z-10 pt-1">
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                                    isCompleted ? "bg-[#008060] border-[#008060] text-white" :
                                        isCurrent ? "bg-white border-[#1a1c1d] text-[#1a1c1d] scale-110 shadow-md" :
                                            "bg-white border-[#f1f1f1] text-gray-300"
                                )}>
                                    {isCompleted ? (
                                        <span className="material-symbols-outlined text-[14px] font-bold">done</span>
                                    ) : (
                                        <span className={cn("w-1.5 h-1.5 rounded-full bg-current", isCurrent && "animate-pulse")} />
                                    )}
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1">
                                <p className={cn(
                                    "text-sm font-bold tracking-tight",
                                    isCurrent || (isDelivered && index === currentIdx) ? "text-[#1a1c1d]" : isCompleted ? "text-[#616161]" : "text-gray-300"
                                )}>
                                    {config.label}
                                </p>
                                {(isCurrent || (isDelivered && index === currentIdx)) && (
                                    <p className="text-xs text-[#616161] mt-1 leading-relaxed max-w-md italic">
                                        {config.desc}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


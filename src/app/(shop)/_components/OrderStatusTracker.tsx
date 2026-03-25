"use client";

import { useOrderRealtime } from "@/components/shop/RealtimeOrderUpdates";
import { CheckCircle, Circle, Truck, Package, Home } from "lucide-react";

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: Circle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

export function OrderStatusTracker({ orderId }: { orderId: string }) {
  const { order, loading } = useOrderRealtime(orderId);

  if (loading) {
    return <div className="animate-pulse h-20 bg-[#f5f5f5] rounded-lg" />;
  }

  if (!order) {
    return <div className="text-center py-8 text-[#616161]">Order not found</div>;
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  // For cancelled or returned orders
  if (order.status === "cancelled" || order.status === "returned") {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-medium">
          Order {order.status === "cancelled" ? "cancelled" : "returned"}
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#e5e5e5]">
          <div
            className="h-full bg-[#008060] transition-all duration-500"
            style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                    isCompleted
                      ? "bg-[#008060] text-white"
                      : "bg-[#f5f5f5] text-[#ababab]"
                  } ${isCurrent ? "ring-4 ring-[#e3f1df]" : ""}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCompleted ? "text-[#008060]" : "text-[#ababab]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimated Delivery */}
      {order.status === "shipped" && (
        <div className="mt-6 p-4 bg-[#f5f5f5] rounded-lg">
          <p className="text-sm text-[#616161]">
            Estimated delivery: <span className="font-medium text-[#1a1c1d]">3-5 business days</span>
          </p>
          {order.tracking_number && (
            <p className="text-sm text-[#616161] mt-1">
              Tracking: <span className="font-medium">{order.tracking_number}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
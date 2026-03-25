"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { submitFabricationRequest } from "@/lib/actions/fabrication";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function FabricationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const result = await submitFabricationRequest(formData);
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success(result.message || "Request submitted successfully!");
      router.push("/");
    }
  };

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Project Specifications */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-black mb-6">Project Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Service Type</Label>
            <select 
              name="serviceType" 
              required 
              className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
            >
              <option value="">Select service...</option>
              <option value="pcb">Multi-Layer PCB Fabrication</option>
              <option value="pcba">Turnkey PCB Assembly (PCBA)</option>
              <option value="iot">Custom IoT Prototyping</option>
              <option value="stencil">Laser Stencil Manufacturing</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Quantity (Batch Size)</Label>
            <Input 
              name="quantity" 
              type="number" 
              placeholder="e.g. 100" 
              className="h-11 border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </section>

      {/* Production Timeline */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-black mb-6">Production Timeline</h3>
        <RadioGroup defaultValue="standard" name="timeline" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TimelineOption value="urgent" title="Priority" duration="7-10 Days" icon="bolt" />
          <TimelineOption value="standard" title="Standard" duration="15-20 Days" icon="schedule" />
          <TimelineOption value="flexible" title="Economy" duration="30+ Days" icon="savings" />
        </RadioGroup>
      </section>

      {/* Contact Information */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-black mb-6">Contact & Billing Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput name="fullName" label="Full Name" placeholder="John Doe" required />
          <FormInput name="email" label="Email Address" placeholder="john@company.com" type="email" required />
          <FormInput name="company" label="Company Name" placeholder="ABC Electronics Pvt Ltd" />
          <FormInput name="gst" label="GST Number (Optional)" placeholder="27AAAAA0000A1Z5" />
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <p className="text-xs text-gray-500 max-w-md">
          By submitting, you agree to our Non-Disclosure Agreement (NDA) and service terms.
        </p>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="h-12 px-10 bg-black hover:bg-gray-800 text-white font-semibold text-sm rounded-lg transition-all flex items-center gap-2"
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
          {!isSubmitting && <span className="material-symbols-outlined text-base">arrow_forward</span>}
        </Button>
      </div>
    </form>
  );
}

function TimelineOption({ value, title, duration, icon }: { value: string; title: string; duration: string; icon: string }) {
  return (
    <div className="relative">
      <RadioGroupItem value={value} id={value} className="peer sr-only" />
      <Label
        htmlFor={value}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-gray-200 cursor-pointer peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-gray-50 transition-all hover:border-gray-300"
      >
        <span className="material-symbols-outlined text-2xl text-gray-600 mb-3">{icon}</span>
        <p className="font-semibold text-sm text-black">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{duration}</p>
      </Label>
    </div>
  );
}

function FormInput({ name, label, placeholder, type = "text", required = false }: { 
  name: string; 
  label: string; 
  placeholder: string; 
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">{label}</Label>
      <Input 
        name={name}
        type={type}
        required={required}
        className="h-11 border-gray-300 rounded-lg text-sm" 
        placeholder={placeholder} 
      />
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { submitFabricationRequest } from "@/lib/actions/fabrication";

export default function FabricationPage() {
  return (
    <div className="bg-[#f6f6f7] min-h-screen font-sans">
      <main className="pt-8 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto">
        
        {/* Navigation Breadcrumb - Shopify Style */}
        <nav className="flex items-center gap-2 mb-6 text-[13px] text-[#616161] font-medium">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-[#1a1c1d]">Fabrication Services</span>
        </nav>

        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#d2d2d2] pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-[#1a1c1d] tracking-tight">Request for Quotation (RFQ)</h1>
              <Badge className="bg-[#eaf4fe] text-[#005bd3] border-none rounded-md px-2 py-0.5 text-[11px] font-bold">
                B2B Industrial
              </Badge>
            </div>
            <p className="text-[#616161] text-[14px] max-w-2xl font-medium">
              Submit your technical specifications for PCB fabrication, assembly, or custom IoT enclosures. 
              Our engineering team in India will provide a GST-compliant proposal within 24 business hours.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-[#d2d2d2] text-[#303030] font-bold text-xs h-9">
              Download Capacity Guide
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-6">
            <form action={async (formData) => { await submitFabricationRequest(formData); }} className="space-y-6">
              
              {/* Card 1: Project Details */}
              <section className="bg-white rounded-xl border border-[#d2d2d2] shadow-sm p-6 md:p-8">
                <h3 className="text-[15px] font-bold text-[#1a1c1d] mb-6 border-b border-[#f1f1f1] pb-4">1. Project Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[13px] font-semibold text-[#303030]">Service Category</Label>
                    <select name="serviceType" required className="flex h-10 w-full rounded-md border border-[#d2d2d2] bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] transition-all">
                      <option value="">Choose service...</option>
                      <option value="pcb">Multi-Layer PCB Fabrication</option>
                      <option value="pcba">Turnkey PCB Assembly (PCBA)</option>
                      <option value="iot">Custom IoT Prototyping</option>
                      <option value="stencil">Laser Stencil Manufacturing</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[13px] font-semibold text-[#303030]">Target Quantity (Batch Size)</Label>
                    <Input name="quantity" type="number" placeholder="e.g. 100" className="h-10 border-[#d2d2d2] text-[13px]" />
                  </div>
                </div>
              </section>

              {/* Card 2: Design Upload */}
              <section className="bg-white rounded-xl border border-[#d2d2d2] shadow-sm p-6 md:p-8">
                <h3 className="text-[15px] font-bold text-[#1a1c1d] mb-4">2. Technical Manifest</h3>
                <div className="border-2 border-dashed border-[#d2d2d2] rounded-lg p-10 text-center bg-[#fafafa] hover:bg-[#f1f1f1] transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-3xl text-[#616161] mb-2">upload_file</span>
                  <p className="text-[13px] font-bold text-[#1a1c1d]">Upload Gerber Files or BOM</p>
                  <p className="text-[12px] text-[#616161] mt-1">Maximum file size: 50MB (.zip, .pdf, .xlsx)</p>
                  <Button type="button" variant="outline" className="mt-4 h-8 text-[11px] font-bold bg-white border-[#d2d2d2]">Add File</Button>
                </div>
              </section>

              {/* Card 3: Timeline Selection */}
              <section className="bg-white rounded-xl border border-[#d2d2d2] shadow-sm p-6 md:p-8">
                <h3 className="text-[15px] font-bold text-[#1a1c1d] mb-6">3. Production Priority</h3>
                <RadioGroup defaultValue="standard" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TimelineOption value="urgent" title="Priority" duration="7-10 Days" icon="bolt" />
                  <TimelineOption value="standard" title="Standard" duration="15-20 Days" icon="schedule" />
                  <TimelineOption value="flexible" title="Economy" duration="30+ Days" icon="savings" />
                </RadioGroup>
              </section>

              {/* Card 4: Corporate Info */}
              <section className="bg-white rounded-xl border border-[#d2d2d2] shadow-sm p-6 md:p-8">
                <h3 className="text-[15px] font-bold text-[#1a1c1d] mb-6">4. Billing & GST Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput name="fullName" label="Contact Person" placeholder="Full Name" />
                  <FormInput name="email" label="Business Email" placeholder="name@company.in" type="email" />
                  <FormInput name="company" label="Company Registered Name" placeholder="ABC Electronics Pvt Ltd" />
                  <FormInput name="gst" label="GST Number (Optional)" placeholder="27AAAAA0000A1Z5" />
                </div>
              </section>

              <div className="flex items-center justify-between gap-4 pt-4">
                <p className="text-[11px] text-[#616161] max-w-sm">
                  By submitting this Quote, you agree to our <strong>Non-Disclosure Agreement (NDA)</strong> and B2B processing terms.
                </p>
                <Button className="h-12 px-10 bg-[#008060] hover:bg-[#006e52] text-white font-bold text-sm rounded-md shadow-sm transition-all flex items-center gap-2">
                  Submit Quote
                </Button>
              </div>
            </form>
          </div>

          {/* Right Sidebar - Shopify Style Information Cards */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-[#d2d2d2] shadow-sm p-6">
              <h4 className="text-[13px] font-bold text-[#1a1c1d] uppercase tracking-wider mb-6">Fabrication Authority</h4>
              <div className="space-y-6">
                <FeatureItem icon="verified" title="ISO 9001:2015" desc="Strict QC protocols for high-reliability electronics." />
                <FeatureItem icon="local_shipping" title="Pan-India Logistics" desc="Express delivery to Bengaluru, Delhi, Pune & beyond." />
                <FeatureItem icon="description" title="GST Compliant" desc="Full tax invoicing for Input Tax Credit (ITC) benefits." />
                <FeatureItem icon="precision_manufacturing" title="DFM Analysis" desc="Free Design for Manufacturing review by senior engineers." />
              </div>
            </div>

            <div className="bg-[#1a1c1d] rounded-xl p-6 text-white">
              <h4 className="text-[14px] font-bold mb-2">Need a Bulk Contract?</h4>
              <p className="text-[12px] text-zinc-400 leading-relaxed mb-6">For annual contracts exceeding ₹10 Lakhs, connect with our Enterprise Solutions team.</p>
              <Link href="/support" className="text-[#98d8ff] text-[12px] font-bold flex items-center gap-2 hover:underline">
                Talk to an Expert <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function TimelineOption({ value, title, duration, icon }: any) {
  return (
    <div className="relative">
      <RadioGroupItem value={value} id={value} className="peer sr-only" />
      <Label
        htmlFor={value}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-[#d2d2d2] cursor-pointer peer-data-[state=checked]:border-[#005bd3] peer-data-[state=checked]:bg-[#f0f7ff] peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-[#005bd3] transition-all hover:bg-[#fafafa]"
      >
        <span className="material-symbols-outlined text-xl text-[#616161] mb-2">{icon}</span>
        <p className="font-bold text-[13px] text-[#1a1c1d]">{title}</p>
        <p className="text-[11px] text-[#616161] mt-1">{duration}</p>
      </Label>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-4">
      <span className="material-symbols-outlined text-[#616161] text-[20px]">{icon}</span>
      <div>
        <h5 className="font-bold text-[13px] text-[#1a1c1d]">{title}</h5>
        <p className="text-[12px] text-[#616161] leading-snug">{desc}</p>
      </div>
    </div>
  );
}

function FormInput({ name, label, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-[13px] font-semibold text-[#303030]">{label}</Label>
      <Input 
        name={name}
        type={type}
        className="h-10 border-[#d2d2d2] text-[13px] focus:ring-[#005bd3]" 
        placeholder={placeholder} 
      />
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FabricationForm } from "@/components/shop/FabricationForm";

export default function FabricationPage() {
  return (
    <div className="bg-white min-h-screen">
      <main className="pt-10 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-black">Fabrication Services</span>
        </nav>

        {/* Header Section */}
        <header className="mb-12 border-b border-gray-200 pb-10">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-black">
              Custom Fabrication Services
            </h1>
            <Badge className="bg-blue-50 text-blue-700 border-none rounded-md px-3 py-1 text-xs font-semibold">
              B2B
            </Badge>
          </div>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl leading-relaxed">
            Professional PCB fabrication, assembly, and IoT prototyping services. 
            Get a detailed quote within 24 hours with GST-compliant invoicing.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            <FabricationForm />
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Capabilities Card */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
              <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-6">
                Our Capabilities
              </h4>
              <div className="space-y-6">
                <FeatureItem 
                  icon="verified" 
                  title="ISO 9001:2015 Certified" 
                  desc="Quality management system for consistent, reliable production." 
                />
                <FeatureItem 
                  icon="local_shipping" 
                  title="Pan-India Delivery" 
                  desc="Express logistics to all major cities and industrial hubs." 
                />
                <FeatureItem 
                  icon="description" 
                  title="GST Compliant" 
                  desc="Full tax invoicing for seamless Input Tax Credit claims." 
                />
                <FeatureItem 
                  icon="precision_manufacturing" 
                  title="DFM Analysis" 
                  desc="Complimentary Design for Manufacturing review by experts." 
                />
              </div>
            </div>

            {/* Services Overview */}
            <div className="bg-black rounded-2xl p-8 text-white">
              <h4 className="text-lg font-semibold mb-3">Available Services</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
                  <span>Multi-layer PCB (1-12 layers)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
                  <span>SMT & Through-hole Assembly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
                  <span>IoT Device Prototyping</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
                  <span>Laser Stencil Manufacturing</span>
                </li>
              </ul>
              <Link 
                href="/support" 
                className="inline-flex items-center gap-2 mt-6 text-blue-400 text-sm font-semibold hover:underline"
              >
                Talk to an Expert
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>

            {/* Enterprise Contact */}
            <div className="border-2 border-gray-200 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-black mb-2">Bulk Orders?</h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                For annual contracts exceeding ₹10 Lakhs, connect with our Enterprise Solutions team for custom pricing.
              </p>
              <Link href="/support">
                <Button variant="outline" className="w-full h-10 text-xs font-semibold">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <span className="material-symbols-outlined text-gray-600 text-xl flex-shrink-0">{icon}</span>
      <div>
        <h5 className="font-semibold text-sm text-black mb-1">{title}</h5>
        <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

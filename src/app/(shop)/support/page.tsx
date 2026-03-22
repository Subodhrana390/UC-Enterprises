import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { SupportNewsletterForm } from "@/components/support/SupportNewsletterForm";

export default function SupportPage() {
  return (
    <div className="flex-1">
      {/* Hero Search Section */}
      <section className="relative bg-primary-container py-24 px-6 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-on-primary-container via-transparent to-transparent"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-headline text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
            How can we assist your architecture today?
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <Input 
              className="w-full h-16 pl-14 pr-6 bg-white/10 backdrop-blur-md border-white/20 text-white rounded-xl focus:ring-2 focus:ring-on-primary-container focus:outline-none transition-all placeholder:text-white/40 border-none" 
              placeholder="Search technical documentation, parts, or order status..." 
              type="text"
            />
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/60">
              search
            </span>
          </div>
        </div>
      </section>

      {/* Status Tracking Section */}
      <section className="px-6 lg:px-24 -mt-10 mb-20 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-xl border border-border/40">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline text-xl font-black text-on-surface">Active Support Tickets</h2>
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase tracking-wider">
                2 Pending
              </span>
            </div>
            <div className="space-y-4">
              <TicketItem 
                id="#TK-8821" 
                title="Fabrication Delay Query" 
                update="2 hours ago" 
                agent="Sarah J." 
                status="In Progress"
                icon="manufacturing"
                color="blue"
              />
              <TicketItem 
                id="#TK-8794" 
                title="B2B Batch Tracking Error" 
                update="Yesterday" 
                agent="Marcus T." 
                status="Waiting for Info"
                icon="local_shipping"
                color="amber"
              />
            </div>
          </div>
          
          <div className="bg-primary p-8 rounded-xl flex flex-col justify-between items-start text-white shadow-xl shadow-primary/20">
            <div>
              <h2 className="font-headline text-2xl font-black mb-4">Can't find an answer?</h2>
              <p className="text-white/70 text-sm mb-8 leading-relaxed">
                Our specialized engineering support team is available 24/7 for Enterprise level accounts.
              </p>
            </div>
            <Button className="w-full bg-white text-primary font-bold h-14 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors text-sm">
              <span className="material-symbols-outlined">add_task</span>
              Submit Support Ticket
            </Button>
          </div>
        </div>
      </section>

      {/* Categorized FAQs - Bento Style */}
      <section className="px-6 lg:px-24 py-20 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="font-headline text-3xl font-black text-on-surface tracking-tight">Browse by Category</h2>
            <p className="text-on-surface-variant mt-2 text-sm">Precision guides for every stage of your project lifecycle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <FAQCategory 
              colSpan="md:col-span-3"
              icon="conveyor_belt"
              title="Shipping & Logistics"
              items={["Global Freight Timelines", "Export Documentation Compliance", "Bulk Inventory Handling"]}
            />
            <FAQCategory 
              colSpan="md:col-span-3"
              icon="precision_manufacturing"
              title="Technical Fabrication"
              items={["Custom Component Tolerances", "Material Certification (ISO 9001)", "Prototype Lead Times"]}
            />
            <FAQCategorySingle 
              colSpan="md:col-span-2"
              icon="assignment_return"
              title="Returns & RMA"
              desc="Step-by-step technical audit process for hardware returns."
            />
            <FAQCategorySingle 
              colSpan="md:col-span-2"
              icon="receipt_long"
              title="Billing"
              desc="Managing corporate credit lines and net-30 invoicing."
            />
            <FAQCategorySingle 
              colSpan="md:col-span-2"
              icon="integration_instructions"
              title="API Support"
              desc="Developer documentation for automated inventory syncing."
            />
          </div>
        </div>
      </section>

      {/* Master the Ecosystem CTA */}
      <section className="px-6 lg:px-24 py-20 bg-white">
        <div className="max-w-6xl mx-auto bg-surface-container rounded-3xl overflow-hidden flex flex-col md:flex-row items-stretch border border-border/40 shadow-sm">
          <div className="md:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
            <h2 className="font-headline text-3xl font-black text-on-surface tracking-tight mb-4">Master the Ecosystem.</h2>
            <p className="text-on-surface-variant mb-8 text-base leading-relaxed">
              Receive technical whitepapers and fabrication updates directly from our engineering leads.
            </p>
            <SupportNewsletterForm />
          </div>
          <div className="md:w-1/2 min-h-[300px] relative">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSSGq33xq7qOEXmSp335QumXkvkGMmKGWvXjFnRvcOJ1OG2J7DLbtfToHBUEhjWYB273FLjQi3vMP1H43VF_3OeptjMCB2E1xp9po3mEzUZ0SoOkUjsEp9FTPJcEbQgH1ymI7mRA6BV7sSkmWAT-9XNX0Fgh_Qw_s0JZ-8kqcgmXDF_E4eBmHdJ7YoHGnFuQ0a8skDK1wHrMbDUMoKNaIx8gE050xpqFbvPEyT53XF4dKHtwDMpkAnVoSnbYnKYDUVmYMMqzSCrzD8"
              alt="Engineering Ecosystem"
              fill
              className="object-cover grayscale opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container via-transparent to-transparent"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TicketItem({ id, title, update, agent, status, icon, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg group hover:bg-surface-container transition-all cursor-pointer border border-transparent hover:border-border/40">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${colorMap[color]}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div>
          <div className="font-bold text-on-surface text-sm">{id}: {title}</div>
          <div className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
            Last update: {update} • Agent: {agent}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${color === 'blue' ? 'text-blue-600' : 'text-amber-600'}`}>
          {status}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform text-sm">
          chevron_right
        </span>
      </div>
    </div>
  );
}

function FAQCategory({ colSpan, icon, title, items }: any) {
  return (
    <div className={`${colSpan} bg-white p-8 rounded-xl hover:shadow-lg transition-all border border-border/40 group cursor-pointer`}>
      <span className="material-symbols-outlined text-4xl text-primary mb-6">{icon}</span>
      <h3 className="font-headline text-xl font-bold mb-4">{title}</h3>
      <ul className="space-y-3 text-sm text-on-surface-variant">
        {items.map((item: string) => (
          <li key={item} className="hover:text-primary flex items-center space-x-2 transition-colors">
            <span className="w-1 h-1 rounded-full bg-border group-hover:bg-primary transition-colors"></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FAQCategorySingle({ colSpan, icon, title, desc }: any) {
  return (
    <div className={`${colSpan} bg-white p-8 rounded-xl hover:shadow-lg transition-all border border-border/40 group cursor-pointer`}>
      <span className="material-symbols-outlined text-4xl text-primary mb-6">{icon}</span>
      <h3 className="font-headline text-xl font-bold mb-4">{title}</h3>
      <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
    </div>
  );
}

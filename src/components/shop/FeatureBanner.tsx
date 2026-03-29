import { Truck, Shield, Headphones, RotateCcw } from "lucide-react";

const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders above ₹499" },
    { icon: Shield, title: "Secure Payment", desc: "100% protected" },
    { icon: Headphones, title: "24/7 Support", desc: "Dedicated support" },
    { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
];

const FeatureBanner = () => (
    <section className="py-8 border-b border-border">
        <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center">
                {features.map((f) => (
                    <div key={f.title} className="flex items-center gap-3 text-center md:text-left">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <f.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-display font-semibold text-sm text-foreground">
                                {f.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {f.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default FeatureBanner;

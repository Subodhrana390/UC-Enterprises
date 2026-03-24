import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatPriceINR } from "@/lib/utils";
import { getUserDashboardData } from "@/lib/actions/account";

export default async function CustomerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { profile, orders, wishlistCount, addresses } = await getUserDashboardData(user.id);

  return (
    <div className="min-h-screen p-4 md:p-10 font-sans antialiased">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER SECTION */}
        <header className="space-y-2">
          <nav className="flex items-center gap-2 text-xs text-[#616161] mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="text-[#d2d2d2]">/</span>
            <span className="text-[#1a1c1d] font-medium">Account</span>
          </nav>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1a1c1d] tracking-tight">Account</h1>
              <p className="text-[#616161] mt-1">Hello, {profile?.full_name || user.email?.split('@')[0]}</p>
            </div>
            <Button variant="ghost" className="text-[#005bd3] hover:text-[#004bb3] hover:bg-transparent p-0 h-auto font-medium text-sm transition-colors">
              Log out
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">

            {/* ORDERS CARD */}
            <Card className="border-[#ebebeb] shadow-[0_1px_3px_rgba(0,0,0,0.12)] rounded-xl bg-white">
              <CardHeader className="p-5 border-b border-[#f1f1f1] flex flex-row items-center justify-between bg-white">
                <CardTitle className="text-base font-semibold text-[#1a1c1d]">Order history</CardTitle>
                {orders && orders.length > 0 && (
                  <Link href="/account/orders" className="text-sm font-medium text-[#005bd3] hover:underline transition-all">
                    View all orders
                  </Link>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {orders && orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[11px] uppercase tracking-wider text-[#616161] border-b border-[#f1f1f1]">
                          <th className="px-5 py-3 font-semibold">Order</th>
                          <th className="px-5 py-3 font-semibold">Date</th>
                          <th className="px-5 py-3 font-semibold">Status</th>
                          <th className="px-5 py-3 font-semibold text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f1f1]">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-[#f9f9f9] transition-colors cursor-pointer group">
                            <td className="px-5 py-4">
                              <Link href={`/account/orders/${order.id}`} className="text-sm font-medium text-[#005bd3] group-hover:underline">
                                #{order.id.substring(0, 8).toUpperCase()}
                              </Link>
                            </td>
                            <td className="px-5 py-4 text-sm text-[#616161]">
                              {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium capitalize shadow-sm ${order.status === 'delivered' ? 'bg-[#e3f1df] text-[#008060]' : 'bg-[#fff4e5] text-[#b98900]'
                                }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm font-medium text-[#1a1c1d] text-right">
                              {formatPriceINR(order.total_amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-12 h-12 bg-[#f1f1f1] rounded-full flex items-center justify-center mx-auto text-[#616161]">
                      <span className="material-symbols-outlined text-2xl">orders</span>
                    </div>
                    <p className="text-sm text-[#616161]">You haven&apos;t placed any orders yet.</p>
                    <Link href="/shop" className="inline-block text-sm font-medium text-[#005bd3] hover:underline">
                      Start shopping
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* WISHLIST QUICK ACCESS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard label="Wishlist Items" value={wishlistCount || 0} icon="favorite" href="/account/wishlist" />
              <StatCard label="Account Type" value={profile?.account_type === 'business' ? 'Enterprise' : 'Personal'} icon="verified_user" />
            </div>
          </div>

          {/* RIGHT: SIDEBAR */}
          <div className="space-y-6">
            <Card className="border-[#ebebeb] shadow-[0_1px_3px_rgba(0,0,0,0.12)] rounded-xl bg-white overflow-hidden">
              <CardHeader className="p-5 border-b border-[#f1f1f1] bg-white">
                <CardTitle className="text-base font-semibold text-[#1a1c1d]">Account details</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                <div className="space-y-1">
                  <h4 className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Primary Contact</h4>
                  <p className="text-sm text-[#1a1c1d] font-medium">{profile?.full_name}</p>
                  <p className="text-sm text-[#616161]">{user.email}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">
                    Default Address
                  </h4>
                  <p className="text-sm text-[#616161] leading-relaxed">
                    {addresses && addresses.length > 0
                      ? `${addresses[0].full_name}, ${addresses[0].address_line1}${addresses[0].address_line2 ? `, ${addresses[0].address_line2}` : ''}, ${addresses[0].city}${addresses[0].state ? `, ${addresses[0].state}` : ''} - ${addresses[0].pincode}`
                      : "No address provided yet."
                    }
                  </p>
                </div>

                <div className="pt-4 border-t border-[#f1f1f1]">
                  <Link
                    href="/account/addresses"
                    className="text-sm font-medium text-[#005bd3] hover:underline flex items-center gap-1"
                  >
                    View addresses ({addresses?.length || 0})
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#616161] uppercase px-1">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <QuickLink label="Profile Settings" icon="settings" href="/account/profile" />
                <QuickLink label="Support History" icon="chat_bubble" href="/support" />
                <QuickLink label="Security & Password" icon="lock" href="/account/security" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, href }: { label: string; value: string | number; icon: string; href?: string }) {
  const content = (
    <Card className={`border-[#ebebeb] shadow-sm rounded-xl bg-white transition-all ${href ? 'hover:border-[#005bd3] cursor-pointer' : ''}`}>
      <CardContent className="p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#f6f6f6] flex items-center justify-center text-[#616161]">
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-[11px] text-[#616161] font-bold uppercase tracking-widest">{label}</p>
          <p className="text-lg font-bold text-[#1a1c1d] leading-none mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function QuickLink({ label, icon, href }: { label: string; icon: string; href: string }) {
  return (
    <Link href={href} className="block group">
      <div className="p-3 bg-white border border-[#ebebeb] rounded-lg group-hover:bg-[#f9f9f9] group-hover:border-[#d2d2d2] transition-all flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#616161] text-lg">{icon}</span>
          <span className="text-sm font-medium text-[#1a1c1d]">{label}</span>
        </div>
        <span className="material-symbols-outlined text-[#d2d2d2] text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward_ios</span>
      </div>
    </Link>
  );
}
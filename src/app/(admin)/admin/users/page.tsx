import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-2">Personnel Directory</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">Identity & Access Management</p>
        </div>
        <Button className="h-12 px-6 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
          <span className="material-symbols-outlined mr-2">person_add</span>
          Invite Operator
        </Button>
      </header>

      <div className="bg-white/50 backdrop-blur-xl rounded-[32px] border border-border/40 shadow-2xl shadow-primary/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-surface/50 border-b border-border/10">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Identity</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Email</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Designation</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Pulse</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} className="h-20 border-b border-border/5 hover:bg-white transition-colors">
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary uppercase text-xs">
                        {user.first_name ? user.first_name.charAt(0) : user.id.charAt(0)}
                    </div>
                    <p className="font-black text-sm uppercase leading-tight">
                        {user.first_name} {user.last_name}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-on-surface-variant opacity-60 font-medium text-xs font-mono">{user.email || "No email"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[9px] font-black bg-white uppercase border-border/20 px-3">{user.account_type || "Standard"}</Badge>
                </TableCell>
                <TableCell>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                       Active
                   </span>
                </TableCell>
                <TableCell className="text-[10px] font-black uppercase tracking-widest opacity-40">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-center">
                   <Button variant="ghost" size="icon" className="h-10 w-10 text-on-surface-variant opacity-40 hover:opacity-100 transition-all">
                       <span className="material-symbols-outlined text-sm">settings_account_box</span>
                   </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

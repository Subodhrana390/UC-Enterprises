import { getAllQA } from "@/lib/actions/admin/qa";
import { QAItem } from "../../_components/QAItem";
import { Search, MessageSquare, CheckCircle2, Clock } from "lucide-react"; // Optional: Add Lucide icons

export default async function QAPage() {
  const { data: questions } = await getAllQA();

  const pendingCount = questions?.filter((q: any) => !q.answer).length || 0;
  const answeredCount = questions?.filter((q: any) => q.answer).length || 0;

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-8 min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Q&A Management</h1>
          <p className="text-slate-500 font-medium">
            Manage user inquiries and platform discussions.
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700">{pendingCount} Pending</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-slate-700">{answeredCount} Answered</span>
          </div>
        </div>
      </header>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

        {/* Search Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              placeholder="Search questions, users, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white focus:ring-2 focus:ring-slate-950 focus:border-transparent outline-none"
            />
          </div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total: {questions?.length || 0} Records
          </div>
        </div>

        {/* Questions List */}
        <div className="divide-y divide-slate-100">
          {questions?.map((qa: any) => (
            <div key={qa.id} className="transition-colors hover:bg-slate-50/50">
              <QAItem qa={qa} />
            </div>
          ))}

          {/* Empty State */}
          {(!questions || questions.length === 0) && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <MessageSquare className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No questions found</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm">
                When users ask questions on the platform, they will appear here for you to manage.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
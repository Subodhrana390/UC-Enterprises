import { createClient } from "@/lib/supabase/server";
import { getAllQA } from "@/lib/actions/admin/qa";
import { QAItem } from "../../_components/QAItem";

export default async function QAPage() {
  const { data: questions } = await getAllQA();

  const pendingCount = questions?.filter((q: any) => !q.answer).length || 0;
  const answeredCount = questions?.filter((q: any) => q.answer).length || 0;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1c1d]">Q&A Management</h1>
          <p className="text-sm text-[#616161]">
            {pendingCount} pending, {answeredCount} answered
          </p>
        </div>
      </header>

      <div className="bg-white border border-[#ebebeb] shadow-sm rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#f1f1f1] bg-[#fafafa]">
          <input
            placeholder="Search questions..."
            className="max-w-md px-4 py-2 bg-white border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="divide-y divide-[#f1f1f1]">
          {questions?.map((qa: any) => (
            <QAItem key={qa.id} qa={qa} />
          ))}
          {(!questions || questions.length === 0) && (
            <div className="text-center py-12 text-[#616161]">
              No questions yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
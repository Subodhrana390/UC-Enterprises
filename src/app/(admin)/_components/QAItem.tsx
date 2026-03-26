"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { answerQA, deleteQA, toggleQAPublic } from "@/lib/actions/admin/qa";
import { Check, X, Trash2, Globe, GlobeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface QAItemProps {
  qa: any;
}

export function QAItem({ qa }: QAItemProps) {
  const router = useRouter();
  const [answering, setAnswering] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [answer, setAnswer] = useState(qa.answer || "");

  return (
    <div className="p-4 hover:bg-[#fafafa] transition-colors">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-[#1a1c1d]">
              {qa.author?.full_name || "Anonymous"}
            </span>
            <span className="text-[10px] text-[#ababab]">
              {new Date(qa.created_at).toLocaleDateString()}
            </span>
            {qa.products && (
              <span className="text-[10px] px-2 py-0.5 bg-[#f1f1f1] rounded">
                re: {qa.products.name}
              </span>
            )}
          </div>

          <div className="mb-3">
            <p className="text-sm font-medium text-[#1a1c1d] mb-1">Q: {qa.question}</p>
            {qa.answer ? (
              <p className="text-sm text-[#008060] bg-[#e3f1df] p-2 rounded">
                A: {qa.answer}
              </p>
            ) : (
              <p className="text-sm text-[#ababab] italic">Pending answer</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!qa.answer ? (
              <Button
                size="sm"
                onClick={() => setAnswering(!answering)}
                className="bg-[#1a1c1d] text-white h-7 text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Answer
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAnswering(!answering)}
                className="h-7 text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              disabled={isPending}
              onClick={async () => {
                setIsPending(true);
                try {
                  const res: any = await toggleQAPublic(qa.id, !qa.is_public);
                  if (res?.success) {
                    toast.success(qa.is_public ? "Question hidden" : "Question visible");
                    router.refresh();
                  } else {
                    toast.error(res?.error || "Failed to update visibility");
                  }
                } finally {
                  setIsPending(false);
                }
              }}
            >
              {qa.is_public ? (
                <>
                  <GlobeOff className="w-3 h-3 mr-1" />
                  Hide
                </>
              ) : (
                <>
                  <Globe className="w-3 h-3 mr-1" />
                  Show
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-rose-600 hover:text-rose-700"
              disabled={isPending}
              onClick={async () => {
                setIsPending(true);
                try {
                  const res: any = await deleteQA(qa.id);
                  if (res?.success) {
                    toast.success("Question deleted");
                    router.refresh();
                  } else {
                    toast.error(res?.error || "Failed to delete");
                  }
                } finally {
                  setIsPending(false);
                }
              }}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>

          {answering && (
            <div className="mt-3">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black"
                rows={3}
                placeholder="Write your answer..."
              />
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  disabled={isPending}
                  className="bg-[#1a1c1d] text-white h-7 text-xs"
                  onClick={async () => {
                    setIsPending(true);
                    try {
                      const res: any = await answerQA(qa.id, answer);
                      if (res?.success) {
                        toast.success("Answer saved!");
                        setAnswering(false);
                        router.refresh();
                      } else {
                        toast.error(res?.error || "Failed to save answer");
                      }
                    } catch (err: any) {
                      toast.error("Something went wrong");
                    } finally {
                      setIsPending(false);
                    }
                  }}
                >
                  {isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                  Save Answer
                </Button>
                <Button size="sm" variant="outline" onClick={() => setAnswering(false)} className="h-7 text-xs">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
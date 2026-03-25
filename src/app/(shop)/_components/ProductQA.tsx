"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitQuestion, getProductQuestions } from "@/lib/actions/admin/qa";
import { toast } from "sonner";
import { MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";

interface ProductQAProps {
  productId: string;
  productName: string;
}

export function ProductQA({ productId, productName }: ProductQAProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadQuestions = async () => {
    setLoading(true);
    const result = await getProductQuestions(productId);
    if (result.data) {
      setQuestions(result.data);
    }
    setLoading(false);
  };

  useState(() => {
    loadQuestions();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    const result = await submitQuestion(productId, newQuestion);
    setSubmitting(false);

    if (result.error) {
      alert(result.error);
    } else {
      alert("Your question has been submitted");
      setNewQuestion("");
      loadQuestions();
    }
  };

  const displayedQuestions = showAll ? questions : questions.slice(0, 3);

  return (
    <div className="border-t border-[#ebebeb] pt-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Questions & Answers
      </h3>

      {/* Question Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder={`Ask a question about ${productName}...`}
            className="flex-1 px-4 py-2 border border-[#d2d2d2] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#008060]"
          />
          <Button
            type="submit"
            disabled={submitting || !newQuestion.trim()}
            className="bg-[#1a1c1d] text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Questions List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-[#f5f5f5] rounded w-3/4 mb-2" />
              <div className="h-4 bg-[#f5f5f5] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <p className="text-[#616161] text-sm">No questions yet. Be the first to ask!</p>
      ) : (
        <div className="space-y-4">
          {displayedQuestions.map((qa) => (
            <div key={qa.id} className="bg-[#f9f9f9] rounded-lg p-4">
              <p className="text-sm font-medium text-[#1a1c1d] mb-2">
                <span className="text-[#008060] font-semibold">Q:</span> {qa.question}
              </p>
              {qa.answer ? (
                <div className="pl-4 border-l-2 border-[#008060]">
                  <p className="text-sm text-[#616161]">
                    <span className="font-medium text-[#1a1c1d]">A:</span> {qa.answer}
                  </p>
                  {qa.profiles && (
                    <p className="text-xs text-[#ababab] mt-1">
                      Answered by {qa.profiles.full_name}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[#ababab] italic">Waiting for answer...</p>
              )}
            </div>
          ))}

          {questions.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-[#008060] font-medium flex items-center gap-1 hover:underline"
            >
              {showAll ? (
                <>
                  Show less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show all {questions.length} questions <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
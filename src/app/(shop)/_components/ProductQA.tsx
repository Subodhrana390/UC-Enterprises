"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { submitQuestion, getProductQuestions } from "@/lib/actions/admin/qa";
import { toast } from "sonner";
import {
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from "lucide-react";

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

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    const result = await getProductQuestions(productId);

    if (result.data) {
      setQuestions(result.data);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newQuestion.trim()) return;

    setSubmitting(true);

    const result = await submitQuestion(productId, newQuestion);

    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Your question has been submitted");
      setNewQuestion("");
      loadQuestions();
    }
  };

  const displayedQuestions = showAll
    ? questions
    : questions.slice(0, 3);

  return (
    <section className="pt-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          Questions & Answers
        </h3>

        <span className="text-sm text-gray-500">
          {questions.length} questions
        </span>
      </div>

      {/* Ask Question Card */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3"
      >
        <input
          type="text"
          value={newQuestion}
          onChange={(e) =>
            setNewQuestion(e.target.value)
          }
          placeholder={`Ask something about ${productName}...`}
          className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />

        <Button
          type="submit"
          disabled={
            submitting || !newQuestion.trim()
          }
          className="px-5"
        >
          <Send className="w-4 h-4 mr-1" />
          Ask
        </Button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 h-20 rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && questions.length === 0 && (
        <p className="text-gray-500 text-sm italic">
          No questions yet. Be the first to ask!
        </p>
      )}

      {/* Questions List */}
      {!loading && questions.length > 0 && (
        <div className="space-y-6">

          {displayedQuestions.map((qa) => (
            <div
              key={qa.id}
              className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-sm transition"
            >

              {/* Question */}
              <div className="mb-3">
                <span className="font-semibold text-gray-900">
                  Q:
                </span>{" "}
                <span className="text-gray-700">
                  {qa.question}
                </span>
              </div>

              {/* Answer */}
              {qa.answer ? (
                <div className="pl-4 border-l-2 border-gray-900/20">

                  <div className="text-gray-700">
                    <span className="font-semibold text-gray-900">
                      A:
                    </span>{" "}
                    {qa.answer}
                  </div>

                  {qa.profiles && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                      <UserCheck className="w-3 h-3" />
                      Answered by {qa.profiles.full_name}
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-xs italic text-gray-400">
                  Waiting for answer...
                </div>
              )}

            </div>
          ))}

          {/* Show More Button */}
          {questions.length > 3 && (
            <button
              onClick={() =>
                setShowAll(!showAll)
              }
              className="text-sm font-medium text-gray-700 hover:underline flex items-center gap-1"
            >
              {showAll ? (
                <>
                  Show less
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show all {questions.length} questions
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}

        </div>
      )}
    </section>
  );
}
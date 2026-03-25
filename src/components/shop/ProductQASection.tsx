"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitProductQuestion, getProductQuestions } from "@/lib/actions/qa";
import { toast } from "sonner";
import { MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";

interface ProductQASectionProps {
  productId: string;
  productName: string;
  initialQuestions?: any[];
}

export function ProductQASection({ productId, productName, initialQuestions = [] }: ProductQASectionProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [showAll, setShowAll] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadQuestions = async () => {
    const data = await getProductQuestions(productId);
    setQuestions(data);
  };

  useEffect(() => {
    if (initialQuestions.length === 0) {
      loadQuestions();
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    const result = await submitProductQuestion(productId, newQuestion);
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Question submitted!");
      setNewQuestion("");
      loadQuestions();
    }
  };

  const displayedQuestions = showAll ? questions : questions.slice(0, 5);

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-gray-700" />
        <h2 className="text-2xl font-semibold text-black">Questions & Answers</h2>
      </div>

      {/* Ask Question Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-3">
          <Textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder={`Have a question about ${productName}? Ask here...`}
            rows={3}
            className="w-full border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-black"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submitting || !newQuestion.trim()}
              className="h-10 px-6 bg-black hover:bg-gray-800 text-white font-medium text-sm rounded-lg flex items-center gap-2"
            >
              {submitting ? "Submitting..." : "Ask Question"}
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-sm font-medium">No questions yet</p>
          <p className="text-gray-500 text-xs mt-1">Be the first to ask about this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedQuestions.map((qa) => (
            <div key={qa.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
              {/* Question */}
              <div className="flex gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">Q</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 leading-relaxed">
                    {qa.question}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Asked by {qa.profiles?.full_name || "Customer"} • {new Date(qa.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Answer */}
              {qa.answer ? (
                <div className="flex gap-3 ml-11">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">A</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {qa.answer}
                    </p>
                    {qa.answerer && (
                      <p className="text-xs text-gray-500 mt-1">
                        Answered by {qa.answerer.full_name}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="ml-11 text-xs text-gray-400 italic">
                  Waiting for answer from our team...
                </div>
              )}
            </div>
          ))}

          {questions.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-3 text-sm text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 rounded-lg transition-colors"
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
    </section>
  );
}

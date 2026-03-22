"use client";

type Step = 1 | 2 | 3;

/** Matches stitch_screens: select_address / select_payment progress patterns */
export function CheckoutProgress({ step }: { step: Step }) {
  const labels = ["Address", "Payment", "Review"] as const;
  return (
    <div className="mb-10 md:mb-14 flex justify-center">
      <div className="flex items-center gap-2 md:gap-4 w-full max-w-lg md:max-w-xl">
        {([1, 2, 3] as const).map((n, i) => (
          <div key={n} className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div
              className={`h-1 w-full rounded-full transition-colors ${
                step >= n ? "bg-primary" : "bg-surface-container-highest"
              }`}
            />
            <span
              className={`text-[9px] md:text-xs font-black tracking-widest uppercase truncate w-full text-center ${
                step === n ? "text-primary" : step > n ? "text-on-surface-variant" : "text-on-surface-variant/50"
              }`}
            >
              {labels[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Alternative stepper (circles) — stitch select_payment style */
export function CheckoutProgressCircles({ step }: { step: Step }) {
  return (
    <header className="mb-10 md:mb-12">
      <div className="flex items-center justify-center max-w-2xl mx-auto gap-2 md:gap-4">
        <div className="flex flex-col items-center gap-2 flex-1">
          <div
            className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-black ${
              step > 1
                ? "bg-primary text-white"
                : step === 1
                  ? "bg-primary text-white ring-4 ring-primary/15"
                  : "bg-surface-container-highest text-on-surface-variant"
            }`}
          >
            {step > 1 ? (
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                check
              </span>
            ) : (
              "1"
            )}
          </div>
          <span className={`text-[10px] font-bold ${step === 1 ? "text-primary" : "text-on-surface-variant"}`}>
            Address
          </span>
        </div>
        <div className="h-0.5 w-8 md:w-16 bg-surface-container-highest mb-6 shrink-0" />
        <div className="flex flex-col items-center gap-2 flex-1">
          <div
            className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-black ${
              step > 2
                ? "bg-primary text-white"
                : step === 2
                  ? "bg-primary text-white ring-4 ring-primary/15"
                  : "bg-surface-container-highest text-on-surface-variant"
            }`}
          >
            {step > 2 ? (
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                check
              </span>
            ) : (
              "2"
            )}
          </div>
          <span className={`text-[10px] font-bold ${step === 2 ? "text-primary" : "text-on-surface-variant"}`}>
            Payment
          </span>
        </div>
        <div className="h-0.5 w-8 md:w-16 bg-surface-container-highest mb-6 shrink-0" />
        <div className="flex flex-col items-center gap-2 flex-1">
          <div
            className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-black ${
              step === 3 ? "bg-primary text-white ring-4 ring-primary/15" : "bg-surface-container-highest text-on-surface-variant"
            }`}
          >
            3
          </div>
          <span className={`text-[10px] font-bold ${step === 3 ? "text-primary" : "text-on-surface-variant"}`}>
            Review
          </span>
        </div>
      </div>
    </header>
  );
}

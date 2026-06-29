import { useState } from "react";

const TEAL = "#0A4A63";
const SAND = "#F0EBE3";
const SAGE = "#7C9A82";
const CHARCOAL = "#1A1A1A";
const GRAY = "#8A8378";

const TIERS = {
  foundation: { name: "Foundation", price: 2250, hours: "20–25 hrs", deposit: 900 },
  growth: { name: "Growth", price: 3250, hours: "28–35 hrs", deposit: 1300 },
  authority: { name: "Authority", price: 5500, hours: "35–45 hrs", deposit: 2200 },
};

const TIER_RANK = { foundation: 0, growth: 1, authority: 2 };

function higherTier(a, b) {
  return TIER_RANK[a] >= TIER_RANK[b] ? a : b;
}

const QUESTIONS = [
  {
    id: "pages",
    label: "How many pages does your site need?",
    sub: "Think in terms of distinct pages — Home, About, Services, Contact, etc.",
    options: [
      { label: "1–5 pages", value: "1-5", tier: "foundation" },
      { label: "6–8 pages", value: "6-8", tier: "growth" },
      { label: "9 or more pages", value: "9+", tier: "authority" },
    ],
  },
  {
    id: "cms",
    label: "What kind of content control do you need?",
    sub: "This determines how flexible your CMS setup will be.",
    options: [
      { label: "Simple — I'll edit text & images on existing pages", value: "simple", tier: "foundation" },
      { label: "Advanced — I need to add new content types myself (blog posts, services, listings)", value: "advanced", tier: "authority" },
    ],
  },
  {
    id: "copy",
    label: "What level of copywriting support do you need?",
    sub: "Be honest here — it changes the scope significantly.",
    options: [
      { label: "Polish — I'll provide the text, just refine it", value: "polish", tier: "foundation" },
      { label: "Full writing — write my site copy for me from a brief", value: "full", tier: "authority" },
    ],
  },
  {
    id: "logo",
    label: "Do you need logo work?",
    sub: "",
    options: [
      { label: "No logo work needed", value: "none", tier: "foundation" },
      { label: "Yes — refine/vectorize my existing logo", value: "refine", tier: "authority" },
    ],
  },
  {
    id: "form",
    label: "What kind of form(s) does your site need?",
    sub: "",
    options: [
      { label: "One simple contact form", value: "simple", tier: "foundation" },
      { label: "Advanced form — booking, multi-step, or conditional logic", value: "advanced", tier: "growth" },
    ],
  },
  {
    id: "integrations",
    label: "How many integrations do you need?",
    sub: "Booking tools, email signup, calendar embeds, etc. (No CRM integrations at this time.)",
    options: [
      { label: "None", value: 0, tier: "foundation" },
      { label: "1", value: 1, tier: "growth" },
      { label: "2", value: 2, tier: "authority" },
      { label: "3 or more", value: 3, tier: "authority" },
    ],
  },
  {
    id: "photos",
    label: "How many photos need editing?",
    sub: "Color correction, cropping, background cleanup.",
    options: [
      { label: "5 or fewer (just placement, no editing)", value: 5, tier: "foundation" },
      { label: "Up to 15 (basic editing)", value: 15, tier: "growth" },
      { label: "More than 15", value: 99, tier: "authority" },
    ],
  },
  {
    id: "rush",
    label: "What's your timeline?",
    sub: "",
    options: [
      { label: "Standard timeline is fine", value: false, tier: "foundation" },
      { label: "I need this rushed (under 2 weeks)", value: true, tier: "foundation" },
    ],
  },
];

function computeQuote(answers) {
  let tier = "foundation";
  Object.entries(answers).forEach(([key, val]) => {
    const q = QUESTIONS.find((q) => q.id === key);
    const opt = q.options.find((o) => o.value === val);
    if (opt) tier = higherTier(tier, opt.tier);
  });

  const base = TIERS[tier];
  const lineItems = [];
  let total = base.price;

  // extra pages beyond tier cap is not directly asked, so we skip unless pages exceeds tier's natural cap
  // integrations beyond what's included
  const includedIntegrations = tier === "foundation" ? 0 : tier === "growth" ? 1 : 2;
  if (typeof answers.integrations === "number" && answers.integrations > includedIntegrations) {
    const extra = answers.integrations - includedIntegrations;
    const cost = extra * 200;
    lineItems.push({ label: `${extra} extra integration${extra > 1 ? "s" : ""}`, cost });
    total += cost;
  }

  // logo on foundation/growth costs extra (only authority includes it)
  if (answers.logo === "refine" && tier !== "authority") {
    lineItems.push({ label: "Logo refinement (add-on)", cost: 400 });
    total += 400;
  }

  // photos beyond cap
  const photoCap = tier === "foundation" ? 5 : tier === "growth" ? 15 : Infinity;
  if (typeof answers.photos === "number" && answers.photos > photoCap && photoCap !== Infinity) {
    const extra = answers.photos - photoCap;
    const cost = extra * 15;
    lineItems.push({ label: `${extra} additional photo${extra > 1 ? "s" : ""} edited`, cost });
    total += cost;
  }

  if (answers.rush === true) {
    const cost = Math.round(total * 0.25);
    lineItems.push({ label: "Rush turnaround (+25%)", cost });
    total += cost;
  }

  const deposit = Math.round(total * 0.4);

  return { tier, base, lineItems, total, deposit };
}

export default function ImbaliIntakeQuote() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [revealStage, setRevealStage] = useState(0);

  const isDone = step >= QUESTIONS.length;
  const quote = isDone ? computeQuote(answers) : null;

  function selectOption(qid, value) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    setTimeout(() => {
      setStep((s) => s + 1);
    }, 180);
  }

  function startReveal() {
    setRevealed(true);
    const total = (quote.lineItems.length || 0) + 2; // base + line items + total
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setRevealStage(i);
      if (i >= total) clearInterval(interval);
    }, 450);
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setRevealed(false);
    setRevealStage(0);
  }

  const progress = Math.min(step / QUESTIONS.length, 1) * 100;

  return (
    <div
      style={{
        minHeight: "600px",
        background: SAND,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: "560px" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: GRAY,
              marginBottom: "6px",
            }}
          >
            Imbali Studio
          </div>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "24px",
              color: TEAL,
              fontWeight: 600,
            }}
          >
            Project Estimate
          </div>
        </div>

        {/* Progress line */}
        {!isDone && (
          <div
            style={{
              height: "3px",
              background: "rgba(10,74,99,0.12)",
              borderRadius: "2px",
              marginBottom: "32px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: SAGE,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        )}

        {/* Question card */}
        {!isDone && (
          <div
            key={step}
            style={{
              background: "#FFFFFF",
              borderRadius: "10px",
              padding: "28px 26px",
              boxShadow: "0 1px 3px rgba(10,74,99,0.08)",
              animation: "fadeIn 0.35s ease",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: GRAY,
                marginBottom: "10px",
                letterSpacing: "0.04em",
              }}
            >
              Question {step + 1} of {QUESTIONS.length}
            </div>
            <div
              style={{
                fontSize: "19px",
                color: CHARCOAL,
                fontWeight: 600,
                marginBottom: QUESTIONS[step].sub ? "6px" : "20px",
                lineHeight: 1.4,
              }}
            >
              {QUESTIONS[step].label}
            </div>
            {QUESTIONS[step].sub && (
              <div
                style={{
                  fontSize: "14px",
                  color: GRAY,
                  marginBottom: "20px",
                  lineHeight: 1.5,
                }}
              >
                {QUESTIONS[step].sub}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {QUESTIONS[step].options.map((opt) => {
                const selected = answers[QUESTIONS[step].id] === opt.value;
                return (
                  <button
                    key={String(opt.value)}
                    onClick={() => selectOption(QUESTIONS[step].id, opt.value)}
                    style={{
                      textAlign: "left",
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: selected
                        ? `2px solid ${TEAL}`
                        : "1px solid rgba(10,74,99,0.18)",
                      background: selected ? "rgba(10,74,99,0.05)" : "#FFFFFF",
                      cursor: "pointer",
                      fontSize: "15px",
                      color: CHARCOAL,
                      transition: "all 0.15s ease",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) e.currentTarget.style.borderColor = TEAL;
                    }}
                    onMouseLeave={(e) => {
                      if (!selected)
                        e.currentTarget.style.borderColor = "rgba(10,74,99,0.18)";
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                style={{
                  marginTop: "18px",
                  background: "none",
                  border: "none",
                  color: GRAY,
                  fontSize: "13px",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                ← Back
              </button>
            )}
          </div>
        )}

        {/* Reveal screen */}
        {isDone && !revealed && (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "10px",
              padding: "36px 26px",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(10,74,99,0.08)",
            }}
          >
            <div style={{ fontSize: "15px", color: CHARCOAL, marginBottom: "20px" }}>
              All set. Your estimate is ready.
            </div>
            <button
              onClick={startReveal}
              style={{
                background: TEAL,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "13px 28px",
                fontSize: "15px",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Reveal my estimate
            </button>
          </div>
        )}

        {isDone && revealed && (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "10px",
              padding: "32px 26px",
              boxShadow: "0 1px 3px rgba(10,74,99,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: GRAY,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Recommended package
            </div>

            {revealStage >= 1 && (
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "30px",
                  color: TEAL,
                  fontWeight: 600,
                  marginBottom: "4px",
                  animation: "fadeIn 0.4s ease",
                }}
              >
                {quote.base.name}
              </div>
            )}
            {revealStage >= 1 && (
              <div style={{ fontSize: "13px", color: GRAY, marginBottom: "20px" }}>
                {quote.base.hours} estimated · base price ${quote.base.price.toLocaleString()}
              </div>
            )}

            {quote.lineItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: revealStage >= idx + 2 ? "flex" : "none",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderTop: "1px solid #EEE",
                  fontSize: "14px",
                  color: CHARCOAL,
                  animation: "fadeIn 0.4s ease",
                }}
              >
                <span>{item.label}</span>
                <span>+${item.cost.toLocaleString()}</span>
              </div>
            ))}

            {revealStage >= quote.lineItems.length + 2 && (
              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: `2px solid ${TEAL}`,
                  animation: "fadeIn 0.4s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: TEAL,
                    marginBottom: "12px",
                  }}
                >
                  <span>Total</span>
                  <span>${quote.total.toLocaleString()}</span>
                </div>
                <div
                  style={{
                    background: SAND,
                    borderRadius: "8px",
                    padding: "14px 16px",
                    fontSize: "14px",
                    color: CHARCOAL,
                  }}
                >
                  40% deposit to begin: <strong>${Math.round(quote.total * 0.4).toLocaleString()}</strong>
                  <br />
                  Remaining balance due at launch.
                </div>

                <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                  <button
                    style={{
                      flex: 1,
                      background: TEAL,
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      padding: "13px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Book a consultation
                  </button>
                  <button
                    onClick={restart}
                    style={{
                      flex: 1,
                      background: "none",
                      border: `1px solid ${TEAL}`,
                      color: TEAL,
                      borderRadius: "8px",
                      padding: "13px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Start over
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

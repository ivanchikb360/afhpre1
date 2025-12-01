/**
 * Mobile-first prelander that filters room-availability leads before the main AFH site.
 * Quiz stays above the fold; trust copy remains punchy but minimal.
 */
"use client";

import { useState, useRef } from "react";
import styles from "./page.module.css";

const trustMetrics = [
  { value: "Licensed", label: "State-certified AFH" },
  { value: "24/7", label: "Care team available" },
];

const benefits = [
  "Care team onsite 24/7",
  "One private suite opening this month",
  "Tours confirmed under 48 hrs",
];

const microTestimonial = {
  quote: "They pre-qualified us quickly and secured mom’s room within a week.",
  author: "Emily R.",
};

interface FormData {
  searchingFor: string;
  careLevel: string;
  mobilityLevel: string;
  memoryCare: string;
  medicalNeeds: string;
  priceRange: string;
  timeline: string;
  name: string;
  email: string;
  phone?: string;
}

export default function Prelander() {
  const [currentStep, setCurrentStep] = useState(0);
  const quizRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    searchingFor: "",
    careLevel: "",
    mobilityLevel: "",
    memoryCare: "",
    medicalNeeds: "",
    priceRange: "",
    timeline: "",
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: "searchingFor",
      title: "Who are you helping place into care?",
      options: [
        { value: "mom", label: "My mom" },
        { value: "dad", label: "My dad" },
        { value: "spouse", label: "My spouse/partner" },
        { value: "other", label: "Another loved one" },
      ],
    },
    {
      id: "careLevel",
      title: "What level of daily support is needed?",
      options: [
        { value: "minimal", label: "Minimal — reminders & light assistance" },
        { value: "moderate", label: "Moderate — help with several ADLs" },
        {
          value: "extensive",
          label: "Extensive — full help with most daily activities",
        },
        { value: "total", label: "Total — full assistance & monitoring" },
      ],
    },
    {
      id: "mobilityLevel",
      title: "What best describes their mobility?",
      options: [
        { value: "fully-mobile", label: "Fully mobile" },
        { value: "walker", label: "Uses walker or cane" },
        { value: "wheelchair", label: "Wheelchair user" },
        { value: "bedbound", label: "Bedbound or very limited mobility" },
      ],
    },
    {
      id: "memoryCare",
      title: "Is memory care or dementia support required?",
      options: [
        { value: "no", label: "No memory care needed" },
        { value: "mild", label: "Mild memory changes" },
        { value: "moderate", label: "Moderate dementia/Alzheimer's" },
        { value: "severe", label: "Severe memory care needs" },
      ],
    },
    {
      id: "medicalNeeds",
      title: "Any medical or behavioral considerations?",
      options: [
        { value: "standard", label: "Standard medication management" },
        { value: "fall-risk", label: "High fall risk / safety monitoring" },
        {
          value: "complex",
          label: "Complex conditions (e.g. diabetes, hospice)",
        },
        { value: "behavioral", label: "Behavioral / mood-related support" },
      ],
    },
    {
      id: "priceRange",
      title: "What monthly budget range are you planning for?",
      options: [
        { value: "under-3000", label: "Under $3,000 per month" },
        { value: "3000-5000", label: "$3,000 – $5,000 per month" },
        { value: "5000-7000", label: "$5,000 – $7,000 per month" },
        { value: "over-7000", label: "Over $7,000 per month" },
      ],
    },
    {
      id: "timeline",
      title: "How soon are you hoping to move in?",
      options: [
        { value: "immediate", label: "Immediately (within 30 days)" },
        { value: "1-3months", label: "1–3 months" },
        { value: "3-6months", label: "3–6 months" },
        { value: "6plus", label: "6+ months / just planning" },
      ],
    },
  ] as const;

  const handleOptionSelect = (questionId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));

    // Auto-advance to keep momentum high.
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // Move to contact step after last question
        setCurrentStep(questions.length);
      }
    }, 280);
  };

  const handleContactChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      alert("Please provide your name and email to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send data to API endpoint
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          source: "prelander",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      // Redirect with query params
      const params = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      window.location.href = `https://afhbestcare.com?${params.toString()}`;
    } catch (error) {
      console.error("Submission error:", error);
      // Still redirect even if API fails
      const params = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      window.location.href = `https://afhbestcare.com?${params.toString()}`;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const scrollToQuiz = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (quizRef.current) {
      quizRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isContactStep = currentStep === questions.length;
  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length + 1; // +1 for contact step
  const progress = isContactStep ? 100 : ((currentStep + 1) / totalSteps) * 100;
  const contactPhone = "(360) 608-2775";
  const contactEmail = "welcome@afhbestcare.com";

  return (
    <main className={styles.page}>
      <section className={styles.heroGrid}>
        <div className={styles.quizSection} ref={quizRef} id="quiz-intake">
          <div className={styles.availabilityBanner}>
            <span className={styles.availabilityLabel}>
              Current availability
            </span>
            <p className={styles.availabilityValue}>
              1 private suite open this month
            </p>
            <p className={styles.availabilityMeta}>
              Tours available within 48 hours · No obligation to finish
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.header}>
              <h2 className={styles.formTitle}>Let’s confirm the fit</h2>
              <p className={styles.formSubtitle}>
                Answer these quick questions so we can match care, budget, and
                move-in timing for your loved one.
              </p>
            </div>

            <div className={styles.progressMeta}>
              <span>{questions.length} curated questions</span>
              <span>~45 seconds</span>
            </div>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>

            {isContactStep ? (
              <div className={styles.questionContainer}>
                <h3 className={styles.questionTitle}>
                  Almost done! We just need your contact info
                </h3>
                <p className={styles.contactPrompt}>
                  We&apos;ll use this to send you availability details and
                  schedule your tour.
                </p>

                <div className={styles.contactForm}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.inputLabel}>
                      Your name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={styles.textInput}
                      value={formData.name}
                      onChange={(e) =>
                        handleContactChange("name", e.target.value)
                      }
                      placeholder="John Smith"
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.inputLabel}>
                      Email address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={styles.textInput}
                      value={formData.email}
                      onChange={(e) =>
                        handleContactChange("email", e.target.value)
                      }
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="phone" className={styles.inputLabel}>
                      Phone number (optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={styles.textInput}
                      value={formData.phone || ""}
                      onChange={(e) =>
                        handleContactChange("phone", e.target.value)
                      }
                      placeholder="(360) 555-1234"
                    />
                  </div>

                  <button
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.name || !formData.email}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : "Get my availability details"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.questionContainer}>
                  <h3 className={styles.questionTitle}>
                    {currentQuestion.title}
                  </h3>

                  <div className={styles.optionsGrid}>
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.value}
                        className={`${styles.optionButton} ${
                          formData[currentQuestion.id as keyof FormData] ===
                          option.value
                            ? styles.optionButtonActive
                            : ""
                        }`}
                        onClick={() =>
                          handleOptionSelect(currentQuestion.id, option.value)
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {currentStep > 0 && (
                  <button className={styles.backButton} onClick={handleBack}>
                    ← Back
                  </button>
                )}
              </>
            )}

            <div className={styles.footer}>
              <p className={styles.footerText}>
                {isContactStep
                  ? `Step ${totalSteps} of ${totalSteps}`
                  : `Step ${currentStep + 1} of ${totalSteps}`}
              </p>
              <p className={styles.formHelper}>
                Protected intake · zero spam · we reply within one business hour
              </p>
            </div>
          </div>
        </div>

        <div className={styles.heroSection}>
          <p className={styles.heroBadge}>Vancouver, WA</p>
          <h1 className={styles.heroHeading}>Secure the open suite today</h1>
          <p className={styles.heroSubheading}>
            This 45-second screen confirms if the remaining room fits your loved
            one’s needs before we book a tour or call.
          </p>
          <ul className={styles.benefitsList}>
            {benefits.map((benefit) => (
              <li key={benefit} className={styles.benefitItem}>
                {benefit}
              </li>
            ))}
          </ul>
          <div className={styles.heroActions}>
            <a
              href="#quiz-intake"
              onClick={scrollToQuiz}
              className={styles.primaryCta}
            >
              Start the screen
            </a>
            <span className={styles.ctaHelper}>No obligation · Fast reply</span>
          </div>
          <p className={styles.microTestimonial}>
            “{microTestimonial.quote}”<span>— {microTestimonial.author}</span>
          </p>
        </div>
      </section>

      <section className={styles.trustSection}>
        <div className={styles.trustIntro}>
          <h2 className={styles.trustHeading}>
            What happens after this screen
          </h2>
          <p className={styles.trustSubheading}>
            We quickly check fit, share clear pricing, and hold the room while
            you decide on a tour.
          </p>
        </div>

        <div className={styles.trustStrip}>
          {trustMetrics.map((metric) => (
            <div key={metric.label} className={styles.trustMetric}>
              <span className={styles.trustValue}>{metric.value}</span>
              <span className={styles.trustLabel}>{metric.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.contactStrip}>
          <div className={styles.contactDetails}>
            <p className={styles.contactHeading}>Prefer to talk it through?</p>
            <p className={styles.contactSubheading}>
              Our provider will return calls within 1 business hour and can
              schedule a same-week tour.
            </p>
          </div>
          <div className={styles.contactActions}>
            <a className={styles.contactButton} href="tel:+13606082775">
              📞 Call {contactPhone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

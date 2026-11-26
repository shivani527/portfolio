"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import socials from "@/data/socials.json";
import contactData from "@/data/contact.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  botfield: string; // honeypot
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const phoneRe = /^[+\d][\d\s\-().]{6,}$/; // simple & forgiving

// Messages are sent with FormSubmit (https://formsubmit.co) to the address below.
// Optional: set NEXT_PUBLIC_FORMSUBMIT_ID to the random alias FormSubmit gives you
// after activation, so your email address is not visible in the page code.
const FORMSUBMIT_TARGET =
  process.env.NEXT_PUBLIC_FORMSUBMIT_ID?.trim() || "shivanikokkula527@gmail.com";
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${FORMSUBMIT_TARGET}`;

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);

  // ---- Sending state ----
  const [sending, setSending] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  // ---- Local state ----
  const [data, setData] = useState<FormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    botfield: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  // ---- validation ----
  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Your name is required.";
        if (value.trim().length < 2)
          return "Please enter at least 2 characters.";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required.";
        if (!emailRe.test(value)) return "Please enter a valid email address.";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required.";
        if (!phoneRe.test(value)) return "Please enter a valid phone number.";
        return "";
      case "message":
        if (!value.trim()) return "A short message is required.";
        if (value.trim().length < 10)
          return "Please write at least 10 characters.";
        return "";
      case "botfield":
        return value ? "Spam detected." : "";
      default:
        return "";
    }
  };

  const validateAll = (payload: FormData): FormErrors => {
    const next: FormErrors = {};
    (Object.keys(payload) as (keyof FormData)[]).forEach((k) => {
      const msg = validateField(k, payload[k]);
      if (msg) next[k] = msg;
    });
    return next;
  };

  const firstErrorMessage = (obj: FormErrors) =>
    Object.values(obj).find(Boolean) ?? "";

  const isComplete = useMemo(
    () =>
      data.name.trim() &&
      data.email.trim() &&
      data.phone.trim() &&
      data.message.trim(),
    [data]
  );

  // validate-on-change when touched/submitted
  const setField = (field: keyof FormData, value: string) => {
    setData((s) => ({ ...s, [field]: value }));
    if (submitted || touched[field]) {
      const msg = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (msg) next[field] = msg;
        else delete next[field];
        return next;
      });
    }
  };

  const markTouched = (field: keyof FormData) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const scrollToFirstError = (all: FormErrors) => {
    const firstKey = (Object.keys(all) as (keyof FormData)[]).find(
      (k) => all[k]
    );
    if (!firstKey) return;
    const el = formRef.current?.querySelector<HTMLElement>(
      `[name="${String(firstKey)}"]`
    );
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // After a successful send: thank the visitor and clear the form
  useEffect(() => {
    if (succeeded) {
      toast.success("Thanks! Your message was sent successfully.", {
        position: "bottom-right",
        autoClose: 4000,
      });
      setData({
        name: "",
        company: "",
        email: "",
        phone: "",
        message: "",
        botfield: "",
      });
      setErrors({});
      setTouched({});
      setSubmitted(false);
    }
  }, [succeeded]);

  // ---- submit ----
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return; // ignore clicks while a request is in progress

    // mark submit + touch all to reveal empties
    setSubmitted(true);
    setTouched({
      name: true,
      company: true,
      email: true,
      phone: true,
      message: true,
      botfield: true,
    });

    // run validation
    const all = validateAll(data);
    setErrors(all);

    // honeypot
    if (data.botfield) {
      toast.error("Spam detected. Submission blocked.", {
        position: "top-right",
      });
      return;
    }

    // block & focus first error (incl. empty fields)
    const first = firstErrorMessage(all);
    if (first) {
      toast.error(first, { position: "top-right" });
      scrollToFirstError(all);
      return;
    }

    // send the message with FormSubmit
    setSending(true);
    setSucceeded(false);
    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: data.name.trim(),
          company: data.company.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          message: data.message.trim(),
          _subject: `Portfolio message from ${data.name.trim()}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const result = await res.json().catch(() => ({}));
      const ok =
        res.ok && (result.success === true || result.success === "true");
      if (ok) {
        setSucceeded(true);
      } else {
        console.error("FormSubmit error:", res.status, result);
        toast.error(
          `❌ Oops! ${String(result.message || "Something went wrong").replace(/[.\s]+$/, "")}. Please try again, or email me directly.`,
          { position: "top-right", autoClose: 6000 }
        );
      }
    } catch (err) {
      console.error("Form submission error:", err);
      toast.error(
        "Network error. Please check your connection and try again.",
        { position: "top-right" }
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section id="contact" className="inner contact">
        <div className="content__block section-title">
          <p className="h2__subtitle animate-in-up">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="currentColor"
            >
              <path
                fill="currentColor"
                d="M5.6,12.6c-0.5-0.8-0.7-2.4-1.7-3.5c-1-1-2.7-1.2-3.5-1.7C-0.1,7-0.1,6,0.4,5.6c0.8-0.5,2.3-0.6,3.5-1.8
              C5,2.8,5.1,1.2,5.6,0.4C6-0.1,7-0.1,7.4,0.4c0.5,0.8,0.7,2.4,1.8,3.5c1.2,1.2,2.6,1.2,3.5,1.7c0.6,0.4,0.6,1.4,0,1.7
              C11.8,7.9,10.2,8,9.1,9.1c-1,1-1.2,2.7-1.7,3.5C7,13.1,6,13.1,5.6,12.6z"
              />
            </svg>
            <span>Contact</span>
          </p>
          <h2 className="h2__title animate-in-up">
            Let&apos;s talk about opportunities
          </h2>
        </div>

        {/* Live region (a11y) */}
        <div className="sr-only" aria-live="polite">
          {firstErrorMessage(errors) ||
            (succeeded ? "Form submitted successfully" : "")}
        </div>

        <div className="content__block grid-block block-grid-large">
          <div className="form-container">
            <form
              ref={formRef}
              className="form contact-form"
              id="contact-form"
              onSubmit={onSubmit}
              noValidate
            >
              {/* Honeypot */}
              <input
                type="text"
                name="botfield"
                autoComplete="off"
                tabIndex={-1}
                value={data.botfield}
                onChange={(e) => setField("botfield", e.target.value)}
                style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                aria-hidden="true"
              />

              {/* Optional meta */}
              <input
                type="hidden"
                name="project_name"
                value="Portfolio"
              />
              <input
                type="hidden"
                name="form_subject"
                value="Contact Form Message"
              />

              <div className="container-fluid p-0">
                <div className="row gx-0">
                  {/* Name */}
                  <div className="col-12 col-md-6 form__item animate-in-up">
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Your Name*"
                      value={data.name}
                      onChange={(e) => setField("name", e.target.value)}
                      onBlur={() => markTouched("name")}
                      aria-invalid={!!errors.name}
                      aria-describedby="error-name"
                      autoComplete="name"
                      required
                      maxLength={80}
                    />
                    {errors.name && (
                      <span id="error-name" className="form-error text-danger">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Company (optional) */}
                  <div className="col-12 col-md-6 form__item animate-in-up">
                    <input
                      id="company"
                      type="text"
                      name="company"
                      placeholder="Company Name"
                      value={data.company}
                      onChange={(e) => setField("company", e.target.value)}
                      onBlur={() => markTouched("company")}
                      autoComplete="organization"
                      maxLength={100}
                    />
                  </div>

                  {/* Email */}
                  <div className="col-12 col-md-6 form__item animate-in-up">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Email Address*"
                      value={data.email}
                      onChange={(e) => setField("email", e.target.value)}
                      onBlur={() => markTouched("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby="error-email"
                      autoComplete="email"
                      inputMode="email"
                      required
                      maxLength={254}
                    />
                    {errors.email && (
                      <span id="error-email" className="form-error text-danger">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="col-12 col-md-6 form__item animate-in-up">
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="Phone Number*"
                      value={data.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      onBlur={() => markTouched("phone")}
                      aria-invalid={!!errors.phone}
                      aria-describedby="error-phone"
                      autoComplete="tel"
                      inputMode="tel"
                      required
                      maxLength={20}
                    />
                    {errors.phone && (
                      <span id="error-phone" className="form-error text-danger">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="col-12 form__item animate-in-up">
                    <textarea
                      id="message"
                      name="message"
                      placeholder="A Few Words*"
                      value={data.message}
                      onChange={(e) => setField("message", e.target.value)}
                      onBlur={() => markTouched("message")}
                      aria-invalid={!!errors.message}
                      aria-describedby="error-message"
                      rows={5}
                      maxLength={500}
                      required
                    />
                    <div className="d-flex justify-content-between">
                      {errors.message ? (
                        <span
                          id="error-message"
                          className="form-error text-danger"
                        >
                          {errors.message}
                        </span>
                      ) : (
                        <span className="form-hint">
                          {Math.min(data.message.trim().length, 500)} / 500
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="col-12 form__item animate-in-up">
                    <button
                      className="btn btn-default btn-hover btn-hover-accent"
                      type="submit"
                      // IMPORTANT: allow submit even if invalid (to show errors)
                      disabled={sending}
                    >
                      <span className="btn-caption">
                        {sending ? "Sending..." : "Send Message"}
                      </span>
                      <i className="ph-bold ph-paper-plane-tilt" />
                    </button>
                    {!isComplete && submitted && (
                      <div className="form-error text-danger mt-2">
                        Please fill all required fields above.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>

            {succeeded ? (
              <div className="form__reply centered text-center">
                <i className="ph-bold ph-smiley reply__icon" />
                <p className="reply__title">Done!</p>
                <span className="reply__text">
                  Thanks for your message. I&apos;ll get back as soon as
                  possible.
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Socials */}
        <div className="content__block grid-block">
          <div className="socials-cards d-flex justify-content-start flex-wrap">
            {socials.map((social, idx) => (
              <div
                key={idx}
                data-delay={0.225 * idx}
                className="socials-cards__item d-flex grid-item-s animate-in-up"
              >
                <div className="socials-cards__card">
                  <i className={social.icon} />
                  <a
                    className="socials-cards__link"
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teaser */}
        <div className="content__block">
          <div className="teaser">
            <p className="teaser__text animate-in-up">
              Hiring for an AI/ML, Python, full-stack or data analyst role, or
              just want to say hello?{" "}
              <a
                className="text-link-bold"
                href="mailto:shivanikokkula527@gmail.com?subject=Message%20from%20your%20portfolio"
              >
                Drop me a line{" "}
              </a>
              and I&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </div>

        {/* Contact lines */}
        <div className="content__block">
          <div className="container-fluid p-0 contact-lines animate-in-up">
            <div className="row g-0 contact-lines__item">
              {contactData.map((item, idx) => (
                <div key={idx} className="col-12 col-md-4 contact-lines__data">
                  <p className="contact-lines__title animate-in-up">
                    {item.title}
                  </p>
                  <p className="contact-lines__text animate-in-up">
                    <a
                      className="text-link-bold"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.text}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ToastContainer />
    </>
  );
}
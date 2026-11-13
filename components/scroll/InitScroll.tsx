"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function InitScroll() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".animate-in-up")
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let io: IntersectionObserver | undefined;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
    } else {
      // One lightweight observer reveals each block as it nears the screen
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const delay = Math.min(
              parseFloat(el.dataset.delay || "0") * 0.4,
              0.25
            );
            if (delay) el.style.animationDelay = `${delay}s`;
            el.classList.add("is-in");
            io?.unobserve(el);
          });
        },
        { rootMargin: "0px 0px -3% 0px" }
      );
      els.forEach((el) => io!.observe(el));
    }

    gsap.utils.toArray<HTMLElement>(".animate-fade").forEach((el) => {
      gsap.fromTo(
        el,
        {
          opacity: 0,

          ease: "linear",
          duration: 0.6,
        },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: document.body,
            toggleActions: "play none none reverse",
          },
        }
      );
    });
    gsap.utils.toArray<HTMLElement>(".promo-image").forEach((el) => {
      gsap.fromTo(
        el,
        {
          x: 30,
          opacity: 0,
          ease: "sine",
          duration: 1,
        },
        { delay: 0.5, opacity: 1, x: 0, duration: 1, ease: "sine" }
      );
    });
    return () => io?.disconnect();
  }, []);
  return <></>;
}
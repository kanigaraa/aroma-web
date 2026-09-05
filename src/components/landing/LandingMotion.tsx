"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";
import styles from "@/app/landing.module.css";

const motionQuery = "(prefers-reduced-motion: reduce), (max-width: 899px)";
const options = { autoRaf: true, lerp: 0.1, smoothWheel: true, anchors: { offset: -120 } };
const subscribe = (callback: () => void) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getSnapshot = () => window.matchMedia(motionQuery).matches;
const getServerSnapshot = () => true;

export default function LandingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const lightweightMode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    if (root.current) {
      gsap.set(root.current.querySelectorAll("[data-hero-intro]"), { clearProps: "transform,rotate,scale,translate" });
    }
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro.from("[data-hero-line]", { y: 40, opacity: 0, duration: 1.15, stagger: 0.13 })
        .from("[data-hero-intro]", { opacity: 0, duration: 0.8 }, "-=0.65");
    }, root);
    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      root.current?.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 36, opacity: 0, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 92%", once: true },
        });
      });
    }, root);
    return () => media.revert();
  }, []);

  return (
    <div ref={root} className={styles.landing}>
      {!lightweightMode && <ReactLenis root options={options} />}
      {children}
    </div>
  );
}

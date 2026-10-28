"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import Countdown from "../components/ui/Countdown";
import LanguageToggle from "../components/ui/LanguageToggle";
import TiltCard from "../components/ui/TiltCard";
import AudioPlayer from "../components/ui/AudioPlayer";
import { Sparkles, Heart, Check, Send } from "lucide-react";
import { triggerGoldConfetti } from "../components/animations/GoldConfetti";
import SacredGeometry3D from "../components/animations/SacredGeometry3D";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/* ── Reusable Section Fade-In ── */
function FadeSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ── Premium Cinematic Staggered Text Reveal ── */
function RevealText({ text, className = "", delay = 0 }) {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 14,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 15,
      filter: "blur(4px)",
    },
  };

  return (
    <motion.span
      style={{ display: "inline-block" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ display: "inline-block", marginRight: "0.22em" }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ── Gold Ornament SVGs ── */
function GoldDiamond() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className="inline-block mx-1">
      <rect
        x="7"
        y="0"
        width="9"
        height="9"
        rx="1"
        transform="rotate(45 7 0)"
        fill="var(--dynamic-gold)"
      />
    </svg>
  );
}

function SunMoonSymbol() {
  return (
    <div className="flex items-center justify-center gap-3 text-xl select-none" style={{ color: "var(--dynamic-gold)" }}>
      <span>☽</span>
      <span className="text-2xl animate-pulse">✦</span>
      <span>☉</span>
    </div>
  );
}

function GoldSeparator() {
  return (
    <div className="flex items-center justify-center gap-3 my-8 sm:my-14">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--dynamic-gold)]/60" />
      <span className="text-sm animate-pulse" style={{ color: "var(--dynamic-gold)" }}>✦ ✦ ✦</span>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--dynamic-gold)]/60" />
    </div>
  );
}

/* ── Ceremony Detail Card (Pure White Icons + 3D Hover Tilt) ── */
function CeremonyCard({ iconSrc, iconAlt, title, description, detail, extraDetail }) {
  return (
    <TiltCard className="w-full">
      <div className="glass-card p-5 sm:p-6 text-center flex flex-col items-center gap-3 h-full">
        <div className="w-14 h-14 sm:w-16 sm:h-16 relative mb-1">
          <Image
            src={iconSrc}
            alt={iconAlt || title}
            fill
            className="object-contain opacity-95 transition-all duration-300"
            style={{ filter: "var(--dynamic-icon-filter, brightness(0) invert(1))" }}
            sizes="64px"
          />
        </div>
        <h4
          className="text-xs uppercase tracking-[0.25em] font-semibold animate-text-glow dyn-text-gold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h4>
        <p className="text-base sm:text-lg font-semibold tracking-wide dyn-text-title animate-white-glow">
          {description}
        </p>
        {detail && (
          <p className="text-xs sm:text-sm leading-relaxed font-normal dyn-text-body">
            {detail}
          </p>
        )}
        {extraDetail && (
          <p className="text-xs italic mt-auto font-medium dyn-text-gold animate-text-glow">
            {extraDetail}
          </p>
        )}
      </div>
    </TiltCard>
  );
}

/* ── Plant Card (3D Hover Tilt) ── */
function PlantCard({ imageSrc, name, description }) {
  return (
    <TiltCard className="w-full">
      <div className="glass-card p-5 sm:p-6 text-center flex flex-col items-center gap-4 h-full">
        <div className="w-20 h-20 sm:w-24 sm:h-24 relative filter drop-shadow-[0_0_10px_rgba(30,100,45,0.35)] transition-transform duration-500 hover:scale-105">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-contain"
            sizes="96px"
          />
        </div>
        <h4
          className="text-sm uppercase tracking-widest font-semibold animate-text-glow dyn-text-gold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {name}
        </h4>
        <p className="text-xs sm:text-sm leading-relaxed font-normal dyn-text-body">
          {description}
        </p>
      </div>
    </TiltCard>
  );
}

/* ── Ambient Fireflies Component (GPU Accelerated CSS) ── */
function AmbientFireflies() {
  const [fireflies, setFireflies] = useState([]);

  useEffect(() => {
    const items = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 6,
    }));
    setFireflies(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full bg-gradient-to-r from-[#FF9F43] to-[#E8C86B] opacity-0 animate-firefly"
          style={{
            left: f.left,
            top: f.top,
            width: `${f.size}px`,
            height: `${f.size}px`,
            boxShadow: "0 0 8px #FF9F43, 0 0 16px #E8C86B",
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Unified Shamanic Cosmic Stars (Real-time Scroll Adaptable) ── */
function ShamanicCosmicStars() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const starList = Array.from({ length: 450 }).map((_, i) => {
      const type = Math.random() > 0.80 ? "gold" : Math.random() > 0.45 ? "white-star" : "tiny";
      let size = Math.random() * 1.2 + 0.7; // tiny default (0.7px to 1.9px)
      if (type === "white-star") size = Math.random() * 1.5 + 1.4; // (1.4px to 2.9px)
      if (type === "gold") size = Math.random() * 2.2 + 2.0; // (2.0px to 4.2px)

      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size,
        type,
        delay: Math.random() * 8,
        duration: Math.random() * 6 + 4, // 4s to 10s
      };
    });
    setStars(starList);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {stars.map((s) => {
        let color = "var(--dynamic-star-color)";
        let shadow = "0 0 6px var(--dynamic-star-glow)";
        
        if (s.type === "gold") {
          color = "var(--dynamic-gold)";
          shadow = "0 0 8px var(--dynamic-gold-glow), 0 0 14px var(--dynamic-gold-glow)";
        }

        return (
          <div
            key={s.id}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              backgroundColor: color,
              boxShadow: s.size > 1.3 ? shadow : "none",
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Scrolling Sparkles for Body Sections (GPU Accelerated CSS) ── */
function ScrollingSparkles({ count = 8, className = "" }) {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const items = Array.from({ length: count }).map((_, i) => {
      const isAsterisk = Math.random() > 0.4;
      const char = isAsterisk ? "✦" : "✨";
      const size = isAsterisk ? Math.random() * 8 + 8 : Math.random() * 10 + 10; // 8-16px for asterisks, 10-20px for sparkles
      return {
        id: i,
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 90 + 5}%`,
        size,
        char,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 3, // 3s to 7s
      };
    });
    setSparkles(items);
  }, [count]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-10 ${className}`}>
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute font-semibold select-none pointer-events-none animate-sparkling"
          style={{
            left: s.left,
            top: s.top,
            fontSize: `${s.size}px`,
            color: "var(--dynamic-gold)",
            textShadow: "0 0 8px var(--dynamic-gold-glow)",
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          {s.char}
        </div>
      ))}
    </div>
  );
}

/* ── Shooting Stars (Rayos Fugaces) Background Component ── */
function ShootingStars() {
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const rotation = Math.random() * 15 - 40; // -25deg to -55deg
      const size = Math.random() * 1.2 + 1.0; // thickness
      const width = Math.random() * 100 + 120; // trace width (120px to 220px)
      const distance = Math.random() * 150 + 250; // travel distance
      
      const newMeteor = {
        id: Date.now() + Math.random(),
        x: Math.random() * 85 + 5,
        y: Math.random() * 30 + 5,
        delay: Math.random() * 0.4,
        duration: Math.random() * 0.6 + 0.5, // 0.5s to 1.1s (fast!)
        rotation,
        size,
        width,
        distance,
      };
      setMeteors((prev) => [...prev.slice(-7), newMeteor]);
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 h-[90vh]">
      {meteors.map((m) => (
        <motion.div
          key={m.id}
          className="absolute bg-gradient-to-r from-[var(--dynamic-gold)] via-[var(--dynamic-gold)]/40 to-transparent"
          style={{
            height: `${m.size}px`,
            left: `${m.x}%`,
            top: `${m.y}%`,
            transform: `rotate(${m.rotation}deg)`,
            transformOrigin: "left center",
          }}
          initial={{
            width: "0px",
            opacity: 0,
          }}
          animate={{
            width: ["0px", `${m.width}px`, "0px"],
            x: [0, m.distance],
            y: [0, m.distance * Math.tan((Math.abs(m.rotation) * Math.PI) / 180)],
            opacity: [0, 0.95, 0.95, 0],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════ */
export default function Home() {
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const [formData, setFormData] = useState({
    name: "",
    attendance: "yes",
    message: "",
  });

  const storyRef = useRef(null);

  /* Scroll mappings bound directly to native scroll for maximum hardware performance and no lag */
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.45, 1.55]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  
  // Transition between deep night and warm sunrise backgrounds
  const nightBgOpacity = useTransform(scrollYProgress, [0.02, 0.20], [0.38, 0]);
  const dawnBgOpacity = useTransform(scrollYProgress, [0.02, 0.20], [0, 0.85]);

  // Fade out celestial elements (fireflies & shooting stars) as sunrise rolls in
  const starsOpacity = useTransform(scrollYProgress, [0.02, 0.20], [1, 0]);

  // Interpolate dynamic colors for text, headings, cards, and buttons on scroll (Warm Amber Sunrise theme)
  const dynamicBg = useTransform(scrollYProgress, [0.02, 0.20], ["#040905", "#FAF3E8"]);
  const dynamicText = useTransform(scrollYProgress, [0.00, 0.10], ["#E5E9E6", "#050A05"]);
  const dynamicTitle = useTransform(scrollYProgress, [0.00, 0.10], ["#FFFFFF", "#000000"]);
  const dynamicGold = useTransform(scrollYProgress, [0.00, 0.10], ["#E8C86B", "#8A6000"]);
  const dynamicCardBg = useTransform(scrollYProgress, [0.02, 0.20], ["rgba(10, 24, 14, 0.55)", "rgba(255, 255, 255, 0.45)"]);
  const dynamicCardBorder = useTransform(scrollYProgress, [0.02, 0.20], ["rgba(232, 200, 107, 0.18)", "rgba(153, 115, 28, 0.22)"]);
  const dynamicCardBorderHover = useTransform(scrollYProgress, [0.02, 0.20], ["rgba(232, 200, 107, 0.4)", "rgba(153, 115, 28, 0.45)"]);
  const dynamicShadow = useTransform(scrollYProgress, [0.02, 0.20], ["rgba(0, 0, 0, 0.5)", "rgba(153, 115, 28, 0.04)"]);
  const dynamicShadowHover = useTransform(scrollYProgress, [0.02, 0.20], ["rgba(232, 200, 107, 0.08)", "rgba(153, 115, 28, 0.08)"]);
  const dynamicBtnBg = useTransform(scrollYProgress, [0.02, 0.20], [
    "linear-gradient(135deg, #E8C86B, #C5A85A)",
    "linear-gradient(135deg, #8A6000, #C5A85A)"
  ]);
  const dynamicBtnText = useTransform(scrollYProgress, [0.02, 0.20], ["#000000", "#FFFFFF"]);
  const dynamicIconFilter = useTransform(scrollYProgress, [0.00, 0.10], [
    "brightness(0) invert(1)",
    "brightness(0) invert(0)"
  ]);
  const dynamicMapFilter = useTransform(scrollYProgress, [0.02, 0.20], [
    "invert(90%) hue-rotate(180deg) brightness(85%) contrast(95%)",
    "invert(0%) hue-rotate(0deg) brightness(100%) contrast(100%)"
  ]);
  const dynamicTitleGlow = useTransform(scrollYProgress, [0.00, 0.10], [
    "rgba(255, 255, 255, 0.4)",
    "rgba(232, 200, 107, 0.85)"
  ]);
  const dynamicGoldGlow = useTransform(scrollYProgress, [0.00, 0.10], [
    "rgba(232, 200, 107, 0.45)",
    "rgba(153, 115, 28, 0.5)"
  ]);
  const dynamicStarColor = useTransform(scrollYProgress, [0.00, 0.10], [
    "rgba(255, 255, 255, 0.85)",
    "rgba(138, 96, 0, 0.85)"
  ]);
  const dynamicStarGlow = useTransform(scrollYProgress, [0.00, 0.10], [
    "rgba(255, 255, 255, 0.6)",
    "rgba(138, 96, 0, 0.25)"
  ]);
  const dynamicSideVineOpacity = useTransform(scrollYProgress, [0.02, 0.20], [0.8, 0.55]);

  /* Smooth scroll to Story section */
  const scrollToStory = () => {
    if (storyRef.current) {
      storyRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* WhatsApp RSVP submit handler */
  const WHATSAPP_NUMBER = "51999999999"; // ← Replace with real number
  const handleSubmit = (e) => {
    e.preventDefault();
    const attendText =
      formData.attendance === "yes" ? t("rsvp.yes") : t("rsvp.no");

    if (formData.attendance === "yes") {
      triggerGoldConfetti();
    }

    const template = t("rsvp.whatsappTextTemplate")
      .replace("{name}", formData.name)
      .replace("{attendance}", attendText)
      .replace("{message}", formData.message || "—");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(template)}`;
    
    // Delay WhatsApp redirect slightly to allow the guest to appreciate the golden confetti burst
    setTimeout(() => {
      window.open(url, "_blank");
    }, 1200);
  };

  return (
    <motion.div
      style={{
        "--dynamic-bg": dynamicBg,
        "--dynamic-text": dynamicText,
        "--dynamic-title": dynamicTitle,
        "--dynamic-gold": dynamicGold,
        "--dynamic-card-bg": dynamicCardBg,
        "--dynamic-card-border": dynamicCardBorder,
        "--dynamic-card-border-hover": dynamicCardBorderHover,
        "--dynamic-shadow": dynamicShadow,
        "--dynamic-shadow-hover": dynamicShadowHover,
        "--dynamic-btn-bg": dynamicBtnBg,
        "--dynamic-btn-text": dynamicBtnText,
        "--dynamic-icon-filter": dynamicIconFilter,
        "--dynamic-map-filter": dynamicMapFilter,
        "--dynamic-title-glow": dynamicTitleGlow,
        "--dynamic-gold-glow": dynamicGoldGlow,
        "--dynamic-star-color": dynamicStarColor,
        "--dynamic-star-glow": dynamicStarGlow,
        backgroundColor: dynamicBg,
        color: dynamicText,
      }}
      className="relative min-h-screen overflow-x-hidden selection:bg-[#E8C86B]/30 perspective-container transition-colors duration-300"
    >
      <LanguageToggle />
      <AudioPlayer />

      {/* Desktop-Only Side Vines (Left and Right Frame) */}
      <motion.div
        className="fixed left-0 top-0 h-full w-[100px] xl:w-[125px] pointer-events-none z-30 hidden lg:block overflow-hidden"
        style={{ opacity: dynamicSideVineOpacity }}
      >
        <Image
          src={`${BASE_PATH}/assets/ayahuasca_border.png`}
          alt="Ayahuasca Liana Left"
          fill
          className="object-cover object-left"
          priority
        />
      </motion.div>
      <motion.div
        className="fixed right-0 top-0 h-full w-[100px] xl:w-[125px] pointer-events-none z-30 hidden lg:block overflow-hidden"
        style={{ opacity: dynamicSideVineOpacity }}
      >
        <Image
          src={`${BASE_PATH}/assets/ayahuasca_border.png`}
          alt="Ayahuasca Liana Right"
          fill
          className="object-cover object-left scale-x-[-1]"
          priority
        />
      </motion.div>

      {/* Ambient glowing orbs (only active in night phase) */}
      <motion.div style={{ opacity: starsOpacity }} className="pointer-events-none">
        <div className="glow-green top-[12%] left-[-150px] opacity-80" />
        <div className="glow-amber top-[35%] right-[-200px] opacity-70" />
        <div className="glow-green top-[65%] left-[10%] opacity-60" />
        <div className="glow-amber top-[80%] right-[15%] opacity-50" />
      </motion.div>

      {/* Floating Shamanic Fireflies & Shooting Stars (Fade out in dawn) */}
      <motion.div style={{ opacity: starsOpacity }} className="pointer-events-none">
        <AmbientFireflies />
        <ShootingStars />
      </motion.div>

      {/* Unified Shamanic Cosmic Stars (Always active, color shifts dynamically on scroll) */}
      <ShamanicCosmicStars />

      {/* ── BACKGROUND LAYER: NIGHT ── */}
      <motion.div
        className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
        style={{
          scale: bgScale,
          opacity: nightBgOpacity,
          y: bgY,
          transformStyle: "preserve-3d",
          translateZ: -450,
        }}
      >
        <Image
          src={`${BASE_PATH}/assets/rio_mayo_bg.jpg`}
          alt="Jungle background río Mayo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040905]/95 via-transparent to-[#040905]" />
      </motion.div>

      {/* ── BACKGROUND LAYER: DAWN ── */}
      <motion.div
        className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
        style={{
          scale: bgScale,
          opacity: dawnBgOpacity,
          y: bgY,
          transformStyle: "preserve-3d",
          translateZ: -450,
        }}
      >
        <Image
          src={`${BASE_PATH}/assets/jungle_dawn_bg.png`}
          alt="Jungle sunrise background río Mayo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF3E8]/80 via-transparent to-[#FAF3E8]" />
      </motion.div>


      {/* ── MAIN CONTENT ── */}
      <main className="relative z-20 flex flex-col items-center w-full transform-style:preserve-3d px-4 sm:px-6">

        {/* ═══ HERO ═══ */}
        <section className="flex flex-col items-center text-center w-full max-w-2xl mx-auto min-h-screen justify-center py-20 relative z-20">
          <FadeSection>
            {/* Celestial Moon Button for smooth scroll */}
            <div className="flex justify-center mb-8">
              <motion.button
                onClick={scrollToStory}
                className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-black/40 border animate-moon-glow cursor-pointer"
                style={{
                  borderColor: "var(--dynamic-gold)",
                  boxShadow: "0 10px 15px -3px var(--dynamic-gold-glow)",
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Scroll to Story"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="sm:w-[32px] sm:h-[32px]" style={{ color: "var(--dynamic-gold)" }}>
                  <path
                    d="M12 3c.132 0 .263 0 .393.007a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 3z"
                    fill="currentColor"
                  />
                  <polygon points="16,6 16.7,7.5 18.2,7.7 17.1,8.7 17.5,10.2 16,9.3 14.5,10.2 14.9,8.7 13.8,7.7 15.3,7.5" fill="#FFF" className="animate-pulse" />
                </svg>
              </motion.button>
            </div>
            <p
              className="text-xs sm:text-sm uppercase tracking-[0.35em] mb-4 drop-shadow-md dyn-text-gold font-medium animate-text-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ✦ {t("hero.subtitle")} ✦
            </p>
          </FadeSection>

          <FadeSection delay={0.15}>
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] mb-2 dyn-text-body font-normal">
              {t("hero.invite")}
            </p>
          </FadeSection>

          <FadeSection delay={0.3}>
            <h2
              className="text-base sm:text-xl uppercase tracking-[0.22em] mb-1 font-semibold dyn-text-title drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] animate-white-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("hero.title")}
            </h2>
            <h1
              className="text-3xl sm:text-6xl md:text-7xl mb-4 drop-shadow-[0_2px_10px_rgba(232,200,107,0.45)] animate-text-glow"
              style={{ color: "var(--dynamic-gold)", fontFamily: "var(--font-script)" }}
            >
              <RevealText text={t("hero.cursiveTitle")} delay={0.2} />
            </h1>
          </FadeSection>

          <FadeSection delay={0.45} className="flex flex-col items-center w-full">
            <h2
              className="text-4xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-2 dyn-text-title animate-white-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RevealText text="Jason" delay={0.4} />
            </h2>
            <span
              className="text-3xl sm:text-5xl block mb-2 font-medium animate-text-glow"
              style={{ color: "var(--dynamic-gold)", fontFamily: "var(--font-script)" }}
            >
              &
            </span>
            <h2
              className="text-4xl sm:text-7xl md:text-8xl font-bold tracking-tight dyn-text-title animate-white-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RevealText text="María" delay={0.6} />
            </h2>
          </FadeSection>

          <FadeSection delay={0.6}>
            <div className="my-6">
              <GoldDiamond />
            </div>
            <p
              className="text-xs sm:text-base uppercase tracking-[0.2em] font-semibold dyn-text-gold animate-text-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("hero.date")}
            </p>
          </FadeSection>

          <FadeSection delay={0.75}>
            <p className="text-xs sm:text-sm mt-8 italic max-w-sm dyn-text-body font-normal leading-relaxed px-4">
              {t("hero.tagline")}
            </p>
          </FadeSection>

          <FadeSection delay={0.85}>
            <motion.button
              onClick={scrollToStory}
              className="mt-12 cursor-pointer"
              style={{ color: "var(--dynamic-gold)" }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-xl sm:text-2xl animate-text-glow">
                ↓
              </span>
            </motion.button>
          </FadeSection>
        </section>


        {/* ═══ QUOTE ═══ */}
        <section className="section-spacing flex flex-col items-center text-center w-full max-w-2xl mx-auto relative z-20">
          <ScrollingSparkles count={5} />
          <FadeSection>
            <div
              style={{
                backgroundColor: "var(--dynamic-card-bg)",
                borderColor: "var(--dynamic-card-border)",
                boxShadow: "0 10px 30px -10px var(--dynamic-shadow)"
              }}
              className="relative p-6 sm:p-12 rounded-3xl border backdrop-blur-md max-w-xl mx-auto shadow-2xl overflow-hidden group transition-all duration-300"
            >
              {/* Shimmer highlighting line */}
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-[var(--dynamic-gold)]/10 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
              
              <blockquote
                className="text-lg sm:text-2xl leading-relaxed italic dyn-text-title font-normal"
                style={{ fontFamily: "var(--font-body)" }}
              >
                &ldquo;{t("quote.text")}&rdquo;
              </blockquote>
              <p className="mt-5 text-sm sm:text-base font-semibold tracking-wider dyn-text-gold uppercase animate-text-glow">
                {t("quote.author")}
              </p>
            </div>
          </FadeSection>
          <FadeSection delay={0.25} className="w-full flex justify-center">
            <div className="w-full max-w-sm mt-4">
              <SacredGeometry3D />
            </div>
          </FadeSection>
        </section>

        <GoldSeparator />


        {/* ═══ STORY ═══ */}
        <section ref={storyRef} className="section-spacing flex flex-col items-center text-center w-full max-w-3xl mx-auto relative z-20 scroll-mt-20">
          <ScrollingSparkles count={10} />
          <FadeSection>
            <p
              className="text-sm sm:text-base uppercase tracking-[0.25em] mb-2 dyn-text-gold animate-text-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("story.intro")}
            </p>
            <h2
              className="text-2xl sm:text-5xl mb-4 dyn-text-title font-semibold animate-white-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RevealText text={t("story.title")} />
            </h2>
            <span className="text-xl dyn-text-gold block animate-pulse animate-text-glow">
              ♡
            </span>
          </FadeSection>

          <FadeSection delay={0.15}>
            <p className="mt-6 text-sm sm:text-lg leading-relaxed max-w-xl dyn-text-body font-normal px-2">
              {t("story.description")}
            </p>
          </FadeSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 w-full">
            <FadeSection delay={0.25}>
              <TiltCard className="w-full">
                <div className="glass-card p-5 sm:p-8 text-center h-full">
                  <h3
                    className="text-xl sm:text-3xl mb-3 dyn-text-title font-semibold animate-white-glow"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {t("story.mariaTitle")}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed dyn-text-body font-normal">
                    {t("story.mariaDesc")}
                  </p>
                </div>
              </TiltCard>
            </FadeSection>
            
            <FadeSection delay={0.4}>
              <TiltCard className="w-full">
                <div className="glass-card p-5 sm:p-8 text-center h-full">
                  <h3
                    className="text-xl sm:text-3xl mb-3 dyn-text-title font-semibold animate-white-glow"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {t("story.jasonTitle")}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed dyn-text-body font-normal">
                    {t("story.jasonDesc")}
                  </p>
                </div>
              </TiltCard>
            </FadeSection>
          </div>

          <FadeSection delay={0.5}>
            <p className="mt-10 text-sm sm:text-lg italic max-w-lg dyn-text-gold font-light leading-relaxed px-4">
              {t("story.jointSpace")}
            </p>
          </FadeSection>
        </section>

        <GoldSeparator />


        {/* ═══ CEREMONY DETAILS ═══ */}
        <section className="section-spacing flex flex-col items-center text-center w-full max-w-3xl mx-auto relative z-20">
          <ScrollingSparkles count={8} />
          <FadeSection>
            <p
              className="text-sm sm:text-base uppercase tracking-[0.25em] mb-2 dyn-text-gold animate-text-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("ceremony.title")}
            </p>
            <h2
              className="text-2xl sm:text-5xl mb-12 dyn-text-title font-semibold animate-white-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RevealText text={t("ceremony.subtitle")} />
            </h2>
          </FadeSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            <FadeSection delay={0.1}>
              <CeremonyCard
                iconSrc={`${BASE_PATH}/assets/icon_calendar.png`}
                iconAlt="Calendar"
                title={t("ceremony.dateTitle")}
                description={t("ceremony.dateDesc")}
                detail={t("ceremony.dateDetail")}
              />
            </FadeSection>
            
            <FadeSection delay={0.2}>
              <CeremonyCard
                iconSrc={`${BASE_PATH}/assets/icon_clock.png`}
                iconAlt="Clock"
                title={t("ceremony.timeTitle")}
                description={t("ceremony.timeDesc")}
                detail={t("ceremony.timeDetail")}
              />
            </FadeSection>
            
            <FadeSection delay={0.3}>
              <CeremonyCard
                iconSrc={`${BASE_PATH}/assets/icon_location.png`}
                iconAlt="Location"
                title={t("ceremony.locationTitle")}
                description={t("ceremony.locationDesc")}
                detail={t("ceremony.locationDetail")}
              />
            </FadeSection>
            
            <FadeSection delay={0.4}>
              <CeremonyCard
                iconSrc={`${BASE_PATH}/assets/icon_dresscode.png`}
                iconAlt="Dress code"
                title={t("ceremony.dressTitle")}
                description={t("ceremony.dressDesc")}
                detail={t("ceremony.dressDetail")}
                extraDetail={t("ceremony.dressWarning")}
              />
            </FadeSection>
          </div>

          {/* Google Maps Integration (Updated to User Coordinates) */}
          <FadeSection delay={0.45} className="w-full mt-6 sm:mt-8">
            <TiltCard className="w-full">
              <div className="glass-card p-4 sm:p-6 flex flex-col gap-4">
                <h4
                  className="text-xs uppercase tracking-[0.25em] font-semibold text-center animate-text-glow dyn-text-gold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t("ceremony.locationTitle")} Map
                </h4>
                <div className="w-full h-64 sm:h-[350px] overflow-hidden rounded-2xl border dark-map-container shadow-inner" style={{ borderColor: "var(--dynamic-card-border)" }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.7320279626783!2d-76.46418542500697!3d-6.539289293453549!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91b0a135413dac8b%3A0x95984b4f1f7fe36e!2sESTERO%20DEL%20RIO%20MAYO!5e1!3m2!1ses-419!2spe!4v1779552329184!5m2!1ses-419!2spe"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <p className="text-xs sm:text-sm text-center dyn-text-body leading-relaxed font-normal">
                  {t("ceremony.locationDesc")} — {t("ceremony.locationDetail")}
                </p>
              </div>
            </TiltCard>
          </FadeSection>

          <FadeSection delay={0.55}>
            <p className="mt-12 text-sm sm:text-lg italic max-w-md dyn-text-body font-normal leading-relaxed px-4">
              {t("ceremony.giftNote")}
            </p>
          </FadeSection>
        </section>

        <GoldSeparator />


        {/* ═══ COUNTDOWN ═══ */}
        <section className="section-spacing flex flex-col items-center text-center w-full max-w-2xl mx-auto relative z-20">
          <ScrollingSparkles count={5} />
          <FadeSection>
            <p
              className="text-sm sm:text-base uppercase tracking-[0.25em] mb-2 dyn-text-gold animate-text-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("countdown.title")}
            </p>
            <h2
              className="text-2xl sm:text-5xl mb-10 dyn-text-title font-semibold animate-white-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RevealText text={t("countdown.subtitle")} />
            </h2>
          </FadeSection>
          
          <FadeSection delay={0.2}>
            <Countdown />
          </FadeSection>
        </section>

        <GoldSeparator />


        {/* ═══ SACRED ELEMENTS / PLANTS ═══ */}
        <section className="section-spacing flex flex-col items-center text-center w-full max-w-4xl mx-auto relative z-20">
          <ScrollingSparkles count={8} />
          <FadeSection>
            <p
              className="text-sm sm:text-base uppercase tracking-[0.25em] mb-2 dyn-text-gold animate-text-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("elements.title")}
            </p>
            <h2
              className="text-2xl sm:text-5xl mb-12 dyn-text-title font-semibold animate-white-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RevealText text={t("elements.subtitle")} />
            </h2>
          </FadeSection>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 w-full">
            <FadeSection delay={0.1}>
              <PlantCard
                imageSrc={`${BASE_PATH}/assets/ayahuasca_liana.png`}
                name={t("elements.ayahuascaName")}
                description={t("elements.ayahuascaDesc")}
              />
            </FadeSection>
            
            <FadeSection delay={0.25}>
              <PlantCard
                imageSrc={`${BASE_PATH}/assets/chacruna_leaves.png`}
                name={t("elements.chacrunaName")}
                description={t("elements.chacrunaDesc")}
              />
            </FadeSection>
            
            <FadeSection delay={0.4}>
              <PlantCard
                imageSrc={`${BASE_PATH}/assets/bobinsana_flower.png`}
                name={t("elements.bobinsanaName")}
                description={t("elements.bobinsanaDesc")}
              />
            </FadeSection>
          </div>
        </section>

        <GoldSeparator />


        {/* ═══ RSVP / WHATSAPP FORM ═══ */}
        <section className="section-spacing flex flex-col items-center text-center w-full max-w-xl mx-auto pb-32 relative z-20">
          <ScrollingSparkles count={6} />
          <FadeSection>
            <p
              className="text-sm sm:text-base uppercase tracking-[0.25em] mb-2 dyn-text-gold animate-text-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("rsvp.title")}
            </p>
            <h2
              className="text-2xl sm:text-5xl mb-10 dyn-text-title font-semibold animate-white-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RevealText text={t("rsvp.subtitle")} />
            </h2>
          </FadeSection>

          <FadeSection delay={0.2} className="w-full">
            <form
              id="rsvp-form"
              onSubmit={handleSubmit}
              className="glass-card p-6 sm:p-10 w-full flex flex-col gap-6 text-left relative overflow-hidden"
            >
              {/* Gold top vine ornament */}
              <div className="flex justify-center mb-1">
                <svg width="80" height="24" viewBox="0 0 80 24" fill="none" style={{ color: "var(--dynamic-gold)" }} className="opacity-80">
                  <path
                    d="M40 4 C 32 12, 22 14, 6 14 M40 4 C 48 12, 58 14, 74 14 M40 4 L 40 22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="40" cy="4" r="2.5" fill="currentColor" className="animate-pulse" />
                  <circle cx="6" cy="14" r="1.5" fill="currentColor" />
                  <circle cx="74" cy="14" r="1.5" fill="currentColor" />
                </svg>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="guest-name"
                  className="text-sm uppercase tracking-[0.2em] font-semibold dyn-text-gold animate-text-glow"
                >
                  {t("rsvp.nameLabel")}
                </label>
                <input
                  id="guest-name"
                  type="text"
                  required
                  placeholder={t("rsvp.namePlaceholder")}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="px-4 py-3.5 rounded-xl border border-[var(--dynamic-card-border)] bg-[var(--dynamic-card-bg)] text-[var(--dynamic-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dynamic-gold)]/40 focus:border-[var(--dynamic-gold)]/40 transition-all font-normal placeholder:text-[var(--dynamic-text)]/60"
                />
              </div>

              {/* Attendance Selection Custom Grid */}
              <div className="flex flex-col gap-3">
                <span className="text-sm uppercase tracking-[0.2em] font-semibold dyn-text-gold animate-text-glow">
                  {t("rsvp.attendanceLabel")}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Yes Card */}
                  <div
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, attendance: "yes" }))
                    }
                    className={`relative flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 border select-none ${
                      formData.attendance === "yes"
                        ? "border-[var(--dynamic-gold)] shadow-[0_0_15px_rgba(232,200,107,0.18)] bg-[var(--dynamic-card-bg)]/80"
                        : "border-[var(--dynamic-card-border)] hover:border-[var(--dynamic-gold)]/40 bg-[var(--dynamic-card-bg)]/45"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🌿</span>
                      <span className="text-base font-semibold dyn-text-title leading-tight">
                        {t("rsvp.yes")}
                      </span>
                    </div>
                    <div
                      className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        formData.attendance === "yes"
                          ? "border-[var(--dynamic-gold)] bg-[var(--dynamic-gold)]"
                          : "border-[var(--dynamic-text)]/40 bg-transparent"
                      }`}
                    >
                      {formData.attendance === "yes" && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          className="text-black stroke-[3.5px] stroke-current"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* No Card */}
                  <div
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, attendance: "no" }))
                    }
                    className={`relative flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 border select-none ${
                      formData.attendance === "no"
                        ? "border-[var(--dynamic-gold)] shadow-[0_0_15px_rgba(232,200,107,0.18)] bg-[var(--dynamic-card-bg)]/80"
                        : "border-[var(--dynamic-card-border)] hover:border-[var(--dynamic-gold)]/40 bg-[var(--dynamic-card-bg)]/45"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">✨</span>
                      <span className="text-base font-semibold dyn-text-title leading-tight">
                        {t("rsvp.no")}
                      </span>
                    </div>
                    <div
                      className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        formData.attendance === "no"
                          ? "border-[var(--dynamic-gold)] bg-[var(--dynamic-gold)]"
                          : "border-[var(--dynamic-text)]/40 bg-transparent"
                      }`}
                    >
                      {formData.attendance === "no" && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          className="text-black stroke-[3.5px] stroke-current"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="guest-message"
                  className="text-sm uppercase tracking-[0.2em] font-semibold dyn-text-gold animate-text-glow"
                >
                  {t("rsvp.messageLabel")}
                </label>
                <textarea
                  id="guest-message"
                  rows={3}
                  placeholder={t("rsvp.messagePlaceholder")}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="px-4 py-3 rounded-xl border border-[var(--dynamic-card-border)] bg-[var(--dynamic-card-bg)] text-[var(--dynamic-text)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--dynamic-gold)]/40 focus:border-[var(--dynamic-gold)]/40 transition-all font-normal placeholder:text-[var(--dynamic-text)]/60"
                />
              </div>

              {/* Submit Button */}
              <button
                id="rsvp-submit"
                type="submit"
                className="mt-2 py-4 px-6 rounded-full text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(232,200,107,0.35)] cursor-pointer dyn-btn-gold flex items-center justify-center gap-3 font-semibold"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="shrink-0"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.118-2.905-6.993-1.876-1.875-4.357-2.904-6.996-2.904-5.438 0-9.863 4.421-9.867 9.867-.001 1.702.461 3.361 1.336 4.8l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.021-.963-.263-.099-.455-.149-.648.149-.193.297-.748.963-.918 1.16-.17.197-.341.222-.638.074-.297-.149-1.253-.462-2.386-1.472-.882-.787-1.478-1.759-1.651-2.056-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.648-1.561-.888-2.138-.233-.562-.471-.485-.648-.494-.167-.008-.36-.01-.553-.01-.193 0-.507.073-.772.36-.265.287-1.01.987-1.01 2.406s1.026 2.793 1.17 2.991c.144.198 2.01 3.069 4.87 4.307.68.294 1.21.469 1.623.6.683.217 1.302.186 1.793.113.547-.081 1.758-.718 2.005-1.411.247-.693.247-1.287.173-1.411z" />
                </svg>
                <span>{t("rsvp.submit")}</span>
              </button>
            </form>
          </FadeSection>

          {/* Yin Yang symbol */}
          <FadeSection delay={0.3}>
            <div className="mt-16 w-24 h-24 relative opacity-40 animate-slow-rotate" style={{ filter: "drop-shadow(0 0 10px var(--dynamic-gold-glow))" }}>
              <Image
                src={`${BASE_PATH}/assets/yinyang_symbol.png`}
                alt="Yin Yang Symbol"
                fill
                className="object-contain filter invert opacity-90"
                sizes="96px"
              />
            </div>
          </FadeSection>

          <FadeSection delay={0.4}>
            <p
              className="mt-8 text-sm uppercase tracking-[0.25em] dyn-text-gold animate-text-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Jason & María · 2027
            </p>
          </FadeSection>
        </section>
      </main>
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ShoppingBasket,
  BarChart3,
  Globe2,
  Activity,
  Lock,
  ArrowRight,
  Building2,
  Coins,
  Briefcase,
  Landmark,
  TrendingUp,
  Heart,
  GitBranch,
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const bgPattern = "/landing/bg-pattern.png";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const HERO_WORDS = ["Smart Strategies", "Cross-chain RWA", "Portfolio Health", "Privacy Layer"];

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black font-[Bakbak_One] text-lg text-[24px]">H</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            Harbor<span className="text-indigo-600">Yield</span>
          </span>
        </Link>
      </div>
    </nav>
  );
};

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = HERO_WORDS[index];
    const typeSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === currentWord) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % HERO_WORDS.length);
      } else {
        setDisplayText(
          currentWord.substring(0, displayText.length + (isDeleting ? -1 : 1))
        );
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index]);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url(${bgPattern})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-slate-200 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
              LIVE ON TESTNET
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Build diversified tokenized RWA-portfolio with{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 font-mono">
              [{displayText}]
              <span className="animate-pulse text-slate-400">|</span>
            </span>
          </h1>

          <h2 className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto font-light">
            Invest safely and track the health of your portfolio.
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group"
            >
              Launch App
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all border border-slate-200 shadow-sm flex items-center justify-center gap-2"
            >
              <Globe2 className="w-4 h-4" />
              Explore Assets
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="mt-16 border-y border-slate-200/60 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-sm font-medium text-slate-500 mb-6 uppercase tracking-widest">
            Trusted Asset Classes
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {[
              { icon: Building2, label: "Real Estate" },
              { icon: Landmark, label: "Treasuries" },
              { icon: Coins, label: "Commodities" },
              { icon: Briefcase, label: "Private Credit" },
              { icon: TrendingUp, label: "Equities" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-slate-600">
                <Icon className="w-6 h-6" />
                <span className="font-semibold text-lg">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <div className="bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-full text-xs font-mono border border-slate-700 shadow-2xl flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full" />
          HackMoney 2026
        </div>
      </div>
    </section>
  );
};

const ValueProp = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            A supermarket of all public <br />
            <span className="text-indigo-600">on-chain tokenized RWA</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShoppingBasket size={200} />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-8 text-indigo-600">
                <ShoppingBasket size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">One-Click Basket</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Collect a diversified basket of tokenized RWAs in just a few clicks. Mix real estate,
                treasury bills, and private credit into a single transaction.
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 overflow-hidden text-white"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-white">
              <Activity size={200} />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white backdrop-blur-sm">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Unified Dashboard</h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                Track all assets from all chains in one place. Monitor yield, risk metrics, and
                portfolio performance with institutional-grade clarity.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Benefits = () => {
  const cards = [
    {
      title: "Portfolio Health Score",
      desc: "Valuation-driven insights.",
      highlight: "Higher score - better investment results.",
      icon: Heart,
      color: "bg-pink-500",
    },
    {
      title: "Cross-chain RWA Supermarket",
      desc: "Invest in EVM-based RWAs without chain-switching friction.",
      highlight: "Seamless multi-chain experience.",
      icon: GitBranch,
      color: "bg-indigo-600",
    },
    {
      title: "Smart investment strategies",
      desc: "Institutional-level pre-built strategies tailored to risk tolerance.",
      highlight: "Professional-grade portfolios.",
      icon: TrendingUp,
      color: "bg-blue-500",
    },
    {
      title: "Private layer for all RWAs",
      desc: "Native privacy for trading/investing powered by Oasis Network.",
      highlight: "Confidential transactions.",
      icon: Lock,
      color: "bg-emerald-600",
    },
  ];

  return (
    <section className="relative py-24 bg-slate-50 border-t border-slate-200 overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url(${bgPattern})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Why invest with Harbor<span className="text-indigo-600">Yield</span>?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const content = (
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center mb-6", card.color)}>
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 font-mono">{card.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed mb-2">{card.desc}</p>
                <p className="text-indigo-600 text-base font-semibold font-mono">{card.highlight}</p>
              </motion.div>
            );

            return card.href ? (
              <Link key={idx} href={card.href} className="block">
                {content}
              </Link>
            ) : (
              <div key={idx}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
            <span className="text-white font-black font-mono text-xs">H</span>
          </div>
          <p className="text-slate-900 font-bold">HarborYield</p>
        </div>

        <p className="text-slate-400 text-sm font-mono">Ethereum HackMoney 2026</p>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main>
        <Hero />
        <ValueProp />
        <Benefits />
      </main>
      <Footer />

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

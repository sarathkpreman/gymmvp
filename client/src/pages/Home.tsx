import { Link, Navigate } from "react-router-dom";
import {
  Zap,
  Target,
  Calendar,
  ArrowRight,
  Sparkles,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { useAuth } from "../components/context/AuthContext";

/* ─── Animation configs ───────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

/* ─── Data ───────────────────────────── */
const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Plans",
    description:
      "Training programs generated from your goals, recovery, and schedule — not templates.",
  },
  {
    icon: Target,
    title: "Goal-Specific Programming",
    description:
      "Hypertrophy, fat loss, or strength — volume and intensity optimized automatically.",
  },
  {
    icon: Calendar,
    title: "Adaptive Scheduling",
    description:
      "Train 2–6 days/week. Your plan reshapes itself around your availability.",
  },
  {
    icon: Clock,
    title: "Time Optimised",
    description:
      "No wasted volume. Maximum results within your available time window.",
  },
];

export default function Home() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ─── HERO ───────────────── */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">

        {/* Animated background glow */}
        <div className="absolute inset-0 flex justify-center -z-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="w-[700px] h-[400px] bg-accent/10 blur-[140px] rounded-full"
          />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur mb-8"
          >
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted">
              AI Training Engine
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
          >
            Stop guessing your workouts.
            <br />
            <span className="text-accent">
              Train with a system.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10"
          >
            Generate structured, science-based gym plans tailored to your goals,
            schedule, and experience — and automatically adapt as you progress.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/onboarding">
              <Button size="lg" className="h-14 px-8 text-lg gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link to="/auth/sign-in">
              <Button variant="secondary" size="lg" className="h-14 px-8">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p
            variants={fadeUp}
            className="text-xs text-muted mt-6"
          >
            No credit card required · Setup in under 60 seconds
          </motion.p>
        </motion.div>
      </section>

      {/* ─── FEATURES ───────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto border border-border rounded-2xl overflow-hidden">

          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`flex flex-col md:flex-row gap-6 p-8 transition-all duration-300 hover:bg-accent/5
              ${i !== features.length - 1 ? "border-b border-border" : ""}`}
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent/10 shrink-0">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted max-w-md">
                  {feature.description}
                </p>
              </div>

              {/* Right hint */}
              <div className="hidden md:flex items-center text-xs text-muted">
                Optimised →
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── MINI CTA ───────────────── */}
      <section className="px-6 pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your training should adapt to you.
          </h2>

          <p className="text-muted mb-8">
            Not the other way around.
          </p>

          <Link to="/onboarding">
            <Button size="lg" className="h-14 px-10">
              Build My Plan
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
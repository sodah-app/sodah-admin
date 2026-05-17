"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* ================================
   IMAGE ASSETS
================================ */
const SLIDES = [
  "https://res.cloudinary.com/djnjhphf5/image/upload/v1777199318/ChatGPT_Image_Apr_26_2026_02_27_51_PM_lre1jb.png",
  "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1600&auto=format&fit=crop",
];

const TRUSTED_LOGOS = [
  {
    name: "WhatsApp",
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
  },
  {
    name: "Meta",
    src: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png",
  },
  {
    name: "OpenAI",
    src: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
    invert: true,
  },
  {
    name: "Google",
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "Stripe",
    src: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Stripe_Logo%2C_revised_2016.svg",
    invert: true,
  },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Replies",
    desc: "Respond to every customer within seconds.",
  },
  {
    icon: "📅",
    title: "Smart Booking",
    desc: "Automatically schedule appointments.",
  },
  {
    icon: "🔁",
    title: "Follow-ups",
    desc: "Convert more leads with automated reminders.",
  },
  {
    icon: "🌍",
    title: "Multi-language",
    desc: "Support customers in multiple languages.",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    desc: "Track messages, bookings, and revenue.",
  },
  {
    icon: "🤖",
    title: "Human-like AI",
    desc: "Natural responses that feel real.",
  },
];

const TESTIMONIALS = [
  {
    name: "Dr. Aisha Khan",
    role: "Medical Clinic",
    text: "We increased bookings by 40% in just two weeks.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Omar Al Mansoori",
    role: "Auto Sales",
    text: "No more missed WhatsApp messages. Everything runs automatically.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sara Al Suwaidi",
    role: "Beauty Salon",
    text: "The smartest investment we made for our business.",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const USE_CASES = [
  "🏥 Clinics & Hospitals",
  "💇 Salons & Spas",
  "🚗 Car Dealerships",
  "🏠 Real Estate",
  "🍽 Restaurants",
  "🛍 Retail Stores",
];

/* ================================
   HOME PAGE
================================ */
export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSignup = () => {
    router.push("/signup");
  };

  const openAIChat = () => {
    window.open(
      "https://solomon-n8n.duckdns.org/webhook/a7935547-15a5-4742-8ac0-b8fab937d44c/chat",
      "_blank"
    );
  };

  return (
    <main className="bg-[#03130f] text-white overflow-x-hidden">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#03130f]/85 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/djnjhphf5/image/upload/v1777199318/ChatGPT_Image_Apr_26_2026_02_27_51_PM_lre1jb.png"
              alt="Sodah"
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h1 className="font-bold text-xl">sodah.io</h1>
              <p className="text-xs text-gray-400">AI WhatsApp Automation</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#demo" className="hover:text-white transition">
              Demo
            </a>
            <a href="#testimonials" className="hover:text-white transition">
              Reviews
            </a>
            <a href="#contact" className="hover:text-white transition">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center">
        {/* Background slideshow */}
        <div className="absolute inset-0">
          {SLIDES.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Slide ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ${
                currentSlide === index
                  ? "opacity-100 scale-110"
                  : "opacity-0 scale-100"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#03130f]/95 via-[#03130f]/75 to-[#03130f]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-400/20 text-green-300 text-sm mb-6">
                🚀 Trusted WhatsApp Automation Platform
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                Automate Your{" "}
                <span className="text-green-400">WhatsApp</span>
                <br />
                Grow Your Business.
              </h1>

              <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                AI-powered replies, smart booking, and automated follow-ups that
                help you respond instantly, book more appointments, and close
                more deals 24/7.
              </p>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-3 mt-8">
                {[
                  "⚡ Instant Replies",
                  "📅 Smart Booking",
                  "🤖 24/7 AI",
                  "📈 More Conversions",
                ].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Trusted logos */}
              <div className="mt-10">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-4">
                  Trusted with technologies from
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  {TRUSTED_LOGOS.map((logo) => (
                    <img
                      key={logo.name}
                      src={logo.src}
                      alt={logo.name}
                      className={`h-6 opacity-80 hover:opacity-100 transition ${
                        logo.invert ? "invert" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(34,197,94,0.2)]">
                <img
                  src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1400&auto=format&fit=crop"
                  alt="Automation dashboard"
                  className="w-full h-[580px] object-cover animate-slowZoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-green-500 text-black px-5 py-3 rounded-2xl font-bold shadow-2xl animate-bounce">
                +40% More Bookings
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST METRICS ================= */}
      <section className="py-14 bg-[#071d17] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Metric title="152K+" subtitle="Messages Automated" />
          <Metric title="3.8K+" subtitle="Bookings Made" />
          <Metric title="10K+" subtitle="Active Users" />
          <Metric title="98%" subtitle="Client Satisfaction" />
        </div>
      </section>

      {/* ================= PROBLEM SECTION ================= */}
      <section className="min-h-screen flex items-center px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1400&auto=format&fit=crop"
            alt="Business team"
            className="rounded-3xl shadow-2xl border border-white/10 animate-float"
          />

          <div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              Still Replying to Messages Manually?
            </h2>

            <p className="mt-6 text-gray-300 text-lg leading-relaxed">
              Every delayed reply means lost leads, missed bookings, and wasted
              time. Let AI answer instantly and convert more customers while you
              focus on running your business.
            </p>

            <ul className="mt-8 space-y-4 text-gray-200">
              <li>✔ Instant replies in seconds</li>
              <li>✔ Smart follow-ups that convert</li>
              <li>✔ Automatic appointment booking</li>
              <li>✔ 24/7 customer support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= CHAT DEMO ================= */}
      <section
        id="demo"
        className="min-h-screen flex items-center bg-[#071d17] px-6 md:px-12 py-20"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              AI Conversations That Feel Human
            </h2>

            <p className="mt-6 text-gray-300 text-lg leading-relaxed">
              Our AI asks questions, qualifies customers, and books appointments
              automatically through WhatsApp.
            </p>
          </div>

          <div className="bg-[#0a231d] rounded-3xl border border-white/10 p-6 shadow-2xl">
            <ChatBubble incoming text="Hi there 👋 Welcome to our clinic!" />
            <ChatBubble outgoing text="I am feeling headache." />
            <ChatBubble incoming text="When did the headache start?" />
            <ChatBubble outgoing text="Two days ago 🤕" />
            <ChatBubble incoming text="We can book you for a consultation tomorrow at 11:00 AM." />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="min-h-screen flex items-center px-6 md:px-12 py-20"
      >
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-6">
            Everything You Need to Scale
          </h2>

          <p className="text-center text-gray-400 max-w-3xl mx-auto mb-14 text-lg">
            One platform to automate conversations, schedule appointments,
            follow up with leads, and grow revenue.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section className="min-h-screen flex items-center bg-[#071d17] px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-14">
            Perfect for Every Business
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {USE_CASES.map((item) => (
              <div
                key={item}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-lg font-semibold hover:border-green-400/30 hover:bg-white/10 transition"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section
        id="testimonials"
        className="min-h-screen flex items-center px-6 md:px-12 py-20"
      >
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-14">
            Loved by Businesses
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section
        id="contact"
        className="min-h-screen flex items-center justify-center px-6 md:px-12 py-20 bg-gradient-to-br from-[#0b2a21] via-[#062218] to-[#03130f]"
      >
        <div className="max-w-4xl text-center">
          <h2 className="text-5xl md:text-7xl font-black leading-tight">
            Ready to Automate Your Business?
          </h2>

          <p className="mt-6 text-xl text-gray-300 leading-relaxed">
            Start converting every WhatsApp conversation into real revenue.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {TRUSTED_LOGOS.map((logo) => (
              <img
                key={logo.name}
                src={logo.src}
                alt={logo.name}
                className={`h-8 opacity-80 ${logo.invert ? "invert" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= FLOATING CTA (ONLY ONE) ================= */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={goToSignup}
          className="px-10 py-4 rounded-full font-bold text-lg bg-white text-[#03130f] shadow-[0_20px_60px_rgba(255,255,255,0.25)] hover:scale-105 transition animate-bounce"
        >
          🚀 Start Free Trial
        </button>
      </div>

      {/* ================= FLOATING AI BUTTON ================= */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openAIChat}
          className="relative w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 text-black text-2xl font-bold shadow-[0_0_40px_rgba(34,197,94,0.5)] hover:scale-110 transition"
          aria-label="Chat with AI"
        >
          🤖
          <span className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping" />
        </button>
      </div>

      {/* ================= GLOBAL ANIMATIONS ================= */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes slowZoom {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.06);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-slowZoom {
          animation: slowZoom 12s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}

/* ================================
   COMPONENTS
================================ */

function Metric({ title, subtitle }) {
  return (
    <div>
      <h3 className="text-3xl md:text-4xl font-black text-green-400">
        {title}
      </h3>
      <p className="text-gray-400 mt-2 text-sm md:text-base">{subtitle}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-green-400/20 transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, role, text, img }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
      <div className="flex items-center gap-4 mb-5">
        <img
          src={img}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
      <p className="text-gray-300 leading-relaxed">“{text}”</p>
    </div>
  );
}

function ChatBubble({ text, incoming = false, outgoing = false }) {
  const isIncoming = incoming || !outgoing;

  return (
    <div className={`flex mb-4 ${isIncoming ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow ${
          isIncoming
            ? "bg-white text-black rounded-bl-md"
            : "bg-green-500 text-black rounded-br-md font-medium"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
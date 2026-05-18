"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Generate floating AI bubbles once
  const bubbles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: 30 + Math.random() * 120,
        left: Math.random() * 100,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 10,
        opacity: 0.08 + Math.random() * 0.12,
      })),
    []
  );

  // If user is already logged in with Supabase, send to welcome page
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/welcome");
      }
    };

    checkSession();
  }, [router]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/welcome`,
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    }
  };

  // Email/Password Login + Signup
  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      alert("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login with Supabase
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) {
          alert(error.message);
        } else {
          router.push("/welcome");
        }
      } else {
        // Sign up with Supabase
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: `${window.location.origin}/welcome`,
          },
        });

        if (error) {
          alert(error.message);
        } else {
          alert(
            "Account created successfully! Please check your email to confirm your account."
          );
          router.push("/subscription");
        }
      }
    } catch (error) {
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background + Floating AI Bubbles */}
      <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-green-50 via-emerald-100 to-cyan-100">
        {/* Animated Bubbles */}
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full border border-emerald-300/30 bg-gradient-to-br from-white/40 to-emerald-200/10 backdrop-blur-sm"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              bottom: `-${bubble.size}px`,
              opacity: bubble.opacity,
              animation: `floatUp ${bubble.duration}s linear ${bubble.delay}s infinite`,
              boxShadow: "0 0 30px rgba(16, 185, 129, 0.08)",
            }}
          />
        ))}

        {/* Soft glowing blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-300/20 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300/20 blur-3xl rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-green-400/10 blur-3xl rounded-full" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white/60">
          {/* Logo / Title */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🤖</div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              AI-powered automation for your business.
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition duration-200 mb-4 shadow-sm disabled:opacity-60"
          >
            {loading ? "Please wait..." : "🔵 Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            className="w-full p-3 mb-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleChange}
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            className="w-full p-3 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleChange}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-600 transition duration-200 shadow-lg disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Log In"
              : "Create Account"}
          </button>

          {/* Toggle Login / Signup */}
          <p className="text-center mt-5 text-sm text-gray-600">
            {isLogin
              ? "Don’t have an account?"
              : "Already have an account?"}{" "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-700 cursor-pointer font-semibold hover:underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </span>
          </p>
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-50vh) scale(1.08);
          }
          100% {
            transform: translateY(-110vh) scale(0.95);
          }
        }
      `}</style>
    </>
  );
}
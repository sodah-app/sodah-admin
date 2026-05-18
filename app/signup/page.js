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

  // Background images that slowly fade/zoom
  const backgroundImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1674027392845-0f3f8f4dbb3d?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1684369175803-4b6a0d8dfe8f?auto=format&fit=crop&w=2000&q=80",
    ],
    []
  );

  const [activeBg, setActiveBg] = useState(0);

  // Change background every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBg((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Redirect if already logged in
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

  // Email/Password Login & Signup
  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      alert("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
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
      {/* Animated AI Background */}
      <div className="fixed inset-0 overflow-hidden">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ${
              activeBg === index ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
              animation: activeBg === index ? "slowZoom 10s ease-in-out" : "none",
            }}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-emerald-900/55 to-cyan-900/65" />

        {/* Decorative glows */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full animate-pulse" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg mb-4">
              <span className="text-3xl">⚡</span>
            </div>

            <h1 className="text-4xl font-extrabold text-white">
              {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
            </h1>

            <p className="text-white/80 mt-2 text-sm">
              AI-powered automation for your business.
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-white to-gray-100 text-gray-800 py-3.5 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300 disabled:opacity-60 mb-5"
          >
            {/* Official Google SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-6 h-6"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.651 32.657 29.226 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.276 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.276 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.176 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.145 35.091 26.715 36 24 36c-5.204 0-9.617-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.084 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>

            <span>
              {loading ? "Please wait..." : "Continue with Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/70 text-sm">or continue with email</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 p-3.5 rounded-2xl mb-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 p-3.5 rounded-2xl mb-5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
          />

          {/* Login / Signup Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500 text-white py-3.5 rounded-2xl font-bold shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300 disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Log In"
              : "Create Account"}
          </button>

          {/* Toggle */}
          <p className="text-center mt-5 text-sm text-white/80">
            {isLogin
              ? "Don’t have an account?"
              : "Already have an account?"}{" "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-emerald-300 font-semibold cursor-pointer hover:text-emerald-200 hover:underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </span>
          </p>
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes slowZoom {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
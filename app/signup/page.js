"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (isLogin) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (
        user &&
        user.email === form.email &&
        user.password === form.password
      ) {
        router.push("/welcome");
      } else {
        alert("Invalid login");
      }
    } else {
      localStorage.setItem("user", JSON.stringify(form));
      router.push("/subscription");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">

      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-lg">

        <h1 className="text-2xl font-bold text-center mb-4">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h1>

        <input
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-lg border"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg border"
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
        >
          {isLogin ? "Log In" : "Create Account"}
        </button>

        <p className="text-center mt-4 text-sm">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-700 cursor-pointer font-semibold"
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>

      </div>
    </div>
  );
}
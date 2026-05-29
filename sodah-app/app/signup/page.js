"use client";

import { useState } from "react";

export default function SignupPage() {

  const [form, setForm] = useState({
    business_name: "",
    owner_name: "",
    email: "",
    phone: "",
    industry: "",
    services: "",
    location: ""
  });
const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    alert(
      "Business onboarding coming next 🚀"
    );

    console.log(form);
  };

  return (

    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Create Your AI Business
        </h1>

        <p className="text-zinc-400 mb-10">
          Connect your WhatsApp business AI assistant.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <input
            type="text"
            name="business_name"
            placeholder="Business Name"
            value={form.business_name}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
            required
          />

          <input
            type="text"
            name="owner_name"
            placeholder="Owner Name"
            value={form.owner_name}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="WhatsApp Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
            required
          />

          <input
            type="text"
            name="industry"
            placeholder="Industry"
            value={form.industry}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
          />

          <textarea
            name="services"
            placeholder="Services Offered"
            value={form.services}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 h-32"
          />

          <input
            type="text"
            name="location"
            placeholder="Business Location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
          />

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 transition p-4 rounded-xl font-bold"
          >
            Create AI Business
          </button>

        </form>

      </div>

    </main>
  );
}
"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export default function DashboardPage() {

  const [businesses, setBusinesses] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchBusinesses();

  }, []);

  const fetchBusinesses = async () => {

    try {

      const {
        data,
        error
      } = await supabase
        .from("businesses")
        .select("*")
        .order("created_at", {
          ascending: false
        });

      if (error) {

        console.error(error);

        return;
      }

      setBusinesses(data || []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  return (

    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-bold">
              Sodah Dashboard
            </h1>

            <p className="text-zinc-400 mt-2">
              Manage all AI businesses
            </p>

          </div>

          <a
            href="/signup"
            className="bg-green-500 px-6 py-3 rounded-xl font-bold"
          >
            Add Business
          </a>

        </div>

        {
          loading ? (

            <p>
              Loading businesses...
            </p>

          ) : businesses.length === 0 ? (

            <div className="bg-zinc-900 p-10 rounded-2xl border border-zinc-800">

              <p className="text-zinc-400">
                No businesses found.
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {
                businesses.map((business) => (

                  <div
                    key={business.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
                  >

                    <h2 className="text-2xl font-bold">
                      {business.business_name}
                    </h2>

                    <p className="text-zinc-400 mt-2">
                      {business.industry}
                    </p>

                    <div className="mt-6 space-y-2 text-sm">

                      <p>
                        <span className="text-zinc-500">
                          Business ID:
                        </span>
                        {" "}
                        {business.business_id}
                      </p>

                      <p>
                        <span className="text-zinc-500">
                          Owner:
                        </span>
                        {" "}
                        {business.owner_name}
                      </p>

                      <p>
                        <span className="text-zinc-500">
                          Email:
                        </span>
                        {" "}
                        {business.email}
                      </p>

                      <p>
                        <span className="text-zinc-500">
                          Phone:
                        </span>
                        {" "}
                        {business.phone}
                      </p>

                    </div>

                    <button
                      className="mt-6 w-full bg-green-500 hover:bg-green-600 transition p-3 rounded-xl font-bold"
                    >
                      Open Dashboard
                    </button>

                  </div>
                ))
              }

            </div>
          )
        }

      </div>

    </main>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setBusinesses(data || []);
    } else {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Businesses
        </h1>

        <p
          style={{
            color: "#94a3b8",
          }}
        >
          Manage all registered AI businesses
        </p>
      </div>

      {/* TABLE */}

      <div
        style={{
          background: "#111827",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid #1f2937",
        }}
      >
        {/* TABLE HEADER */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr 1fr 1fr 1fr",
            padding: "18px 25px",
            fontWeight: "bold",
            color: "#94a3b8",
            borderBottom: "1px solid #1f2937",
          }}
        >
          <div>Business</div>
          <div>Industry</div>
          <div>Phone</div>
          <div>Status</div>
          <div>Profile</div>
        </div>

        {/* TABLE BODY */}

        <div
          style={{
            maxHeight: "650px",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "30px",
              }}
            >
              Loading...
            </div>
          ) : businesses.length === 0 ? (
            <div
              style={{
                padding: "30px",
              }}
            >
              No businesses found
            </div>
          ) : (
            businesses.map((business) => (
              <div
                key={business.id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "2fr 1fr 1fr 1fr 1fr",
                  padding: "20px 25px",
                  borderBottom:
                    "1px solid #1f2937",
                  alignItems: "center",
                }}
              >
                {/* BUSINESS */}

                <div>
                  {business.business_name ||
                    business.full_name ||
                    "Unnamed"}
                </div>

                {/* INDUSTRY */}

                <div>
                  {business.industry ||
                    "Unknown"}
                </div>

                {/* PHONE */}

                <div>
                  {business.ai_number ||
                    "No Number"}
                </div>

                {/* STATUS */}

                <div>
                  <span
                    style={{
                      background:
                        business.status === "active"
                          ? "#052e16"
                          : "#3f1d1d",

                      color:
                        business.status === "active"
                          ? "#4ade80"
                          : "#f87171",

                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "14px",
                    }}
                  >
                    {business.status ||
                      "offline"}
                  </span>
                </div>

                {/* PROFILE */}

                <Link
                  href={`/admin/businesses/${business.id}`}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    textAlign: "center",
                    width: "100px",
                  }}
                >
                  Open
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
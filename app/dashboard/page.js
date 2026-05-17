"use client";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [activePage, setActivePage] = useState("Dashboard");
  const [loading, setLoading] = useState(true);

  const businessId =
    typeof window !== "undefined"
      ? localStorage.getItem("business_id") || "BIZ_002"
      : "BIZ_002";

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        appointmentsResult,
        customersResult,
      ] = await Promise.all([
        supabase
          .from("appointments")
          .select("*")
          .eq("business_id", businessId)
          .order("created_at", { ascending: false }),

        supabase
          .from("customers")
          .select("*")
          .eq("business_id", businessId)
          .order("created_at", { ascending: false }),
      ]);

      if (appointmentsResult.error) {
        throw appointmentsResult.error;
      }

      if (customersResult.error) {
        throw customersResult.error;
      }

      const normalizedAppointments = (
        appointmentsResult.data || []
      ).map((item) => ({
        ...item,
        Name:
          item.customer_name ||
          item.name ||
          "Unknown",
        Phone:
          item.customer_phone ||
          item.phone ||
          "No phone",
        Date:
          item.appointment_date || "",
        Time:
          item.appointment_time || "",
        Appointment_status:
          item.status || "Pending",
        Query:
          item.notes || "",
        query:
          item.notes || "",
        lead_status:
          item.lead_status || "new",
      }));

      const normalizedCustomers = (
        customersResult.data || []
      ).map((item) => ({
        ...item,
        Name:
          item.name || "Unknown",
        Phone:
          item.phone || "No phone",
        Query:
          item.customer_message ||
          item.query ||
          "",
        query:
          item.customer_message ||
          item.query ||
          "",
        lead_status:
          item.lead_status || "new",
      }));

      setAppointments(normalizedAppointments);
      setCustomers(normalizedCustomers);
    } catch (err) {
      console.error(
        "Dashboard Supabase fetch error:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  // Initial load only once
  fetchData();

  // Background refresh every 4 seconds WITHOUT showing loading screen
  const interval = setInterval(async () => {
    try {
      const [
        appointmentsResult,
        customersResult,
      ] = await Promise.all([
        supabase
          .from("appointments")
          .select("*")
          .eq("business_id", businessId)
          .order("created_at", { ascending: false }),

        supabase
          .from("customers")
          .select("*")
          .eq("business_id", businessId)
          .order("created_at", { ascending: false }),
      ]);

      if (
        appointmentsResult.error ||
        customersResult.error
      ) {
        return;
      }

      const normalizedAppointments = (
        appointmentsResult.data || []
      ).map((item) => ({
        ...item,
        Name:
          item.customer_name ||
          item.name ||
          "Unknown",
        Phone:
          item.customer_phone ||
          item.phone ||
          "No phone",
        Date:
          item.appointment_date || "",
        Time:
          item.appointment_time || "",
        Appointment_status:
          item.status || "Pending",
        Query:
          item.notes || "",
        query:
          item.notes || "",
        lead_status:
          item.lead_status || "new",
      }));

      const normalizedCustomers = (
        customersResult.data || []
      ).map((item) => ({
        ...item,
        Name:
          item.name || "Unknown",
        Phone:
          item.phone || "No phone",
        Query:
          item.customer_message ||
          item.query ||
          "",
        query:
          item.customer_message ||
          item.query ||
          "",
        lead_status:
          item.lead_status || "new",
      }));

      // Update silently in background
      setAppointments(normalizedAppointments);
      setCustomers(normalizedCustomers);
    } catch (error) {
      console.error(
        "Background refresh error:",
        error
      );
    }
  }, 4000);

  return () => clearInterval(interval);
}, []);
  // ======================================================
  // MAIN STATS
  // ======================================================
  const total = appointments.length;

  const booked = appointments.filter(
    (a) =>
      String(a.Appointment_status || "")
        .toLowerCase()
        .trim() === "booked"
  ).length;

  const pending = appointments.filter(
    (a) =>
      String(a.Appointment_status || "")
        .toLowerCase()
        .trim() === "pending"
  ).length;

  // ======================================================
  // PIE CHART DATA
  // ======================================================
  const pieData = [
    { name: "Booked", value: booked },
    { name: "Pending", value: pending },
  ];

  // ======================================================
  // WEEKLY CHAT ACTIVITY (MON → SUN)
  // ======================================================
  const activityData = useMemo(() => {
    const weeklyActivity = [
      { name: "Mon", value: 0 },
      { name: "Tue", value: 0 },
      { name: "Wed", value: 0 },
      { name: "Thu", value: 0 },
      { name: "Fri", value: 0 },
      { name: "Sat", value: 0 },
      { name: "Sun", value: 0 },
    ];

    const dayMap = {
      1: 0, // Mon
      2: 1, // Tue
      3: 2, // Wed
      4: 3, // Thu
      5: 4, // Fri
      6: 5, // Sat
      0: 6, // Sun
    };

    appointments.forEach((item) => {
      const rawDate =
        item.created_at ||
        item.Date ||
        null;

      if (!rawDate) return;

      const date = new Date(rawDate);

      if (isNaN(date.getTime())) return;

      const jsDay = date.getDay();
      const index = dayMap[jsDay];

      if (index !== undefined) {
        weeklyActivity[index].value += 1;
      }
    });

    return weeklyActivity;
  }, [appointments]);

  // ======================================================
  // UNIQUE CUSTOMERS
  // ======================================================
  const uniqueCustomers = useMemo(() => {
    const merged = [
      ...customers,
      ...appointments,
    ];

    return Array.from(
      new Map(
        merged.map((item) => [
          item.Phone ||
            item.phone ||
            `temp-${Math.random()}`,
          item,
        ])
      ).values()
    );
  }, [customers, appointments]);

  // ======================================================
  // NEW LEADS
  // ======================================================
  const newLeads = uniqueCustomers.filter(
    (customer) => {
      const status = String(
        customer.lead_status ||
          customer.leadStatus ||
          "new"
      ).toLowerCase();

      return status.includes("new");
    }
  );

  // ======================================================
  // HOT LEADS
  // ======================================================
  const hotLeads = uniqueCustomers.filter(
    (customer) => {
      const status = String(
        customer.lead_status ||
          customer.leadStatus ||
          ""
      ).toLowerCase();

      const query = String(
        customer.query ||
          customer.Query ||
          customer.customer_message ||
          ""
      ).toLowerCase();

      return (
        status.includes("hot") ||
        query.includes("price") ||
        query.includes("book") ||
        query.includes("appointment") ||
        query.includes("today") ||
        query.includes("available")
      );
    }
  );

  // ======================================================
  // LOADING
  // ======================================================
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-400 items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          Loading dashboard...
        </div>
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="flex h-screen bg-gray-400">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}
      <div className="w-60 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-4 flex flex-col">
        <h2 className="font-bold text-lg mb-6">Sodah.io</h2>

        <SidebarItem
          title="Dashboard"
          active={activePage === "Dashboard"}
          onClick={() => setActivePage("Dashboard")}
        />

        <SidebarItem
          title="Bookings"
          active={activePage === "Bookings"}
          onClick={() => setActivePage("Bookings")}
        />

        <SidebarItem
          title="Customers"
          active={activePage === "Customers"}
          onClick={() => setActivePage("Customers")}
        />

        <SidebarItem
          title="New Leads"
          active={activePage === "New Leads"}
          onClick={() => setActivePage("New Leads")}
        />

        <SidebarItem
          title="Hot Leads"
          active={activePage === "Hot Leads"}
          onClick={() => setActivePage("Hot Leads")}
        />

        <SidebarItem
          title="Calendar"
          active={activePage === "Calendar"}
          onClick={() => setActivePage("Calendar")}
        />

        <SidebarItem
          title="Reports"
          active={activePage === "Reports"}
          onClick={() => setActivePage("Reports")}
        />

        <SidebarItem
          title="Settings"
          active={activePage === "Settings"}
          onClick={() => setActivePage("Settings")}
        />

        {/* BOTTOM */}
        <div className="mt-auto">
          <AILiveIndicator />

          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded text-center text-xs mt-4 mb-4">
            🤖 AI Assistant Active
          </div>

          <div
            className="text-red-400 cursor-pointer"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Logout
          </div>
        </div>
      </div>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="flex-1 p-6 overflow-hidden">
        {/* DASHBOARD */}
        {activePage === "Dashboard" && (
          <>
            <div className="flex justify-between mb-4">
              <h1 className="text-xl font-bold">
                Dashboard
              </h1>
              <p>Welcome back</p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <Card
                title="Total Bookings"
                value={total}
                color="blue"
              />
              <Card
                title="Booked"
                value={booked}
                color="green"
              />
              <Card
                title="Pending"
                value={pending}
                color="yellow"
              />
              <Card
                title="Success %"
                value={
                  total
                    ? `${Math.round(
                        (booked / total) * 100
                      )}%`
                    : "0%"
                }
                color="purple"
              />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* BOOKING STATUS */}
              <div className="bg-white p-3 rounded-xl shadow">
                <h3 className="text-xs font-semibold mb-1">
                  Booking Status
                </h3>

                <ResponsiveContainer
                  width="100%"
                  height={120}
                >
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={45}
                      outerRadius={60}
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#facc15" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* WEEKLY CHAT ACTIVITY */}
              <div className="bg-white p-3 rounded-xl shadow">
                <h3 className="text-xs font-semibold mb-1">
                  Weekly Chat Activity
                </h3>

                <ResponsiveContainer
                  width="100%"
                  height={120}
                >
                  <BarChart data={activityData}>
                    <XAxis
                      dataKey="name"
                      fontSize={10}
                    />
                    <YAxis hide />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="#3b82f6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <AppointmentsTable
              appointments={appointments}
            />
          </>
        )}

        {/* BOOKINGS */}
        {activePage === "Bookings" && (
          <AppointmentsTable
            appointments={appointments}
            full
          />
        )}

        {/* CUSTOMERS */}
        {activePage === "Customers" && (
          <CustomersTable
            customers={uniqueCustomers}
            title="Customers"
          />
        )}

        {/* NEW LEADS */}
        {activePage === "New Leads" && (
          <CustomersTable
            customers={newLeads}
            title="New Leads"
            statusLabel="New Lead"
            statusColor="text-blue-600"
          />
        )}

        {/* HOT LEADS */}
        {activePage === "Hot Leads" && (
          <CustomersTable
            customers={hotLeads}
            title="Hot Leads"
            statusLabel="🔥 Hot Lead"
            statusColor="text-red-600 font-bold"
          />
        )}

        {/* CALENDAR */}
        {activePage === "Calendar" && (
          <iframe
            src="https://calendar.google.com/calendar/embed?src=en.ae%23holiday%40group.v.calendar.google.com"
            className="w-full h-full border rounded-xl"
          />
        )}

        {/* REPORTS */}
        {activePage === "Reports" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-bold mb-4">
              Daily Report
            </h2>

            <p>Total Bookings: {total}</p>
            <p>Booked: {booked}</p>
            <p>Pending: {pending}</p>
            <p>New Leads: {newLeads.length}</p>
            <p>Hot Leads: {hotLeads.length}</p>

            <textarea
              className="w-full mt-4 p-2 border rounded"
              placeholder="Write report..."
            />

            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Download Report
            </button>
          </div>
        )}

        {/* SETTINGS */}
        {activePage === "Settings" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-bold">
              Settings
            </h2>
            <p>
              System settings already configured.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AILiveIndicator() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>

      <p className="text-xs text-gray-300 mt-3">
        AI is responding...
      </p>

      <style jsx>{`
        .dot {
          width: 8px;
          height: 8px;
          background: #38bdf8;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }

          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

function SidebarItem({
  title,
  active,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`px-3 py-2 rounded-md cursor-pointer text-sm mb-1 ${
        active
          ? "bg-green-500 text-white"
          : "hover:bg-white/10"
      }`}
    >
      {title}
    </div>
  );
}

function Card({ title, value, color }) {
  const styles = {
    blue: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    green:
      "bg-gradient-to-r from-green-500 to-green-600 text-white",
    yellow:
      "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
    purple:
      "bg-gradient-to-r from-purple-500 to-indigo-600 text-white",
  };

  return (
    <div
      className={`p-4 rounded-xl ${styles[color]}`}
    >
      <p className="text-xs">{title}</p>
      <h3 className="text-xl font-bold">
        {value}
      </h3>
    </div>
  );
}

function CustomersTable({
  customers,
  title,
  statusLabel,
  statusColor = "text-gray-700",
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow h-full overflow-y-auto">
      <h2 className="font-bold mb-4 text-lg">
        {title}
      </h2>

      <div className="grid grid-cols-4 text-sm font-bold bg-gray-300 px-3 py-2 rounded mb-2">
        <div>#</div>
        <div>Name</div>
        <div>Phone</div>
        <div>
          {statusLabel ? "Status" : "Query"}
        </div>
      </div>

      {customers.map((customer, index) => (
        <div
          key={index}
          className={`grid grid-cols-4 px-3 py-2 text-sm ${
            index % 2 === 0
              ? "bg-gray-100"
              : "bg-white"
          }`}
        >
          <div className="text-gray-500">
            {index + 1}
          </div>

          <div className="font-medium">
            {customer.Name || "Unknown"}
          </div>

          <div>
            {customer.Phone || "No phone"}
          </div>

          <div className={statusColor}>
            {statusLabel ||
              customer.query ||
              customer.Query ||
              "No query"}
          </div>
        </div>
      ))}
    </div>
  );
}

function AppointmentsTable({
  appointments,
  full,
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow p-4 flex flex-col ${
        full ? "h-full" : "h-[380px]"
      }`}
    >
      <h3 className="text-sm font-semibold mb-2">
        Appointment Bookings
      </h3>

      <div className="grid grid-cols-6 text-xs font-bold bg-blue-200 px-2 py-2 rounded">
        <div>#</div>
        <div>Name</div>
        <div>Phone</div>
        <div>Date</div>
        <div>Time</div>
        <div>Status</div>
      </div>

      <div
        className={`overflow-y-auto mt-2 ${
          full ? "flex-1" : ""
        }`}
      >
        {appointments.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-6 text-sm px-2 ${
              index % 2 === 0
                ? "bg-gray-200"
                : "bg-white"
            }`}
            style={{
              height: "40px",
              alignItems: "center",
            }}
          >
            <div>{index + 1}</div>
            <div>{item.Name}</div>
            <div>{item.Phone}</div>
            <div>{item.Date}</div>
            <div>{item.Time}</div>
            <div>
              {item.Appointment_status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">

      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Chats</p>
          <h2 className="text-2xl font-bold">124</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Bookings</p>
          <h2 className="text-2xl font-bold">32</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Active Automations</p>
          <h2 className="text-2xl font-bold">5</h2>
        </div>

      </div>

      {/* 🔥 ACTIVITY */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Recent Activity</h3>

        <ul className="space-y-2 text-gray-600">
          <li>✅ New WhatsApp lead received</li>
          <li>📅 Booking created for tomorrow</li>
          <li>🤖 Automation replied to user</li>
        </ul>
      </div>

      {/* 🔥 QUICK ACTIONS */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Quick Actions</h3>

        <div className="flex gap-3 flex-wrap">
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Connect WhatsApp
          </button>

          <button className="bg-black text-white px-4 py-2 rounded">
            Create Automation
          </button>

          <button className="border px-4 py-2 rounded">
            View Analytics
          </button>
        </div>
      </div>

    </div>
  );
}
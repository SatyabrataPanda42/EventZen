import React, { useMemo } from "react";
import {
  Users,
  Calendar,
  ClipboardList,
  DollarSign,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/**
 * CUSTOM TOOLTIP COMPONENT
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-xl rounded-lg border border-slate-100 outline-none">
        <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-lg font-bold text-slate-900">
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

// --- MAIN COMPONENT ---
export default function AdminDashboard({
  attendees = [],
  bookings = [],
  events = [],
  venues = [],
}) {
  // ✅ DATA CALCULATIONS (Logic preserved from original)
  const totalAttendees = attendees.length;
  const totalBookings = bookings.length;

  const totalEvents = useMemo(() => {
    return new Set(bookings.map((b) => b.eventId)).size;
  }, [bookings]);

  const totalVenues = venues.length || 0;
  const totalEarnings = totalAttendees * 500;

  // ✅ REVENUE TREND DATA
  const revenueData = useMemo(() => {
    const map = {};
    (bookings || []).forEach((b) => {
      if (!b.createdAt) return;
      const date = new Date(b.createdAt);
      const day = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
      if (!map[day]) map[day] = 0;
      map[day] += 500;
    });

    const data = Object.keys(map).map((d) => ({ name: d, revenue: map[d] }));
    // Sort by date if possible, otherwise return map
    return data.length > 0 ? data : [{ name: "No Data", revenue: 0 }];
  }, [bookings]);

  // ✅ CATEGORY DISTRIBUTION
  const categoryData = useMemo(() => {
    const map = {};
    const eventMap = {};
    (events || []).forEach((e) => {
      const id = e.id || e.eventId;
      const name = e.title || e.name;
      eventMap[id] = name;
    });

    (bookings || []).forEach((b) => {
      const key = eventMap[b.eventId] || `Event ${b.eventId}`;
      map[key] = (map[key] || 0) + 1;
    });

    const total = bookings.length || 1;
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

    return Object.keys(map).map((k, i) => ({
      name: k,
      value: map[k],
      percent: Math.round((map[k] / total) * 100),
      color: colors[i % colors.length],
    }));
  }, [bookings, events]);

  return (
    <div className=" bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      <div className="space-y-8">
        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <StatCard
            label="Total Earnings"
            value={`₹${totalEarnings.toLocaleString("en-IN")}`}
            icon={DollarSign}
            color="indigo"
            trend="+12.5%"
            isUp={true}
          />
          <StatCard
            label="Attendees"
            value={totalAttendees.toLocaleString()}
            icon={Users}
            color="blue"
            trend="+8.2%"
            isUp={true}
          />
          <StatCard
            label="Venues"
            value={totalVenues}
            icon={MapPin}
            color="orange"
            trend="Active"
            isUp={true}
          />
          <StatCard
            label="Live Events"
            value={totalEvents}
            icon={Calendar}
            color="emerald"
            trend="+2"
            isUp={true}
          />
          <StatCard
            label="Bookings"
            value={totalBookings}
            icon={ClipboardList}
            color="rose"
            trend="-3%"
            isUp={false}
          />
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* REVENUE AREA CHART */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp size={18} className="text-indigo-500" />
                  Revenue Growth
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track daily income from event bookings
                </p>
              </div>
              <select className="bg-slate-50 border-none text-xs font-bold text-slate-600 rounded-md px-3 py-1.5 outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
              </select>
            </div>
            <div className="p-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DISTRIBUTION PIE CHART */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Event Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of bookings by event
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={8}
                      stroke="none"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          cornerRadius={4}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* LEGEND LIST */}
              <div className="w-full space-y-3 mt-4">
                {categoryData.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-600 font-medium truncate max-w-[120px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {item.percent}%
                    </span>
                  </div>
                ))}
                {categoryData.length === 0 && (
                  <p className="text-center text-slate-400 text-sm italic py-4">
                    No events found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ ENHANCED STAT CARD
function StatCard({ label, value, icon: Icon, color, trend, isUp }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    rose: "bg-rose-50 text-rose-600 ring-rose-100",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-xl ring-4 ${colorMap[color]} transition-transform group-hover:scale-110 duration-300`}
        >
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <div
          className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
        >
          {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-500 mb-1">{label}</p>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {value}
        </h2>
      </div>
    </div>
  );
}

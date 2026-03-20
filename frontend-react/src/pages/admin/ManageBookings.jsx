import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  User,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Inbox,
  RotateCcw,
  ChevronRight,
  AlertCircle,
  Edit2,
  Trash2,
  Search,
  Bell,
  Plus,
} from "lucide-react";

// Defining SERVICES locally to prevent import resolution errors in this environment
import { SERVICES } from "../../api/services";

// --- Internal UI Components ---

const StyledCard = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const ActionButton = ({
  onClick,
  variant = "primary",
  children,
  className = "",
}) => {
  const variants = {
    primary:
      "bg-[#3b82f6] hover:bg-blue-600 text-white shadow-lg shadow-blue-100",
    outline: "border border-gray-200 hover:bg-gray-50 text-gray-700",
    danger: "text-red-400 hover:text-red-500 hover:bg-red-50",
  };

  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 active:scale-95 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Main Component ---

export default function ManageBookings({
  bookings = [],
  handleUpdateStatus = (id, status) =>
    console.log(`Updating ${id} to ${status}`),
  api = { get: async () => ({ data: [] }) },
}) {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all necessary data
  useEffect(() => {
    const fetchAll = async () => {
      if (!api || !api.get) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [eventRes, venueRes, userRes] = await Promise.all([
          api.get(`${SERVICES.EVENT}/events`).catch(() => ({ data: [] })),
          api.get(`${SERVICES.VENUE}/venues`).catch(() => ({ data: [] })),
          api.get(`${SERVICES.USER}/auth/users`).catch(() => ({ data: [] })),
        ]);

        setEvents(eventRes.data || []);
        setVenues(venueRes.data || []);
        setUsers(userRes.data || []);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [api]);

  // ================= DATA MAPPING =================

  const eventMap = useMemo(() => {
    const map = {};
    (events || []).forEach((e) => {
      const id = Number(e.id || e.eventId);
      map[id] = e;
    });
    return map;
  }, [events]);

  const venueMap = useMemo(() => {
    const map = {};
    (venues || []).forEach((v) => {
      const id = Number(v.id || v.venueId);
      map[id] = v.name || v.venueName || v.title;
    });
    return map;
  }, [venues]);

  const userMap = useMemo(() => {
    const map = {};
    (users || []).forEach((u) => {
      const id = u.id || u._id;
      map[id] = u.name || u.username || u.email;
    });
    return map;
  }, [users]);

  const getStatusTheme = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "CANCELLED":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-4">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-50 rounded-[2.5rem] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="">
      <div className="">
        <p className="text-sm font-medium text-gray-400 mb-8 uppercase">
          {bookings.length} total requests
        </p>

        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className=" border-2 border-dashed border-gray-100 rounded-[3rem] py-24 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-3xl mb-4">
                <Inbox className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                No Requests to Display
              </p>
            </div>
          ) : (
            [...bookings]
              .sort((a, b) => b.id - a.id)
              .map((b) => {
                const isProcessed =
                  b.status === "CANCELLED" || b.status === "CONFIRMED";
                const eventId = Number(b.eventId || b.event_id);
                const userId = b.userId || b.user_id;
                const event = eventMap[eventId];
                const eventName =
                  event?.name || event?.title || "Unknown Event";
                const venueId = Number(event?.venueId || event?.venue_id);
                const venueName = venueMap[venueId] || "TBD";
                const userName = userMap[userId] || "Anonymous Customer";

                return (
                  <StyledCard key={b.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      {/* Left: Content Block */}
                      <div className="flex items-center gap-6 flex-1">
                        {/* Status-aware Icon Box */}
                        <div
                          className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 border transition-colors ${
                            b.status === "CANCELLED"
                              ? "bg-gray-50 text-gray-200 border-gray-100"
                              : "bg-[#eff6ff] text-[#3b82f6] border-blue-50"
                          }`}
                        >
                          <Calendar className="w-8 h-8" />
                        </div>

                        {/* Text Details */}
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3
                              className={`text-2xl font-black tracking-tight ${b.status === "CANCELLED" ? "text-gray-300 line-through" : "text-gray-900"}`}
                            >
                              {eventName}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider border ${getStatusTheme(b.status)}`}
                            >
                              {b.status || "PENDING"}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-bold">
                            <div className="flex items-center gap-2 text-indigo-500">
                              <User className="w-4 h-4" />
                              <span className="text-gray-700">{userName}</span>
                              <span className="text-gray-400 font-medium text-xs">
                                #{userId?.toString().slice(-4)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-500">
                              <Clock className="w-4 h-4" />
                              <span className="text-gray-500">
                                {event?.date || "No Date"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-500">
                              <MapPin className="w-4 h-4" />
                              <span className="text-gray-500">{venueName}</span>
                            </div>
                          </div>

                          {event?.description && (
                            <p className="text-sm text-gray-400 italic mt-1 line-clamp-1">
                              "{event.description}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                        {!isProcessed ? (
                          <>
                            <ActionButton
                              onClick={() =>
                                handleUpdateStatus(b.id, "CONFIRMED")
                              }
                            >
                              Approve
                            </ActionButton>
                            <ActionButton
                              variant="danger"
                              onClick={() =>
                                handleUpdateStatus(b.id, "CANCELLED")
                              }
                            >
                              <Trash2 className="w-5 h-5" />
                            </ActionButton>
                          </>
                        ) : (
                          <ActionButton
                            variant="outline"
                            onClick={() => handleUpdateStatus(b.id, "PENDING")}
                          >
                            <RotateCcw className="w-4 h-4" />
                            Reset Status
                          </ActionButton>
                        )}
                      </div>
                    </div>
                  </StyledCard>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}

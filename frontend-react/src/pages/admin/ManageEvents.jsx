import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Trash2,
  MapPin,
  Edit3,
  AlertCircle,
  Clock,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

// --- Improved Local UI Components for the enhanced look ---
const StyledCard = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${className}`}
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
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-blue-100",
    outline: "border border-gray-200 hover:bg-gray-50 text-gray-700",
    danger:
      "text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
import { SERVICES } from "../../api/services";
export default function ManageEvents({
  events = [],
  user = { role: "user", id: null },
  setEditingEvent,
  setActiveTab,
  api,
  fetchData,
}) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const getVenueId = (item) => item?.venue_id || item?.venueId;

  // ✅ Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      if (!api) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`${SERVICES.VENUE}/venues`);
        if (res && res.data) {
          setVenues(res.data);
        }
      } catch (err) {
        console.error("Venue fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [api, SERVICES.VENUE]);

  // ✅ Create venue map
  const venueMap = useMemo(() => {
    const map = {};
    (venues || []).forEach((v) => {
      const id = Number(v.id || v.venueId);
      const name = v.name || v.venueName || v.title;
      map[id] = name;
    });
    return map;
  }, [venues]);

  const filteredEvents = (events || []).filter(
    (e) => user.role === "admin" || (e.created_by || e.createdBy) === user.id,
  );

  const handleDelete = async (e) => {
    if (!api) {
      console.error("API client not available for deletion");
      return;
    }

    // Custom modal logic would be better, but sticking to standard behavior as requested
    if (
      !window.confirm(
        `Are you sure you want to delete "${e.name}"? This action cannot be undone.`,
      )
    )
      return;
    try {
      await api.delete(`${SERVICES.EVENT}/events/${e.id}`);
      if (fetchData) fetchData();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between px-2">
        <div>
          <p className="text-sm font-medium text-gray-400 uppercase">
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1 ? "event" : "events"} total
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredEvents.map((e) => {
          const venueId = Number(getVenueId(e));
          const venueName = venueMap[venueId] || "Unknown Venue";

          return (
            <StyledCard key={e.id}>
              <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left Section: Event Info */}
                <div className="flex items-start gap-5">
                  <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xl text-gray-900 leading-tight">
                        {e.name}
                      </h3>
                      {user.role === "admin" && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] uppercase tracking-wider font-bold rounded-full">
                          Admin View
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{e.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span>{venueName}</span>
                      </div>
                    </div>

                    {e.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-1 max-w-lg italic">
                        "{e.description}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <ActionButton
                    variant="outline"
                    className="flex-1 md:flex-none"
                    onClick={() => {
                      setEditingEvent(e);
                      setActiveTab("edit-event");
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </ActionButton>

                  <ActionButton
                    variant="danger"
                    className="px-3"
                    onClick={() => handleDelete(e)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </ActionButton>
                </div>
              </div>
            </StyledCard>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && filteredEvents.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-16 px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4">
            <AlertCircle className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No events found
          </h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-2">
            You haven't created any events yet or don't have permission to
            manage existing ones.
          </p>
          <button
            onClick={() => setActiveTab("add-event")}
            className="mt-6 text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
          >
            Create your first event <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading Skeleton Placeholder */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}
    </div>
  );
}

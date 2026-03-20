import { useState, useEffect, useMemo } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { SERVICES } from "../../api/services";

export default function MyBookings({
  bookings = [],
  setSelectedBooking,
  setActiveTab,
  handleCancelBooking,
  handleUpdateStatus,
  user,
  api,
}) {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);

  // ✅ Fetch events and venues
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get(`${SERVICES.EVENT}/events`);
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };

    const fetchVenues = async () => {
      try {
        const res = await api.get(`${SERVICES.VENUE}/venues`);
        setVenues(res.data);
      } catch (err) {
        console.error("Failed to fetch venues", err);
      }
    };

    fetchEvents();
    fetchVenues();
  }, [api]);

  // ✅ eventId → event object
  const eventMap = useMemo(() => {
    const map = {};
    (events || []).forEach((e) => {
      const id = Number(e.id || e.eventId);
      map[id] = e;
    });
    return map;
  }, [events]);

  // ✅ venueId → venue name
  const venueMap = useMemo(() => {
    const map = {};
    (venues || []).forEach((v) => {
      const id = Number(v.id || v.venueId);
      map[id] = v.name || v.venueName || v.title;
    });
    return map;
  }, [venues]);

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {bookings.map((b) => {
            const isCancelled = b.status === "CANCELLED";
            const eventId = Number(b.event_id || b.eventId);
            const event = eventMap[eventId];
            const venueId = Number(event?.venue_id || event?.venueId);

            const eventName = event?.name || event?.title || "Unknown Event";
            const venueName = venueMap[venueId] || "Unknown Venue";
            const eventDate = event?.date ? new Date(event.date) : null;

            // Status styling helper
            const getStatusStyles = (status) => {
              switch (status?.toUpperCase()) {
                case "CONFIRMED":
                  return "bg-green-500 text-white";
                case "CANCELLED":
                  return "bg-red-500 text-white";
                default:
                  return "bg-yellow-400 text-white";
              }
            };

            return (
              <div
                key={b.id}
                className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 flex flex-col transition-all hover:shadow-xl"
              >
                {/* HEADER SECTION (Visual Area) */}
                <div
                  className={`relative h-44 flex items-center justify-center overflow-hidden ${isCancelled ? "bg-gray-100" : "bg-[#F0F5FF]"}`}
                >
                  {/* Decorative Pattern */}
                  <svg
                    className="absolute inset-0 w-full h-full text-blue-100 opacity-40"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <rect
                      x="10"
                      y="10"
                      width="20"
                      height="20"
                      rx="4"
                      fill="currentColor"
                    />
                    <rect
                      x="70"
                      y="60"
                      width="30"
                      height="30"
                      rx="8"
                      fill="currentColor"
                    />
                  </svg>

                  {/* Booking Icon */}
                  <svg
                    className={`w-16 h-16 relative z-10 ${isCancelled ? "text-gray-300" : "text-blue-200"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>

                  {/* Date Badge */}
                  {eventDate && (
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-white/50 flex flex-col items-center min-w-[60px]">
                      <span className="text-[#2563EB] font-black text-xs uppercase">
                        {eventDate.toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-gray-800 font-bold text-lg leading-tight">
                        {eventDate.getDate()}
                      </span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute bottom-6 left-6">
                    <span
                      className={`${getStatusStyles(b.status)} text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider`}
                    >
                      {b.status || "Pending"}
                    </span>
                  </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="p-8 flex-grow">
                  <h3
                    className={`text-2xl font-bold mb-2 leading-tight ${isCancelled ? "text-gray-400 line-through" : "text-[#1E293B]"}`}
                  >
                    {eventName}
                  </h3>

                  <div className="flex items-center text-blue-400 mb-6">
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="text-sm font-medium">{venueName}</span>
                  </div>

                  {isCancelled ? (
                    <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-center font-bold text-sm border border-red-100 mb-2">
                      This booking has been cancelled
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {/* CUSTOMER ACTIONS */}
                      {user.role === "customer" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setActiveTab("attendee-mgmt");
                            }}
                            className="flex-grow bg-white border-2 border-gray-100 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.487 4.49a3 3 0 11-5.974 0 3 3 0 015.974 0z"
                              />
                            </svg>
                            Manage Guests
                          </button>
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-500 p-4 rounded-2xl transition-colors"
                            title="Cancel Booking"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </>
                      )}

                      {/* ADMIN ACTIONS */}
                      {user.role === "admin" && (
                        <div className="flex w-full gap-3">
                          <button
                            onClick={() =>
                              handleUpdateStatus(b.id, "CONFIRMED")
                            }
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-green-100 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(b.id, "CANCELLED")
                            }
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-red-100 transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {/* VENDOR ACTIONS */}
                      {user.role === "vendor" && (
                        <div className="flex w-full gap-3">
                          <button
                            onClick={() =>
                              handleUpdateStatus(b.id, "CONFIRMED")
                            }
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-100 transition-all"
                          >
                            Confirm Booking
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(b.id, "CANCELLED")
                            }
                            className="flex-1 bg-white border-2 border-red-100 text-red-500 font-bold py-3.5 rounded-2xl hover:bg-red-50 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <div className="bg-white p-8 rounded-full shadow-sm mb-6 border border-gray-50">
            <svg
              className="w-16 h-16 opacity-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="italic text-xl">You don't have any bookings yet.</p>
          <button
            onClick={() => setActiveTab("events")}
            className="mt-6 text-blue-600 font-bold hover:underline bg-blue-50 px-6 py-2 rounded-full"
          >
            Explore Events
          </button>
        </div>
      )}
    </div>
  );
}

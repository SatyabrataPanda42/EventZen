import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { SERVICES } from "../../api/services";

export default function Events({
  events,
  venues,
  bookings,
  api,
  fetchData,
  setActiveTab,
  showNotification,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50">
      {events.map((ev) => {
        // Find venue details
        const venue = venues.find((v) => v.id === (ev.venueId || ev.venue_id));

        // Check if user already booked (excluding cancelled)
        const isBooked = bookings?.some(
          (b) =>
            (b.eventId || b.event_id) === ev.id && b.status !== "CANCELLED",
        );

        return (
          <div
            key={ev.id}
            className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 flex flex-col transition-all hover:shadow-xl group"
          >
            {/* HEADER SECTION (Visual Area) */}
            <div className="relative h-48 bg-[#F0F5FF] flex items-center justify-center overflow-hidden">
              {/* Decorative Background Pattern (SVG) */}
              <svg
                className="absolute inset-0 w-full h-full text-blue-100 opacity-50"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <circle cx="10" cy="10" r="20" fill="currentColor" />
                <circle cx="90" cy="90" r="30" fill="currentColor" />
              </svg>

              {/* Event Icon Placeholder */}
              <svg
                className="w-20 h-20 text-blue-200 relative z-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12v.75m0 3v.75m0 3v.75m0 3V18M3 6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 17.25V6.75z"
                />
              </svg>

              {/* Date Badge Overlay */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-white/50 flex flex-col items-center">
                <span className="text-[#2563EB] font-black text-sm uppercase">
                  {new Date(ev.date).toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </span>
                <span className="text-gray-800 font-bold text-lg leading-tight">
                  {new Date(ev.date).getDate()}
                </span>
              </div>

              {/* Booking Status Overlay */}
              {isBooked && (
                <div className="absolute bottom-6 left-6">
                  <span className="bg-[#4ADE80] text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Booked
                  </span>
                </div>
              )}
            </div>

            {/* CONTENT SECTION */}
            <div className="p-8 flex-grow flex flex-col">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-[#1E293B] mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {ev.name}
                </h3>

                <div className="flex items-center text-blue-500 font-medium">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm">
                    {venue?.name || `Venue ID: ${ev.venueId}`}
                  </span>
                </div>
              </div>

              {/* Description Snippet */}
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                {ev.description ||
                  "No description provided for this event. Join us for an unforgettable experience."}
              </p>

              {/* ACTION FOOTER */}
              <button
                disabled={isBooked}
                onClick={async () => {
                  if (isBooked) return;
                  try {
                    await api.post(`${SERVICES.BOOKING}/bookings`, {
                      eventId: ev.id,
                    });
                    showNotification("Booking successful!");
                    setActiveTab("my-bookings");
                    fetchData();
                  } catch (err) {
                    showNotification(
                      err.response?.data || "Booking failed",
                      "error",
                    );
                  }
                }}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  isBooked
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98]"
                }`}
              >
                {isBooked ? (
                  <>
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Already Booked
                  </>
                ) : (
                  <>
                    Book Now
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
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}

      {events.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-32 text-gray-400">
          <div className="bg-gray-100 p-6 rounded-full mb-6">
            <svg
              className="w-12 h-12 opacity-40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="italic text-xl">No upcoming events found.</p>
          <button
            onClick={() => fetchData()}
            className="mt-4 text-blue-500 font-bold hover:underline"
          >
            Refresh List
          </button>
        </div>
      )}
    </div>
  );
}

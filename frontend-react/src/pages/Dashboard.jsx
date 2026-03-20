import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

// ADMIN
import AdminDashboard from "./admin/AdminDashboard";
import ManageUsers from "./admin/ManageUsers";
import ManageBookings from "./admin/ManageBookings";
import ManageEvents from "./admin/ManageEvents";
import ManageVenues from "./admin/ManageVenues";
import AdminAttendees from "./admin/AdminAttendees";
import { SERVICES } from "../api/services";
// CUSTOMER
import Events from "./customer/Events";
import Venues from "./customer/Venues";
import MyBookings from "./customer/MyBookings";
import AttendeeMgmt from "./customer/AttendeeMgmt";

// FORMS
import AddEvent from "./forms/AddEvent";
import AddVenue from "./forms/AddVenue";
import EditEvent from "./forms/EditEvent";
import EditVenue from "./forms/EditVenue";

// ICON
import { ArrowLeft } from "lucide-react";

export default function Dashboard({
  user,
  activeTab,
  setActiveTab,

  venues,
  events,
  bookings,
  attendees,
  allUsers,

  api,
  fetchData,
  showNotification,

  logout,

  // states
  editingVenue,
  setEditingVenue,
  editingEvent,
  setEditingEvent,
  selectedVenue,
  setSelectedVenue,
  selectedBooking,
  setSelectedBooking,
  setAttendees,
  setAllUsers,

  // handlers
  handleUpdateStatus,
  handleCancelBooking,

  stats,
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900">
      {/* SIDEBAR */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logout={logout}
      />

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* HEADER */}
        <Header user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* ================= ADMIN ================= */}

        {activeTab === "admin-dashboard" && (
          <AdminDashboard
            attendees={attendees}
            bookings={bookings}
            events={events}
            venues={venues}
          />
        )}

        {activeTab === "admin-users" && (
          <ManageUsers
            allUsers={allUsers}
            setAllUsers={setAllUsers}
            api={api}
            fetchData={fetchData}
            showNotification={showNotification}
          />
        )}

        {activeTab === "manage-bookings" && (
          <ManageBookings
            bookings={bookings}
            handleUpdateStatus={handleUpdateStatus}
            api={api}
          />
        )}

        {activeTab === "admin-events" && (
          <ManageEvents
            events={events}
            user={user}
            setEditingEvent={setEditingEvent}
            setActiveTab={setActiveTab}
            api={api}
            fetchData={fetchData}
          />
        )}

        {activeTab === "admin-venues" && (
          <ManageVenues
            venues={venues}
            user={user}
            api={api}
            fetchData={fetchData}
            setEditingVenue={setEditingVenue}
            setActiveTab={setActiveTab}
            setSelectedVenue={setSelectedVenue}
          />
        )}

        {activeTab === "admin-attendees" && (
          <AdminAttendees attendees={attendees} bookings={bookings} />
        )}

        {/* ================= VENDOR ================= */}

        {activeTab === "vendor-events" && (
          <ManageEvents
            events={events}
            user={user}
            setEditingEvent={setEditingEvent}
            setActiveTab={setActiveTab}
            api={api}
            fetchData={fetchData}
          />
        )}

        {activeTab === "vendor-venues" && (
          <ManageVenues
            venues={venues}
            user={user}
            api={api}
            fetchData={fetchData}
            setEditingVenue={setEditingVenue}
            setActiveTab={setActiveTab}
            setSelectedVenue={setSelectedVenue}
          />
        )}

        {/* ================= CUSTOMER ================= */}

        {activeTab === "venues" && user?.role === "customer" && (
          <Venues
            venues={venues}
            setSelectedVenue={setSelectedVenue}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "events" && user?.role === "customer" && (
          <Events
            events={events}
            venues={venues}
            bookings={bookings}
            api={api}
            fetchData={fetchData}
            setActiveTab={setActiveTab}
            showNotification={showNotification}
          />
        )}

        {activeTab === "my-bookings" && (
          <MyBookings
            bookings={bookings}
            setSelectedBooking={setSelectedBooking}
            setActiveTab={setActiveTab}
            handleCancelBooking={handleCancelBooking}
            api={api}
            handleUpdateStatus={handleUpdateStatus} // ✅ ADD THIS
            user={user}
          />
        )}

        {activeTab === "attendee-mgmt" && selectedBooking && (
          <AttendeeMgmt
            attendees={attendees}
            bookings={bookings}
            selectedBooking={selectedBooking}
            setActiveTab={setActiveTab}
            api={api}
            showNotification={showNotification}
            setAttendees={setAttendees}
            fetchData={fetchData}
          />
        )}

        {/* ================= FORMS ================= */}

        {activeTab === "add-event" && (
          <AddEvent
            user={user}
            venues={venues}
            api={api}
            fetchData={fetchData}
            showNotification={showNotification}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "add-venue" && (
          <AddVenue
            user={user}
            api={api}
            fetchData={fetchData}
            showNotification={showNotification}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "edit-event" && (
          <EditEvent
            editingEvent={editingEvent}
            venues={venues}
            user={user}
            api={api}
            fetchData={fetchData}
            showNotification={showNotification}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "edit-venue" && (
          <EditVenue
            editingVenue={editingVenue}
            api={api}
            fetchData={fetchData}
            showNotification={showNotification}
            setActiveTab={setActiveTab}
          />
        )}

        {/* ================= VENUE EVENTS ================= */}

        {activeTab === "venue-events" && selectedVenue && (
          <div className="space-y-6">
            <button
              onClick={() => setActiveTab("venues")}
              className="flex items-center gap-2 text-gray-500"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Venues
            </button>

            <h2 className="text-2xl font-bold">
              Events at {selectedVenue.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events
                .filter((e) => (e.venueId || e.venue_id) === selectedVenue.id)
                .map((ev) => {
                  const isBooked = bookings?.some(
                    (b) =>
                      (b.eventId || b.event_id) === ev.id &&
                      b.status !== "CANCELLED",
                  );

                  return (
                    <div
                      key={ev.id}
                      className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 flex flex-col transition-all hover:shadow-xl group"
                    >
                      {/* HEADER */}
                      <div className="relative h-48 bg-[#F0F5FF] flex items-center justify-center overflow-hidden">
                        <svg
                          className="absolute inset-0 w-full h-full text-blue-100 opacity-50"
                          viewBox="0 0 100 100"
                        >
                          <circle cx="10" cy="10" r="20" fill="currentColor" />
                          <circle cx="90" cy="90" r="30" fill="currentColor" />
                        </svg>

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

                        {/* DATE BADGE */}
                        <div className="absolute top-6 right-6 bg-white/90 px-4 py-2 rounded-2xl shadow-sm flex flex-col items-center">
                          <span className="text-blue-600 font-black text-sm uppercase">
                            {new Date(ev.date).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </span>
                          <span className="text-gray-800 font-bold text-lg">
                            {new Date(ev.date).getDate()}
                          </span>
                        </div>

                        {/* BOOKED BADGE */}
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

                      {/* CONTENT */}
                      <div className="p-8 flex flex-col flex-grow">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {ev.name}
                        </h3>

                        <p className="text-sm text-gray-500 mb-3">{ev.date}</p>

                        {/* DESCRIPTION */}
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                          {ev.description || "No description provided."}
                        </p>

                        {/* BUTTON */}
                        <button
                          disabled={isBooked}
                          className={`w-full py-3 rounded-xl font-semibold transition-all
                ${
                  isBooked
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
              `}
                          onClick={async () => {
                            if (isBooked) return;

                            try {
                              await api.post(`${SERVICES.BOOKING}/bookings`, {
                                eventId: ev.id,
                              });

                              showNotification("Booked!");
                              setActiveTab("my-bookings");
                              fetchData();
                            } catch (err) {
                              const msg =
                                err.response?.data?.error ||
                                err.response?.data ||
                                "Booking failed";

                              showNotification(msg, "error");
                            }
                          }}
                        >
                          {isBooked ? "Already Booked" : "Book Now"}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

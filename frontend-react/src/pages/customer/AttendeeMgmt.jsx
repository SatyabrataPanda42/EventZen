import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  UserPlus,
  CreditCard,
  Info,
  MoreVertical,
  Trash2,
  Mail,
  User,
  ShieldCheck,
  Lock,
  ChevronRight,
  Calendar,
} from "lucide-react";

import { SERVICES } from "../../api/services";

export default function AttendeeMgmt({
  attendees = [],
  selectedBooking = { id: "59", eventId: "28", status: "PENDING" },
  setActiveTab = () => {},
  api = {
    get: async () => ({ data: [] }),
    post: async () => ({}),
    put: async () => ({}),
    delete: async () => ({}),
  },
  showNotification = () => {},
  setAttendees = () => {},
  fetchData = () => {},
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => setActiveTab("my-bookings");

  // ✅ Fetch events + venues
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [eventRes, venueRes] = await Promise.all([
          api.get(`${SERVICES.EVENT}/events`),
          api.get(`${SERVICES.VENUE}/venues`),
        ]);

        setEvents(eventRes.data);
        setVenues(venueRes.data);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };

    fetchAll();
  }, [api]);

  // ✅ event map
  const eventMap = useMemo(() => {
    const map = {};
    (events || []).forEach((e) => {
      const id = Number(e.id || e.eventId);
      map[id] = e;
    });
    return map;
  }, [events]);

  // ✅ venue map
  const venueMap = useMemo(() => {
    const map = {};
    (venues || []).forEach((v) => {
      const id = Number(v.id || v.venueId);
      map[id] = v.name || v.venueName || v.title;
    });
    return map;
  }, [venues]);

  // ✅ derive values
  const eventId = Number(selectedBooking?.event_id || selectedBooking?.eventId);
  const event = eventMap[eventId];

  const venueId = Number(event?.venue_id || event?.venueId);

  const eventName = event?.name || event?.title || "Unknown Event";
  const venueName = venueMap[venueId] || "Unknown Venue";

  const filtered = (attendees || []).filter(
    (a) => a.bookingId === selectedBooking.id,
  );

  const isConfirmed = selectedBooking.status === "CONFIRMED";
const isWaitlist = selectedBooking.status === "WAITLIST";
  // ================= ACTIONS =================

  const handleAddGuest = async () => {
    if (!name || !email) {
      showNotification("Enter name & email", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`${SERVICES.BOOKING}/attendees`, {
        bookingId: selectedBooking.id,
        name,
        email,
      });

      showNotification("Guest added");
      setName("");
      setEmail("");

      const res = await api.get(
        `${SERVICES.BOOKING}/attendees/booking/${selectedBooking.id}`,
      );
      setAttendees(res.data);
      fetchData && fetchData();
    } catch {
      showNotification("Failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveGuest = async (id) => {
    try {
      await api.delete(`${SERVICES.BOOKING}/attendees/${id}`);
      showNotification("Removed");

      const res = await api.get(
        `${SERVICES.BOOKING}/attendees/booking/${selectedBooking.id}`,
      );
      setAttendees(res.data);
      fetchData && fetchData();
    } catch {
      showNotification("Failed", "error");
    }
  };

  const handlePayment = async () => {
    try {
      await api.put(
        `${SERVICES.BOOKING}/bookings/${selectedBooking.id}/status`,
        { status: "CONFIRMED" },
      );

      showNotification("Payment Successful");
      selectedBooking.status = "CONFIRMED";
      fetchData && fetchData();
    } catch {
      showNotification("Payment failed", "error");
    }
  };

  // ================= UI =================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={handleClose} />

      <div className="relative w-full max-w-[1200px] bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between bg-white sticky top-0 z-10">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={20} />
            <span className="font-bold text-slate-800 tracking-tight">
              Booking Management
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8 bg-slate-50">
          {/* ✅ UPDATED CARD */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                <Calendar size={28} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {eventName}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Venue:{" "}
                  <span className="text-slate-700 font-semibold">
                    {venueName}
                  </span>
                </p>
              </div>
            </div>

            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
              ${
    isConfirmed
      ? "bg-green-100 text-green-700 border border-green-200"
      : isWaitlist
      ? "bg-yellow-200 text-yellow-800 border border-yellow-300"
      : "bg-yellow-100 text-yellow-700 border border-yellow-200"
  }
            `}
            >
              {selectedBooking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* GUEST LIST */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                    Guest List
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full font-extrabold">
                      {filtered.length}
                    </span>
                  </h3>
                </div>

                <div className="flex-1">
                  {isWaitlist ? (
  <div className="flex flex-col items-center justify-center h-full py-20 text-center">
    <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-4 text-yellow-400 border border-dashed border-yellow-200">
      <Users size={32} />
    </div>
    <p className="text-yellow-600 font-bold">
      Event is currently full
    </p>
    <p className="text-xs text-yellow-500 mt-1">
      Please wait until seats become available.
    </p>
  </div>
) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300 border border-dashed border-slate-200">
                        <Users size={32} />
                      </div>
                      <p className="text-slate-500 font-medium">
                        No guests registered yet.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Add attendees using the form on the right.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {filtered.map((a) => (
                        <div
                          key={a.id}
                          className="flex justify-between items-center p-5 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                              {a.name ? a.name[0].toUpperCase() : "?"}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                {a.name}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                <Mail size={14} />
                                {a.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                              <CheckCircle2 size={14} /> Confirmed
                            </div>
                            {!isConfirmed && (
                              <button
                                onClick={() => handleRemoveGuest(a.id)}
                                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Remove Guest"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SIDEBAR PANEL */}
            <div className="lg:col-span-4 space-y-6">
              {/* ADD FORM */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
                  <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
                    <UserPlus size={20} />
                  </div>
                  Add Guest
                </h3>

               {isConfirmed || isWaitlist ? (
                  <div className="bg-slate-50 p-6 rounded-xl text-center border border-slate-100">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <Lock size={20} className="text-slate-400" />
                    </div>
                   <p className="text-sm text-slate-600 font-bold">
  {isWaitlist ? "Waitlisted" : "Registration Locked"}
</p>

<p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-bold">
  {isWaitlist
    ? "No capacity available for this event"
    : "Booking is already confirmed"}
</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                          size={16}
                        />
                        <input
                          placeholder="Ex: John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-semibold text-slate-700"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                          size={16}
                        />
                        <input
                          type="email"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-semibold text-slate-700"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleAddGuest}
                      disabled={isSubmitting}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 mt-2 text-sm flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "Processing..." : "Register Guest"}
                    </button>
                  </div>
                )}
              </div>

              {/* PAYMENT SUMMARY */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-emerald-50/20">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <CreditCard size={18} className="text-emerald-600" />
                    Bill Summary
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-500">Attendee Count</span>
                    <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {filtered.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-500">Registration Fee</span>
                    <span className="text-slate-900">₹500.00</span>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Grand Total
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        Inclusive of all taxes
                      </p>
                    </div>
                    <span className="text-2xl font-black text-slate-900">
                      ₹{(filtered.length * 500).toLocaleString()}
                    </span>
                  </div>

                 {!isConfirmed && !isWaitlist && (
                    <button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-emerald-100 mt-4 text-sm flex items-center justify-center gap-2 group"
                      onClick={handlePayment}
                      disabled={filtered.length === 0}
                    >
                      Pay ₹{(filtered.length * 500).toLocaleString()}
                      <ChevronRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  )}

                  {isConfirmed && (
                    <div className="flex flex-col items-center justify-center gap-2 py-6 text-emerald-600 font-black text-xs bg-emerald-50 rounded-2xl border-2 border-emerald-100 mt-2">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <CheckCircle2 size={24} />
                      </div>
                      TRANSACTION COMPLETED
                    </div>
                  )}

                  <div className="flex items-center gap-2 justify-center pt-2">
                    <Info size={14} className="text-slate-300" />
                    <span className="text-[10px] text-slate-400 font-medium">
                      Secure SSL Encrypted Payment
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

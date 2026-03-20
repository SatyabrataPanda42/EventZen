import { useState, useEffect, useMemo } from "react";
import axios from "axios";

import { SERVICES } from "./api/services";
import { createAPI } from "./api/axios";
import { decodeToken } from "./utils/decodeToken";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Notification from "./components/layout/Notification";

export default function App() {
  // ================= STATE =================
  const [currentPage, setCurrentPage] = useState("landing");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "overview",
  );

  const [notification, setNotification] = useState(null);

  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingVenue, setEditingVenue] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  // ================= API =================
  const api = useMemo(() => createAPI(token), [token]);

  // ================= NOTIFICATION =================
  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };
  const getErrorMessage = (err) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.response?.data ||
      err?.message ||
      "Something went wrong"
    );
  };
  // ================= AUTH =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${SERVICES.USER}/auth/login`, {
        email: e.target.email.value,
        password: e.target.password.value,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      showNotification(getErrorMessage(err), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${SERVICES.USER}/auth/register`, {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
      });

      showNotification("Registered successfully!");
      setCurrentPage("login");
    } catch (err) {
      showNotification(getErrorMessage(err), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeTab");

    setToken(null);
    setUser(null);
    setActiveTab("overview");
    setCurrentPage("landing");
  };

  // ================= FETCH DATA =================
  const fetchData = async () => {
    if (!token || !user) return;

    try {
      const [vRes, eRes] = await Promise.all([
        api.get(`${SERVICES.VENUE}/venues`),
        api.get(`${SERVICES.EVENT}/events`),
      ]);

      setVenues(vRes.data);
      setEvents(eRes.data);

      if (user.role === "customer") {
        const bRes = await api.get(`${SERVICES.BOOKING}/bookings/my`);
        setBookings(bRes.data);
        const aRes = await api.get(`${SERVICES.BOOKING}/attendees/all`);
        setAttendees(aRes.data);
      }

      if (user.role === "vendor") {
        const bRes = await api.get(`${SERVICES.BOOKING}/bookings/vendor`);
        setBookings(bRes.data);
      }

      if (user.role === "admin") {
        const uRes = await api.get(`${SERVICES.USER}/auth/users`);
        const bRes = await api.get(`${SERVICES.BOOKING}/bookings/all`);
        const aRes = await api.get(`${SERVICES.BOOKING}/attendees/all`);

        setAllUsers(uRes.data);
        setBookings(bRes.data);
        setAttendees(aRes.data);
      }
    } catch {
      showNotification(getErrorMessage(err), "error");
    }
  };

  // ================= EFFECTS =================
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);

      if (decoded) {
        const role = decoded.role || "customer";

        setUser({
          id: decoded.userId || decoded.id || decoded.sub,
          role,
          name: decoded.name || "User",
        });

        if (role === "admin") setActiveTab("admin-dashboard");
        else if (role === "vendor") setActiveTab("vendor-venues");
        else setActiveTab("venues");

        setCurrentPage("dashboard");
      }
    }
  }, [token]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // ================= HANDLERS =================
  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await api.put(`${SERVICES.BOOKING}/bookings/${bookingId}/status`, {
        status,
      });
      showNotification(`Booking ${status}`);
      fetchData();
    } catch {
      showNotification(getErrorMessage(err), "error");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.delete(`${SERVICES.BOOKING}/bookings/${bookingId}`);

      // ✅ Update booking status instead of removing
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "CANCELLED" } : b,
        ),
      );

      // ✅ Remove attendees of this booking from state
      setAttendees((prev) => prev.filter((a) => a.bookingId !== bookingId));

      // ✅ Also update selected booking (important)
      setSelectedBooking((prev) =>
        prev && prev.id === bookingId ? { ...prev, status: "CANCELLED" } : prev,
      );

      showNotification("Booking Cancelled");
    } catch {
      showNotification(getErrorMessage(err), "error");
    }
  };

  // ================= STATS =================
  const stats = useMemo(
    () => ({
      totalVenues: venues.length,
      totalEvents: events.length,
      totalBookings: bookings.length,
      graphData: venues.slice(0, 5).map((v) => ({
        name: v.name,
        events: events.filter((e) => (e.venueId || e.venue_id) === v.id).length,
      })),
    }),
    [venues, events, bookings],
  );

  // ================= ROUTING =================

  if (currentPage === "landing") {
    return (
      <>
        <Notification notification={notification} />
        <Landing setCurrentPage={setCurrentPage} notification={notification} />
      </>
    );
  }

  if (currentPage === "login" || currentPage === "register") {
    return (
      <Auth
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        isLoading={isLoading}
        notification={notification}
      />
    );
  }

  return (
    <>
      <Notification notification={notification} />

      <Dashboard
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        venues={venues}
        events={events}
        bookings={bookings}
        attendees={attendees}
        allUsers={allUsers}
        api={api}
        fetchData={fetchData}
        showNotification={showNotification}
        logout={logout}
        editingVenue={editingVenue}
        setEditingVenue={setEditingVenue}
        editingEvent={editingEvent}
        setEditingEvent={setEditingEvent}
        selectedVenue={selectedVenue}
        setSelectedVenue={setSelectedVenue}
        selectedBooking={selectedBooking}
        setSelectedBooking={setSelectedBooking}
        setAttendees={setAttendees}
        setAllUsers={setAllUsers}
        handleUpdateStatus={handleUpdateStatus}
        handleCancelBooking={handleCancelBooking}
        stats={stats}
      />
    </>
  );
}

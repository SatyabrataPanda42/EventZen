import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  BarChart3, 
  UserPlus, 
  ArrowLeft, 
  Info, 
  CreditCard,
  PlusCircle,
  Eye,
  ClipboardList,
  UserCheck,
  Sparkles,
ArrowRight,
Zap,
ShieldCheck,
Star,
Ticket
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// --- Configuration for Live Backend ---
const SERVICES = {
  USER: 'http://localhost:4000',
  VENUE: 'http://localhost:8081',
  EVENT: 'http://localhost:8082',
  BOOKING: 'http://localhost:8083'
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// Helper to decode JWT
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};
const handleRegister = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    await axios.post(`${SERVICES.USER}/auth/register`, {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value
    });

    showNotification("Registered successfully!");
    setCurrentPage('landing');

  } catch (err) {
    showNotification(err.response?.data?.message || "Register failed", "error");
  } finally {
    setIsLoading(false);
  }
};
const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false, size = 'md' }) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, title, subtitle, footer, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    {(title || subtitle) && (
      <div className="px-6 py-4 border-b border-gray-100">
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    )}
    <div className="p-6">{children}</div>
    {footer && <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">{footer}</div>}
  </div>
);

const Input = ({ label, type = 'text', value, onChange, defaultValue, placeholder, required = false, name, children }) => (
  <div className="space-y-1.5 w-full text-left">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    {type === 'select' ? (
      <select
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900"
      >
        {children}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={3}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
    )}
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
const [activeTab, setActiveTab] = useState(
  localStorage.getItem('activeTab') || 'overview'
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
const [venueEvents, setVenueEvents] = useState([]);

  const api = useMemo(() => {
    const instance = axios.create();
    instance.interceptors.request.use(config => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return instance;
  }, [token]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = async () => {
    if (!token || !user) return;
    setIsLoading(true);
    try {
      const venueUrl = user.role === 'vendor' 
        ? `${SERVICES.VENUE}/venues/my` 
        : `${SERVICES.VENUE}/venues`;

      const [vRes, eRes] = await Promise.all([
        api.get(venueUrl),
        api.get(`${SERVICES.EVENT}/events`)
      ]);

      setVenues(vRes.data);
      setEvents(eRes.data);

      if (user.role === 'customer') {
        const bRes = await api.get(`${SERVICES.BOOKING}/bookings/my`);
      setBookings(bRes.data);
      }
      if (user.role === 'vendor') {
  const bRes = await api.get(`${SERVICES.BOOKING}/bookings/vendor`);
  setBookings(bRes.data);
}
      if (user.role === 'admin') {
        const uRes = await api.get(`${SERVICES.USER}/auth/users`).catch(() => ({ data: [] }));
        const bAllRes = await api.get(`${SERVICES.BOOKING}/bookings/all`).catch(() => ({ data: [] }));
        const aRes = await api.get(`${SERVICES.BOOKING}/attendees/all?_=${Date.now()}`)
        setAllUsers(uRes.data);
setAllUsers(uRes.data);
setBookings(bAllRes.data);
setAttendees(aRes.data); 
      }

    } catch (err) {
      console.error(err);
      showNotification("Error connecting to services", "error");
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
  if (token) {
    const decoded = decodeToken(token);

    if (decoded) {
      const role = decoded.role || 'customer';

      setUser({ 
        id: decoded.userId || decoded.id || decoded.sub, 
        role: role, 
        name: decoded.name || 'User' 
      });

      // ✅ RESET TAB WHEN USER CHANGES
      localStorage.removeItem('activeTab');

      // ✅ SET DEFAULT TAB BASED ON ROLE
      if (role === 'admin') {
        setActiveTab('admin-dashboard');
      } else if (role === 'vendor') {
        setActiveTab('vendor-venues');
      } else {
        setActiveTab('venues');
      }

      setCurrentPage('dashboard');
    }
  }
}, [token]);
useEffect(() => {
  if (user) {
    const allowedTabs = {
      admin: ['admin-dashboard','admin-users','admin-venues','admin-events','manage-bookings','admin-attendees'],
      vendor: ['vendor-venues','vendor-events','manage-bookings'],
      customer: ['venues','events','my-bookings','attendee-mgmt']
    };

    if (!allowedTabs[user.role]?.includes(activeTab)) {
      if (user.role === 'admin') setActiveTab('admin-dashboard');
      else if (user.role === 'vendor') setActiveTab('vendor-venues');
      else setActiveTab('venues');
    }
  }
}, [user]);
useEffect(() => {
  const fetchVenueEvents = async () => {
    if (activeTab === 'venue-events' && selectedVenue) {
      try {
        const res = await api.get(
          `${SERVICES.EVENT}/events/venue/${selectedVenue.id}`
        );

        setVenueEvents(res.data);

      } catch (err) {
        console.error(err);
        showNotification("Failed to load events", "error");
      }
    }
  };
  fetchVenueEvents();
}, [activeTab, selectedVenue]);
  useEffect(() => {
    if (user) fetchData();
  }, [user]);
useEffect(() => {
  if (activeTab) {
    localStorage.setItem('activeTab', activeTab);
  }
}, [activeTab]);
  // Handle fetching attendees for a specific booking
  useEffect(() => {
    const fetchBookingAttendees = async () => {
      if (activeTab === 'attendee-mgmt' && selectedBooking) {
        try {
          const res = await api.get(`${SERVICES.BOOKING}/attendees/event/${selectedBooking.event_id || selectedBooking.eventId}`);
          setAttendees(res.data);
        } catch (err) {
          console.error("Failed to fetch attendees");
        }
      }
    };
    fetchBookingAttendees();
  }, [activeTab, selectedBooking]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${SERVICES.USER}/auth/login`, {
        email: e.target.email.value,
        password: e.target.password.value
      });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      showNotification(err.response?.data?.message || "Login failed", "error");
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
      password: e.target.password.value
    });

    showNotification("Registered successfully!");
    setCurrentPage("login");

  } catch (err) {
    showNotification(err.response?.data?.message || "Register failed", "error");
  } finally {
    setIsLoading(false);
  }
};
const handleCancelBooking = async (bookingId) => {
  if (!window.confirm("Cancel booking?")) return;

  try {
    await api.delete(`${SERVICES.BOOKING}/bookings/${bookingId}`);
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    fetchData();
    showNotification("Cancelled");

  } catch {
    showNotification("Failed", "error");
  }
};

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      // Assuming a PUT /bookings/{id}/status endpoint based on typical patterns
      await api.put(`${SERVICES.BOOKING}/bookings/${bookingId}/status`, { status });
      showNotification(`Booking ${status}`);
      fetchData();
    } catch (err) {
      showNotification("Update failed. Check backend endpoints.", "error");
    }
  };

const handleAddAttendee = async (e) => {
  e.preventDefault();

  try {
    await api.post(`${SERVICES.BOOKING}/attendees`, {
      bookingId: selectedBooking.id,  
      name: e.target.name.value,
      email: e.target.email.value
    });

    showNotification("Attendee added!");
    e.target.reset();

    const res = await api.get(
      `${SERVICES.BOOKING}/attendees/event/${selectedBooking.event_id || selectedBooking.eventId}`
    );

    setAttendees(res.data);

  } catch (err) {
    console.error(err.response?.data); 
    showNotification("Error adding attendee", "error");
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('activeTab'); // ✅ IMPORTANT
  setToken(null);
  setUser(null);
  setActiveTab('overview'); // reset
  setCurrentPage('landing');
};

  const getVenueId = (item) => item?.venue_id || item?.venueId;

  const stats = useMemo(() => ({
    totalVenues: venues.length,
    totalEvents: events.length,
    totalBookings: bookings.length,
    graphData: venues.slice(0, 5).map(v => ({
      name: v.name,
      events: events.filter(e => getVenueId(e) === v.id).length
    }))
  }), [venues, events, bookings]);


  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
        {/* NAVBAR */}
        <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-600">
            <Calendar className="w-8 h-8" />
            <span className="text-2xl font-black tracking-tighter">EventZen</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setCurrentPage('login')} className="font-semibold text-gray-600 hover:text-gray-900 transition-colors">Sign In</button>
            <button 
              onClick={() => setCurrentPage('register')} 
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Sign Up
            </button>
          </div>
        </nav>

        {/* HERO SECTION - Focused on Customer Discovery */}
        <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.95]">
              Find. Book. <br/> <span className="text-blue-600">Attend.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-lg leading-relaxed font-medium">
              Everyone starts as a member. Discover breathtaking venues, book curated events, and manage your guest list with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setCurrentPage('login')}
                className="group px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
              >
                Get In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setCurrentPage('register')}
                className="px-8 py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all border border-gray-200"
              >
                Join Now
              </button>
            </div>
          </div>

          {/* MOCK DISCOVERY INTERFACE (Visual representation for Customers) */}
          <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
             <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-emerald-100 rounded-[40px] blur-3xl opacity-50 -z-10"></div>
             <Card className="border-none shadow-2xl p-0 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="bg-white border rounded px-3 py-1 flex items-center gap-2 text-[10px] font-bold text-gray-400">
                    <Search className="w-2.5 h-2.5" /> Search events near you...
                  </div>
                </div>
                <div className="p-6 space-y-6">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Featured Venue</h4>
                      </div>
                      <div className="h-32 w-full bg-blue-50 rounded-xl flex items-center justify-center">
                        <MapPin className="w-10 h-10 text-blue-200" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">The Grand Symphony Hall</p>
                        <p className="text-xs text-gray-500">Mumbai • 500 Capacity</p>
                      </div>
                   </div>
                   <div className="pt-4 border-t flex justify-between items-center">
                      <Button size="lg" className='w-full'>Book Now</Button>
                   </div>
                </div>
             </Card>
          </div>
        </main>

        {/* CUSTOMER VALUE SECTION */}
        <section className="bg-gray-50 py-24 border-t border-gray-100">
           <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-12 text-gray-900">
              <div className="space-y-4">
                 <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border flex items-center justify-center text-blue-600 transition-transform hover:scale-110"><Ticket className="w-6 h-6"/></div>
                 <h3 className="text-xl font-bold">Seamless Booking</h3>
                 <p className="text-gray-500 font-medium">Reserve your spot at the city's most exclusive venues and events in just two clicks.</p>
              </div>
              <div className="space-y-4">
                 <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border flex items-center justify-center text-blue-600 transition-transform hover:scale-110"><UserPlus className="w-6 h-6"/></div>
                 <h3 className="text-xl font-bold">Manage Guests</h3>
                 <p className="text-gray-500 font-medium">Add, remove, or invite attendees to your booked events directly from your portal.</p>
              </div>
              <div className="space-y-4">
                 <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border flex items-center justify-center text-blue-600 transition-transform hover:scale-110"><ArrowRight className="w-6 h-6"/></div>
                 <h3 className="text-xl font-bold">Partner Ready</h3>
                 <p className="text-gray-500 font-medium">Want to host? Register as a customer first, and upgrade to Vendor status when you're ready.</p>
              </div>
           </div>
        </section>
      </div>
    );
  }



  if (currentPage === 'login' || currentPage === 'register') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-gray-900">
        <div className="max-w-md w-full">
          <Card title={currentPage === 'login' ? "Welcome Back" : "Register Account"}>
            <form onSubmit={currentPage === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {currentPage === 'register' && <Input label="Full Name" name="name" required />}
              <Input label="Email" name="email" type="email" required />
              <Input label="Password" name="password" type="password" required />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Please wait..." : (currentPage === 'login' ? "Sign In" : "Sign Up")}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">
              {currentPage === 'login' ? "New here?" : "Joined already?"} 
              <button onClick={() => setCurrentPage(currentPage === 'login' ? 'register' : 'login')} className="text-blue-600 ml-1 font-semibold">
                {currentPage === 'login' ? "Register" : "Login"}
              </button>
            </p>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="mt-4 text-sm text-gray-400"
            >
              ← Back to Home
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 text-blue-600 mb-8">
            <Calendar className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900">EventZen</span>
          </div>
          <nav className="space-y-1">
            {user?.role === 'admin' && (
              <>
                <SidebarItem icon={<BarChart3 />} label="Dashboard" active={activeTab === 'admin-dashboard'} onClick={() => setActiveTab('admin-dashboard')} />
                <SidebarItem icon={<Users />} label="Manage Users" active={activeTab === 'admin-users'} onClick={() => setActiveTab('admin-users')} />
                <SidebarItem icon={<MapPin />} label="All Venues" active={activeTab === 'admin-venues'} onClick={() => setActiveTab('admin-venues')} />
                <SidebarItem icon={<Calendar />} label="All Events" active={activeTab === 'admin-events'} onClick={() => setActiveTab('admin-events')} />
                <SidebarItem icon={<ClipboardList />} label="Manage Bookings" active={activeTab === 'manage-bookings'} onClick={() => setActiveTab('manage-bookings')} />
                <SidebarItem icon={<UserCheck />} label="All Attendees" active={activeTab === 'admin-attendees'} onClick={() => setActiveTab('admin-attendees')}/>
              </>
            )}
            {user?.role === 'vendor' && (
              <>
                <SidebarItem icon={<MapPin />} label="My Venues" active={activeTab === 'vendor-venues'} onClick={() => setActiveTab('vendor-venues')} />
                <SidebarItem icon={<Calendar />} label="My Events" active={activeTab === 'vendor-events'} onClick={() => setActiveTab('vendor-events')} />
                <SidebarItem icon={<ClipboardList />} label="Booking Requests" active={activeTab === 'manage-bookings'} onClick={() => setActiveTab('manage-bookings')} />
              </>
            )}
            {user?.role === 'customer' && (
              <>
                <SidebarItem icon={<MapPin />} label="Browse Venues" active={activeTab === 'venues'} onClick={() => setActiveTab('venues')} />
                <SidebarItem icon={<Calendar />} label="Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
                <SidebarItem icon={<LayoutDashboard />} label="My Bookings" active={activeTab === 'my-bookings'} onClick={() => setActiveTab('my-bookings')} />
              </>
            )}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
              {user?.name?.[0]}
            </div>
            <div>
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 w-full text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 relative">
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 animate-in fade-in duration-300 ${
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            <span className="font-medium">{notification.msg}</span>
          </div>
        )}

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 capitalize tracking-tight">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-gray-500">Managing your EventZen workspace</p>
          </div>
          <div className="flex gap-2">
            {((user?.role === 'admin' && activeTab === 'admin-venues') || (user?.role === 'vendor' && activeTab === 'vendor-venues')) && (
              <Button onClick={() => setActiveTab('add-venue')}><Plus className="w-4 h-4" /> New Venue</Button>
            )}
            {((user?.role === 'admin' && activeTab === 'admin-events') || (user?.role === 'vendor' && activeTab === 'vendor-events')) && (
              <Button onClick={() => setActiveTab('add-event')}><PlusCircle className="w-4 h-4" /> Create Event</Button>
            )}
          </div>
        </header>

        {/* --- VIEWS --- */}
{activeTab === 'edit-venue' && editingVenue && (
  <div className="max-w-2xl mx-auto text-gray-900">
    <button
      onClick={() => setActiveTab('vendor-venues')}
      className="mb-6 flex items-center gap-2 text-gray-500"
    >
      <ArrowLeft className="w-4 h-4" /> Back
    </button>

    <Card title="Edit Venue">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            await api.put(`${SERVICES.VENUE}/venues/${editingVenue.id}`, {
              name: e.target.name.value,
              location: e.target.location.value,
              capacity: parseInt(e.target.capacity.value),
              price: parseFloat(e.target.price.value)
            });

            showNotification("Venue updated!");
            setActiveTab('vendor-venues');
            fetchData();

          } catch {
            showNotification("Update failed", "error");
          }
        }}
      >
        <Input label="Name" name="name" defaultValue={editingVenue.name} />
        <Input label="Location" name="location" defaultValue={editingVenue.location} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Capacity" name="capacity" type="number" defaultValue={editingVenue.capacity} />
          <Input label="Price" name="price" type="number" defaultValue={editingVenue.price} />
        </div>

        <Button type="submit" className="w-full mt-6">
          Update Venue
        </Button>
      </form>
    </Card>
  </div>
)}
{activeTab === 'edit-event' && editingEvent && (
  <div className="max-w-2xl mx-auto text-gray-900">
    <button
      onClick={() => setActiveTab(user.role === 'admin' ? 'admin-events' : 'vendor-events')}
      className="mb-6 flex items-center gap-2 text-gray-500"
    >
      <ArrowLeft className="w-4 h-4" /> Back
    </button>

    <Card title="Edit Event">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            await api.put(`${SERVICES.EVENT}/events/${editingEvent.id}`, {
              name: e.target.name.value,
              description: e.target.description.value,
              date: e.target.date.value,
              venueId: parseInt(e.target.venue.value)
            });

            showNotification("Event updated!");
            setActiveTab(user.role === 'admin' ? 'admin-events' : 'vendor-events');
            fetchData();

          } catch {
            showNotification("Update failed", "error");
          }
        }}
      >
        <Input label="Name" name="name" defaultValue={editingEvent.name} />

        <Input label="Venue" name="venue" type="select" defaultValue={editingEvent.venueId}>
          {venues.map(v => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </Input>

        <Input label="Date" name="date" type="date" defaultValue={editingEvent.date} />

        <Input label="Description" name="description" type="textarea" defaultValue={editingEvent.description} />

        <Button type="submit" className="w-full mt-6">
          Update Event
        </Button>
      </form>
    </Card>
  </div>
)}
{activeTab === 'venue-events' && selectedVenue && (
  <div className="space-y-6 text-gray-900">
    
    <button
      onClick={() => setActiveTab('venues')}
      className="flex items-center gap-2 text-gray-500"
    >
      <ArrowLeft className="w-4 h-4" /> Back to Venues
    </button>

    <h2 className="text-2xl font-bold">
      Events at {selectedVenue.name}
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {venueEvents.length > 0 ? (
        venueEvents.map(ev => (
          <Card key={ev.id} title={ev.name} subtitle={ev.date}>
            <p className="text-gray-600 mb-4">{ev.description}</p>

            <Button
              className="w-full"
              onClick={async () => {
                try {
                  await api.post(`${SERVICES.BOOKING}/bookings`, {
                    eventId: ev.id
                  });

                  showNotification("Booked!");
                  setActiveTab('my-bookings');
                  fetchData();

                } catch {
                  showNotification("Booking failed", "error");
                }
              }}
            >
              Book Now
            </Button>
          </Card>
        ))
      ) : (
        <p className="text-gray-400 italic">
          No events available for this venue
        </p>
      )}
    </div>
  </div>
)}




        {/* ADMIN: MANAGE USERS */}
        {activeTab === 'admin-users' && (
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">User Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-900">
                {allUsers.length > 0 ? allUsers.map(u => (
                  <tr key={u.id || u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold">{u.name}</td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                        u.role === 'vendor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
  
  {u.role === 'customer' && (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await api.put(`${SERVICES.USER}/auth/update-role/${u.id || u._id}`, {
  role: 'vendor'
});

// ✅ instant update
setAllUsers(prev =>
  prev.map(user =>
    (user.id || user._id) === (u.id || u._id)
      ? { ...user, role: 'vendor' }
      : user
  )
);

showNotification("User promoted");
        } catch {
          showNotification("Update failed", "error");
        }
      }}
    >
      Make Vendor
    </Button>
  )}

  {/* DELETE USER */}
  <Button
    variant="danger"
    size="sm"
    onClick={async () => {
      if (!window.confirm("Delete this user?")) return;

      try {
        await api.delete(`${SERVICES.USER}/auth/delete/${u.id || u._id}`);
        showNotification("User deleted");
        fetchData();
      } catch {
        showNotification("Delete failed", "error");
      }
    }}
  >
    <Trash2 className="w-4 h-4" />
  </Button>

</div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">No users found on user-service (Port 4000).</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}

        {/* MANAGE BOOKINGS */}
        {activeTab === 'manage-bookings' && (
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-left text-gray-900">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Event ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">User ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings
  .filter(b => b.status !== 'CANCELLED')
  .map(b => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 font-medium">{b.event_id || b.eventId}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{b.user_id || b.userId}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                        b.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>{b.status || 'WAITLIST'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="success" onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}><CheckCircle className="w-4 h-4" /></Button>
                        <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}><XCircle className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">No booking requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}
        {activeTab === 'admin-attendees' && (
  <Card className="p-0 overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Name</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Email</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Booking ID</th>
        </tr>
      </thead>
      <tbody>
        {attendees
  .filter(a => bookings.some(b => b.id === a.bookingId))
  .map(a => (
          <tr key={a.id}>
            <td className="px-6 py-4">{a.name}</td>
            <td className="px-6 py-4">{a.email}</td>
            <td className="px-6 py-4">{a.bookingId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
)}


        {/* CUSTOMER: ATTENDEE MGMT */}
        {activeTab === 'attendee-mgmt' && selectedBooking && (
          <div className="space-y-6">
            <button onClick={() => setActiveTab('my-bookings')} className="flex items-center gap-2 text-gray-500">
              <ArrowLeft className="w-4 h-4" /> Back to My Bookings
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card title="Guest List">
                  <div className="space-y-3 text-gray-900">
                    {attendees
  .filter(a => bookings.some(b => b.id === a.bookingId))
  .map(a => (
                      <div key={a.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-bold">{a.name}</p>
                          <p className="text-sm text-gray-500">{a.email}</p>
                        </div>
                        <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg" onClick={async () => {
                          try {
  await api.delete(`${SERVICES.BOOKING}/attendees/${a.id}`);

  showNotification("Removed");

  // ✅ ALWAYS refetch from backend
  const res = await api.get(`${SERVICES.BOOKING}/attendees/all`);
  setAttendees(res.data);

} catch (err) {
  showNotification("Failed to remove", "error");
}
                        }}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {attendees.length === 0 && <p className="text-center py-12 text-gray-400 italic">No guests added yet.</p>}
                  </div>
                </Card>
              </div>
              <Card title="Add Guest">
                <form className="space-y-4" onSubmit={handleAddAttendee}>
                  <Input label="Guest Name" name="name" required />
                  <Input label="Guest Email" name="email" type="email" required />
                  <Button type="submit" className="w-full mt-4">Confirm Add</Button>
                </form>
              </Card>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {activeTab === 'admin-dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-900">
            <StatCard label="Total Venues" value={stats.totalVenues} icon={<MapPin />} />
            <StatCard label="Total Events" value={stats.totalEvents} icon={<Calendar />} />
            <StatCard label="Total Bookings" value={stats.totalBookings} icon={<ClipboardList />} />
            <div className="md:col-span-3">
              <Card title="Engagement Analysis">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.graphData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="events" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* VENUE LIST */}
        {(activeTab === 'admin-venues' || activeTab === 'vendor-venues' || activeTab === 'venues') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-900">
            {venues.map(venue => (
              <Card key={venue.id} title={venue.name} subtitle={venue.location}>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Capacity</p>
                    <p className="font-bold">{venue.capacity} People</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase">Price</p>
                    <p className="font-bold text-blue-600">${venue.price}</p>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  {user?.role === 'customer' ? (
                    <Button className="w-full" onClick={() => { setSelectedVenue(venue); setActiveTab('venue-events'); }}>View Events</Button>
                  ) : (
                    <>
                      <Button variant="outline" className="flex-1" onClick={() => { setEditingVenue(venue); setActiveTab('edit-venue'); }}><Edit className="w-4 h-4" /></Button>
                      <Button variant="danger" onClick={async () => {
                          if (!window.confirm("Delete this venue?")) return;
                          await api.delete(`${SERVICES.VENUE}/venues/${venue.id}`);
                          fetchData();
                        }}><Trash2 className="w-4 h-4" /></Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
        {/* CUSTOMER EVENTS */}
{activeTab === 'events' && user?.role === 'customer' && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900">
    {events.map(ev => {
      const venue = venues.find(v => v.id === (ev.venueId || ev.venue_id));

      return (
        <Card key={ev.id} title={ev.name} subtitle={ev.date}>
          <p className="text-blue-600 text-sm mb-2">
            {venue?.name || `Venue ID: ${ev.venueId}`}
          </p>

          <p className="text-gray-600 mb-6">{ev.description}</p>

          <Button
            className="w-full"
            onClick={async () => {
              try {
                await api.post(`${SERVICES.BOOKING}/bookings`, {
                  eventId: ev.id
                });
                setActiveTab('my-bookings');
                fetchData();
                showNotification("Booking confirmed!");

              } catch (err) {
                showNotification("Booking failed", "error");
              }
            }}
          >
            Book Now
          </Button>
        </Card>
      );
    })}
  </div>
)}
       {/* MY BOOKINGS */}
{activeTab === 'my-bookings' && (
  bookings.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900">
      {bookings.map(b => (
        <Card key={b.id} title={`Booking #${b.id}`} subtitle={`Status: ${b.status || 'pending'}`}>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Event ID:</span>
              <span className="font-bold">{b.event_id || b.eventId}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSelectedBooking(b);
                setActiveTab('attendee-mgmt');
              }}
            >
              Manage Guests
            </Button>

            <Button
              variant="ghost"
              className="text-red-500"
              onClick={() => handleCancelBooking(b.id)}
            >
              Cancel
            </Button>
          </div>
        </Card>
      ))}
    </div>
  ) : (
    <div className="text-center py-20 text-gray-400">
      No bookings left. Redirecting...
    </div>
  )
)}

        {/* ADD EVENT FORM */}
        {activeTab === 'add-event' && (
          <div className="max-w-2xl mx-auto text-gray-900">
            <button onClick={() => setActiveTab(user.role === 'admin' ? 'admin-events' : 'vendor-events')} className="mb-6 flex items-center gap-2 text-gray-500"><ArrowLeft className="w-4 h-4" /> Back</button>
            <Card title="Launch New Event">
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                try {
                  // Sending both cases to ensure Spring Boot matches the model field
                  const payload = {
                    name: e.target.name.value,
                    description: e.target.description.value,
                    date: e.target.date.value,
                    venue_id: parseInt(e.target.venue.value),
                    venueId: parseInt(e.target.venue.value)
                  };
                  await api.post(`${SERVICES.EVENT}/events`, payload);
                  showNotification("Event created!");
                  setActiveTab(user.role === 'admin' ? 'admin-events' : 'vendor-events');
                  fetchData();
                } catch (err) { 
                  showNotification("Error creating event. Check Console.", "error"); 
                }
              }}>
                <Input label="Event Name" name="name" required />
                <Input label="Select Venue" name="venue" type="select" required>
                  <option value="">Choose Venue</option>
                  {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </Input>
                <Input label="Date" name="date" type="date" required />
                <Input label="Description" name="description" type="textarea" required />
                <Button type="submit" className="w-full mt-6 py-3">Publish Event</Button>
              </form>
            </Card>
          </div>
        )}

        {/* EVENT LISTS (Vendor/Admin) */}
        {(activeTab === 'admin-events' || activeTab === 'vendor-events') && (
          <div className="space-y-4 text-gray-900">
            {events.filter(e => user.role === 'admin' || (e.created_by || e.createdBy) === user.id).map(e => (
              <Card key={e.id} className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Calendar className="w-6 h-6" /></div>
                  <div><h3 className="font-bold text-lg">{e.name}</h3><p className="text-sm text-gray-500">{e.date} • Venue ID: {getVenueId(e)}</p></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setEditingEvent(e); setActiveTab('edit-event'); }}>Edit</Button>
                  <Button variant="danger" onClick={async () => {
                      if (!window.confirm("Delete event?")) return;
                      await api.delete(`${SERVICES.EVENT}/events/${e.id}`);
                      fetchData();
                    }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ADD VENUE FORM */}
        {activeTab === 'add-venue' && (
          <div className="max-w-2xl mx-auto text-gray-900">
            <button onClick={() => setActiveTab(user.role === 'admin' ? 'admin-venues' : 'vendor-venues')} className="mb-6 flex items-center gap-2 text-gray-500"><ArrowLeft className="w-4 h-4" /> Back</button>
            <Card title="Register New Venue">
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await api.post(`${SERVICES.VENUE}/venues`, {
                    name: e.target.name.value,
                    location: e.target.location.value,
                    capacity: parseInt(e.target.capacity.value),
                    price: parseFloat(e.target.price.value),
                    available: true
                  });
                  showNotification("Venue registered!");
                  setActiveTab(user.role === 'admin' ? 'admin-venues' : 'vendor-venues');
                  fetchData();
                } catch (err) { showNotification("Error creating venue", "error"); }
              }}>
                <Input label="Venue Name" name="name" required />
                <Input label="Location" name="location" required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Max Capacity" name="capacity" type="number" required />
                  <Input label="Daily Rate ($)" name="price" type="number" required />
                </div>
                <Button type="submit" className="w-full mt-6 py-3">Register Property</Button>
              </form>
            </Card>
          </div>
        )}

      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}>
      {React.cloneElement(icon, { className: "w-5 h-5" })}
      {label}
    </button>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <Card className="flex items-center gap-4 border-none shadow-sm">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </Card>
  );
}

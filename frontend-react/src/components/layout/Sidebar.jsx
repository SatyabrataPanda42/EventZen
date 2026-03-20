import {
  Calendar,
  LogOut,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  ClipboardList,
  UserCheck,
  Sparkles,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";
import SidebarItem from "../ui/SidebarItem";

export default function Sidebar({ user, activeTab, setActiveTab, logout }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 text-blue-600 mb-8">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:-rotate-6 transition-transform duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent" />
                <Sparkles className="w-6 h-6 text-blue-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-6 h-6 border-2 border-blue-500 rounded-md flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800">
                EventZen
              </span>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {user?.role === "admin" && (
            <>
              <SidebarItem
                icon={<BarChart3 />}
                label="Dashboard"
                active={activeTab === "admin-dashboard"}
                onClick={() => setActiveTab("admin-dashboard")}
              />
              <SidebarItem
                icon={<Users />}
                label="Manage Users"
                active={activeTab === "admin-users"}
                onClick={() => setActiveTab("admin-users")}
              />
              <SidebarItem
                icon={<MapPin />}
                label="All Venues"
                active={activeTab === "admin-venues"}
                onClick={() => setActiveTab("admin-venues")}
              />
              <SidebarItem
                icon={<CalendarIcon />}
                label="All Events"
                active={activeTab === "admin-events"}
                onClick={() => setActiveTab("admin-events")}
              />
              <SidebarItem
                icon={<ClipboardList />}
                label="Manage Bookings"
                active={activeTab === "manage-bookings"}
                onClick={() => setActiveTab("manage-bookings")}
              />
              <SidebarItem
                icon={<UserCheck />}
                label="All Attendees"
                active={activeTab === "admin-attendees"}
                onClick={() => setActiveTab("admin-attendees")}
              />
            </>
          )}

          {user?.role === "vendor" && (
            <>
              <SidebarItem
                icon={<MapPin />}
                label="My Venues"
                active={activeTab === "vendor-venues"}
                onClick={() => setActiveTab("vendor-venues")}
              />
              <SidebarItem
                icon={<CalendarIcon />}
                label="My Events"
                active={activeTab === "vendor-events"}
                onClick={() => setActiveTab("vendor-events")}
              />
              <SidebarItem
                icon={<ClipboardList />}
                label="Booking Requests"
                active={activeTab === "manage-bookings"}
                onClick={() => setActiveTab("manage-bookings")}
              />
            </>
          )}

          {user?.role === "customer" && (
            <>
              <SidebarItem
                icon={<MapPin />}
                label="Browse Venues"
                active={activeTab === "venues"}
                onClick={() => setActiveTab("venues")}
              />
              <SidebarItem
                icon={<CalendarIcon />}
                label="Events"
                active={activeTab === "events"}
                onClick={() => setActiveTab("events")}
              />
              <SidebarItem
                icon={<LayoutDashboard />}
                label="My Bookings"
                active={activeTab === "my-bookings"}
                onClick={() => setActiveTab("my-bookings")}
              />
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

        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 w-full text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}

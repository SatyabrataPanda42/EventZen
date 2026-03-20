import Button from "../ui/Button";
import { Plus, PlusCircle, Search, Bell } from "lucide-react";

export default function Header({ user, activeTab, setActiveTab }) {
  const title = activeTab.replace("-", " ");

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
      {/* LEFT: TITLE */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 capitalize tracking-tight">
          {title}
        </h1>
      </div>

      {/* RIGHT: SEARCH + ACTIONS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
        {/* SEARCH */}
        <div className="relative w-full sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl 
            focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          />
        </div>

        {/* NOTIFICATION */}
        <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 relative">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          {/* ADD VENUE */}
          {((user?.role === "admin" && activeTab === "admin-venues") ||
            (user?.role === "vendor" && activeTab === "vendor-venues")) && (
            <Button onClick={() => setActiveTab("add-venue")}>
              <Plus className="w-4 h-4" /> New Venue
            </Button>
          )}

          {/* ADD EVENT */}
          {((user?.role === "admin" && activeTab === "admin-events") ||
            (user?.role === "vendor" && activeTab === "vendor-events")) && (
            <Button onClick={() => setActiveTab("add-event")}>
              <PlusCircle className="w-4 h-4" /> Create Event
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

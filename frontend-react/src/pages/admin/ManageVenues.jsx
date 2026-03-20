import React from "react";
import {
  Edit,
  Trash2,
  Users,
  MapPin,
  DollarSign,
  ChevronRight,
  Calendar,
  PlusCircle,
  X,
} from "lucide-react";

/**
 * INTERNAL UI COMPONENTS
 * To ensure the file is self-contained and runnable in the preview environment,
 * we've inlined the Button and Card components.
 */
import { SERVICES } from "../../api/services";

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline: "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
    danger: "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Mocking the services API path for compilatio

export default function ManageVenues({
  venues = [],
  user = { role: "admin" }, // Default for preview
  api = { delete: async () => {} },
  fetchData = () => {},
  setEditingVenue = () => {},
  setActiveTab = () => {},
  setSelectedVenue = () => {},
}) {
  const handleDelete = async (venue) => {
    if (!window.confirm(`Are you sure you want to delete "${venue.name}"?`))
      return;

    try {
      await api.delete(`${SERVICES.VENUE}/venues/${venue.id}`);
      fetchData();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="">
      {/* Header section */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col"
          >
            {/* Image Header */}
            <div className="relative h-52 bg-gray-100 overflow-hidden">
              {venue.imageUrl ? (
                <img
                  src={
                    "https://imgcdn.bookmywed.in/UploadImages/venue/dbc7aaf5-8a1f-4134-a9f9-080e431186dc-gallery.webp"
                  }
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 text-indigo-200">
                  <Calendar className="w-16 h-16 opacity-40" />
                </div>
              )}

              {/* Floating Price Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                <p className="text-sm font-bold text-blue-600 flex items-center">
                  <DollarSign className="w-4 h-4 mr-0.5" />
                  <span className="text-lg">{venue.price}</span>
                  <span className="text-[10px] text-gray-400 font-bold ml-1 uppercase tracking-tighter">
                    /hr
                  </span>
                </p>
              </div>

              {/* Status Badge (Example) */}
              <div className="absolute bottom-4 left-4 bg-green-500/90 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm border border-green-400/30">
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                  Active
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-grow flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {venue.name}
                </h3>
                <div className="flex items-center text-gray-500 text-sm mt-1.5 font-medium">
                  <MapPin className="w-4 h-4 mr-1.5 text-blue-400 shrink-0" />
                  <span className="truncate">{venue.location}</span>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Capacity
                  </p>
                  <div className="flex items-center text-gray-800 font-bold">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    {venue.capacity}{" "}
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      pax
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Category
                  </p>
                  <div className="text-gray-800 font-bold truncate">
                    {venue.type || "Standard"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex gap-3">
                {user?.role === "customer" ? (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 group/btn"
                    onClick={() => {
                      setSelectedVenue(venue);
                      setActiveTab("venue-events");
                    }}
                  >
                    Check Availability
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="flex-grow py-3 border-gray-200"
                      onClick={() => {
                        setEditingVenue(venue);
                        setActiveTab("edit-venue");
                      }}
                    >
                      <Edit className="w-4 h-4" />
                      Manage
                    </Button>
                    <Button
                      variant="danger"
                      className="w-12 h-12 p-0 shrink-0 border-none"
                      onClick={() => handleDelete(venue)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {venues.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 px-6 bg-white rounded-[32px] border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative">
              <Calendar className="w-10 h-10 text-blue-400" />
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border border-blue-50">
                <PlusCircle className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              No venues available
            </h3>
            <p className="text-gray-500 max-w-sm mt-2 mb-8 text-center leading-relaxed">
              Your venue list is currently empty. Add a new space to start
              managing events and bookings.
            </p>
            {user?.role !== "customer" && (
              <Button
                onClick={() => setActiveTab("add-venue")}
                className="rounded-full px-8 py-3"
              >
                Get Started
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

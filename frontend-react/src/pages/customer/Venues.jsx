import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
export default function Venues({ venues, setSelectedVenue, setActiveTab }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-gray-50">
      {venues.map((venue) => (
        <div
          key={venue.id}
          className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 flex flex-col transition-all hover:shadow-xl"
        >
          {/* HEADER SECTION (Light Blue Area) */}
          <div className="relative h-56 bg-[#EBF2FF] flex items-center justify-center">
            {/* Main Placeholder Icon */}
            <svg
              className="w-24 h-24 text-blue-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>

            {/* Price Tag Overlay */}
            <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-50 flex items-baseline gap-1">
              <span className="text-[#2563EB] font-bold text-xl">
                ${venue.price}
              </span>
              <span className="text-gray-400 text-[10px] font-bold uppercase">
                /hr
              </span>
            </div>

            {/* Status Badge Overlay */}
            <div className="absolute bottom-6 left-6">
              <span className="bg-[#4ADE80] text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">
                Active
              </span>
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="p-8 flex-grow">
            <h3 className="text-2xl font-bold text-[#1E293B] mb-1">
              {venue.name}
            </h3>

            <div className="flex items-center text-blue-400 mb-8">
              <svg
                className="w-4 h-4 mr-1"
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
              <span className="text-sm font-medium lowercase">
                {venue.location}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="bg-[#F8FAFC] rounded-2xl p-5 grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                  Capacity
                </p>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-400"
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
                  <span className="font-bold text-gray-700">
                    {venue.capacity}{" "}
                    <span className="text-xs text-gray-400 font-normal ml-1">
                      pax
                    </span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedVenue(venue);
                  setActiveTab("venue-events");
                }}
                className="flex-grow flex items-center justify-center gap-2 border-2 border-gray-100 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-2xl transition-colors"
              >
                view events
              </button>
            </div>
          </div>
        </div>
      ))}

      {venues.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400">
          <svg
            className="w-16 h-16 mb-4 opacity-20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="italic text-lg">No venues found in your area.</p>
        </div>
      )}
    </div>
  );
}

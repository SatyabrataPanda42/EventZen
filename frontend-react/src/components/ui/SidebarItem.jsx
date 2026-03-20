import React from "react";
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {React.cloneElement(icon, { className: "w-5 h-5" })}
      {label}
    </button>
  );
}

export default SidebarItem;

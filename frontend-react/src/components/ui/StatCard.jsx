import Card from "./Card";
function StatCard({ label, value, icon }) {
  return (
    <Card className="flex items-center gap-4 border-none shadow-sm">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </Card>
  );
}

export default StatCard;

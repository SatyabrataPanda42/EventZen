export default function Notification({ notification }) {
  if (!notification) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] px-6 py-3 rounded-lg shadow-lg text-white font-semibold
      ${notification.type === "error" ? "bg-red-500" : "bg-green-500"}
    `}
    >
      {notification.msg}
    </div>
  );
}

import Card from "../../components/ui/Card";

export default function AdminAttendees(props) {
  const attendees = props.attendees || [];
  const bookings = props.bookings || [];

  return (
    <Card className="p-0 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
              Name
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
              Email
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
              Booking ID
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {attendees.map((a) => {
            const booking = (bookings || []).find((b) => b.id === a.bookingId);

            return (
              <tr key={a.id}>
                <td className="px-6 py-4">{a.name}</td>
                <td className="px-6 py-4">{a.email}</td>
                <td className="px-6 py-4">{a.bookingId}</td>
                <td className="px-6 py-4">
                  {booking ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Cancelled
                    </span>
                  )}
                </td>
              </tr>
            );
          })}

          {attendees.length === 0 && (
            <tr>
              <td
                colSpan="4"
                className="px-6 py-12 text-center text-gray-400 italic"
              >
                No attendees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

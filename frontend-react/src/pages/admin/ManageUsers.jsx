import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { Trash2 } from "lucide-react";
import { SERVICES } from "../../api/services";

export default function ManageUsers({
  allUsers,
  setAllUsers,
  api,
  fetchData,
  showNotification,
}) {
  return (
    <Card className="p-0 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
              User Name
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
              Email
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
              Role
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y text-gray-900">
          {allUsers.length > 0 ? (
            allUsers.map((u) => (
              <tr
                key={u.id || u._id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* NAME */}
                <td className="px-6 py-4 font-semibold">{u.name}</td>

                {/* EMAIL */}
                <td className="px-6 py-4 text-gray-500">{u.email}</td>

                {/* ROLE */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : u.role === "vendor"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    {/* PROMOTE TO VENDOR */}
                    {u.role === "customer" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            await api.put(
                              `${SERVICES.USER}/auth/update-role/${u.id || u._id}`,
                              { role: "vendor" },
                            );

                            // ✅ instant UI update
                            setAllUsers((prev) =>
                              prev.map((user) =>
                                (user.id || user._id) === (u.id || u._id)
                                  ? { ...user, role: "vendor" }
                                  : user,
                              ),
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
                          await api.delete(
                            `${SERVICES.USER}/auth/delete/${u.id || u._id}`,
                          );

                          showNotification("User deleted");

                          fetchData(); // refresh
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
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-6 py-12 text-center text-gray-400 italic"
              >
                No users found on user-service (Port 4000).
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

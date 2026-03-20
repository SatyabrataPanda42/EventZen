import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { ArrowLeft } from "lucide-react";
import { SERVICES } from "../../api/services";

export default function EditEvent({
  editingEvent,
  venues,
  user,
  api,
  fetchData,
  showNotification,
  setActiveTab,
}) {
  if (!editingEvent) return null;

  return (
    <div className="max-w-2xl mx-auto text-gray-900">
      {/* BACK */}
      <button
        onClick={() =>
          setActiveTab(user.role === "admin" ? "admin-events" : "vendor-events")
        }
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
                venueId: parseInt(e.target.venue.value),
              });

              showNotification("Event updated!");

              setActiveTab(
                user.role === "admin" ? "admin-events" : "vendor-events",
              );

              fetchData();
            } catch {
              showNotification("Update failed", "error");
            }
          }}
        >
          <Input label="Name" name="name" defaultValue={editingEvent.name} />

          <Input
            label="Venue"
            name="venue"
            type="select"
            defaultValue={editingEvent.venueId}
          >
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </Input>

          <Input
            label="Date"
            name="date"
            type="date"
            defaultValue={editingEvent.date}
          />

          <Input
            label="Description"
            name="description"
            type="textarea"
            defaultValue={editingEvent.description}
          />

          <Button type="submit" className="w-full mt-6">
            Update Event
          </Button>
        </form>
      </Card>
    </div>
  );
}

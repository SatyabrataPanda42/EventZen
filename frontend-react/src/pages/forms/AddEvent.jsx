import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { ArrowLeft } from "lucide-react";
import { SERVICES } from "../../api/services";

export default function AddEvent({
  user,
  venues,
  api,
  fetchData,
  showNotification,
  setActiveTab,
}) {
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

      <Card title="Launch New Event">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              const payload = {
                name: e.target.name.value,
                description: e.target.description.value,
                date: e.target.date.value,
                venue_id: parseInt(e.target.venue.value),
                venueId: parseInt(e.target.venue.value),
              };

              await api.post(`${SERVICES.EVENT}/events`, payload);

              showNotification("Event created!");

              setActiveTab(
                user.role === "admin" ? "admin-events" : "vendor-events",
              );

              fetchData();
            } catch (err) {
              showNotification("Error creating event. Check Console.", "error");
            }
          }}
        >
          <Input label="Event Name" name="name" required />

          <Input label="Select Venue" name="venue" type="select" required>
            <option value="">Choose Venue</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </Input>

          <Input label="Date" name="date" type="date" required />

          <Input
            label="Description"
            name="description"
            type="textarea"
            required
          />

          <Button type="submit" className="w-full mt-6 py-3">
            Publish Event
          </Button>
        </form>
      </Card>
    </div>
  );
}

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { ArrowLeft } from "lucide-react";
import { SERVICES } from "../../api/services";

export default function EditVenue({
  editingVenue,
  api,
  fetchData,
  showNotification,
  setActiveTab,
}) {
  if (!editingVenue) return null;

  return (
    <div className="max-w-2xl mx-auto text-gray-900">
      {/* BACK */}
      <button
        onClick={() => setActiveTab("vendor-venues")}
        className="mb-6 flex items-center gap-2 text-gray-500"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <Card title="Edit Venue">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              await api.put(`${SERVICES.VENUE}/venues/${editingVenue.id}`, {
                name: e.target.name.value,
                location: e.target.location.value,
                capacity: parseInt(e.target.capacity.value),
                price: parseFloat(e.target.price.value),
              });

              showNotification("Venue updated!");
              setActiveTab("vendor-venues");
              fetchData();
            } catch {
              showNotification("Update failed", "error");
            }
          }}
        >
          <Input label="Name" name="name" defaultValue={editingVenue.name} />

          <Input
            label="Location"
            name="location"
            defaultValue={editingVenue.location}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Capacity"
              name="capacity"
              type="number"
              defaultValue={editingVenue.capacity}
            />
            <Input
              label="Price"
              name="price"
              type="number"
              defaultValue={editingVenue.price}
            />
          </div>

          <Button type="submit" className="w-full mt-6">
            Update Venue
          </Button>
        </form>
      </Card>
    </div>
  );
}

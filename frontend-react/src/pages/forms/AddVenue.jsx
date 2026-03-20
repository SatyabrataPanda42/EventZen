import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { ArrowLeft } from "lucide-react";
import { SERVICES } from "../../api/services";

export default function AddVenue({
  user,
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
          setActiveTab(user.role === "admin" ? "admin-venues" : "vendor-venues")
        }
        className="mb-6 flex items-center gap-2 text-gray-500"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <Card title="Register New Venue">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              await api.post(`${SERVICES.VENUE}/venues`, {
                name: e.target.name.value,
                location: e.target.location.value,
                capacity: parseInt(e.target.capacity.value),
                price: parseFloat(e.target.price.value),
                available: true,
              });

              showNotification("Venue registered!");

              setActiveTab(
                user.role === "admin" ? "admin-venues" : "vendor-venues",
              );

              fetchData();
            } catch (err) {
              showNotification("Error creating venue", "error");
            }
          }}
        >
          <Input label="Venue Name" name="name" required />

          <Input label="Location" name="location" required />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max Capacity"
              name="capacity"
              type="number"
              required
            />
            <Input label="Daily Rate (₹)" name="price" type="number" required />
          </div>

          <Button type="submit" className="w-full mt-6 py-3">
            Register Property
          </Button>
        </form>
      </Card>
    </div>
  );
}

import ManageVenues from "../admin/ManageVenues";

export default function VendorVenues({
  venues,
  user,
  api,
  fetchData,
  setEditingVenue,
  setActiveTab,
  setSelectedVenue,
}) {
  return (
    <ManageVenues
      venues={venues}
      user={user}
      api={api}
      fetchData={fetchData}
      setEditingVenue={setEditingVenue}
      setActiveTab={setActiveTab}
      setSelectedVenue={setSelectedVenue}
    />
  );
}

import ManageEvents from "../admin/ManageEvents";

export default function VendorEvents({
  events,
  user,
  setEditingEvent,
  setActiveTab,
  api,
  fetchData,
}) {
  return (
    <ManageEvents
      events={events}
      user={user}
      setEditingEvent={setEditingEvent}
      setActiveTab={setActiveTab}
      api={api}
      fetchData={fetchData}
    />
  );
}

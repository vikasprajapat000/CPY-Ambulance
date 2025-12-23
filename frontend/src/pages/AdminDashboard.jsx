import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch bookings function
  const fetchBookings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bookings');
      const data = await res.json();
      setBookings(data.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    }
  };

  // 🔁 Auto refresh every 1 second
  useEffect(() => {
    fetchBookings(); // initial load

    const interval = setInterval(() => {
      fetchBookings();
    }, 1000); // 1 second

    return () => clearInterval(interval); // cleanup
  }, []);

  // Approve booking
  const approveBooking = async (id) => {
    await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'APPROVED' }),
    });

    // optional: instant UI update (no wait)
    setBookings(prev =>
      prev.map(b =>
        b._id === id ? { ...b, status: 'APPROVED' } : b
      )
    );
  };

  if (loading) return <p className="p-6">Loading bookings...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🚑 Admin Dashboard</h1>

      {bookings.length === 0 && (
        <p className="text-gray-500">No bookings yet.</p>
      )}

      {bookings.map(booking => (
        <div
          key={booking._id}
          className="border p-4 mb-4 rounded bg-white shadow"
        >
          <p><b>Patient:</b> {booking.patientName}</p>
          <p><b>Phone:</b> {booking.phone}</p>
          <p><b>Emergency:</b> {booking.emergencyType}</p>
          <p>
            <b>Status:</b>{' '}
            <span
              className={`font-semibold ${
                booking.status === 'APPROVED'
                  ? 'text-green-600'
                  : 'text-orange-600'
              }`}
            >
              {booking.status}
            </span>
          </p>

          {booking.status.toUpperCase() === 'PENDING' && (
            <button
              onClick={() => approveBooking(booking._id)}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;

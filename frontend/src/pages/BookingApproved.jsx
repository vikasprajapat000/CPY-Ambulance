import { CheckCircle, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const BookingApproved = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
        <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Booking Approved</h1>
        <p className="text-gray-600 mb-6">
          Your ambulance request has been approved successfully.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="bg-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400"
          >
            Go Home
          </Link>

          <Link
            to={`/tracking/${id}`}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2"
          >
            <MapPin className="h-5 w-5" />
            Track Ambulance
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingApproved;


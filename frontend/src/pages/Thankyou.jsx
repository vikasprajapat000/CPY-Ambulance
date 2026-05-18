import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center">

          <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Thank You for Contacting Us!
          </h1>

          <p className="text-gray-600 mb-6">
            Your message has been sent successfully.
            Our emergency response team will contact you shortly
            via phone or WhatsApp.
          </p>

          <Link
            to="/"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Back to Home
          </Link>

        </div>
      </div>
    </div>
  );
};

export default ThankYou;

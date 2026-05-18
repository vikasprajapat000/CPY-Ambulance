import { Link } from 'react-router-dom';
import { Ambulance } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg">
        <Ambulance />
        CPY Ambulance
      </Link>

      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/booking" className="hover:underline">Book</Link>
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;

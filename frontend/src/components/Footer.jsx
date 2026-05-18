const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 text-center py-6 mt-10">
      <p>© {new Date().getFullYear()} CPY Ambulance Service</p>
      <p className="text-sm">24/7 Emergency Medical Support</p>
    </footer>
  );
};

export default Footer;

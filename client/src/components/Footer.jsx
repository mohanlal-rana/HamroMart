import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-800 mt-16 border-t border-gray-200 w-full">
      {/* Centered Container */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold mb-4">YourStore</h2>
          <p className="text-gray-600 mb-4">
            YourStore is your one-stop shop for quality products at amazing prices. Shop from anywhere, anytime!
          </p>
          <div className="flex gap-3 mt-2 text-blue-600">
            <a href="#" className="hover:text-blue-800"><FaFacebookF /></a>
            <a href="#" className="hover:text-blue-800"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-800"><FaTwitter /></a>
            <a href="#" className="hover:text-blue-800"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-600">Home</a></li>
            <li><a href="#" className="hover:text-blue-600">About Us</a></li>
            <li><a href="#" className="hover:text-blue-600">Shop</a></li>
            <li><a href="#" className="hover:text-blue-600">Contact</a></li>
            <li><a href="#" className="hover:text-blue-600">Blog</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-600">FAQ</a></li>
            <li><a href="#" className="hover:text-blue-600">Returns</a></li>
            <li><a href="#" className="hover:text-blue-600">Shipping</a></li>
            <li><a href="#" className="hover:text-blue-600">Track Order</a></li>
            <li><a href="#" className="hover:text-blue-600">Terms & Conditions</a></li>
          </ul>
        </div>

    {/* Newsletter */}

<div>
  <h3 className="font-semibold mb-4">Newsletter</h3>
  <p className="text-gray-600 mb-3">Subscribe to get the latest offers and updates.</p>

  <div className="flex flex-col md:flex-row gap-2">
    <input 
      type="email" 
      placeholder="Enter your email" 
      className="w-full md:flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
    />
    <button className="px-4 py-2 w-full md:w-auto bg-blue-600 rounded-lg hover:bg-blue-700 transition text-white font-semibold">
      Subscribe
    </button>
  </div>
</div>


      </div>

      {/* Bottom Copyright */}
      <div className="py-4 text-center text-gray-500 text-sm border-t border-gray-200">
        &copy; {new Date().getFullYear()} HamroMart. All rights reserved.
      </div>
    </footer>
  );
}

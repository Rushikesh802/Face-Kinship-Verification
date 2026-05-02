import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neu-bg/95 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="kinVision Logo" className="w-10 h-10 object-cover rounded-lg group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
            <h1 className="text-xl font-bold text-text-primary font-[family-name:var(--font-family-heading)]">
              kin<span className="gradient-text">Vision</span>
            </h1>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-clay-blue bg-white/5'
                    : 'text-text-primary hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/analyze"
              className="ml-3 clay-btn clay-btn-lg !py-2.5 !px-5 !text-sm !rounded-xl"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-text-primary hover:bg-white/10 transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg font-semibold transition-colors ${
                location.pathname === link.to
                  ? 'text-clay-blue bg-white/5'
                  : 'text-text-primary hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

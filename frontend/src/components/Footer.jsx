import { Link } from 'react-router-dom';
import { Users, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative px-6 py-20 bg-neu-bg border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="neu-container-lg p-10 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="clay-icon-purple w-10 h-10 flex items-center justify-center rounded-lg">
                <Users size={22} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary font-[family-name:var(--font-family-heading)]">
                Face <span className="gradient-text">Kinship</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-text-secondary">
              AI-powered facial kinship verification using Siamese Neural Networks
              and AdaFace embeddings. Built with privacy-first principles and deep learning precision.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Navigate</h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/analyze', label: 'Analyze' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Technology</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>AdaFace IR-101</li>
              <li>Siamese Neural Network</li>
              <li>PyTorch & FastAPI</li>
              <li>SCRFD Face Detection</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/10" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-text-muted flex items-center gap-1">
            Built with <Heart size={14} className="text-clay-danger" /> using PyTorch & React
          </p>
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Face Kinship — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

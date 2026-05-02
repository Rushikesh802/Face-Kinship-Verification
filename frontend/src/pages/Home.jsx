import { Link } from 'react-router-dom';
import {
  ArrowRight, Upload, Brain, Shield, Zap, TrendingUp,
  Scan, Search, FileSearch, Users, Lock, Eye
} from 'lucide-react';

export default function Home() {
  return (
    <div className="pt-20">
      {/* ─── Hero Section ─────────────────────────────────────── */}
      <section className="min-h-screen flex items-center px-4 py-12 relative overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 animate-float bg-clay-purple" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float-delayed bg-clay-blue" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-clay-success" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hero Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full clay-badge animate-pulse-clay">
                  <Zap size={16} className="text-yellow-400" />
                  <span>Powered by AdaFace & SCRFD</span>
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-text-primary font-[family-name:var(--font-family-heading)]">
                  Discover Your
                  <br />
                  <span className="gradient-text inline-block animate-gradient">
                    Family Bonds
                  </span>
                </h1>
                <p className="text-xl md:text-2xl font-medium text-text-secondary max-w-xl mx-auto lg:mx-0">
                  Advanced facial recognition technology that verifies kinship
                  relationships with{' '}
                  <span className="text-clay-blue font-bold">deep learning</span>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/analyze"
                  className="clay-btn clay-btn-lg flex items-center justify-center gap-3 text-lg group"
                >
                  <Upload size={24} />
                  Start Analysis
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="clay-btn clay-btn-purple clay-btn-lg flex items-center justify-center gap-3 text-lg"
                >
                  <Brain size={22} />
                  Learn More
                </a>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {[
                  { icon: <Brain size={16} className="text-clay-blue" />, label: 'Siamese Network' },
                  { icon: <TrendingUp size={16} className="text-clay-purple" />, label: 'KinFaceW-II' },
                  { icon: <Shield size={16} className="text-clay-success" />, label: 'Privacy First' },
                ].map((pill, i) => (
                  <div key={i} className="px-4 py-2 flex items-center gap-2 rounded-full neu-container-sm">
                    {pill.icon}
                    <span className="text-sm font-medium text-text-secondary">{pill.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Glass AI Panel */}
            <div className="relative hidden lg:block">
              <div className="glass-panel p-8 overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-transparent to-purple-500/15" />
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent animate-scan" />
                </div>

                {/* Header */}
                <div className="relative mb-8">
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    Live Kinship Inference
                  </h3>
                  <p className="text-sm text-white/60">
                    Siamese Neural Network · Real-time similarity scoring
                  </p>
                  <div className="flex gap-2 mt-3">
                    {['Face Alignment', 'Embedding Match', 'Cosine Similarity'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Input Placeholders */}
                <div className="relative grid grid-cols-2 gap-8 mb-10">
                  {[
                    { label: 'Input A', color: 'blue' },
                    { label: 'Input B', color: 'purple' },
                  ].map(({ label, color }) => (
                    <div
                      key={label}
                      className="relative aspect-square rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:border-white/20"
                    >
                      <div className="relative">
                        <Users size={56} className={color === 'blue' ? 'text-blue-400/60' : 'text-purple-400/60'} />
                      </div>
                      <span className="text-xs tracking-wide text-white/60">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Neural Connection Line */}
                <div className="relative mb-6">
                  <div className="relative h-[2px] w-full rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 animate-flow" />
                </div>


              </div>

              {/* Outer Glow */}
              <div className="absolute inset-0 -z-10 blur-[90px] opacity-25 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-[36px]" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary font-[family-name:var(--font-family-heading)]">
              What is <span className="gradient-text">kinVision</span>?
            </h2>
            <p className="max-w-2xl mx-auto text-text-secondary">
              An AI-based system that analyzes facial similarities between two individuals
              to estimate biological relationships using deep learning models.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain size={32} className="text-white" />,
                iconClass: 'clay-icon',
                title: 'Feature Extraction',
                desc: 'AdaFace IR-101 deep feature extraction captures 512 unique facial characteristics for precise similarity analysis.',
              },
              {
                icon: <Search size={28} className="text-white" />,
                iconClass: 'clay-icon-purple',
                title: 'Siamese Network',
                desc: 'Twin Siamese neural networks extract and compare facial embeddings using 4-component fusion.',
              },
              {
                icon: <FileSearch size={28} className="text-white" />,
                iconClass: 'clay-icon-success',
                title: 'Result Analysis',
                desc: 'Cosine similarity, L2 distance, and Hadamard product compute kinship probability with 93.1% AUC.',
              },
            ].map((item, i) => (
              <div key={i} className="clay-card text-center">
                <div className={`${item.iconClass} mb-6 mx-auto`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-primary">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Privacy Section ──────────────────────────────────── */}
      <section className="py-20 px-4 bg-neu-bg-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 clay-badge">
              <Shield size={20} />
              <span className="font-bold">Your Privacy Matters</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary font-[family-name:var(--font-family-heading)]">
              Privacy & <span className="gradient-text">Security</span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-text-secondary">
              We take your privacy seriously. Here's how we protect your data
              and ensure your information remains secure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Lock size={24} className="text-white" />,
                iconClass: 'clay-icon-success',
                title: 'Zero Storage',
                desc: 'Images are never stored on our servers. They exist only during analysis.',
              },
              {
                icon: <Zap size={24} className="text-white" />,
                iconClass: 'clay-icon',
                title: 'Instant Processing',
                desc: 'Analysis happens in real-time, then all data is immediately deleted.',
              },
              {
                icon: <Eye size={24} className="text-white" />,
                iconClass: 'clay-icon-purple',
                title: 'No Third Parties',
                desc: 'Your data is never shared, sold, or accessed by any third party.',
              },
            ].map((card, i) => (
              <div key={i} className="neu-container p-6 text-center">
                <div className={`${card.iconClass} mb-4 mx-auto !w-12 !h-12 !rounded-full`}>
                  {card.icon}
                </div>
                <h3 className="font-bold mb-2 text-text-primary">{card.title}</h3>
                <p className="text-sm text-text-secondary">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="neu-container-lg p-12">
            <h2 className="font-[family-name:var(--font-family-heading)] text-3xl font-bold text-text-primary mb-4">
              Ready to Discover?
            </h2>
            <p className="text-text-secondary mb-8 text-lg">
              Upload two photos and find out if there's a family connection in seconds.
            </p>
            <Link to="/analyze" className="animated-compare-btn inline-flex items-center gap-3 group">
              <div className="btn-content">
                <Scan size={24} />
                <span>Try It Now</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

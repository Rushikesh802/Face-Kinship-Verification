import { Brain, Database, Layers, Target, GitBranch, BarChart3 } from 'lucide-react';

const techStack = [
  {
    icon: <Brain size={24} />,
    name: 'AdaFace IR-101',
    role: 'Feature Extraction',
    desc: 'Pre-trained on WebFace12M (12M+ face images). Produces 512-d identity-rich embeddings with adaptive margin loss.',
    iconClass: 'clay-icon',
  },
  {
    icon: <Target size={24} />,
    name: 'SCRFD',
    role: 'Face Detection',
    desc: 'InsightFace SCRFD anchor-free detector with 5-point landmark alignment. Ensures 112×112 standardized face crops.',
    iconClass: 'clay-icon-purple',
  },
  {
    icon: <GitBranch size={24} />,
    name: 'Siamese Network',
    role: 'Kinship Classifier',
    desc: 'Custom 4-component fusion: absolute difference, Hadamard product, cosine similarity, and L2 distance.',
    iconClass: 'clay-icon-success',
  },
  {
    icon: <Database size={24} />,
    name: 'KinFaceW-II + FIW',
    role: 'Training Data',
    desc: 'Pre-trained on Families in the Wild and fine-tuned on KinFaceW-II benchmark with 4 relationship types.',
    iconClass: 'clay-icon',
  },
  {
    icon: <Layers size={24} />,
    name: 'PyTorch + FastAPI',
    role: 'Backend Stack',
    desc: 'Production-grade Python backend using PyTorch for inference and FastAPI for high-performance async API.',
    iconClass: 'clay-icon-purple',
  },
  {
    icon: <BarChart3 size={24} />,
    name: 'React + Tailwind',
    role: 'Frontend Stack',
    desc: 'Modern React frontend with Tailwind CSS, neumorphic design, and smooth micro-animations.',
    iconClass: 'clay-icon-success',
  },
];

const metrics = [
  { label: 'AUC-ROC', value: '0.931', desc: 'Area under ROC curve' },
  { label: 'Threshold', value: '0.519', desc: "Youden's J optimized" },
  { label: 'Embedding', value: '512-d', desc: 'L2-normalized vectors' },
  { label: 'Backbone', value: '101 layers', desc: 'iResNet architecture' },
];

export default function About() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4 font-[family-name:var(--font-family-heading)]">
              About <span className="gradient-text">kinVision</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
              An AI-powered facial kinship verification system that uses deep learning
              to determine if two people share a familial relationship.
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16 fade-in fade-in-delay-1">
            {metrics.map((m, i) => (
              <div key={i} className="neu-container p-5 text-center">
                <p className="text-2xl font-bold gradient-text font-[family-name:var(--font-family-heading)]">
                  {m.value}
                </p>
                <p className="text-text-primary text-sm font-semibold mt-1">{m.label}</p>
                <p className="text-text-muted text-xs mt-0.5">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Pipeline */}
          <div className="neu-container-lg p-8 mb-16 fade-in fade-in-delay-2">
            <h2 className="font-[family-name:var(--font-family-heading)] text-2xl font-bold text-text-primary mb-6 text-center">
              ML Pipeline Architecture
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-sm">
              {[
                { label: 'Input Image', bg: 'bg-slate-600' },
                { label: 'SCRFD', bg: 'bg-clay-danger' },
                { label: 'Align 112×112', bg: 'bg-clay-warning' },
                { label: 'AdaFace IR-101', bg: 'bg-clay-purple' },
                { label: '512-d Embedding', bg: 'bg-clay-blue' },
                { label: 'Siamese Fusion', bg: 'bg-indigo-500' },
                { label: 'Kinship Score', bg: 'bg-clay-success' },
              ].map((step, i, arr) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`px-4 py-2.5 rounded-lg ${step.bg} text-white font-semibold whitespace-nowrap shadow-lg`}>
                    {step.label}
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-text-muted text-lg hidden md:block">→</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-text-muted text-xs text-center mt-4">
              × 2 images → embeddings compared via 4-component fusion → binary kinship prediction
            </p>
          </div>

          {/* Tech Stack */}
          <div className="mb-16">
            <h2 className="font-[family-name:var(--font-family-heading)] text-3xl font-bold text-text-primary mb-8 text-center">
              Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech, i) => (
                <div key={i} className="clay-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${tech.iconClass} !w-12 !h-12 !rounded-xl`}>
                      {tech.icon}
                    </div>
                    <div>
                      <h3 className="text-text-primary font-semibold">{tech.name}</h3>
                      <p className="text-xs text-text-muted">{tech.role}</p>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>


        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function ResultCard({ result }) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const { is_related, confidence, raw_probability, threshold } = result;
  const displayConfidence = Math.min(confidence, 99);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(displayConfidence);
    }, 100);
    return () => clearTimeout(timer);
  }, [displayConfidence]);

  const barColor = is_related
    ? 'bg-gradient-to-r from-clay-success to-clay-blue'
    : 'bg-gradient-to-r from-clay-danger to-clay-warning';

  const ringColor = is_related
    ? 'border-clay-success text-clay-success'
    : 'border-clay-danger text-clay-danger';

  return (
    <div className="neu-container-lg p-8 fade-in">
      {/* Verdict */}
      <div className="flex flex-col items-center gap-4 mb-8">
        {/* Score Gauge Circle */}
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold border-4 transition-all duration-1000 ${ringColor}`}
        >
          {Math.round(animatedConfidence)}%
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {is_related ? (
              <CheckCircle2 size={22} className="text-clay-success" />
            ) : (
              <XCircle size={22} className="text-clay-danger" />
            )}
            <h3
              className={`font-[family-name:var(--font-family-heading)] text-3xl font-bold ${
                is_related ? 'text-clay-success' : 'text-clay-danger'
              }`}
            >
              {is_related ? 'Related' : 'Not Related'}
            </h3>
          </div>
          <p className="text-text-secondary text-sm mt-2">
            {is_related
              ? 'Our AI model detected familial facial features between these individuals.'
              : 'Our AI model did not find significant familial resemblance.'}
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="space-y-3 fade-in fade-in-delay-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider uppercase text-text-secondary">Confidence</span>
          <span
            className={`text-lg font-bold ${
              is_related ? 'text-clay-success' : 'text-clay-danger'
            }`}
          >
            {Math.round(animatedConfidence)}%
          </span>
        </div>

        <div className="w-full h-3 bg-neu-bg-light rounded-full overflow-hidden" style={{
          boxShadow: 'inset 4px 4px 8px var(--color-neu-dark), inset -4px -4px 8px var(--color-neu-light)',
        }}>
          <div
            className={`confidence-bar h-full rounded-full ${barColor}`}
            style={{ width: `${animatedConfidence}%` }}
          />
        </div>

        <p className="text-xs text-text-muted text-center mt-3 flex items-center justify-center gap-1">
          <Info size={12} />
          This result is based on facial feature analysis and should be used as a reference only.
        </p>
      </div>

      {/* Technical details */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <button
          id="toggle-technical-details"
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors w-full justify-center"
        >
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span>{showDetails ? 'Hide' : 'View'} Technical Details</span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            showDetails ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="neu-pressed-sm p-3 text-center">
              <p className="text-text-muted text-xs mb-1">Raw Probability</p>
              <p className="text-text-primary font-mono font-bold">{raw_probability?.toFixed(4)}</p>
            </div>
            <div className="neu-pressed-sm p-3 text-center">
              <p className="text-text-muted text-xs mb-1">Threshold</p>
              <p className="text-text-primary font-mono font-bold">{threshold?.toFixed(4)}</p>
            </div>
            <div className="neu-pressed-sm p-3 text-center">
              <p className="text-text-muted text-xs mb-1">Model</p>
              <p className="text-text-primary text-xs font-bold">AdaFace IR-101</p>
            </div>
            <div className="neu-pressed-sm p-3 text-center">
              <p className="text-text-muted text-xs mb-1">Embedding</p>
              <p className="text-text-primary text-xs font-bold">512-d L2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="neu-container-lg p-8 space-y-6 fade-in">
      {/* Scan animation header */}
      <div className="flex items-center justify-center gap-3">
        <div className="spinner" />
        <p className="text-clay-blue font-semibold animate-pulse">Analyzing facial features...</p>
      </div>

      {/* Progress steps */}
      <div className="space-y-4 max-w-sm mx-auto">
        {[
          'Detecting faces with MTCNN...',
          'Aligning to 112×112...',
          'Extracting AdaFace embeddings...',
          'Computing kinship probability...',
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3" style={{ animationDelay: `${i * 0.3}s` }}>
            <div
              className="w-2.5 h-2.5 rounded-full bg-clay-blue animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
            <p className="text-sm text-text-secondary animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
              {step}
            </p>
          </div>
        ))}
      </div>

      {/* Skeleton bars */}
      <div className="space-y-3 pt-4">
        <div className="skeleton h-6 w-3/4 mx-auto" />
        <div className="skeleton h-4 w-1/2 mx-auto" />
        <div className="skeleton h-8 w-full rounded-full" />
      </div>
    </div>
  );
}

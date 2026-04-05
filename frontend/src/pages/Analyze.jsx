import { useState } from 'react';
import { Scan, RotateCcw, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import ImageUploader from '../components/ImageUploader';
import ResultCard from '../components/ResultCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function Analyze() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const canSubmit = image1 && image2 && !image1.detecting && !image2.detecting && !loading;

  const handleVerify = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('image1', image1.file);
    formData.append('image2', image2.file);

    try {
      const response = await axios.post('/api/verify-kinship', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      setResult(response.data);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage1(null);
    setImage2(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center mb-12 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary font-[family-name:var(--font-family-heading)]">
            The Kinship <span className="gradient-text">Lab</span>
          </h1>
          <p className="max-w-2xl mx-auto text-text-secondary">
            Upload two face images to analyze their kinship relationship. Our
            AI will compare facial features and determine biological similarity.
          </p>
        </div>

        <div className="container mx-auto max-w-6xl">
          {/* Upload cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-10 fade-in fade-in-delay-1">
            <ImageUploader
              id="upload-person-1"
              label="Face 1"
              image={image1}
              onImageChange={setImage1}
            />
            <ImageUploader
              id="upload-person-2"
              label="Face 2"
              image={image2}
              onImageChange={setImage2}
            />
          </div>

          {/* Compare Button */}
          <div className="text-center mb-10 fade-in fade-in-delay-2">
            <button
              id="verify-kinship-btn"
              onClick={handleVerify}
              disabled={!canSubmit}
              className="animated-compare-btn"
            >
              <div className="btn-content">
                {loading ? (
                  <>
                    <Loader2 size={26} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <div className="icon-wrapper">
                      <Scan size={26} />
                    </div>
                    <span>Compare Faces</span>
                  </>
                )}
              </div>
            </button>

            {(image1 || image2 || result) && (
              <button
                id="reset-btn"
                onClick={handleReset}
                className="ml-4 px-6 py-3.5 rounded-[16px] text-text-secondary font-semibold neu-container-sm hover:text-text-primary transition-colors inline-flex items-center gap-2"
              >
                <RotateCcw size={18} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-8 max-w-2xl mx-auto fade-in">
              <div className="neu-container p-4 border-2 border-clay-danger/30 flex items-center gap-3">
                <AlertCircle size={24} className="text-clay-danger flex-shrink-0" />
                <p className="text-clay-danger font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="max-w-lg mx-auto">
            {loading && <LoadingSkeleton />}
            {result && !loading && <ResultCard result={result} />}
          </div>
        </div>
      </section>
    </div>
  );
}

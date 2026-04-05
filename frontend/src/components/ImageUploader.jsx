import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, CheckCircle2, Camera, Loader2, ScanFace } from 'lucide-react';

export default function ImageUploader({ label, image, onImageChange, id }) {
  const [dragOver, setDragOver] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleFile = useCallback(
    (file) => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const originalPreview = e.target.result;
          onImageChange({ file, preview: originalPreview, detecting: true });

          try {
            const formData = new FormData();
            formData.append('image', file);
            
            const res = await fetch('/api/detect-face', {
              method: 'POST',
              body: formData,
            });
            const data = await res.json();
            
            if (data.bbox) {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                const [x1, y1, x2, y2] = data.bbox;
                ctx.strokeStyle = '#00ff88'; 
                ctx.lineWidth = Math.max(4, Math.floor(img.width / 100)); 
                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                
                ctx.fillStyle = 'rgba(0, 255, 136, 0.15)';
                ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
                
                const newPreview = canvas.toDataURL('image/jpeg', 0.95);
                onImageChange({ file, preview: newPreview, detecting: false });
              };
              img.src = originalPreview;
            } else {
              onImageChange({ file, preview: originalPreview, detecting: false, noFace: true });
            }
          } catch (err) {
            console.error('Face detection failed:', err);
            onImageChange({ file, preview: originalPreview, detecting: false });
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const startCamera = async (e) => {
    e.stopPropagation();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setIsCameraOpen(true);
      // Allow video element to render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please allow permissions.');
    }
  };

  const captureImage = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      // Mirror the image if it's front-facing (standard behavior for webcams)
      // ctx.translate(canvas.width, 0);
      // ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          handleFile(file);
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleClick = () => {
    if (!isCameraOpen) {
      inputRef.current?.click();
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onImageChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      className={`relative group transition-all duration-300 ${dragOver ? 'scale-[1.02]' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        id={id}
        onClick={handleClick}
        className={`relative h-80 overflow-hidden cursor-pointer transition-all duration-300 rounded-[20px]
          ${image || isCameraOpen ? 'neu-container' : 'neu-pressed'}
          ${dragOver ? 'shadow-[0_8px_24px_rgba(74,143,217,0.35)] scale-[1.02]' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {image ? (
          <>
            <img
              src={image.preview}
              alt={label}
              className="w-full h-full object-cover rounded-[20px]"
            />

            {/* Hover overlay with remove button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px]">
              <button
                onClick={handleRemove}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-gradient-to-br from-clay-danger to-clay-danger-dark text-white shadow-[0_4px_12px_rgba(231,76,60,0.4)] hover:scale-110 transition-transform"
                title="Remove image"
              >
                <X size={18} />
              </button>
            </div>

            {/* Bottom label */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-[20px]">
              <div className="flex items-center gap-2">
                {image.detecting ? (
                  <>
                    <Loader2 size={16} className="text-primary-violet animate-spin" />
                    <p className="text-sm text-primary-violet font-semibold">Detecting face...</p>
                  </>
                ) : image.noFace ? (
                  <>
                    <X size={16} className="text-clay-danger" />
                    <p className="text-sm text-clay-danger font-semibold">No face detected</p>
                  </>
                ) : (
                  <>
                    <ScanFace size={16} className="text-clay-success" />
                    <p className="text-sm text-clay-success font-semibold">{label} uploaded ✓</p>
                  </>
                )}
              </div>
            </div>
          </>
        ) : isCameraOpen ? (
          <div className="relative w-full h-full bg-black rounded-[20px] flex flex-col items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover -scale-x-100"
            />
            <div className="absolute bottom-6 flex gap-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stopCamera();
                }}
                className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 hover:scale-110 transition-all shadow-lg border border-white/30"
                title="Cancel"
              >
                <X size={24} />
              </button>
              <button
                onClick={captureImage}
                className="p-4 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full hover:scale-110 transition-all shadow-[0_4px_16px_rgba(59,130,246,0.6)] border-2 border-white/30"
                title="Capture"
              >
                <Camera size={28} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center relative z-10">
            <div className="mb-4 clay-icon animate-float">
              <Upload size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-primary">
              Upload {label}
            </h3>
            <p className="mb-4 text-text-secondary">
              Drag & drop or click to browse
            </p>
            
            <button 
              onClick={startCamera}
              className="mt-2 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 text-white text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all shadow-md group border border-slate-600 z-20"
            >
              <Camera size={16} className="text-slate-300 group-hover:text-white transition-colors" />
              <span>Use Camera</span>
            </button>

            <p className="mt-4 text-xs text-text-muted">
              Supports: JPG, PNG, WebP (Max 10MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


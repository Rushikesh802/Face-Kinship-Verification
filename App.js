import React, { useState, useRef } from "react";
import {
  Upload,
  Scan,
  Users,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Brain,
  Shield,
  Search,
  FileSearch,
  ArrowRight,
  ChevronDown,
  Lock,
  Eye,
  Moon,
  Sun,
  Zap,
  TrendingUp,
} from "lucide-react";
import ContactPage from "./ContactPage";

const API_URL = "http://localhost:5000";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver1, setDragOver1] = useState(false);
  const [dragOver2, setDragOver2] = useState(false);
  const [validating1, setValidating1] = useState(false);
  const [validating2, setValidating2] = useState(false);
  const [validation1, setValidation1] = useState(null);
  const [validation2, setValidation2] = useState(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);
  const uploadSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const privacySectionRef = useRef(null);

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPrivacy = () => {
    privacySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const validateFaceInImage = async (file, imageNumber) => {
    const setValidating = imageNumber === 1 ? setValidating1 : setValidating2;
    const setValidation = imageNumber === 1 ? setValidation1 : setValidation2;

    setValidating(true);
    setValidation(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_URL}/validate`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.valid) {
        setValidation({ valid: true, message: "Face detected ✓" });
      } else {
        setValidation({ valid: false, message: data.error });
      }
    } catch (err) {
      console.error("Validation error:", err);
      setValidation({
        valid: false,
        message: "Validation failed. Please try again.",
      });
    } finally {
      setValidating(false);
    }
  };

  const handleFileSelect = async (file, imageNumber) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (imageNumber === 1) {
        setImage1(file);
        setPreview1(reader.result);
      } else {
        setImage2(file);
        setPreview2(reader.result);
      }
      setError(null);
      setResult(null);
    };
    reader.readAsDataURL(file);

    await validateFaceInImage(file, imageNumber);
  };

  const handleDragOver = (e, imageNumber) => {
    e.preventDefault();
    if (imageNumber === 1) {
      setDragOver1(true);
    } else {
      setDragOver2(true);
    }
  };

  const handleDragLeave = (e, imageNumber) => {
    e.preventDefault();
    if (imageNumber === 1) {
      setDragOver1(false);
    } else {
      setDragOver2(false);
    }
  };

  const handleDrop = (e, imageNumber) => {
    e.preventDefault();
    if (imageNumber === 1) {
      setDragOver1(false);
    } else {
      setDragOver2(false);
    }

    const file = e.dataTransfer.files[0];
    handleFileSelect(file, imageNumber);
  };

  const handleRemoveImage = (imageNumber) => {
    if (imageNumber === 1) {
      setImage1(null);
      setPreview1(null);
      setValidation1(null);
      setValidating1(false);
      if (fileInput1Ref.current) fileInput1Ref.current.value = "";
    } else {
      setImage2(null);
      setPreview2(null);
      setValidation2(null);
      setValidating2(false);
      if (fileInput2Ref.current) fileInput2Ref.current.value = "";
    }
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!image1 || !image2) {
      setError("Please upload both images");
      return;
    }

    if (!validation1?.valid || !validation2?.valid) {
      setError("Please upload valid face images before analyzing");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image1", image1);
      formData.append("image2", image2);

      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error analyzing images:", err);
      setError(
        "Failed to analyze images. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const getGaugeClass = (score) => {
    if (score >= 0.7) return "clay-gauge";
    if (score >= 0.4) return "clay-gauge-warning";
    return "clay-gauge-danger";
  };

  const ImageUploadBox = ({ imageNumber, preview, dragOver }) => {
    const validating = imageNumber === 1 ? validating1 : validating2;
    const validation = imageNumber === 1 ? validation1 : validation2;
    const isAnalyzing = loading && preview;

    return (
      <div
        className={`relative group transition-all duration-300 ${
          dragOver ? "scale-[1.02]" : ""
        }`}
        onDragOver={(e) => handleDragOver(e, imageNumber)}
        onDragLeave={(e) => handleDragLeave(e, imageNumber)}
        onDrop={(e) => handleDrop(e, imageNumber)}
      >
        <div
          className={`relative h-80 overflow-hidden cursor-pointer transition-all duration-300
            ${
              preview
                ? darkMode
                  ? "dark-card"
                  : "neu-container"
                : darkMode
                ? "dark-card-pressed"
                : "neu-pressed"
            }
            ${dragOver ? "shadow-clay scale-[1.02]" : ""}
            ${validation?.valid ? "ring-4 ring-clay-success/50" : ""}
            ${validation?.valid === false ? "ring-4 ring-clay-danger/50" : ""}
          `}
          onClick={() => {
            if (!preview) {
              imageNumber === 1
                ? fileInput1Ref.current?.click()
                : fileInput2Ref.current?.click();
            }
          }}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt={`Face ${imageNumber}`}
                className="w-full h-full object-cover rounded-[20px]"
              />

              {isAnalyzing && (
                <div className="scan-line-container">
                  <div className="scan-line"></div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(imageNumber);
                  }}
                  className="absolute top-4 right-4 p-2 clay-btn-lg bg-gradient-to-br from-clay-danger to-clay-danger-dark text-white rounded-full"
                  style={{ padding: "10px" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-[20px]">
                {validating ? (
                  <div className="flex items-center gap-2">
                    <Loader2
                      size={16}
                      className="animate-spin text-clay-blue"
                    />
                    <p className="text-sm text-clay-blue font-semibold">
                      Validating face...
                    </p>
                  </div>
                ) : validation?.valid ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-clay-success" />
                    <p className="text-sm text-clay-success font-semibold">
                      {validation.message}
                    </p>
                  </div>
                ) : validation?.valid === false ? (
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-clay-danger" />
                    <p className="text-sm text-clay-danger font-semibold">
                      {validation.message}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-clay-blue font-semibold">
                    Face {imageNumber} Uploaded
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="mb-4 clay-icon animate-float">
                <Upload size={32} className="text-white" />
              </div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  darkMode ? "text-dark-text-primary" : "text-text-primary"
                }`}
              >
                Upload Face {imageNumber}
              </h3>
              <p
                className={`mb-4 ${
                  darkMode ? "text-dark-text-secondary" : "text-text-secondary"
                }`}
              >
                Drag & drop or click to browse
              </p>
              <p
                className={`text-xs ${
                  darkMode ? "text-dark-text-muted" : "text-text-muted"
                }`}
              >
                Supports: JPG, PNG, JPEG (Max 5MB)
              </p>
            </div>
          )}
        </div>

        <input
          ref={imageNumber === 1 ? fileInput1Ref : fileInput2Ref}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files[0], imageNumber)}
          className="hidden"
        />
      </div>
    );
  };

  return (
    <>  
      {currentPage === "contact" ? (
        <ContactPage darkMode={darkMode} />
      ) : (
        <div
          className={`min-h-screen font-quicksand transition-colors duration-300 ${
            darkMode ? "bg-dark-bg" : "bg-neu-bg"
          }`}
        >
          {/* Navigation Header */}
          <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              darkMode
                ? "bg-dark-bg/95 border-b border-white/10"
                : "bg-neu-bg/95 border-b border-black/10"
            } backdrop-blur-md`}
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="clay-icon-purple w-10 h-10 flex items-center justify-center rounded-lg">
                  <Users size={20} className="text-white" />
                </div>
                <h1
                  className={`text-xl font-bold ${
                    darkMode ? "text-dark-text-primary" : "text-text-primary"
                  }`}
                >
                  Face <span className="gradient-text">Kinship</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPage("home")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    darkMode
                      ? "text-dark-text-primary hover:bg-white/10"
                      : "text-text-primary hover:bg-black/5"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setCurrentPage("contact")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    darkMode
                      ? "text-dark-text-primary hover:bg-white/10"
                      : "text-text-primary hover:bg-black/5"
                  }`}
                >
                  Contact
                </button>
              </div>
            </div>
          </header>

          {/* Main Content with top padding for header */}
          <div className="pt-20">
            {/* Enhanced Hero Section */}
            <section className="min-h-screen flex items-center px-4 py-12 relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 animate-float ${
                    darkMode ? "bg-purple-500" : "bg-clay-blue"
                  }`}
                ></div>
                <div
                  className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float-delayed ${
                    darkMode ? "bg-blue-500" : "bg-clay-purple"
                  }`}
                ></div>
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 ${
                    darkMode ? "bg-pink-500" : "bg-clay-success"
                  }`}
                ></div>
              </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Enhanced Hero Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Premium Badge */}
              <div className="flex justify-center lg:justify-start">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                    darkMode ? "dark-card" : "clay-badge"
                  } animate-pulse-clay`}
                >
                  <Zap size={16} className="text-yellow-400" />
                  
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1
                  className={`text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight ${
                    darkMode ? "text-dark-text-primary" : "text-text-primary"
                  }`}
                >
                  Discover Your
                  <br />
                  <span className="gradient-text inline-block animate-gradient">
                    Family Bonds
                  </span>
                </h1>
                <p
                  className={`text-xl md:text-2xl font-medium ${
                    darkMode
                      ? "text-dark-text-secondary"
                      : "text-text-secondary"
                  } max-w-xl mx-auto lg:mx-0`}
                >
                  Advanced facial recognition technology that verifies kinship
                  relationships with{" "}
                  <span className="text-clay-blue font-bold">
                    deep learning precision
                  </span>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={scrollToUpload}
                  className="clay-btn clay-btn-lg flex items-center justify-center gap-3 text-lg group"
                >
                  <Upload size={24} />
                  Start Analysis
                  <ArrowRight
                    size={22}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <button
                  onClick={scrollToAbout}
                  className={`clay-btn-lg flex items-center justify-center gap-3 text-lg ${
                    darkMode
                      ? "dark-card hover:scale-105"
                      : "clay-btn clay-btn-purple"
                  }`}
                >
                  <Brain size={22} />
                  Learn More
                </button>
              </div>

             
              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <div
                  className={`px-4 py-2 flex items-center gap-2 rounded-full ${
                    darkMode ? "dark-card" : "neu-container-sm"
                  }`}
                >
                  <Brain size={16} className="text-clay-blue" />
                  <span
                    className={`text-sm font-medium ${
                      darkMode
                        ? "text-dark-text-secondary"
                        : "text-text-secondary"
                    }`}
                  >
                    Siamese CNN
                  </span>
                </div>
                <div
                  className={`px-4 py-2 flex items-center gap-2 rounded-full ${
                    darkMode ? "dark-card" : "neu-container-sm"
                  }`}
                >
                  <TrendingUp size={16} className="text-clay-purple" />
                  <span
                    className={`text-sm font-medium ${
                      darkMode
                        ? "text-dark-text-secondary"
                        : "text-text-secondary"
                    }`}
                  >
                    KinFaceW-II
                  </span>
                </div>
                <div
                  className={`px-4 py-2 flex items-center gap-2 rounded-full ${
                    darkMode ? "dark-card" : "neu-container-sm"
                  }`}
                >
                  <Shield size={16} className="text-clay-success" />
                  <span
                    className={`text-sm font-medium ${
                      darkMode
                        ? "text-dark-text-secondary"
                        : "text-text-secondary"
                    }`}
                  >
                    Privacy First
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Preview */}
            <div className="relative hidden lg:block">
              {/* Glass AI Panel */}
              <div
                className="relative rounded-[32px] p-8 overflow-hidden
    bg-[#0b0f1a]/90 border border-white/10 backdrop-blur-2xl
    shadow-[0_40px_120px_rgba(0,0,0,0.6)]
    transition-all duration-500 hover:scale-[1.035]"
              >
                {/* Ambient Gradient */}
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

                  {/* Feature chips */}
                  <div className="flex gap-2 mt-3">
                    {[
                      "Face Alignment",
                      "Embedding Match",
                      "Cosine Similarity",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-3 py-1 rounded-full
            bg-white/5 border border-white/10 text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inputs */}
                <div className="relative grid grid-cols-2 gap-8 mb-10">
                  {[
                    { label: "Input A", color: "blue" },
                    { label: "Input B", color: "purple" },
                  ].map(({ label, color }) => (
                    <div
                      key={label}
                      className={`
          relative aspect-square rounded-2xl
          bg-black/40 border border-white/10
          flex flex-col items-center justify-center gap-3
          hover:border-${color}-400/40
          transition-all duration-300`}
                    >
                      <div className="relative">
                        <Users size={66} className={`text-${color}-400/60`} />
                        <span
                          className={`absolute inset-0 rounded-full
              border border-${color}-400/40 animate-ping`}
                        />
                      </div>
                      <span className="text-xs tracking-wide text-white/60">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Neural Connection */}
                {/* Neural Connection */}
                <div className="relative mb-10">
                  {/* Line */}
                  <div
                    className="relative h-[2px] w-full rounded-full
    bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400
    animate-flow"
                  />

                  {/* Badge */}
                  
                </div>

                {/* Result */}
               

                {/* Floating AI Nodes */}
              
              </div>

              {/* Outer Glow */}
              <div
                className="absolute inset-0 -z-10 blur-[90px] opacity-25
    bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500
    rounded-[36px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section ref={uploadSectionRef} className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                darkMode ? "text-dark-text-primary" : "text-text-primary"
              }`}
            >
              The Kinship <span className="gradient-text">Lab</span>
            </h2>
            <p
              className={`max-w-2xl mx-auto ${
                darkMode ? "text-dark-text-secondary" : "text-text-secondary"
              }`}
            >
              Upload two face images to analyze their kinship relationship. Our
              AI will compare facial features and determine biological
              similarity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <ImageUploadBox
              imageNumber={1}
              preview={preview1}
              dragOver={dragOver1}
            />
            <ImageUploadBox
              imageNumber={2}
              preview={preview2}
              dragOver={dragOver2}
            />
          </div>

          {/* Compare Button - Animated */}
          <div className="text-center mb-10">
            <button
              onClick={handleAnalyze}
              disabled={
                !image1 ||
                !image2 ||
                loading ||
                !validation1?.valid ||
                !validation2?.valid ||
                validating1 ||
                validating2
              }
              className="animated-compare-btn"
            >
              <div className="btn-content">
                {loading ? (
                  <>
                    <Loader2 size={26} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : validating1 || validating2 ? (
                  <>
                    <Loader2 size={26} className="animate-spin" />
                    <span>Validating faces...</span>
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
          </div>

          {error && (
            <div className="mb-8 max-w-2xl mx-auto">
              <div
                className={`p-4 border-2 border-clay-danger/30 flex items-center gap-3 ${
                  darkMode ? "dark-card" : "neu-container"
                }`}
              >
                <AlertCircle
                  size={24}
                  className="text-clay-danger flex-shrink-0"
                />
                <p className="text-clay-danger font-medium">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div
              className={`p-8 max-w-6xl mx-auto ${
                darkMode ? "" : "neu-container-lg"
              }`}
            >
              {/* Header */}
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold mb-3 gradient-text-success">
                  Analysis Complete
                </h2>
                <p
                  className={`text-base ${
                    darkMode
                      ? "text-dark-text-secondary"
                      : "text-text-secondary"
                  }`}
                >
                  Comprehensive facial kinship analysis results
                </p>
              </div>

              {/* Hero Section - Gauge and Relationship */}
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                {/* Kinship Score Gauge */}
                <div
                  className={`${
                    darkMode ? "dark-card" : "neu-container"
                  } p-8 flex flex-col items-center justify-center space-y-4`}
                >
                  <p
                    className={`text-xs font-bold tracking-widest uppercase ${
                      darkMode
                        ? "text-dark-text-secondary"
                        : "text-text-secondary"
                    }`}
                  >
                    Kinship Score
                  </p>
                  <div
                    className={`w-40 h-40 rounded-full flex items-center justify-center text-5xl font-bold border-4 transition-all duration-1000 ${
                      result.kinship_score >= 0.7
                        ? "border-green-500 text-green-500"
                        : result.kinship_score >= 0.4
                        ? "border-yellow-500 text-yellow-500"
                        : "border-red-500 text-red-500"
                    }`}
                  >
                    {(result.kinship_score * 100).toFixed(0)}%
                  </div>
                </div>

                {/* Relationship Details */}
                {result.relationship_type && (
                  <div
                    className={`${
                      darkMode ? "dark-card" : "neu-container"
                    } p-8 flex flex-col justify-between`}
                  >
                    <div>
                      <p
                        className={`text-xs font-bold mb-6 tracking-widest uppercase ${
                          darkMode
                            ? "text-dark-text-secondary"
                            : "text-text-secondary"
                        }`}
                      >
                        Detected Relationship
                      </p>
                      <p
                        className={`text-4xl font-bold mb-6 ${
                          result.related
                            ? "text-clay-success-dark"
                            : "text-clay-warning-dark"
                        }`}
                      >
                        {result.relationship_type}
                      </p>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                          result.related
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            result.related ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        ></div>
                        <span className="font-semibold text-sm">
                          {result.related ? "Related" : "Not Related"}
                        </span>
                      </div>
                    </div>
                    {result.confidence_score && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-xs font-bold tracking-wider uppercase ${
                              darkMode
                                ? "text-dark-text-secondary"
                                : "text-text-secondary"
                            }`}
                          >
                            Confidence
                          </span>
                          <span className="text-lg font-bold text-clay-success-dark">
                            {(result.confidence_score * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-clay-success to-clay-blue transition-all duration-1000"
                            style={{
                              width: `${result.confidence_score * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div
                  className={`${
                    darkMode ? "dark-card" : "neu-pressed"
                  } p-6 rounded-xl`}
                >
                  <p
                    className={`text-xs font-bold tracking-wider uppercase mb-3 ${
                      darkMode
                        ? "text-dark-text-secondary"
                        : "text-text-secondary"
                    }`}
                  >
                    Kinship Score
                  </p>
                  <p
                    className={`text-4xl font-bold ${
                      result.kinship_score >= 0.7
                        ? "text-clay-success-dark"
                        : result.kinship_score >= 0.4
                        ? "text-clay-warning-dark"
                        : "text-clay-danger-dark"
                    }`}
                  >
                    {(result.kinship_score * 100).toFixed(1)}%
                  </p>
                </div>

                <div
                  className={`${
                    darkMode ? "dark-card" : "neu-pressed"
                  } p-6 rounded-xl`}
                >
                  <p
                    className={`text-xs font-bold tracking-wider uppercase mb-3 ${
                      darkMode
                        ? "text-dark-text-secondary"
                        : "text-text-secondary"
                    }`}
                  >
                    Status
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      result.related
                        ? "text-clay-success-dark"
                        : "text-clay-warning-dark"
                    }`}
                  >
                    {result.related ? "Related" : "Not Related"}
                  </p>
                </div>

                <div
                  className={`${
                    darkMode ? "dark-card" : "neu-pressed"
                  } p-6 rounded-xl`}
                >
                  <p
                    className={`text-xs font-bold tracking-wider uppercase mb-3 ${
                      darkMode
                        ? "text-dark-text-secondary"
                        : "text-text-secondary"
                    }`}
                  >
                    Confidence
                  </p>
                  <p className="text-2xl font-bold text-clay-blue-dark">
                    {result.confidence}
                  </p>
                </div>
              </div>

              {/* Top Predictions */}
              {result.top_predictions && result.top_predictions.length > 0 && (
                <div className="mb-10">
                  <div
                    className={`${
                      darkMode ? "dark-card" : "neu-container"
                    } p-8`}
                  >
                    <h3
                      className={`text-xl font-bold mb-6 text-center ${
                        darkMode ? "text-clay-purple" : "text-clay-purple-dark"
                      }`}
                    >
                      Top Predictions
                    </h3>
                    <div className="space-y-4">
                      {result.top_predictions.map((pred, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-5 ${
                            darkMode ? "dark-card" : "neu-pressed-sm"
                          } rounded-xl hover:shadow-lg transition-shadow`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                idx === 0
                                  ? "bg-gradient-to-br from-green-400 to-green-600"
                                  : idx === 1
                                  ? "bg-gradient-to-br from-blue-400 to-blue-600"
                                  : "bg-gradient-to-br from-purple-400 to-purple-600"
                              }`}
                            >
                              #{idx + 1}
                            </div>
                            <span
                              className={`text-lg font-semibold ${
                                darkMode
                                  ? "text-dark-text-primary"
                                  : "text-text-primary"
                              }`}
                            >
                              {pred.relationship}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-3 rounded-full transition-all duration-700 ${
                                  idx === 0
                                    ? "bg-gradient-to-r from-green-400 to-green-600"
                                    : idx === 1
                                    ? "bg-gradient-to-r from-blue-400 to-blue-600"
                                    : "bg-gradient-to-r from-purple-400 to-purple-600"
                                }`}
                                style={{ width: `${pred.percentage}%` }}
                              ></div>
                            </div>
                            <span
                              className={`font-mono font-bold text-lg w-16 text-right ${
                                darkMode
                                  ? "text-dark-text-primary"
                                  : "text-text-primary"
                              }`}
                            >
                              {pred.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* All Probabilities */}
              {result.all_probabilities && (
                <div className="mb-8">
                  <div
                    className={`${
                      darkMode ? "dark-card" : "neu-container"
                    } p-8`}
                  >
                    <h3
                      className={`text-xl font-bold mb-6 ${
                        darkMode ? "text-clay-blue" : "text-clay-blue-dark"
                      }`}
                    >
                      All Relationship Probabilities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(result.all_probabilities).map(
                        ([relationship, prob]) => (
                          <div
                            key={relationship}
                            className={`flex justify-between items-center p-4 ${
                              darkMode ? "dark-card" : "neu-pressed-sm"
                            } rounded-lg`}
                          >
                            <span
                              className={`font-medium ${
                                darkMode
                                  ? "text-dark-text-secondary"
                                  : "text-text-secondary"
                              }`}
                            >
                              {relationship}
                            </span>
                            <span className="text-clay-purple-dark font-mono font-bold text-lg">
                              {(prob * 100).toFixed(2)}%
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Summary */}
              <div className="text-center">
                <p
                  className={`text-sm ${
                    darkMode
                      ? "text-dark-text-secondary"
                      : "text-text-secondary"
                  }`}
                >
                  {result.related
                    ? `✓ The facial features suggest a ${
                        result.relationship_type || "biological relationship"
                      } between these individuals.`
                    : "✗ The facial features do not indicate a strong biological relationship."}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutSectionRef} className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                darkMode ? "text-dark-text-primary" : "text-text-primary"
              }`}
            >
              What is{" "}
              <span className="gradient-text">Face Kinship Verification</span>?
            </h2>
            <p
              className={`max-w-2xl mx-auto ${
                darkMode ? "text-dark-text-secondary" : "text-text-secondary"
              }`}
            >
              An AI-based system that analyzes facial similarities between two
              individuals to estimate biological relationships using deep
              learning models.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="clay-card text-center">
              <div className="clay-icon mb-6 mx-auto">
                <Brain size={32} className="text-white" />
              </div>
              <h3
                className={`text-xl font-bold mb-3 ${
                  darkMode ? "text-dark-text-primary" : "text-text-primary"
                }`}
              >
                Feature Extraction
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-dark-text-secondary" : "text-text-secondary"
                }`}
              >
                CNN-based deep feature extraction captures unique facial
                characteristics for precise similarity analysis.
              </p>
            </div>

            <div className="clay-card text-center">
              <div className="clay-icon-purple mb-6 mx-auto w-14 h-14 flex items-center justify-center rounded-2xl">
                <Search size={28} className="text-white" />
              </div>

              <h3
                className={`text-xl font-bold mb-3 ${
                  darkMode ? "text-dark-text-primary" : "text-text-primary"
                }`}
              >
                Neural Network
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-dark-text-secondary" : "text-text-secondary"
                }`}
              >
                Twin Siamese neural networks extract and compare facial features
                from both images.
              </p>
            </div>

            <div className="clay-card text-center">
              <div className="clay-icon-success mb-6 mx-auto w-14 h-14 flex items-center justify-center rounded-2xl">
                <FileSearch size={28} className="text-white" />
              </div>

              <h3
                className={`text-xl font-bold mb-3 ${
                  darkMode ? "text-dark-text-primary" : "text-text-primary"
                }`}
              >
                Result Analysis
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-dark-text-secondary" : "text-text-secondary"
                }`}
              >
                Cosine and L2 similarity metrics compute relationship
                probability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section
        ref={privacySectionRef}
        className={`py-20 px-3 ${darkMode ? "bg-dark-bg" : "bg-neu-bg-alt"}`}
      >
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 clay-badge">
              <Shield size={20} />
              <span className="font-bold">Your Privacy Matters</span>
            </div>
            <h2
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                darkMode ? "text-dark-text-primary" : "text-text-primary"
              }`}
            >
              Privacy & <span className="gradient-text">Security</span>
            </h2>
            <p
              className={`text-lg max-w-3xl mx-auto ${
                darkMode ? "text-dark-text-secondary" : "text-text-secondary"
              }`}
            >
              We take your privacy seriously. Here's how we protect your data
              and ensure your information remains secure.
            </p>
          </div>

          {/* Privacy Highlights Grid */}

         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
  {/* Card 1 - Zero Storage */}
  <div
    className={`p-6 rounded-2xl text-center ${
      darkMode ? "dark-card" : "neu-container"
    }`}
  >
    <div className="clay-icon-success mb-4 mx-auto w-12 h-12 flex items-center justify-center rounded-full">
      <Lock size={24} className="text-white" />
    </div>
    <h3
      className={`font-bold mb-2 ${
        darkMode ? "text-dark-text-primary" : "text-text-primary"
      }`}
    >
      Zero Storage
    </h3>
    <p
      className={`text-sm ${
        darkMode ? "text-dark-text-secondary" : "text-text-secondary"
      }`}
    >
      Images are never stored on our servers
    </p>
  </div>

  {/* Card 2 - Instant Processing */}
  <div
    className={`p-6 rounded-2xl text-center ${
      darkMode ? "dark-card" : "neu-container"
    }`}
  >
    <div className="clay-icon mb-4 mx-auto w-12 h-12 flex items-center justify-center rounded-full">
      <Zap size={24} className="text-white" />
    </div>
    <h3
      className={`font-bold mb-2 ${
        darkMode ? "text-dark-text-primary" : "text-text-primary"
      }`}
    >
      Instant Processing
    </h3>
    <p
      className={`text-sm ${
        darkMode ? "text-dark-text-secondary" : "text-text-secondary"
      }`}
    >
      Analysis happens in real-time, then deleted
    </p>
  </div>

  {/* Card 3 - No Third Parties */}
  <div
    className={`p-6 rounded-2xl text-center ${
      darkMode ? "dark-card" : "neu-container"
    }`}
  >
    <div className="clay-icon mb-4 mx-auto w-12 h-12 flex items-center justify-center rounded-full">
      <Eye size={24} className="text-white" />
    </div>
    <h3
      className={`font-bold mb-2 ${
        darkMode ? "text-dark-text-primary" : "text-text-primary"
      }`}
    >
      No Third Parties
    </h3>
    <p
      className={`text-sm ${
        darkMode ? "text-dark-text-secondary" : "text-text-secondary"
      }`}
    >
      Your data is never shared or sold
    </p>
  </div>

 
  
</div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`relative px-6 py-20 ${
          darkMode
            ? "bg-dark-bg border-t border-white/10"
            : "bg-neu-bg neu-border-top"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div
            className={`rounded-3xl p-10 grid gap-12 md:grid-cols-2 lg:grid-cols-4 ${
              darkMode ? "dark-card" : "neu-container"
            }`}
          >
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="clay-icon-purple">
                  <Users size={26} className="text-white" />
                </div>
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-dark-text-primary" : "text-text-primary"
                  }`}
                >
                  Face <span className="gradient-text">Kinship</span>
                </h2>
              </div>

              <p
                className={`max-w-md text-sm leading-relaxed ${
                  darkMode ? "text-dark-text-secondary" : "text-text-secondary"
                }`}
              >
                AI-powered facial kinship verification using Siamese Neural
                Networks. Built with privacy-first principles and deep learning
                precision.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4
                className={`font-semibold mb-4 ${
                  darkMode ? "text-dark-text-primary" : "text-text-primary"
                }`}
              >
                Navigate
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <button onClick={scrollToUpload} className="footer-link">
                    Start Analysis
                  </button>
                </li>
                <li>
                  <button onClick={scrollToAbout} className="footer-link">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={scrollToPrivacy} className="footer-link">
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Tech */}
            <div>
              <h4
                className={`font-semibold mb-4 ${
                  darkMode ? "text-dark-text-primary" : "text-text-primary"
                }`}
              >
                Technology
              </h4>
              <ul
                className={`space-y-3 text-sm ${
                  darkMode ? "text-dark-text-secondary" : "text-text-secondary"
                }`}
              >
                <li>Siamese CNN Architecture</li>
                <li>KinFaceW-II Dataset</li>
                <li>TensorFlow & Python</li>
                <li>MediaPipe Face Validation</li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 h-px bg-white/10" />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p
              className={`text-sm ${
                darkMode ? "text-dark-text-muted" : "text-text-muted"
              }`}
            >
              © 2026 Face Kinship — All rights reserved
            </p>

            
          </div>
        </div>
      </footer>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

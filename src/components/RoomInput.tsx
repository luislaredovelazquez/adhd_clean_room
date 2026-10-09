import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, RefreshCw, Zap, Sliders, AlertCircle, CheckCircle2 } from 'lucide-react';
import { EnergyLevel, RoomCategory, SampleRoom } from '../types';
import { SAMPLE_ROOMS } from '../data/sampleRooms';

interface RoomInputProps {
  onDecompose: (imageDataUri: string, roomType: RoomCategory, energyLevel: EnergyLevel, customContext: string) => void;
  isLoading: boolean;
  highContrast: boolean;
  onAnnounce: (msg: string) => void;
}

export const RoomInput: React.FC<RoomInputProps> = ({
  onDecompose,
  isLoading,
  highContrast,
  onAnnounce,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_ROOMS[0].imageDataUri);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomCategory>('kitchen');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const [customContext, setCustomContext] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      onAnnounce('Live camera activated. Frame the messy room and click Capture Photo.');
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access device camera. Please upload an image file instead.');
      onAnnounce('Camera access error. Please upload an image file instead.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUri);
      stopCamera();
      onAnnounce('Room photo captured successfully.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImage(result);
      stopCamera();
      onAnnounce(`Image ${file.name} loaded successfully.`);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: SampleRoom) => {
    stopCamera();
    setSelectedImage(preset.imageDataUri);
    setSelectedRoomType(preset.roomType);
    onAnnounce(`Selected sample preset: ${preset.title}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;
    onAnnounce('Analyzing room photo and calculating ADHD task decomposition...');
    onDecompose(selectedImage, selectedRoomType, energyLevel, customContext);
  };

  return (
    <section aria-labelledby="scanner-heading" className="w-full max-w-6xl mx-auto py-6 sm:py-8">
      {/* Intro Heading & ADHD Context */}
      <div className="mb-8">
        <h1
          id="scanner-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2"
        >
          Overwhelmed by a Messy Room?
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          ADHD brains experience executive function freeze when facing large, messy spaces. Our AI analyzes your room image and decomposes it into <strong className="text-cyan-300 font-semibold">2-to-5 minute dopamine-friendly micro-steps</strong> so you never feel overwhelmed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Input & Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div
            className={`relative rounded-xl overflow-hidden border transition-all ${
              highContrast
                ? 'bg-black border-yellow-400'
                : 'bg-slate-900/80 border-slate-700/80 shadow-2xl'
            }`}
          >
            {/* Camera Viewfinder or Static Image Display */}
            <div className="aspect-[4/3] w-full bg-slate-950 relative flex items-center justify-center overflow-hidden">
              {isCameraActive ? (
                <div className="w-full h-full relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    aria-label="Live camera viewfinder"
                  />
                  <div className="absolute inset-0 pointer-events-none border border-cyan-400/40 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-dashed border-cyan-400/60 rounded-lg" />
                  </div>
                </div>
              ) : selectedImage ? (
                <div className="w-full h-full relative group">
                  <img
                    src={selectedImage}
                    alt="Current messy room for task decomposition analysis"
                    className="w-full h-full object-cover"
                  />
                  {/* Cyberpunk HUD Corner brackets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" aria-hidden="true" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" aria-hidden="true" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" aria-hidden="true" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" aria-hidden="true" />
                  
                  {/* Scanning active overlay during AI computation */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-full h-1 bg-cyan-400 absolute top-0 left-0 animate-pulse shadow-[0_0_15px_#00f0ff]" />
                      <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mb-3" aria-hidden="true" />
                      <p className="font-mono text-cyan-300 font-bold text-base mb-1">
                        DECOMPOSING CLUTTER TOPOLOGY
                      </p>
                      <p className="text-slate-300 text-xs font-mono max-w-xs">
                        Slicing visual chaos into 3-minute executive function micro-wins...
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" aria-hidden="true" />
                  <p>No room image loaded yet</p>
                </div>
              )}
            </div>

            {/* Input Action Toolbar */}
            <div
              className={`p-3 border-t flex flex-wrap items-center justify-between gap-2 ${
                highContrast ? 'bg-black border-yellow-400' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCameraActive ? (
                  <>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono rounded flex items-center gap-1.5 min-h-[42px] transition-colors"
                    >
                      <Camera className="w-4 h-4" aria-hidden="true" />
                      SNAP PHOTO
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded min-h-[42px]"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono rounded flex items-center gap-1.5 min-h-[42px] transition-colors"
                    >
                      <Camera className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                      Take Photo
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono rounded flex items-center gap-1.5 min-h-[42px] transition-colors"
                    >
                      <Upload className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                      Upload File
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      aria-label="Upload photo of messy room"
                    />
                  </>
                )}
              </div>

              <div className="text-xs text-slate-400 font-mono">
                {isCameraActive ? 'Camera Active' : 'Image Ready'}
              </div>
            </div>

            {cameraError && (
              <div className="p-3 bg-red-950/70 border-t border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" aria-hidden="true" />
                <span>{cameraError}</span>
              </div>
            )}
          </div>

          {/* Quick-Pick Sample Room Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono tracking-wider text-slate-400 uppercase font-semibold">
                Or Try A Sample Scenario
              </span>
              <span className="text-xs text-slate-500 font-mono">Instant test</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_ROOMS.map((preset) => {
                const isSelected = selectedImage === preset.imageDataUri;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    aria-label={`Select preset: ${preset.title}`}
                    className={`p-2 rounded-lg border text-left transition-all flex flex-col gap-1 min-h-[64px] ${
                      isSelected
                        ? highContrast
                          ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 font-bold'
                          : 'bg-cyan-950/50 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="text-xs font-bold leading-tight truncate">
                      {preset.title}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {preset.roomType.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Decomposition Parameters & Action (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div
            className={`p-5 rounded-xl border ${
              highContrast
                ? 'bg-black border-yellow-400 text-white'
                : 'bg-slate-900/90 border-slate-800 text-slate-200 shadow-xl'
            }`}
          >
            <h2 className="text-lg font-bold font-mono tracking-wide text-white mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              Executive Parameters
            </h2>

            {/* 1. Room Type Category */}
            <div className="mb-4">
              <label htmlFor="room-type-select" className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1.5">
                Room Zone Category
              </label>
              <select
                id="room-type-select"
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value as RoomCategory)}
                className={`w-full p-2.5 rounded border text-sm font-medium transition-colors ${
                  highContrast
                    ? 'bg-black border-yellow-400 text-white font-bold'
                    : 'bg-slate-950 border-slate-700 text-slate-100 focus:border-cyan-400'
                }`}
              >
                <option value="kitchen">Kitchen (Dishes, counters, sink)</option>
                <option value="bedroom">Bedroom (Clothes, bed, floor)</option>
                <option value="desk">Workspace / Desk (Cables, mugs, papers)</option>
                <option value="bathroom">Bathroom (Vanity, sink, towels)</option>
                <option value="living_room">Living Room (Couch, coffee table)</option>
              </select>
            </div>

            {/* 2. ADHD Energy Level Selector (Crucial for Spoons Theory) */}
            <fieldset className="mb-5">
              <legend className="text-xs font-mono uppercase text-slate-300 font-semibold mb-2">
                Your Energy Level Right Now
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Low Energy', desc: '≤ 2 min steps' },
                  { id: 'medium', label: 'Balanced', desc: '3-4 min steps' },
                  { id: 'hyperfocus', label: 'High Focus', desc: '5 min steps' },
                ].map((item) => {
                  const isActive = energyLevel === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEnergyLevel(item.id as EnergyLevel)}
                      aria-pressed={isActive}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        isActive
                          ? highContrast
                            ? 'bg-yellow-400 text-black border-yellow-400 font-extrabold'
                            : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold ring-1 ring-cyan-400'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[10px] opacity-80 font-mono mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* 3. Optional ADHD Context note */}
            <div className="mb-6">
              <label htmlFor="context-input" className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1.5">
                Special Request (Optional)
              </label>
              <input
                id="context-input"
                type="text"
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="e.g. Only have 10 minutes, or guests coming over"
                className={`w-full p-2.5 rounded border text-xs ${
                  highContrast
                    ? 'bg-black border-yellow-400 text-white'
                    : 'bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400'
                }`}
              />
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !selectedImage}
              className={`w-full py-3.5 px-6 rounded-lg font-mono font-bold tracking-wider text-sm transition-all flex items-center justify-center gap-2 min-h-[48px] shadow-lg ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-white hover:bg-yellow-300'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20 hover:shadow-cyan-500/40'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ANALYZING & DECOMPOSING...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" aria-hidden="true" />
                  DECOMPOSE INTO MICRO-STEPS
                </>
              )}
            </button>
          </div>

          {/* Neurodiversity Anchor Card */}
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed ${
              highContrast
                ? 'bg-black border-white text-white'
                : 'bg-slate-900/50 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2 font-mono font-bold text-slate-300 mb-1">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
              <span>The Executive Function Law</span>
            </div>
            <p>
              When your brain sees 50 objects in a messy room, dopamine receptors experience friction. Breaking tasks into 180-second physical micro-goals triggers immediate dopamine release, bypassing task paralysis completely.
            </p>
          </div>
        </div>
      </form>
    </section>
  );
};

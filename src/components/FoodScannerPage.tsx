import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Upload, Sparkles, Flame, Droplet, Star, RefreshCw, ShoppingCart, Save } from 'lucide-react';
import Header from './Header';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface FoodScannerPageProps {
  addToCart: (item: any) => void;
  cartCount: number;
  onCartClick: () => void;
}

export default function FoodScannerPage({ addToCart, cartCount, onCartClick }: FoodScannerPageProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [mobileFocus, setMobileFocus] = useState(false);
  const [mode, setMode] = useState<'neutral'|'healthy'|'oily'>('neutral');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const autoIntervalRef = useRef<number | null>(null);

  const handleScan = (fromFile?: boolean) => {
    setIsScanning(true);
    setScanResult(null);
    // Simulate AI analysis
    setTimeout(() => {
      const result = {
        dish: 'Paneer Butter Masala',
        calories: 420,
        protein: 12,
        fat: 10,
        carbs: 30,
        healthScore: 8.2,
        tip: 'Avoid eating after 9 PM for better digestion',
        waterSuggestion: 'Drink 2 glasses after meal',
        breakdown: [
          { name: 'Paneer', percent: 70 },
          { name: 'Rice', percent: 20 },
          { name: 'Salad', percent: 10 },
        ],
      };
      setScanResult(result);
      setIsScanning(false);
      // adapt theme mode
      if (result.calories > 600) setMode('oily');
      else if (result.calories < 300) setMode('healthy');
      else setMode('neutral');
      toast.success('Food analyzed successfully! 🍲');
    }, 1400 + (fromFile ? 200 : 0));
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewSrc(String(reader.result));
    };
    reader.readAsDataURL(f);

    // upload to server for analysis
    const form = new FormData();
    form.append('image', f);
    setIsScanning(true);
    fetch((import.meta.env.DEV ? 'http://localhost:5000' : '') + '/api/vision', {
      method: 'POST',
      body: form,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Vision API error');
        const json = await res.json();
        if (json && json.analysis) {
          setScanResult(json.analysis);
          // adapt theme
          const cal = json.analysis.calories || 0;
          if (cal > 600) setMode('oily');
          else if (cal < 300) setMode('healthy');
          else setMode('neutral');
        } else {
          toast.error('No analysis returned');
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('Upload failed');
      })
      .finally(() => setIsScanning(false));
  };

  const handleRescan = () => {
    setScanResult(null);
    setPreviewSrc(null);
    setIsScanning(false);
    toast('Ready to scan again');
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error('Camera not supported in this browser');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setMobileFocus(true);
      toast('Camera activated');
    } catch (err) {
      console.error('camera error', err);
      toast.error('Unable to access camera');
    }
  };

  const stopCamera = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    } catch (e) {}
    streamRef.current = null;
    if (videoRef.current) {
      try { videoRef.current.pause(); videoRef.current.srcObject = null; } catch (e) {}
    }
    setCameraActive(false);
    setMobileFocus(false);
    setAutoAnalyze(false);
    if (autoIntervalRef.current) { window.clearInterval(autoIntervalRef.current); autoIntervalRef.current = null; }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const captureFromCamera = async (): Promise<Blob | null> => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, w, h);
    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });
  };

  const uploadBlob = async (blob: Blob | null) => {
    if (!blob) return;
    setIsScanning(true);
    try {
      const form = new FormData();
      form.append('image', blob, 'capture.jpg');
      const res = await fetch((import.meta.env.DEV ? 'http://localhost:5000' : '') + '/api/vision', { method: 'POST', body: form });
      if (!res.ok) throw new Error('Vision API error');
      const json = await res.json();
      if (json && json.analysis) {
        setScanResult(json.analysis);
        setPreviewSrc(null);
        const cal = json.analysis.calories || 0;
        if (cal > 600) setMode('oily'); else if (cal < 300) setMode('healthy'); else setMode('neutral');
      } else {
        toast.error('No analysis returned');
      }
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setIsScanning(false);
    }
  };

  const captureAndAnalyze = async () => {
    const blob = await captureFromCamera();
    if (!blob) { toast.error('Capture failed'); return; }
    // show immediate preview
    const url = URL.createObjectURL(blob);
    setPreviewSrc(url);
    await uploadBlob(blob);
    // revoke after use
    setTimeout(() => { try { URL.revokeObjectURL(url); } catch (e) {} }, 5000);
  };

  useEffect(() => {
    if (cameraActive && autoAnalyze) {
      // capture every 2s until a scanResult is found
      autoIntervalRef.current = window.setInterval(async () => {
        if (!cameraActive) return;
        await captureAndAnalyze();
      }, 2000) as unknown as number;
    } else {
      if (autoIntervalRef.current) { window.clearInterval(autoIntervalRef.current); autoIntervalRef.current = null; }
    }
    return () => { if (autoIntervalRef.current) { window.clearInterval(autoIntervalRef.current); autoIntervalRef.current = null; } };
  }, [cameraActive, autoAnalyze]);

  useEffect(() => {
    // adjust mobile focus based on window width
    const onResize = () => setMobileFocus(window.innerWidth < 768 ? false : false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FF5200] to-[#FF7A33] rounded-full mb-4">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl text-[#1C1C1C] mb-2">AI Food Scanner 📸</h1>
            <p className="text-[#5E5E5E]">Scan your meal to get instant nutrition insights</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Scanner Panel */}
            <Card className="p-6 bg-gradient-to-br from-[#FF5200] to-[#FF7A33] border-0 shadow-xl overflow-hidden rounded-[24px]">
              <div className="relative">
                {/* Camera Frame */}
                <div className={`w-full ${mobileFocus ? 'h-[60vh]' : 'aspect-video'} bg-black/20 rounded-[24px] overflow-hidden relative flex items-center justify-center`}>
                  {/* preview or placeholder */}
                  {previewSrc ? (
                    <img src={previewSrc} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white p-8">
                      <div className="w-40 h-28 rounded-md bg-black/30 flex items-center justify-center mb-4">
                        <Camera className="w-12 h-12 opacity-60" />
                      </div>
                      <p className="text-sm opacity-90">AI scanning a plate of food with holographic HUD overlay.</p>
                    </div>
                  )}

                  {/* Scanning Laser Line */}
                  {isScanning && (
                    <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <motion.div className="w-3/4 h-[2px] bg-white/60" animate={{ y: ['-40%','40%'] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} />
                    </motion.div>
                  )}

                  {/* Target Box */}
                  <div className="absolute inset-6 border-2 border-[#FF7A33] rounded-lg mix-blend-overlay pointer-events-none" />

                  {/* Floating micro-icons */}
                  <motion.div className="absolute -top-4 left-6 text-2xl opacity-90" animate={{ rotate: [0, 360] }} transition={{ duration: 12, repeat: Infinity }}>{'🥗'}</motion.div>
                  <motion.div className="absolute -bottom-4 right-8 text-2xl opacity-90" animate={{ rotate: [0, -360] }} transition={{ duration: 14, repeat: Infinity }}>{'🍛'}</motion.div>
                </div>

                {/* Controls */}
                <div className="flex gap-3 mt-4">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" aria-label="Upload food image" />
                  <Button onClick={() => handleScan(false)} disabled={isScanning} className="flex-1 h-12 bg-white text-[#FF5200] hover:bg-white/95">
                    <Camera className="w-5 h-5 mr-2" />
                    Capture
                  </Button>
                  <Button onClick={handleUploadClick} variant="outline" className="flex-1 h-12 bg-white/90 border-0 text-[#1C1C1C] hover:bg-white">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload
                  </Button>
                  <Button onClick={handleRescan} className="flex-shrink-0 h-12 bg-white/90 text-[#FF5200] border-0">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Rescan
                  </Button>
                </div>
              </div>
            </Card>

            {/* Results Panel */}
            <Card className={`p-6 border-0 shadow-xl rounded-[24px] bg-white`}> 
              <h2 className="text-2xl text-[#1C1C1C] mb-6">YummAI Results — Smart Nutrition Insights 🍴</h2>

              {scanResult ? (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-[#FFF3E6] border-0 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">🍲</div>
                        <div>
                          <p className="text-sm text-[#5E5E5E]">Dish Name</p>
                          <p className="text-[#1C1C1C] font-medium">{scanResult.dish}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-[#FFF3E6] border-0 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Flame className="w-8 h-8 text-[#FF5200]" />
                        <div>
                          <p className="text-sm text-[#5E5E5E]">Calories</p>
                          <p className="text-[#1C1C1C] font-medium">{scanResult.calories} kcal</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-[#FFF3E6] border-0 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">🥦</div>
                        <div>
                          <p className="text-sm text-[#5E5E5E]">Nutrients</p>
                          <p className="text-xs text-[#1C1C1C]">Protein {scanResult.protein}g • Fat {scanResult.fat}g • Carbs {scanResult.carbs}g</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-[#FFF3E6] border-0 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Star className="w-8 h-8 text-[#FFD54F] fill-[#FFD54F]" />
                        <div>
                          <p className="text-sm text-[#5E5E5E]">Health Score</p>
                          <p className="text-[#1C1C1C] font-medium">{scanResult.healthScore} / 10</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-[#FFF3E6] border-0 shadow-sm col-span-2">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">💡</div>
                        <div>
                          <p className="text-sm text-[#5E5E5E] mb-1">Health Tip</p>
                          <p className="text-xs text-[#1C1C1C]">{scanResult.tip}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-[#FFF3E6] border-0 shadow-sm col-span-2">
                      <div className="flex items-start gap-3">
                        <Droplet className="w-6 h-6 text-[#00B5D8]" />
                        <div>
                          <p className="text-sm text-[#5E5E5E] mb-1">Water Suggestion</p>
                          <p className="text-xs text-[#1C1C1C]">{scanResult.waterSuggestion}</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button onClick={() => { addToCart({ name: scanResult.dish, price: Math.round((scanResult.calories/100)*50) }); toast.success('Added similar dish to cart'); }} className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33] flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                    <Button onClick={() => { toast.success('Saved to your health tracker'); }} variant="outline" className="border-[#FF5200] text-[#FF5200] flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" />
                      Save to Tracker
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-[#5E5E5E]">Scan or upload a food image to get instant analysis</p>
                </div>
              )}
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

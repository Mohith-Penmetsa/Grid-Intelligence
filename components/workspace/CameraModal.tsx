"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Camera, RefreshCw, Upload, Check } from "lucide-react";

export function CameraModal({ 
  onClose, 
  onCapture 
}: { 
  onClose: () => void; 
  onCapture: (imageUrl: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const newStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setError(null);
      } else {
        setError("Camera access unavailable in this browser.");
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Camera permission denied or camera not available.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageUrl);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-surface-2 rounded-xl overflow-hidden shadow-2xl border border-border/50 animate-in zoom-in-95 flex flex-col">
        
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Camera className="h-5 w-5" />
            <span>Capture Evidence</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative bg-black flex-1 flex flex-col min-h-[350px]">
          {error && !capturedImage ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-4">
              <span className="text-red-400 text-sm">{error}</span>
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" /> Upload Image
              </Button>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured preview" className="w-full h-full object-contain" />
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          )}
          
          <canvas ref={canvasRef} className="hidden" />
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
        </div>

        <div className="p-4 bg-surface-3 flex items-center justify-center gap-4">
          {capturedImage ? (
            <>
              <Button variant="outline" className="flex-1 gap-2" onClick={retakePhoto}>
                <RefreshCw className="h-4 w-4" /> Retake
              </Button>
              <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 gap-2 text-white" onClick={confirmPhoto}>
                <Check className="h-4 w-4" /> Use Photo
              </Button>
            </>
          ) : !error ? (
            <Button className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 border-4 border-white shrink-0" onClick={capturePhoto}>
              <span className="sr-only">Take Photo</span>
            </Button>
          ) : null}
        </div>

      </div>
    </div>
  );
}

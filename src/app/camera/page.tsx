'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import AuthGuard from '@/components/AuthGuard';
import { Camera as CameraIcon, X } from 'lucide-react';

export default function CameraPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
  }, []);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        setShowPopup(true);
      }
    }
  };

  const handleSubmit = () => {
    if (capturedImage) {
      // Stop camera before navigating
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      // Store the image in sessionStorage to pass to preview page
      sessionStorage.setItem('capturedImage', capturedImage);
      router.push('/preview');
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowPopup(false);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black relative">
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent px-4 py-6 pt-12">
        <h1 className="text-2xl font-semibold text-white text-center">
          Camera
        </h1>
      </div>

      <div className="relative w-full h-screen">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
          <button
            onClick={capturePhoto}
            className="bg-white hover:bg-gray-100 rounded-full p-4 shadow-lg transition-colors"
          >
            <CameraIcon className="w-8 h-8 text-black" />
          </button>
        </div>
      </div>

      {showPopup && capturedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-text-primary">
                Capture the Problem
              </h2>
              <button
                onClick={handleRetake}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <p className="text-text-secondary text-sm text-center">
              You've captured an image of the problem. Continue to preview and submit.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleRetake}
                className="flex-1 py-3 px-4 border border-border rounded-lg text-text-primary hover:bg-hover transition-colors"
              >
                Retake
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 px-4 bg-accent hover:bg-accent-light text-surface rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

        <BottomNavigation />
      </div>
    </AuthGuard>
  );
}
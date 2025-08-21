'use client';

import { useState, useEffect } from 'react';
import { Camera as CameraIcon, ArrowLeft, RotateCcw, Send } from 'lucide-react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';

export default function CameraPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Check if camera is available (in Capacitor environment)
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);

  useEffect(() => {
    // Check if we're in a Capacitor environment
    const checkCameraAvailability = async () => {
      try {
        // This will work in Capacitor environment
        await Camera.checkPermissions();
        setIsCameraAvailable(true);
      } catch (error) {
        console.log('Camera not available in web environment');
        setIsCameraAvailable(false);
      }
    };

    checkCameraAvailability();
  }, []);

  const takePicture = async () => {
    try {
      if (!isCameraAvailable) {
        // Fallback for web environment - use HTML5 file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setCapturedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
          }
        };
        
        input.click();
        return;
      }

      // Capacitor camera implementation
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      setCapturedImage(image.dataUrl || null);
    } catch (error) {
      console.error('Error taking picture:', error);
      alert('Unable to take picture. Please try again.');
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  const submitReport = async () => {
    if (!capturedImage) return;

    setIsSubmitting(true);
    
    try {
      // Here you would typically:
      // 1. Upload the image to your backend/Supabase
      // 2. Use LLM API to classify the problem
      // 3. Save the report to database
      
      // For now, just simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Report submitted successfully! Thank you for helping improve your community.');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (capturedImage) {
    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-12 bg-surface">
          <button onClick={retakePicture} className="p-2">
            <ArrowLeft className="w-6 h-6 text-text-primary" />
          </button>
          <h1 className="text-lg font-semibold text-text-primary">
            Review Photo
          </h1>
          <div className="w-10" />
        </div>

        {/* Image Preview */}
        <div className="px-4 py-6">
          <div className="relative rounded-xl overflow-hidden mb-6">
            <img
              src={capturedImage}
              alt="Captured problem"
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={retakePicture}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-secondary rounded-xl font-medium text-text-primary"
            >
              <RotateCcw className="w-5 h-5" />
              Retake Photo
            </button>

            <button
              onClick={submitReport}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-accent hover:bg-accent-light rounded-xl font-medium text-surface disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-primary-light rounded-xl">
            <h3 className="font-semibold text-text-primary mb-2">
              What happens next?
            </h3>
            <p className="text-text-secondary text-sm">
              Our AI will analyze your photo to identify the issue and add it to the community database. You'll earn points for contributing to a better Malaysia!
            </p>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12 bg-surface">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">
          Report an Issue
        </h1>
        <div className="w-10" />
      </div>

      {/* Camera Interface */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center mb-4 mx-auto">
            <CameraIcon className="w-12 h-12 text-accent" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Capture the Problem
          </h2>
          <p className="text-text-secondary max-w-sm">
            Take a photo of traffic violations, illegal parking, or other civic issues you'd like to report.
          </p>
        </div>

        {/* Camera Button */}
        <button
          onClick={takePicture}
          className="w-20 h-20 bg-accent hover:bg-accent-light rounded-full flex items-center justify-center shadow-lg transition-colors mb-8"
        >
          <CameraIcon className="w-8 h-8 text-surface" />
        </button>

        {/* Tips */}
        <div className="bg-surface rounded-xl p-4 max-w-sm">
          <h3 className="font-semibold text-text-primary mb-2">
            📷 Photo Tips
          </h3>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Ensure good lighting</li>
            <li>• Include license plates when relevant</li>
            <li>• Capture clear evidence of the issue</li>
            <li>• Be safe - don't put yourself at risk</li>
          </ul>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
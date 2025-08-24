'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import { ArrowLeft, Send } from 'lucide-react';

export default function PreviewPage() {
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedImage = sessionStorage.getItem('capturedImage');
    if (!storedImage) {
      router.push('/camera');
      return;
    }
    setCapturedImage(storedImage);
  }, [router]);

  const handleBack = () => {
    router.push('/camera');
  };

  const handleSubmit = async () => {
    if (!capturedImage) return;
    
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the image to your backend
      // For now, we'll just simulate a submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear the stored image
      sessionStorage.removeItem('capturedImage');
      
      // Navigate back to home after successful submission
      router.push('/home');
    } catch (error) {
      console.error('Error submitting image:', error);
      setIsSubmitting(false);
    }
  };

  if (!capturedImage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-surface px-4 py-6 pt-12">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold text-text-primary">
            Preview
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="bg-surface rounded-xl p-4 shadow-sm">
          <div className="aspect-square rounded-lg overflow-hidden mb-4">
            <img 
              src={capturedImage} 
              alt="Captured problem" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">
              Problem Captured
            </h2>
            <p className="text-text-secondary text-sm">
              Review your captured image and submit it for analysis. Our system will help identify and provide solutions for the problem shown.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-accent-light text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit</span>
            </>
          )}
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}
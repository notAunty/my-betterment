'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import AuthGuard from '@/components/AuthGuard';
import { ArrowLeft, Send, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import type { AIAnalysisResult } from '@/types/database';

export default function PreviewPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedImage = sessionStorage.getItem('capturedImage');
    if (!storedImage) {
      router.push('/camera');
      return;
    }
    setCapturedImage(storedImage);
    
    // Automatically start analysis
    analyzeImage(storedImage);
  }, [router]);

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData
        }),
      });

      const result = await response.json();
      
      if (result.success && result.analysis) {
        setAnalysis(result.analysis);
        
        if (result.analysis.requiresRetake) {
          setError('Image quality is not sufficient for analysis. Please retake the photo.');
        }
      } else {
        setError('Failed to analyze image. Please try again.');
        setAnalysis({
          problemType: 'parking',
          problemSubtype: 'illegal_parking',
          confidence: 0.3,
          description: 'Analysis failed. Please retake the photo.',
          requiresRetake: true
        });
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBack = () => {
    router.push('/camera');
  };

  const handleRetake = () => {
    sessionStorage.removeItem('capturedImage');
    router.push('/camera');
  };

  const handleSubmit = async () => {
    if (!capturedImage || !analysis || !user) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/submit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: capturedImage,
          analysis: analysis,
          location: 'Kuala Lumpur, Malaysia', // Could be enhanced with geolocation
          userId: user.id
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Clear the stored image
        sessionStorage.removeItem('capturedImage');
        
        // Navigate back to home after successful submission
        router.push('/home');
      } else {
        setError(result.error || 'Failed to submit report');
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  if (!capturedImage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center space-y-4">
          <p className="text-text-secondary">Please sign in to submit reports</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-accent text-surface rounded-xl font-semibold hover:bg-accent-light transition-colors"
          >
            Sign In
          </button>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20">
      <div className="bg-surface px-4 py-6 pt-12 shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold text-text-primary">
            Review & Submit
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-xl p-4">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {/* Image Preview */}
        <div className="bg-surface rounded-xl p-4 shadow-sm">
          <div className="aspect-square rounded-lg overflow-hidden mb-4">
            <img 
              src={capturedImage} 
              alt="Captured problem" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleRetake}
              className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-hover transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Retake Photo</span>
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="bg-surface rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-text-primary mb-4">AI Analysis</h3>
          
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-text-secondary text-sm">Analyzing image...</p>
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Problem Type:</span>
                <span className="font-semibold text-text-primary capitalize">
                  {analysis.problemType === 'parking' ? 'Parking Violation' : 'Infrastructure Issue'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Category:</span>
                <span className="font-semibold text-text-primary capitalize">
                  {analysis.problemSubtype?.replace(/_/g, ' ')}
                </span>
              </div>

              {analysis.licensePlate && (
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">License Plate:</span>
                  <span className="font-mono font-semibold text-text-primary">
                    {analysis.licensePlate}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Confidence:</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold ${getConfidenceColor(analysis.confidence)}`}>
                    {Math.round(analysis.confidence * 100)}%
                  </span>
                  <span className={`text-xs ${getConfidenceColor(analysis.confidence)}`}>
                    ({getConfidenceText(analysis.confidence)})
                  </span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-border">
                <p className="text-text-secondary text-sm mb-2">Description:</p>
                <p className="text-text-primary text-sm">{analysis.description}</p>
              </div>

              {analysis.requiresRetake && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-warning font-semibold text-sm">Retake Recommended</p>
                    <p className="text-warning text-xs mt-1">
                      The image quality or content may not be sufficient for accurate analysis. 
                      Consider retaking the photo for better results.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-secondary">No analysis available</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        {analysis && !analysis.requiresRetake && (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !analysis}
            className="w-full bg-accent hover:bg-accent-light text-surface py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-surface border-t-transparent rounded-full animate-spin" />
                <span>Submitting Report...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Submit Report</span>
              </>
            )}
          </button>
        )}

        {analysis && analysis.requiresRetake && (
          <button
            onClick={handleRetake}
            className="w-full bg-warning hover:bg-warning/90 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retake Photo</span>
          </button>
        )}
      </div>

        <BottomNavigation />
      </div>
    </AuthGuard>
  );
}
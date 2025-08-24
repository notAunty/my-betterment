'use client';

import BottomNavigation from '@/components/BottomNavigation';
import { Home } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-surface px-4 py-6 pt-12">
        <h1 className="text-2xl font-semibold text-text-primary">
          Home
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center mx-auto">
            <Home className="w-12 h-12 text-accent" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">
            Welcome to My Betterment
          </h2>
          <p className="text-text-secondary">
            Your journey starts here
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
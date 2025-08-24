'use client';

import { Camera, User, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/home',
      active: pathname === '/home'
    },
    {
      icon: Camera,
      label: 'Camera',
      href: '/camera',
      active: pathname === '/camera',
      isCamera: true
    },
    {
      icon: User,
      label: 'Profile',
      href: '/profile',
      active: pathname === '/profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isCamera) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center p-2"
              >
                <div className="bg-accent hover:bg-accent-light rounded-full p-3 shadow-md transition-colors">
                  <Icon className="w-6 h-6 text-surface" />
                </div>
                <span className="text-xs text-text-secondary mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 transition-colors ${
                item.active 
                  ? 'text-accent' 
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <Icon className={`w-6 h-6 ${item.active ? 'text-accent' : ''}`} />
              <span className="text-xs mt-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
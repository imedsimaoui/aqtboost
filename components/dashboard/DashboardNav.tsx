'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import { signOut } from 'next-auth/react';

interface DashboardNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();

  const getNavLinks = () => {
    const links = [
      { href: '/dashboard', label: 'Overview', roles: ['CUSTOMER', 'BOOSTER', 'ADMIN'] },
      { href: '/dashboard/orders', label: 'My Orders', roles: ['CUSTOMER'] },
      { href: '/dashboard/booster/available', label: 'Available Orders', roles: ['BOOSTER'] },
      { href: '/dashboard/booster/my-orders', label: 'My Boosts', roles: ['BOOSTER'] },
      { href: '/dashboard/admin/orders', label: 'All Orders', roles: ['ADMIN'] },
      { href: '/dashboard/admin/users', label: 'Users', roles: ['ADMIN'] },
      { href: '/dashboard/admin/applications', label: 'Applications', roles: ['ADMIN'] },
      { href: '/dashboard/admin/stats', label: 'Statistics', roles: ['ADMIN'] },
    ];

    return links.filter(link => link.roles.includes(user.role || 'CUSTOMER'));
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="AQTBOOST"
                width={160}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-gray-600">
              <span className="font-medium">{user.name}</span>
              {user.role && (
                <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                  {user.role}
                </span>
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

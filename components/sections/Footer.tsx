'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="AQTBOOST"
                width={180}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm text-gray-400">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.games}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/games/league-of-legends" className="hover:text-white transition-colors">League of Legends</Link></li>
              <li><Link href="/games/valorant" className="hover:text-white transition-colors">Valorant</Link></li>
              <li><Link href="/games/cs2" className="hover:text-white transition-colors">CS2</Link></li>
              <li><Link href="/games/dota2" className="hover:text-white transition-colors">Dota 2</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.company}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">{t.footer.about}</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t.footer.contact}</Link></li>
              <li><Link href="/boosters" className="hover:text-white transition-colors">{t.footer.becomeBooster}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.legal}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">{t.footer.terms}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">{t.footer.refund}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {currentYear} AQTBOOST. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

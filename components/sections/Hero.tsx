'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-8">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t.hero.badge}
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            {t.hero.title}<br />
            <span className="text-gradient">{t.hero.titleGradient}</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/order">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                {t.hero.ctaPrimary}
              </Button>
            </Link>
            <Link href="#games">
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                {t.hero.ctaSecondary}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">{t.hero.stat1}</div>
              <div className="text-sm text-gray-600">{t.hero.stat1Label}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">{t.hero.stat2}</div>
              <div className="text-sm text-gray-600">{t.hero.stat2Label}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1" dangerouslySetInnerHTML={{ __html: t.hero.stat3 }} />
              <div className="text-sm text-gray-600">{t.hero.stat3Label}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">{t.hero.stat4}</div>
              <div className="text-sm text-gray-600">{t.hero.stat4Label}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

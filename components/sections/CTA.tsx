'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const CTA = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="brand-gradient rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.cta.title}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order">
              <Button variant="secondary" size="lg" className="min-w-[200px] bg-white text-primary-600 hover:bg-gray-100">
                {t.cta.orderNow}
              </Button>
            </Link>
            <Link href="#games">
              <Button variant="outline" size="lg" className="min-w-[200px] border-white text-white hover:bg-white/10">
                {t.cta.viewGames}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

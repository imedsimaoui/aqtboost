'use client';

import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const Games = () => {
  const { t } = useLanguage();

  const games = [
    {
      name: 'League of Legends',
      description: 'Rank boost, duo queue, personalized coaching',
      players: '12M+',
      avgTime: '3-5 days',
      startPrice: '€19.99',
      slug: 'league-of-legends',
      color: 'from-amber-500 to-yellow-600',
    },
    {
      name: 'Valorant',
      description: 'Rank up by Radiant players',
      players: '8M+',
      avgTime: '2-4 days',
      startPrice: '€24.99',
      slug: 'valorant',
      color: 'from-red-500 to-rose-600',
    },
    {
      name: 'CS2',
      description: 'ELO boost services by Global Elite',
      players: '5M+',
      avgTime: '3-6 days',
      startPrice: '€29.99',
      slug: 'cs2',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Dota 2',
      description: 'MMR boost with top players',
      players: '3M+',
      avgTime: '4-7 days',
      startPrice: '€22.99',
      slug: 'dota2',
      color: 'from-purple-500 to-violet-600',
    },
    {
      name: 'Overwatch 2',
      description: 'Reach your rank goals quickly',
      players: '4M+',
      avgTime: '3-5 days',
      startPrice: '€27.99',
      slug: 'overwatch2',
      color: 'from-orange-500 to-amber-600',
    },
    {
      name: 'Apex Legends',
      description: 'Boost services by Predators',
      players: '6M+',
      avgTime: '2-5 days',
      startPrice: '€25.99',
      slug: 'apex',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <section id="games" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.games.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.games.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link key={game.slug} href={`/games/${game.slug}`}>
              <Card hover className="h-full cursor-pointer group">
                <div className={`w-full h-32 bg-gradient-to-br ${game.color} rounded-lg mb-4 flex items-center justify-center`}>
                  <span className="text-5xl font-bold text-white opacity-90">
                    {game.name.split(' ').map(w => w[0]).join('')}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {game.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-500">{t.games.activePlayers}</div>
                    <div className="text-sm font-semibold text-gray-900">{game.players}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-500">{t.games.avgTime}</div>
                    <div className="text-sm font-semibold text-gray-900">{game.avgTime}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500">{t.games.startingFrom}</div>
                    <div className="text-lg font-bold text-primary-600">{game.startPrice}</div>
                  </div>
                  <div className="text-primary-600 font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                    {t.games.viewServices}
                    <svg className="w-4 h-4 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Games;

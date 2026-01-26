import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const LeagueOfLegends = () => {
  const services = [
    {
      name: 'Rank Boost',
      description: 'Montée de rang rapide par des joueurs Challenger/Master',
      price: 'À partir de €19.99',
      features: ['100% Main', 'Livestream disponible', 'Garantie de résultat', 'Support 24/7'],
      icon: '🚀',
    },
    {
      name: 'Duo Queue',
      description: 'Jouez avec un joueur professionnel et apprenez',
      price: 'À partir de €14.99/game',
      features: ['Conseils en direct', 'Améliorez votre gameplay', 'Champions spécifiques', 'Rôle au choix'],
      icon: '👥',
    },
    {
      name: 'Placement Matches',
      description: 'Obtenez le meilleur rang possible pour la nouvelle saison',
      price: 'À partir de €49.99',
      features: ['Joueurs Master+', 'Maximisez votre MMR', '10 games', 'Début immédiat'],
      icon: '🎯',
    },
    {
      name: 'Coaching Personnel',
      description: 'Sessions de coaching 1-on-1 avec des pros',
      price: '€29.99/heure',
      features: ['Analyse de replays', 'Conseils personnalisés', 'Stratégies avancées', 'Notes détaillées'],
      icon: '🎓',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block text-7xl mb-4">🎮</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            League of Legends <span className="gradient-text">Boosting</span>
          </h1>
          <p className="text-xl text-dark-300 max-w-2xl mx-auto">
            Services de boosting premium pour LoL. Atteignez votre rang de rêve avec nos boosteurs Challenger et Master.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {services.map((service, index) => (
            <Card key={index} hover>
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">{service.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                  <p className="text-dark-400 mb-3">{service.description}</p>
                  <div className="text-2xl font-bold gradient-text mb-4">{service.price}</div>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-dark-300">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/order">
                <Button variant="primary" className="w-full">Commander Maintenant</Button>
              </Link>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-primary-600/20 to-primary-500/20 border-primary-500/30">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir notre service LoL ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div>
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-bold text-lg mb-2">Boost Rapide</h3>
                <p className="text-dark-300">Commencez dans les 5 minutes après la commande</p>
              </div>
              <div>
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-bold text-lg mb-2">100% Sécurisé</h3>
                <p className="text-dark-300">VPN, mode offline, compte protégé</p>
              </div>
              <div>
                <div className="text-4xl mb-3">👑</div>
                <h3 className="font-bold text-lg mb-2">Joueurs Elite</h3>
                <p className="text-dark-300">Tous nos boosteurs sont Challenger/Master</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LeagueOfLegends;

'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface OrderForm {
  game: string;
  service: string;
  currentRank: string;
  desiredRank: string;
  options: {
    priority: boolean;
    duoQueue: boolean;
    specificChampions: boolean;
    streaming: boolean;
  };
  customerEmail: string;
  customerName: string;
  customerDiscord: string;
}

const Order = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OrderForm>({
    game: '',
    service: '',
    currentRank: '',
    desiredRank: '',
    options: {
      priority: false,
      duoQueue: false,
      specificChampions: false,
      streaming: false,
    },
    customerEmail: '',
    customerName: '',
    customerDiscord: '',
  });
  const [price, setPrice] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const games = [
    { id: 'league-of-legends', name: 'League of Legends' },
    { id: 'valorant', name: 'Valorant' },
    { id: 'cs2', name: 'CS2' },
    { id: 'dota2', name: 'Dota 2' },
  ];

  const services = [
    { id: 'rank-boost', name: 'Rank Boost', description: 'Montée de rang rapide' },
    { id: 'duo-queue', name: 'Duo Queue', description: 'Jouez avec un pro' },
    { id: 'placement', name: 'Placement Matches', description: 'Meilleur rang possible' },
    { id: 'coaching', name: 'Coaching', description: 'Améliorez votre gameplay' },
  ];

  const ranks: Record<string, string[]> = {
    'league-of-legends': ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Challenger'],
    'valorant': ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'],
    'cs2': ['Silver', 'Gold Nova', 'Master Guardian', 'Legendary Eagle', 'Supreme', 'Global'],
    'dota2': ['Herald', 'Guardian', 'Crusader', 'Archon', 'Legend', 'Ancient', 'Divine', 'Immortal'],
  };

  // Calculate price when relevant fields change
  useEffect(() => {
    if (formData.game && formData.service && formData.currentRank && formData.desiredRank) {
      calculatePrice();
    }
  }, [formData.game, formData.service, formData.currentRank, formData.desiredRank, formData.options]);

  const calculatePrice = async () => {
    try {
      const response = await fetch('/api/calculate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: formData.game,
          service: formData.service,
          currentRank: formData.currentRank,
          desiredRank: formData.desiredRank,
          options: formData.options,
        }),
      });

      const data = await response.json();
      setPrice(data.price);
      setEstimatedTime(data.estimatedTime);
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setOrderNumber(data.order.orderNumber);
        setOrderComplete(true);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <Card padding="lg" className="text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande créée !</h1>
              <p className="text-gray-600">Votre numéro de commande</p>
              <p className="text-2xl font-bold text-primary-600 mt-2">{orderNumber}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Prochaines étapes</h3>
              <div className="text-left space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</div>
                  <p className="text-gray-700">Vérifiez votre email pour les détails de paiement</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</div>
                  <p className="text-gray-700">Un boosteur sera assigné dans les 2 heures</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</div>
                  <p className="text-gray-700">Suivez votre progression sur le dashboard</p>
                </div>
              </div>
            </div>

            <Button variant="primary" size="lg" onClick={() => window.location.href = '/dashboard'} className="w-full">
              Voir mon dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {['Jeu & Service', 'Rangs', 'Informations'].map((label, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step > index + 1 ? 'bg-accent-500 text-white' : step === index + 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > index + 1 ? '✓' : index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${step >= index + 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                  {label}
                </span>
                {index < 2 && <div className={`w-12 h-1 mx-3 ${step > index + 1 ? 'bg-accent-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card padding="lg">
              {/* Step 1: Game & Service */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Sélectionnez votre jeu</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {games.map((game) => (
                        <button
                          key={game.id}
                          onClick={() => setFormData({ ...formData, game: game.id })}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            formData.game === game.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-900">{game.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.game && (
                    <div className="animate-fade-in">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Choisissez votre service</h2>
                      <div className="grid grid-cols-1 gap-4">
                        {services.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => setFormData({ ...formData, service: service.id })}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              formData.service === service.id
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-semibold text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-600">{service.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.game && formData.service && (
                    <Button variant="primary" size="lg" fullWidth onClick={() => setStep(2)}>
                      Continuer
                    </Button>
                  )}
                </div>
              )}

              {/* Step 2: Ranks */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Rang actuel</label>
                    <select
                      value={formData.currentRank}
                      onChange={(e) => setFormData({ ...formData, currentRank: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Sélectionnez votre rang</option>
                      {ranks[formData.game]?.map((rank) => (
                        <option key={rank} value={rank}>{rank}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Rang désiré</label>
                    <select
                      value={formData.desiredRank}
                      onChange={(e) => setFormData({ ...formData, desiredRank: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Sélectionnez votre objectif</option>
                      {ranks[formData.game]?.map((rank) => (
                        <option key={rank} value={rank}>{rank}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Options supplémentaires</label>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.options.priority}
                          onChange={(e) => setFormData({ ...formData, options: { ...formData.options, priority: e.target.checked }})}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">Mode prioritaire (+30%)</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.options.duoQueue}
                          onChange={(e) => setFormData({ ...formData, options: { ...formData.options, duoQueue: e.target.checked }})}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">Duo queue (+20%)</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.options.specificChampions}
                          onChange={(e) => setFormData({ ...formData, options: { ...formData.options, specificChampions: e.target.checked }})}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">Champions spécifiques (+10%)</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.options.streaming}
                          onChange={(e) => setFormData({ ...formData, options: { ...formData.options, streaming: e.target.checked }})}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">Streaming en direct (+5€)</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="secondary" size="lg" fullWidth onClick={() => setStep(1)}>
                      Retour
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={() => setStep(3)}
                      disabled={!formData.currentRank || !formData.desiredRank}
                    >
                      Continuer
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Customer Info */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Vos informations</h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Nom complet</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Discord</label>
                    <input
                      type="text"
                      value={formData.customerDiscord}
                      onChange={(e) => setFormData({ ...formData, customerDiscord: e.target.value })}
                      placeholder="username#1234"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="secondary" size="lg" fullWidth onClick={() => setStep(2)}>
                      Retour
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handleSubmit}
                      disabled={!formData.customerEmail || isLoading}
                    >
                      {isLoading ? 'Création...' : 'Créer la commande'}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card padding="lg" className="sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Résumé</h3>

              {formData.game && (
                <div className="space-y-3 text-sm pb-4 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jeu:</span>
                    <span className="font-medium text-gray-900">{games.find(g => g.id === formData.game)?.name}</span>
                  </div>
                  {formData.service && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium text-gray-900">{services.find(s => s.id === formData.service)?.name}</span>
                    </div>
                  )}
                  {formData.currentRank && formData.desiredRank && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Boost:</span>
                      <span className="font-medium text-gray-900">{formData.currentRank} → {formData.desiredRank}</span>
                    </div>
                  )}
                </div>
              )}

              {price > 0 && (
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prix total:</span>
                    <span className="text-3xl font-bold text-primary-600">{price.toFixed(2)}€</span>
                  </div>
                  {estimatedTime && (
                    <div className="text-sm text-gray-600 text-center">
                      Temps estimé: <span className="font-medium text-gray-900">{estimatedTime}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-start text-xs text-gray-500">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Garantie satisfait ou remboursé</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;

// Pricing calculator for boosting services

export interface PriceConfig {
  game: string;
  service: string;
  currentRank: string;
  desiredRank: string;
  options?: {
    priority?: boolean;
    duoQueue?: boolean;
    specificChampions?: boolean;
    streaming?: boolean;
  };
}

// Rank values pour le calcul
const rankValues: Record<string, Record<string, number>> = {
  'league-of-legends': {
    'iron': 0,
    'bronze': 4,
    'silver': 8,
    'gold': 12,
    'platinum': 16,
    'diamond': 20,
    'master': 24,
    'grandmaster': 28,
    'challenger': 32,
  },
  'valorant': {
    'iron': 0,
    'bronze': 3,
    'silver': 6,
    'gold': 9,
    'platinum': 12,
    'diamond': 15,
    'ascendant': 18,
    'immortal': 21,
    'radiant': 24,
  },
  'cs2': {
    'silver': 0,
    'gold-nova': 4,
    'master-guardian': 8,
    'legendary-eagle': 12,
    'supreme': 16,
    'global': 20,
  }
};

// Base prices par division
const basePricePerDivision: Record<string, number> = {
  'rank-boost': 5.99,
  'duo-queue': 8.99,
  'placement': 49.99,
  'coaching': 29.99,
};

export function calculatePrice(config: PriceConfig): number {
  const { game, service, currentRank, desiredRank, options = {} } = config;

  // Pour placement matches, prix fixe
  if (service === 'placement') {
    return basePricePerDivision[service];
  }

  // Pour coaching, prix par heure
  if (service === 'coaching') {
    return basePricePerDivision[service];
  }

  // Calculer la différence de divisions
  const ranks = rankValues[game] || rankValues['league-of-legends'];
  const currentValue = ranks[currentRank.toLowerCase()] || 0;
  const desiredValue = ranks[desiredRank.toLowerCase()] || 0;
  const divisions = Math.max(1, desiredValue - currentValue);

  // Prix de base par division
  let price = divisions * (basePricePerDivision[service] || basePricePerDivision['rank-boost']);

  // Options supplémentaires
  if (options.priority) {
    price *= 1.3; // +30%
  }
  if (options.duoQueue) {
    price *= 1.2; // +20%
  }
  if (options.specificChampions) {
    price *= 1.1; // +10%
  }
  if (options.streaming) {
    price += 5; // +5€ fixe
  }

  // Arrondir à 2 décimales
  return Math.round(price * 100) / 100;
}

export function estimateTime(divisions: number, service: string): string {
  if (service === 'placement') {
    return '1-2 jours';
  }
  if (service === 'coaching') {
    return '1 heure';
  }

  const daysPerDivision = 1.5;
  const totalDays = Math.ceil(divisions * daysPerDivision);

  if (totalDays <= 2) return '1-2 jours';
  if (totalDays <= 5) return '3-5 jours';
  if (totalDays <= 7) return '5-7 jours';
  return `${totalDays} jours`;
}

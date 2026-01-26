'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function ApplyBoosterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discord: '',
    age: '',
    games: [] as string[],
    ranks: '',
    experience: '',
    availability: '',
    why: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const availableGames = [
    'League of Legends',
    'Valorant',
    'CS2',
    'Dota 2',
    'Overwatch 2',
    'Apex Legends',
  ];

  const toggleGame = (game: string) => {
    setFormData({
      ...formData,
      games: formData.games.includes(game)
        ? formData.games.filter((g) => g !== game)
        : [...formData.games, game],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.games.length === 0) {
      setError('Please select at least one game');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/apply/booster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Application failed');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-medium sm:rounded-lg sm:px-10 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for applying. We'll review your application and get back to you within 48 hours.
            </p>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <Link href="/" className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="AQTBOOST"
            width={200}
            height={48}
            className="h-12 w-auto"
          />
        </Link>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Apply to Become a Booster
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our team of professional boosters
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-medium sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="discord" className="block text-sm font-medium text-gray-700">
                  Discord username <span className="text-red-500">*</span>
                </label>
                <input
                  id="discord"
                  type="text"
                  required
                  placeholder="username#1234"
                  value={formData.discord}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  id="age"
                  type="number"
                  required
                  min="18"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Games you can boost <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableGames.map((game) => (
                  <button
                    key={game}
                    type="button"
                    onClick={() => toggleGame(game)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      formData.games.includes(game)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {game}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="ranks" className="block text-sm font-medium text-gray-700">
                Your peak ranks <span className="text-red-500">*</span>
              </label>
              <textarea
                id="ranks"
                required
                rows={3}
                placeholder="Example: League of Legends - Challenger, Valorant - Immortal 3"
                value={formData.ranks}
                onChange={(e) => setFormData({ ...formData, ranks: e.target.value })}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Boosting experience <span className="text-red-500">*</span>
              </label>
              <textarea
                id="experience"
                required
                rows={4}
                placeholder="Tell us about your previous boosting experience (platforms, duration, number of orders, etc.)"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                Availability <span className="text-red-500">*</span>
              </label>
              <textarea
                id="availability"
                required
                rows={2}
                placeholder="Example: Available 6-8 hours/day, weekends, evenings"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="why" className="block text-sm font-medium text-gray-700">
                Why do you want to join AQTBOOST? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="why"
                required
                rows={4}
                placeholder="Tell us why you want to join our team"
                value={formData.why}
                onChange={(e) => setFormData({ ...formData, why: e.target.value })}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> We carefully review each application. If accepted, you'll receive an
                email with next steps within 48 hours. You can also join our{' '}
                <a
                  href="https://discord.gg/aqtboost"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Discord server
                </a>{' '}
                for updates.
              </p>
            </div>

            <div className="flex gap-4">
              <Link href="/" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" disabled={loading} className="flex-1">
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

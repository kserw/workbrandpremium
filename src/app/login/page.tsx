'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/auth';
import LogoImage from '@/components/LogoImage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      
      if (email.includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-blue-900 p-4">
      <div className="glass w-full max-w-md p-8 rounded-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-64">
              <LogoImage />
            </div>
          </div>
          <p className="text-white mt-2">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-2 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-workbrand-blue focus:border-transparent transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-white mb-2 text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-3 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-workbrand-blue focus:border-transparent transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-workbrand-blue text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-workbrand-blue transition ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-workbrand-blue-600'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <div className="text-white font-medium mb-3">Demo credentials:</div>
          <div className="text-white">User: user@mastercard.com / password123</div>
          <div className="text-white mt-2">Admin: admin@mastercard.com / admin123</div>
        </div>
      </div>
    </div>
  );
}

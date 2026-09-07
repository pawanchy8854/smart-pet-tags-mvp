"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Attempt to sign in
    let { error } = await supabase.auth.signInWithPassword({ email, password });

    // If account doesn't exist, create it automatically for local testing
    if (error && error.message.includes("Invalid login")) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      error = signUpError;
    }

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
        <ShieldCheck size={48} className="mx-auto text-blue-600 mb-6" />
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Owner Access</h1>
        <p className="text-gray-500 mb-8">Sign in to manage your smart tags.</p>
        
        <form onSubmit={handleAuth} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition disabled:bg-blue-400 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
            {loading ? 'Authenticating...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
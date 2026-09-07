"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Save, Loader2 } from 'lucide-react';

export default function SetupPet() {
  const params = useParams();
  const router = useRouter();
  const tagId = params.tagId as string;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    owner_phone: '',
    medical_alerts: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in.");
      router.push('/login');
      return;
    }

    // 1. Save Pet Data and catch exact error
    const { data: newPet, error: petError } = await supabase
      .from('pets')
      .insert({
        owner_id: user.id,
        name: formData.name,
        owner_phone: formData.owner_phone,
        medical_alerts: formData.medical_alerts,
      })
      .select()
      .single();

    if (petError) {
      alert(`Pet DB Error: ${petError.message} (Code: ${petError.code})`);
      setLoading(false);
      return;
    }

    // 2. Link the Tag and catch exact error
    const { error: tagError } = await supabase
      .from('tags')
      .update({ status: 'active', pet_id: newPet.id })
      .eq('id', tagId);

    if (tagError) {
      alert(`Tag DB Error: ${tagError.message} (Code: ${tagError.code})`);
      setLoading(false);
      return;
    }

    // 3. Success
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg mt-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Register Your Pet</h1>
        <p className="text-gray-500 mb-6">Linking to Tag: <span className="font-mono text-blue-600">{tagId}</span></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Pet's Name *</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Your Phone Number *</label>
            <input 
              type="tel" 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.owner_phone}
              onChange={(e) => setFormData({...formData, owner_phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Medical Alerts (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g., Diabetic, Needs Insulin"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.medical_alerts}
              onChange={(e) => setFormData({...formData, medical_alerts: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 mt-8 disabled:bg-blue-400"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? 'Saving Profile...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
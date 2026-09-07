"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Save, ShieldAlert, ToggleRight, ToggleLeft, Loader2, LogOut } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pet, setPet] = useState<any>(null);

  useEffect(() => {
    async function loadDashboard() {
      // 1. Verify user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // 2. Fetch the user's pet (fetching the first one for MVP)
      const { data: petData } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .limit(1)
        .single();

      if (petData) {
        setPet(petData);
      }
      setLoading(false);
    }
    loadDashboard();
  }, [router]);

  const handleToggle = (key: string) => {
    const updatedSettings = { ...pet.visibility_settings, [key]: !pet.visibility_settings[key] };
    setPet({ ...pet, visibility_settings: updatedSettings });
  };

  const handleLostToggle = () => {
    setPet({ ...pet, is_lost: !pet.is_lost });
  };

  const saveChanges = async () => {
    setSaving(true);
    await supabase
      .from('pets')
      .update({ 
        is_lost: pet.is_lost,
        visibility_settings: pet.visibility_settings 
      })
      .eq('id', pet.id);
    setSaving(false);
    alert("Settings saved successfully!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">No Pets Found</h2>
        <p className="text-gray-500 mb-6">You haven't registered any smart tags yet.</p>
        <button onClick={handleLogout} className="text-blue-600 font-medium">Log Out</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 bg-white min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8 pb-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">{pet.name}'s Profile</h1>
        <div className="flex gap-3">
          <button onClick={handleLogout} className="text-gray-500 hover:text-gray-900 p-2">
            <LogOut size={20} />
          </button>
          <button 
            onClick={saveChanges}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save
          </button>
        </div>
      </div>

      <div className={`p-5 rounded-xl mb-8 border-2 transition-colors ${
        pet.is_lost ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert size={20} className={pet.is_lost ? "text-red-600" : "text-gray-400"} />
              Lost Pet Mode
            </h2>
            <p className="text-sm text-gray-500 mt-1">Activating this alerts finders immediately.</p>
          </div>
          <button onClick={handleLostToggle}>
            {pet.is_lost ? <ToggleRight size={40} className="text-red-600" /> : <ToggleLeft size={40} className="text-gray-300" />}
          </button>
        </div>
      </div>

      <h3 className="font-bold text-gray-900 mb-4">Public Scan Visibility</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Show Phone Number</p>
            <p className="text-xs text-gray-500">Allow finders to call {pet.owner_phone}</p>
          </div>
          <button onClick={() => handleToggle('showPhone')}>
             {pet.visibility_settings.showPhone ? <ToggleRight size={32} className="text-blue-600" /> : <ToggleLeft size={32} className="text-gray-300" />}
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Show Medical Alerts</p>
            <p className="text-xs text-gray-500">Display critical health info to finders</p>
          </div>
          <button onClick={() => handleToggle('showMedicalAlerts')}>
             {pet.visibility_settings.showMedicalAlerts ? <ToggleRight size={32} className="text-blue-600" /> : <ToggleLeft size={32} className="text-gray-300" />}
          </button>
        </div>
      </div>
    </div>
  );
}
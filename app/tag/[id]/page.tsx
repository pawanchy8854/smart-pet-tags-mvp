"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Phone, MapPin, Tag, PlusCircle } from 'lucide-react';

export default function TagRouter() {
  const params = useParams();
  const router = useRouter();
  const tagId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [tagData, setTagData] = useState<any>(null);
  const [petData, setPetData] = useState<any>(null);

  useEffect(() => {
    async function fetchTagDetails() {
      // 1. Check if the physical tag exists in our database
      const { data: tag } = await supabase
        .from('tags')
        .select('*')
        .eq('id', tagId)
        .single();

      if (tag) {
        setTagData(tag);
        // 2. If it's linked to a pet, fetch the pet's profile
        if (tag.pet_id) {
          const { data: pet } = await supabase
            .from('pets')
            .select('*')
            .eq('id', tag.pet_id)
            .single();
          setPetData(pet);
        }
      }
      setLoading(false);
    }
    fetchTagDetails();
  }, [tagId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-sans">Loading secure profile...</div>;
  }

  if (!tagData) {
    return <div className="min-h-screen flex items-center justify-center font-sans font-bold text-red-500">Invalid or Counterfeit Tag.</div>;
  }

  // --- STATE 1: UNREGISTERED TAG (Activation Setup) ---
  if (tagData.status === 'unclaimed') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 font-sans">
        <div className="w-full max-w-md text-center mt-8 mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <Tag size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">New Tag Detected</h1>
          <p className="text-gray-500">ID: {tagId}</p>
        </div>
        <div className="w-full max-w-md">
          <button
            onClick={() => router.push(`/setup/${tagId}`)}
            className="w-full flex items-center p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-500 transition"
          >
            <PlusCircle size={28} className="text-blue-600 mr-4" />
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900">Set up a new pet</h3>
              <p className="text-sm text-gray-500">Link this tag to a digital profile.</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // --- STATE 2: REGISTERED TAG (Finder View) ---
  const handleLocation = () => alert("Location sent to owner!");

  if (tagData.status === 'active' && petData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-sans">
        <div className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden mt-4">
          <div className="w-full h-64 bg-gray-200">
            <img
              src={petData.photo_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800"}
              alt="Pet"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 text-center space-y-4">
            <h1 className="text-4xl font-extrabold text-gray-900">{petData.name}</h1>

            {/* Dynamically render medical alerts if they exist in the DB */}
            {petData.medical_alerts && (
              <p className="text-sm font-semibold text-red-600 bg-red-50 py-2 rounded-lg">
                Alert: {petData.medical_alerts}
              </p>
            )}

            <a href={`tel:${petData.owner_phone}`} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg">
              <Phone size={24} />
              Call Owner
            </a>

            <button onClick={handleLocation} className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 text-lg font-bold py-4 rounded-xl hover:bg-gray-50">
              <MapPin size={24} />
              Share My Location
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback UI in case of unexpected state
  return <div className="min-h-screen flex items-center justify-center">Error loading tag state.</div>;
}
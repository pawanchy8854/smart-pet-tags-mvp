"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Phone, MapPin, Tag, PlusCircle } from 'lucide-react';

export default function TagRouter() {
  const params = useParams();
  const tagId = params.id as string;
  
  // In a real app, you fetch this status from Supabase using the tagId
  // For the MVP UI, we simulate a mock database response:
  const isTagRegistered = tagId === "DEMO-123"; 

  // --- STATE 1: UNREGISTERED TAG (Activation Setup) ---
  if (!isTagRegistered) {
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
          <button className="w-full flex items-center p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-500 transition">
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden mt-4">
        <div className="w-full h-64 bg-gray-200">
          <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800" alt="Pet" className="w-full h-full object-cover" />
        </div>
        <div className="p-6 text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">Max</h1>
          <p className="text-gray-600">Golden Retriever • Microchipped</p>
          
          <a href="tel:5550198" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg">
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
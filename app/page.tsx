import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Smartphone } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 font-sans">
      <main className="max-w-2xl text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl mb-4 shadow-sm">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Next-Gen Pet Safety.
        </h1>
        <p className="text-xl text-gray-500 max-w-lg mx-auto">
          The smart QR & NFC tag that protects your pet with instant alerts, GPS mapping, and a secure medical vault.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/login" className="bg-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-700 transition">
            Owner Login
          </Link>
          <Link href="/tag/DEMO-123" className="bg-white text-gray-900 border-2 border-gray-200 font-bold py-4 px-8 rounded-xl hover:border-gray-300 transition">
            Try a Demo Scan
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <MapPin className="text-blue-500 mb-4" size={28} />
            <h3 className="font-bold text-lg">Instant Geolocation</h3>
            <p className="text-gray-500 text-sm mt-2">Get an exact map pin sent directly to your phone the second someone scans your lost pet's tag.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <Smartphone className="text-blue-500 mb-4" size={28} />
            <h3 className="font-bold text-lg">No App Required</h3>
            <p className="text-gray-500 text-sm mt-2">Finders simply tap or scan the tag with their native smartphone camera to contact you instantly.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
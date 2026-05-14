'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { ChevronLeft, MapPin, Navigation } from 'lucide-react';
import Button from '@/components/ui/Button';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 80px)'
};

const center = {
  lat: 23.0225,
  lng: 72.5714
};

const mockCases = [
  { id: '1', applicant: 'Amit Sharma', lat: 23.0225, lng: 72.5714, address: 'Satellite, Ahmedabad' },
  { id: '2', applicant: 'Priya Patel', lat: 23.0300, lng: 72.5800, address: 'South Bopal, Ahmedabad' },
];

export default function NearbyMapPage() {
  const router = useRouter();
  const [selectedCase, setSelectedCase] = useState<typeof mockCases[0] | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  if (!isLoaded) return <div className="h-screen flex items-center justify-center">Loading Maps...</div>;

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-lg px-6 py-4 flex items-center gap-4 border-b border-gray-100 z-10">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft className="h-6 w-6 text-gray-500" />
        </button>
        <h1 className="text-xl font-bold">Nearby Cases</h1>
      </header>

      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
              {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#746855' }]
              },
              // ... add custom premium dark/light styles if needed
            ]
          }}
        >
          {mockCases.map((item) => (
            <Marker
              key={item.id}
              position={{ lat: item.lat, lng: item.lng }}
              onClick={() => setSelectedCase(item)}
            />
          ))}

          {selectedCase && (
            <InfoWindow
              position={{ lat: selectedCase.lat, lng: selectedCase.lng }}
              onCloseClick={() => setSelectedCase(null)}
            >
              <div className="p-2 min-w-[150px]">
                <h4 className="font-bold text-gray-900">{selectedCase.applicant}</h4>
                <p className="text-xs text-gray-500 mb-2">{selectedCase.address}</p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => router.push(`/engineer/visit/${selectedCase.id}`)}
                >
                  Start Visit
                </Button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Floating Action for Current Location */}
        <button className="absolute bottom-24 right-6 p-4 bg-white rounded-full shadow-2xl text-blue-600 active:scale-95 transition-transform">
          <Navigation className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

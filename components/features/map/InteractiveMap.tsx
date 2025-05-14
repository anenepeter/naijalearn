'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlForImage } from '@/lib/sanityClient';
import 'leaflet/dist/leaflet.css';
// Attempting to force re-evaluation
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';

// Fix for default marker icon issue with Webpack
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
  iconUrl: 'leaflet/images/marker-icon.png',
  shadowUrl: 'leaflet/images/marker-shadow.png',
});

interface MapLocation {
  _id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: any[]; // Sanity Portable Text
  cultural_significance?: string;
  media?: any[]; // Sanity assets
}

interface InteractiveMapProps {
  locations: MapLocation[];
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ locations }) => {
  const mapRef = useRef<L.Map | null>(null);

  // Calculate bounds to fit all markers
  const bounds = locations.length > 0
    ? L.latLngBounds(locations.map(loc => [loc.coordinates.lat, loc.coordinates.lng]))
    : undefined; // No bounds if no locations

  return (
    <div className="h-[600px] w-full rounded-md shadow-lg"> {/* Responsive container with styling */}
      <MapContainer
        center={[9.0820, 8.6753]} // Default center
        {...(bounds ? { bounds } : {})} // Apply bounds if they exist
        zoom={locations.length === 1 ? 10 : undefined} // Zoom in on a single marker
        scrollWheelZoom={true} // Enable scroll wheel zoom
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker key={location._id} position={[location.coordinates.lat, location.coordinates.lng]}>
            <Popup>
              <div className="max-w-xs">
                <h3 className="text-lg font-bold mb-2">{location.name}</h3>
                {location.description && (
                  <div className="prose max-w-xs">
                    <PortableText value={location.description} />
                  </div>
                )}
                {location.cultural_significance && (
                  <p className="mt-2 text-sm italic">{location.cultural_significance}</p>
                )}
                {location.media && location.media.length > 0 && (
                  <div className="mt-4">
                    {location.media.map((item, index) => (
                      <div key={index}>
                        {item._type === 'image' && item.asset && (
                          <Image
                            src={urlForImage(item).url()}
                            alt={`Media for ${location.name}`}
                            width={200} // Adjust size as needed
                            height={150} // Adjust size as needed
                            style={{ objectFit: 'cover' }}
                            className="rounded-md"
                          />
                        )}
                        {/* Add handling for video or other file types if necessary */}
                        {/* Example for a video file: */}
                        {item._type === 'file' && item.asset && item.asset._ref.includes('.mp4') && (
                          <video controls width="200">
                            <source src={urlForImage(item).url()} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
import InteractiveMap from '@/components/features/map/InteractiveMap';
import { client } from '@/lib/sanityClient';
import { mapLocationsQuery } from '@/lib/sanityQueries';

async function getMapLocations() {
  const locations = await client.fetch(mapLocationsQuery);
  return locations;
}

export default async function MapPage() {
  const locations = await getMapLocations();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Interactive Map of Nigeria</h1>
      <InteractiveMap locations={locations} />
    </div>
  );
}
import { CulturalMatchingGame } from '@/components/features/games/CulturalMatchingGame';
import { getAllMatchingActivities } from '@/lib/sanityQueries';

export default async function CulturalMatchingGamePage() {
  const activities = await getAllMatchingActivities();

  if (!activities || activities.length === 0) {
    return <div>No matching activities found.</div>;
  }

  // For now, display the first activity. You might want to list them or
  // implement dynamic routing to display a specific game later.
  const firstActivity = activities[0];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Cultural Matching Games</h1>
      {/* Render a list of games or the first game */}
      <CulturalMatchingGame activity={firstActivity} />
    </div>
  );
}
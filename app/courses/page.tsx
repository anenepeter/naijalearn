import { client } from '@/lib/sanityClient';
import { courseCardQuery } from '@/lib/sanityQueries';
import CourseCard from '@/components/features/courses/CourseCard'; // Assuming CourseCard component is created

export default async function CoursesPage() {
  const courses = await client.fetch(courseCardQuery);

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">All Courses</h1>
      {/* Add filtering and sorting options here later */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any) => ( // Replace 'any' with a proper CourseCardProps type later
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </main>
  );
}
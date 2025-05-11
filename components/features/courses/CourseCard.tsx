import Link from 'next/link';
import Image from 'next/image'; // Assuming you'll use next/image for optimized images

// Define a basic type for course data expected by the card
interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt?: string;
    mainImage?: any; // Replace 'any' with a proper Sanity image type later
    category?: { title: string };
    difficulty?: string;
    instructor?: { name: string };
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const { title, slug, excerpt, mainImage, category, difficulty, instructor } = course;

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {mainImage && (
        <div className="relative w-full h-48">
          {/* Replace with Sanity image URL builder later */}
          <Image
            src="/placeholder-course-image.jpg" // Use a placeholder image for now
            alt={title}
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {category && <p className="text-sm text-gray-600">Category: {category.title}</p>}
        {difficulty && <p className="text-sm text-gray-600">Difficulty: {difficulty}</p>}
        {instructor && <p className="text-sm text-gray-600">Instructor: {instructor.name}</p>}
        {excerpt && <p className="text-gray-700 mt-2">{excerpt}</p>}
        <Link href={`/courses/${slug.current}`} className="mt-4 inline-block text-blue-600 hover:underline">
          Learn More
        </Link>
      </div>
    </div>
  );
}
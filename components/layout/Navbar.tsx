import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          NaijaLearn
        </Link>
        <div>
          <Link href="/" className="mr-4">Home</Link>
          <Link href="/courses" className="mr-4">Courses</Link>
          {/* Add more navigation links as needed */}
        </div>
      </div>
    </nav>
  );
}
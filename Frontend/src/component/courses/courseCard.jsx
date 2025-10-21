export default function CourseCard({ title, description }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition">
      <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">View Details</button>
    </div>
  );
}

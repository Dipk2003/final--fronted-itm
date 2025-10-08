const categories = ["Laptops", "Smartphones", "Accessories", "Monitors", "Keyboards", "Mice"]

export default function CategorySidebar() {
  return (
    <div className="bg-white p-6 rounded-md border shadow-sm">
      <h3 className="font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        {categories.map((cat, i) => (
          <li key={i} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">{cat}</li>
        ))}
      </ul>
    </div>
  )
}

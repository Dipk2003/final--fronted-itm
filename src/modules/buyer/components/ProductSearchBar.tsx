export default function ProductSearchBar() {
  return (
    <div className="my-6 flex gap-2">
      <input
        type="text"
        placeholder="Search for products..."
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
      />
      <button className="bg-black text-white px-4 py-2 rounded-md">Search</button>
    </div>
  )
}

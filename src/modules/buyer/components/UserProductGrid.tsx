export default function UserProductGrid() {
  return (
    <div className="bg-white p-6 rounded-md border shadow-sm">
      <h3 className="font-semibold mb-4">Featured Products</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border p-3 rounded-md">
            <div className="bg-gray-200 h-24 mb-2" />
            <p className="text-sm font-semibold">Product {i}</p>
            <p className="text-xs text-gray-500">₹99.99</p>
            <button className="mt-2 text-xs bg-black text-white px-2 py-1 rounded-md w-full">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  )
}

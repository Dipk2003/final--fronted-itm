const orders = [
  { product: "Laptop HP Pavilion", status: "Delivered" },
  { product: "Wireless Mouse", status: "Shipped" },
  { product: "Mechanical Keyboard", status: "Processing" },
]

export default function RecentOrders() {
  return (
    <div className="bg-white p-6 rounded-md border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Recent Orders</h3>
        <button className="text-sm text-blue-600 hover:underline">View All Orders</button>
      </div>
      <ul className="space-y-3">
        {orders.map((item, i) => (
          <li key={i} className="flex justify-between border-b pb-2">
            <span>{item.product}</span>
            <span className="text-sm text-gray-600">{item.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

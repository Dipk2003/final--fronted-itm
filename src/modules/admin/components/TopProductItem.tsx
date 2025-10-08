interface Props {
  name: string
  vendor: string
  sold: number
  revenue: string
  rating: number
}

export default function TopProductItem({ name, vendor, sold, revenue, rating }: Props) {
  return (
    <div className="border p-4 rounded-md shadow-sm flex justify-between items-center text-sm">
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-gray-500">by {vendor}</div>
      </div>
      <div className="text-right">
        <p className="text-gray-700">Sold: {sold}</p>
        <p className="text-gray-600">Revenue: {revenue}</p>
        <p className="text-yellow-500">⭐ {rating}</p>
      </div>
    </div>
  )
}

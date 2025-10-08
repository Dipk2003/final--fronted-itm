const actions = [
  { label: "Browse Products", icon: "📦" },
  { label: "My Orders", icon: "🧾" },
  { label: "Wishlist", icon: "❤️" },
  { label: "Support Chat", icon: "💬" }
]

export default function UserActionPanel() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <div key={index} className="p-4 border rounded-md bg-white text-center shadow-sm hover:shadow-md cursor-pointer">
          <div className="text-2xl">{action.icon}</div>
          <p className="mt-2 font-medium">{action.label}</p>
        </div>
      ))}
    </div>
  )
}

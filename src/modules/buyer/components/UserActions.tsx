interface UserActionsProps {
  onNavigate: (view: string) => void;
}

const actions = [
  { title: "Browse Products", icon: "🛒", view: "home" },
  { title: "My Orders", icon: "📦", view: "orders" },
  { title: "Wishlist", icon: "💖", view: "wishlist" },
  { title: "Support Chat", icon: "💬", view: "support" },
]

export default function UserActions({ onNavigate }: UserActionsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {actions.map((action, i) => (
        <div 
          key={i} 
          className="bg-white p-4 rounded-md border text-center shadow-sm hover:shadow-md transition cursor-pointer hover:bg-gray-50"
          onClick={(e) => {
            e.preventDefault();
            console.log('UserActions click:', action.view);
            onNavigate(action.view);
          }}
        >
          <div className="text-3xl mb-2">{action.icon}</div>
          <p className="font-medium">{action.title}</p>
        </div>
      ))}
    </div>
  )
}

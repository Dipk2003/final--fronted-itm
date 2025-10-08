'use client';

interface VendorQuickActionsProps {
  onActionClick: (action: string, subAction?: string) => void;
}

const actions = [
  { title: "Add Product", icon: "➕", button: "Add Product", action: "products", subAction: "add" },
  { title: "Bulk Upload", icon: "⬆️", button: "Upload Excel", action: "products", subAction: "excel" },
  { title: "View Analytics", icon: "📊", button: "View Analytics", action: "analytics" },
]

export default function VendorQuickActions({ onActionClick }: VendorQuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action, i) => (
        <div key={i} className="bg-white p-6 rounded-md border text-center shadow-sm">
          <div className="text-3xl mb-2">{action.icon}</div>
          <p className="font-medium mb-4">{action.title}</p>
          <button 
            onClick={() => onActionClick(action.action, action.subAction)}
            className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors"
          >
            {action.button}
          </button>
        </div>
      ))}
    </div>
  )
}

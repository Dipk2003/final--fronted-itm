interface AccountActionsProps {
  onNavigate: (view: string) => void;
}

const items = [
  { label: "Edit Profile", view: "profile" },
  { label: "Payment Methods", view: "profile" },
  { label: "Shipping Address", view: "profile" },
  { label: "Support", view: "support" }
]

export default function AccountActions({ onNavigate }: AccountActionsProps) {
  return (
    <div className="bg-white p-6 rounded-md border shadow-sm">
      <h3 className="font-semibold mb-4">Account</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li 
            key={i} 
            className="text-sm text-blue-600 hover:underline cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              console.log('AccountActions click:', item.view);
              onNavigate(item.view);
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

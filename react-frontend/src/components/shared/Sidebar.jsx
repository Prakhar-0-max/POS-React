import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Clock, CreditCard, BarChart2 } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Cart / Billing', path: '/cart', icon: ShoppingCart },
    { name: 'Orders', path: '/orders', icon: Clock },
    { name: 'Payment', path: '/payment', icon: CreditCard },
    { name: 'Reports', path: '/reports', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-73px)] hidden md:block">
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

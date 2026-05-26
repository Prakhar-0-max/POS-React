import { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, Users, Package } from 'lucide-react';
import { dashboardService } from '../../services/dashboard.service';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-4">
    <div className={`p-4 rounded-full ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const { reportService } = await import('../../services/report.service');
      const data = await reportService.getProductSales();
      setTopProducts((data || []).slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch top products', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const { orderService } = await import('../../services/order.service');
      const data = await orderService.getAllOrders();
      setRecentOrders((data || []).slice(0, 5)); // Show only top 5 recent
    } catch (error) {
      console.error('Failed to fetch recent orders', error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading dashboard stats...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={`₹ ${stats.totalRevenue?.toLocaleString() || 0}`} 
            icon={IndianRupee} 
            color="bg-emerald-100 text-emerald-600" 
          />
          <StatCard 
            title="Total Orders" 
            value={stats.totalOrders || 0} 
            icon={ShoppingBag} 
            color="bg-indigo-100 text-indigo-600" 
          />
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers || 0} 
            icon={Users} 
            color="bg-blue-100 text-blue-600" 
          />
          <StatCard 
            title="Total Products" 
            value={stats.totalProducts || 0} 
            icon={Package} 
            color="bg-rose-100 text-rose-600" 
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No recent orders found.
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600 flex items-center justify-end">
                      <IndianRupee size={14} className="mr-1" /> {order.totalAmount}
                    </p>
                    <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block mt-1">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Products</h3>
          {topProducts.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No product sales data yet.
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={product.productId} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.productName}</p>
                      <p className="text-xs text-gray-500">Stock: {product.currentStock}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">{product.totalQuantitySold} Sold</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

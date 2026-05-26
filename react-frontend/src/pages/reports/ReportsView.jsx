import { useState, useEffect } from 'react';
import { BarChart2, AlertTriangle } from 'lucide-react';
import { reportService } from '../../services/report.service';

const ReportsView = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const data = await reportService.getLowStockProducts();
      setLowStockProducts(data);
    } catch (error) {
      console.error('Failed to fetch low stock products', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <BarChart2 className="text-indigo-600" />
        Reports & Analytics
      </h1>
      
      {/* Low Stock Alerts Section */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-red-50/50">
          <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
            <AlertTriangle size={20} />
            Low Stock Alerts
          </h3>
          <p className="text-sm text-red-600 mt-1">Products with less than 5 items in stock.</p>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading alerts...</div>
        ) : lowStockProducts.length === 0 ? (
          <div className="p-8 text-center text-emerald-600 font-medium">
            All product stocks are looking good!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Product Name</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Current Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lowStockProducts.map(product => (
                  <tr key={product.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 text-gray-500">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {product.stock} left
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500 mt-6">
        Advanced reports will be implemented here.
      </div>
    </div>
  );
};

export default ReportsView;

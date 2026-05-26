import { useState } from 'react';
import { Smartphone, Banknote } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { cartService } from '../../services/cart.service';

const PaymentSelection = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  const processCheckout = async (method) => {
    setLoading(true);
    try {
      if (user && user.id) {
        await cartService.checkout({ 
          userId: user.id, 
          paymentMethod: method,
          items: cartItems 
        });
      }
      toast.success(`Payment processed successfully via ${method}!`);
      clearCart();
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleUpiSubmit = (e) => {
    e.preventDefault();
    if (!upiId) {
      toast.error('Please enter a valid UPI ID');
      return;
    }
    processCheckout(`UPI (${upiId})`);
  };

  const handleCashSubmit = () => {
    processCheckout('Cash');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Payment Selection</h1>
      
      {!selectedMethod ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <button 
            onClick={() => setSelectedMethod('UPI')}
            className="bg-white p-8 rounded-xl border-2 border-transparent hover:border-purple-600 shadow-sm transition-all text-center flex flex-col items-center gap-4"
          >
            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <Smartphone size={40} />
            </div>
            <span className="font-bold text-xl text-gray-900">Pay via UPI</span>
            <p className="text-gray-500 text-sm">Pay using your favorite UPI app</p>
          </button>
          
          <button 
            onClick={() => setSelectedMethod('Cash')}
            className="bg-white p-8 rounded-xl border-2 border-transparent hover:border-emerald-600 shadow-sm transition-all text-center flex flex-col items-center gap-4"
          >
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-3xl">
              ₹
            </div>
            <span className="font-bold text-xl text-gray-900">Pay via Cash</span>
            <p className="text-gray-500 text-sm">Pay using physical currency</p>
          </button>
        </div>
      ) : selectedMethod === 'UPI' ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md">
          <button onClick={() => setSelectedMethod(null)} className="text-indigo-600 font-medium mb-6 hover:underline">
            &larr; Back to Methods
          </button>
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <Smartphone size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Pay via UPI</h2>
            <p className="text-gray-500 text-center text-sm">
              Please enter the customer's UPI ID to complete the payment.
            </p>
          </div>

          <form onSubmit={handleUpiSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID / VPA
              </label>
              <input
                type="text"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading || !upiId}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? 'Processing...' : 'Complete Payment'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md text-center">
          <button onClick={() => setSelectedMethod(null)} className="text-indigo-600 font-medium mb-6 hover:underline block text-left w-full">
            &larr; Back to Methods
          </button>
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-3xl">
              ₹
            </div>
            <h2 className="text-xl font-bold text-gray-900">Pay via Cash</h2>
            <p className="text-gray-500 text-sm">
              Receive cash from the customer and confirm below to complete the order.
            </p>
          </div>
          
          <button 
            onClick={handleCashSubmit}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? 'Processing...' : 'Confirm Received Cash'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentSelection;

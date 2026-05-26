import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartView = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <ShoppingCart className="text-indigo-600" />
        Cart & Billing
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">Your cart is empty.</p>
              <button 
                onClick={() => navigate('/products')}
                className="mt-4 text-indigo-600 font-medium hover:underline"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-indigo-600 font-medium">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold hover:bg-gray-200"
                  >-</button>
                  <span className="w-4 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold hover:bg-gray-200"
                  >+</button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-rose-500 hover:text-rose-700 ml-4 font-medium text-sm"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (5%)</span>
              <span>₹{Math.round(cartTotal * 0.05)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-100">
              <span>Total</span>
              <span className="text-indigo-600">₹{cartTotal + Math.round(cartTotal * 0.05)}</span>
            </div>
          </div>
          <button 
            disabled={cartItems.length === 0}
            onClick={() => navigate('/payment')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;

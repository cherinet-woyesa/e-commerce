import { FiCheck, FiMail, FiTruck } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;

  // If no order details are present, redirect to home
  if (!orderDetails) {
    navigate('/');
    return null;
  }

  const order = {
    id: orderDetails.id,
    date: new Date().toLocaleDateString(),
    items: orderDetails.items,
    shipping: {
      method: orderDetails.shippingAddress.shippingMethod,
      cost: orderDetails.shippingAddress.shippingMethod === 'express' ? 9.99 : 0,
      address: `${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.zip}, ${orderDetails.shippingAddress.country}`
    },
    payment: {
      method: orderDetails.payment?.method || 'Payment completed',
      total: orderDetails.total
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiCheck className="text-green-500 text-3xl" />
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Thank you for your purchase. Your order #{order.id} has been received.
      </p>

      <div className="bg-white p-6 rounded-xl shadow-sm text-left max-w-md mx-auto mb-8">
        <h2 className="font-bold text-xl mb-4">Order Summary</h2>
        
        <div className="space-y-4 mb-6">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.quantity} × {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shipping.cost === 0 ? 'FREE' : `$${order.shipping.cost.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2">
            <span>Total</span>
            <span>${order.payment.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm text-left">
          <h3 className="font-bold mb-3">Shipping Information</h3>
          <p className="text-gray-700">{order.shipping.address}</p>
          <p className="text-gray-700 mt-2">{order.shipping.method}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm text-left">
          <h3 className="font-bold mb-3">Payment Method</h3>
          <p className="text-gray-700">{order.payment.method}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold mb-4">What's Next?</h3>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
            <FiMail className="text-blue-500 text-xl" />
            <span>Order confirmation sent to your email</span>
          </div>
          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
            <FiTruck className="text-blue-500 text-xl" />
            <span>Shipping updates coming soon</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to={`/orders/${order.id}`}
          className="px-6 py-3 bg-white border rounded-lg font-medium hover:bg-gray-50"
        >
          View Order Details
        </Link>
        <Link 
          to="/products"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
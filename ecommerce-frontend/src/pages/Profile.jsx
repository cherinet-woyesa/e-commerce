import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, updateDoc, doc, getFirestore } from 'firebase/firestore';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const db = getFirestore();

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
    }
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDocs(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch order history
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchUserData();
    fetchOrders();
    setLoading(false);
  }, [currentUser, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...userData,
        address: userData.address
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Address Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Street</label>
              <input
                type="text"
                value={userData.address.street}
                onChange={(e) => setUserData(prev => ({
                  ...prev,
                  address: { ...prev.address, street: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={userData.address.city}
                onChange={(e) => setUserData(prev => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                value={userData.address.state}
                onChange={(e) => setUserData(prev => ({
                  ...prev,
                  address: { ...prev.address, state: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code</label>
              <input
                type="text"
                value={userData.address.zip}
                onChange={(e) => setUserData(prev => ({
                  ...prev,
                  address: { ...prev.address, zip: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </form>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-sm text-gray-600">
                  Date: {new Date(order.date).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 font-semibold">
                  Total: ${order.total}
                </p>
                <p className={`mt-2 px-2 py-1 rounded-md ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Status: {order.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

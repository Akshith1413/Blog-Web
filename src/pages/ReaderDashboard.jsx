// pages/ReaderDashboard.jsx
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ReaderDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ likedPosts: 0, comments: 0, bookmarks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          `https://mern-blog-back-8z6z.onrender.com/api/readers/${user.id}/stats`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Reader Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard title="Liked Posts" value={stats.likedPosts} />
            <DashboardCard title="Your Comments" value={stats.comments} />
            <DashboardCard title="Bookmarks" value={stats.bookmarks} />
          </div>
        )}
      </main>
    </div>
  );
};

const DashboardCard = ({ title, value }) => (
  <div className="bg-white shadow rounded-lg p-6 text-center">
    <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
    <p className="text-3xl font-bold text-indigo-600 mt-2">{value}</p>
  </div>
);

export default ReaderDashboard;
// pages/dashboard.tsx
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('user');

      if (!userId) {
        router.push('/login'); // Redirect to login if no user ID is found
        return;
      }

      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        ;
        console.error('Failed to fetch user data');
      }
    };

    fetchUser();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex space-x-4">
            <Link href="/profile" className="hover:underline">
              Profile
            </Link>
            <Link href="/settings" className="hover:underline">
              Settings
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                router.push('/login');
              }}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <h2 className="text-3xl font-bold uppercase text-black mb-4">Welcome, {user.name}</h2>
        <div className="bg-white shadow flex  justify-around text-black font-bold p-4 rounded-lg">
          <p>Email: {user.email}</p>
          <p>Account: {user.account}</p>
          <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

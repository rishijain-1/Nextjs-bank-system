"use client"

import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FundTransfer from '../transections/fund-transfer/fund-transfer';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userToken = localStorage.getItem('token');

      if (!userToken) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`/api/users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setError('Failed to fetch user data');
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        setError('An error occurred while fetching user data');
        console.error('An error occurred:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return <div className="items-center h-screen flex justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="items-center h-screen flex justify-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold mb-2 sm:mb-0 px-3 hover:underline">
            Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row">
            <Link href="/profile" className="text-xl mb-2 sm:mb-0 px-3 hover:underline">
              Profile
            </Link>
            <Link href="/transactionhistory" className="text-xl mb-2 sm:mb-0 px-3 hover:underline">
              Transaction
            </Link>
            <Link href="/transaction-analysis" className="text-xl mb-2 sm:mb-0 px-3 hover:underline">
              Analysis
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/login');
              }}
              className="text-red-600 px-3 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <h2 className="text-2xl sm:text-3xl font-bold uppercase text-black mb-4">
          Welcome, {user.name}
        </h2>
        <div className="bg-white shadow flex flex-col sm:flex-row sm:justify-around text-black font-bold p-4 rounded-lg space-y-2 sm:space-y-0 sm:space-x-4">
          <p>Email: {user.email}</p>
          <p>Account: {user.account_no}</p>
          <p>Amount: $ {user.closeningBalance}</p>
          <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      </main>
     <FundTransfer/>
    
    </div>
  );
};

export default Dashboard;

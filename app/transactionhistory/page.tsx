"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


interface Transaction {
  id: string;
  sender_acc_no: string;
  receiver_acc_no: string;
  amount: number;
  type: string;
  transfer_date: string;
  method: string;
}

const TransactionHistory = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token missing');
        return;
      }

      try {
        const response = await fetch('/api/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          setTransactions(data);
        } else {
          const data = await response.json();
          setError(data.error || 'Failed to fetch transactions');
        }
      } catch (error) {
        setError('An error occurred while fetching transactions');
      }
    };

    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authorization token missing');
        return;
      }

      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTransactions(transactions.filter(transaction => transaction.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete transaction');
      }
    } catch (error) {
      alert('An unexpected error occurred.');
    } finally {
      setDeleting(null);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No transactions found</p>
      </div>
    );
  }

  return (
    <div>
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between">
            <Link href="/dashboard" className="text-2xl font-bold px-3 hover:underline">
                Dashboard
            </Link>
            <div className="flex flex-col sm:flex-row overflow-hidden">
                <Link href="/profile" className="text-xl px-3 hover:underline">
                Profile
                </Link>
                <Link href="/transactionhistory" className="text-xl px-3 hover:underline">
                Transaction
                </Link>
                <Link href="/transaction-analysis" className="text-xl px-3 hover:underline">
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
        <div className="min-h-screen text-black bg-gray-100 p-4 sm:p-6">
          <div className="container mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Transaction History</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-2 sm:px-4 border-b">ID</th>
                    <th className="py-2 px-2 sm:px-4 border-b">Sender</th>
                    <th className="py-2 px-2 sm:px-4 border-b">Receiver</th>
                    <th className="py-2 px-2 sm:px-4 border-b">Amount</th>
                    <th className="py-2 px-2 sm:px-4 border-b">Type</th>
                    <th className="py-2 px-2 sm:px-4 border-b">Date</th>
                    <th className="py-2 px-2 sm:px-4 border-b">Method</th>
                    <th className="py-2 px-2 sm:px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="py-2 px-2 sm:px-4 border-b">{transaction.id}</td>
                      <td className="py-2 px-2 sm:px-4 border-b">{transaction.sender_acc_no}</td>
                      <td className="py-2 px-2 sm:px-4 border-b">{transaction.receiver_acc_no}</td>
                      <td className="py-2 px-2 sm:px-4 border-b">${transaction.amount}</td>
                      <td className="py-2 px-2 sm:px-4 border-b">{transaction.type}</td>
                      <td className="py-2 px-2 sm:px-4 border-b">
                        {new Date(transaction.transfer_date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b">{transaction.method}</td>
                      <td className="py-2 px-2 sm:px-4 border-b">
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          disabled={deleting === transaction.id}
                          className="text-red-500 hover:underline"
                        >
                          {deleting === transaction.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>
    
  );
};

export default TransactionHistory;

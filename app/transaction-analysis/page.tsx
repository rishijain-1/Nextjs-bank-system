"use client";
import React, { useEffect, useState } from 'react';
import TransactionAnalysisChart from '../../component/TransactionAnalysisChart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// Register components with Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const TransactionAnalysisPage: React.FC = () => {
    const router =useRouter()
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Credits',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
      {
        label: 'Debits',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
    ],
  });

  const [options, setOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Transaction Analysis',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        type: 'category' as const,
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount',
        },
        ticks: {
          beginAtZero: true,
          callback: (value: number) => `$${value}`,
        },
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authorization token missing');
        return;
      }
  
      const response = await fetch('/api/transaction-analysis', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      // Log result for debugging
      console.log(result);
  
      // Ensure result is in the expected format
      setData({
        labels: result.map((entry: any) => entry.date),
        datasets: [
          {
            label: 'Credits',
            data: result.map((entry: any) => entry.credit),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
          },
          {
            label: 'Debits',
            data: result.map((entry: any) => entry.debit),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false,
          },
        ],
      });
    };
  
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
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
        <div className='flex justify-center flex-col min-h-80 items-center '>
            <div className='text-black font-bold text-2xl' > Transaction Analysis</div>
            <TransactionAnalysisChart
                type="line"
                data={data}
                options={options}
            />
        </div>
    </div>
  );
};

export default TransactionAnalysisPage;

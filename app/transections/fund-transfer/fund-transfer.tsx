import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FundTransfer = () => {
  const [receiverAccNo, setReceiverAccNo] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<string>('IMPS');
  const [method, setMethod] = useState<string>('CREDIT');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Clear previous messages
    setError(null);
    setSuccess(null);
  
    if (!receiverAccNo || amount === '' || amount <= 0) {
      setError('Please provide valid receiver account number and amount.');
      return;
    }
  
    // Ensure amount is a number before making the API request
    const transferAmount = Number(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }
  
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ receiver_acc_no: receiverAccNo, amount: transferAmount, type}),
      });
  
      const data = await response.json();
      if (response.ok) {
        setSuccess('Transfer successful!');
        setReceiverAccNo('');
        setAmount('');
        router.refresh();  // Refresh the page or redirect as needed
      } else {
        setError(data.error || 'An error occurred during the transfer.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };
  return (
    <div className="max-w-md text-black mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Fund Transfer</h2>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="receiverAccNo" className="block text-gray-700 font-medium mb-1">Receiver Account Number</label>
          <input
            id="receiverAccNo"
            type="text"
            value={receiverAccNo}
            onChange={(e) => setReceiverAccNo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Receiver Account Number"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700 font-medium mb-1">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Amount"
            min="1"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700 font-medium mb-1">Transaction Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="UPI">UPI</option>
            <option value="NEFT">NEFT</option>
            <option value="IMPS">IMPS</option>
            <option value="RTGS">RTGS</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Transfer
        </button>
      </form>
    </div>
  );
};

export default FundTransfer;

import React, { useState } from 'react';

const TransactionForm: React.FC = () => {
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/trasnfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender_acc_no: sender, receiver_acc_no: receiver, amount }),
    });
    const data = await response.json();
    if (response.ok) {
      setMessage('Transaction successful');
    } else {
      setMessage(`Transaction failed: ${data.error}`);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label className='text-black'>Sender Account Number</label>
        <input type="text" className='text-black' value={sender} onChange={(e) => setSender(e.target.value)} required />
      </div>
      <div>
        <label className='text-black'>Receiver Account Number</label>
        <input className='text-black' type="text" value={receiver} onChange={(e) => setReceiver(e.target.value)} required />
      </div>
      <div>
        <label className='text-black'>Amount</label>
        <input className='text-black' type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
      </div>
      <button className='text-black' type="submit">Transfer</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default TransactionForm;

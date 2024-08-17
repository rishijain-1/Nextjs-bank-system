import React from 'react';

interface Transaction {
  id: string;
  sender_acc_no: string;
  receiver_acc_no: string;
  amount: number;
  transfer_date: string;
}

interface Props {
  transactions: Transaction[];
}

const TransactionTable: React.FC<Props> = ({ transactions }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Sender</th>
          <th>Receiver</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td>{transaction.id}</td>
            <td>{transaction.sender_acc_no}</td>
            <td>{transaction.receiver_acc_no}</td>
            <td>{transaction.amount}</td>
            <td>{transaction.transfer_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;



import React from 'react';
import Header from '../../component/header/header';

const Dashboard: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="p-8">
        <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
        {/* Your dashboard content goes here */}
      </main>
    </div>
  );
};

export default Dashboard;

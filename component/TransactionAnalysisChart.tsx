import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';
import { ChartOptions } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

interface ChartProps {
  type: 'line';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  };
  options: ChartOptions<'line'>; // Use ChartOptions for type safety
}

const TransactionAnalysisChart: React.FC<ChartProps> = ({ type, data, options }) => {
  return (
    <div className='min-h-80 w-full items-center flex justify-center'>
      <Line data={data} options={options} />
    </div>
  );
};

export default TransactionAnalysisChart;

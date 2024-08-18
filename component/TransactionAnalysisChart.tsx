import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';

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
  options: {
    responsive: boolean;
    plugins: {
      legend: {
        display: boolean;
      };
      title: {
        display: boolean;
        text: string;
      };
    };
    scales: {
      x: {
        title: {
          display: boolean;
          text: string;
        };
        type: 'category';
        ticks: {
          autoSkip?: boolean;
          maxRotation?: number;
          minRotation?: number;
        };
      };
      y: {
        title: {
          display: boolean;
          text: string;
        };
        ticks: {
          beginAtZero: boolean;
          callback?: (value: number) => string;
        };
      };
    };
  };
}

const TransactionAnalysisChart: React.FC<ChartProps> = ({ type, data, options }) => {
  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default TransactionAnalysisChart;

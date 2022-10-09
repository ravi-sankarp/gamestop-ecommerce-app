import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart({ graphData }) {
  const data = {
    labels: graphData.map((item) => item._id),
    datasets: [
      {
        label: 'Payment Method',
        data: graphData.map((item) => item.orders),
        backgroundColor: ['rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
        hoverOffset: 4,
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1
      }
    ]
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        padding: 10,
        labels: {
          margin: 50,
          padding: 16
        }
      },
      datalabels: {
        display: true,
        color: 'white'
      }
    }
  };
  return (
    <Doughnut
      data={data}
      height="100"
      options={options}
    />
  );
}

export default DoughnutChart;

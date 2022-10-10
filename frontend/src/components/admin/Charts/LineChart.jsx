import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function LineChart({ graphData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: false
      }
    }
  };

  const labels = new Array(7).fill(9).map((ele, i) => new Date(new Date().getTime() + (i + 1) * 1000 * 24 * 3600).toLocaleDateString('en-us', {
      weekday: 'long'
    }));

  const data = {
    labels,
    datasets: [
      {
        label: 'Orders',
        data: labels.map((item, i) => {
          const found = graphData.find(
            (date) => new Date(date._id).toLocaleDateString('en-us', { weekday: 'long' }) === labels[i]
          );
          if (found) {
            return found.orders;
          }
          return 0;
        }),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  };
  return (
    <Line
      options={options}
      data={data}
    />
  );
}

export default LineChart;

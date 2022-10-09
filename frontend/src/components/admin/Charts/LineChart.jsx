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

  const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Orders',
        data: labels.map((item, i) => {
          const found = graphData.find(
            (date) => new Date(date._id).toLocaleDateString('en-us', { weekday: 'long' }) === labels[i]
          );
          console.log(found);
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

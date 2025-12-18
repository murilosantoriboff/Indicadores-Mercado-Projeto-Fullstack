import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './GraficoComparacao.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function GraficoComparacao({ dadosComparacao }) {
  if (!dadosComparacao || dadosComparacao.length === 0) {
    return null;
  }

  const cores = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 206, 86)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
    'rgb(255, 159, 64)',
  ];
  const datasets = dadosComparacao.map((item, index) => {
    const valoresOrdenados = [...item.valores].reverse();
    
    return {
      label: `${item.indicador.nome} (${item.indicador.unidade})`,
      data: valoresOrdenados.map(v => parseFloat(v.valor)),
      borderColor: cores[index % cores.length],
      backgroundColor: cores[index % cores.length].replace(')', ', 0.5)').replace('rgb', 'rgba'),
      tension: 0.3,
    };
  });

  const labels = dadosComparacao[0]?.valores
    ? [...dadosComparacao[0].valores].reverse().map(v => 
        new Date(v.data_coleta).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        })
      )
    : [];

  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolução dos Indicadores',
        font: {
          size: 18,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return value.toFixed(2);
          },
        },
      },
    },
  };

  return (
    <div className="grafico-container">
      <div className="grafico-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default GraficoComparacao;

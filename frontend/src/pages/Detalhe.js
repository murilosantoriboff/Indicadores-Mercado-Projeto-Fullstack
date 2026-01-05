import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIndicador, getValoresIndicador } from '../services/api';
import { Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx'
import './Detalhe.css';

function Detalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [indicador, setIndicador] = useState(null);
  const [valores, setValores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarDetalhes();
  }, [id]);

  const carregarDetalhes = async () => {
    try {
      setLoading(true);
      
      // Buscar indicador
      const respIndicador = await getIndicador(id);
      setIndicador(respIndicador.data);
      
      // Buscar valores
      const respValores = await getValoresIndicador(id);
      setValores(respValores.data.results || respValores.data);
      
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      setErro('Erro ao carregar detalhes do indicador');
    } finally {
      setLoading(false);
    }
  };

  const exportarValoresCSV = () => {
    const dados = valores.map(v => ({
      'Data': new Date(v.data_coleta).toLocaleDateString('pt-BR'),
      'Valor': `${indicador.unidade} ${parseFloat(v.valor).toFixed(4)}`,
      'Fonte': v.fonte
    }));

    const headers = Object.keys(dados[0]);
    const csvContent = [
      headers.join(','),
      ...dados.map(row => headers.map(h => row[h]).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${indicador.nome.replace(/\s+/g, '-')}-valores.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarValoresExcel = () => {
    const dados = valores.map(v => ({
      'Data': new Date(v.data_coleta).toLocaleDateString('pt-BR'),
      'Valor': parseFloat(v.valor).toFixed(4),
      'Unidade': indicador.unidade,
      'Fonte': v.fonte
    }));

    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Valores');
    
    XLSX.writeFile(wb, `${indicador.nome.replace(/\s+/g, '-')}-valores.xlsx`);
  };


  const calcularEstatisticas = () => {
    if (valores.length === 0) return null;

    const nums = valores.map(v => parseFloat(v.valor));
    const maximo = Math.max(...nums);
    const minimo = Math.min(...nums);
    const soma = nums.reduce((acc, val) => acc + val, 0);
    const media = soma / nums.length;

    return { maximo, minimo, media };
  };

  const prepararDadosGrafico = () => {
    const valoresOrdenados = [...valores].sort((a, b) => 
      new Date(a.data_coleta) - new Date(b.data_coleta)
    );

    return {
      labels: valoresOrdenados.map(v => 
        new Date(v.data_coleta).toLocaleDateString('pt-BR')
      ),
      datasets: [{
        label: indicador?.nome || 'Valor',
        data: valoresOrdenados.map(v => parseFloat(v.valor)),
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        tension: 0.4,
        fill: true,
      }]
    };
  };

  const opcoes = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
      }
    }
  };

  if (loading) {
    return (
      <div className="detalhes-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="detalhes-container">
        <div className="erro">{erro}</div>
        <button className="btn-voltar" onClick={() => navigate('/')}>
          ← Voltar
        </button>
      </div>
    );
  }

  if (!indicador) {
    return (
      <div className="detalhes-container">
        <p>Indicador não encontrado</p>
        <button className="btn-voltar" onClick={() => navigate('/')}>
          ← Voltar
        </button>
      </div>
    );
  }

  const stats = calcularEstatisticas();

  return (
    <div className="detalhes-container">
      <button className="btn-voltar" onClick={() => navigate('/')}>
        ← Voltar
      </button>

      <div className="detalhes-header">
        <div className="header-info">
          <h1>{indicador.nome}</h1>
          <span className="badge-tipo">{indicador.tipo}</span>
        </div>
        <p className="descricao">{indicador.descricao || 'Sem descrição'}</p>
      </div>

      {stats && (
        <div className="estatisticas-grid">
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Máximo</span>
              <span className="stat-valor">
                {indicador.unidade} {stats.maximo.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                })}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Mínimo</span>
              <span className="stat-valor">
                {indicador.unidade} {stats.minimo.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                })}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Média</span>
              <span className="stat-valor">
                {indicador.unidade} {stats.media.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                })}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Total de Registros</span>
              <span className="stat-valor">{valores.length}</span>
            </div>
          </div>
        </div>
      )}

      {valores.length > 0 && (
        <div className="grafico-section">
          <h2>Histórico</h2>
          <div className="grafico-wrapper">
            <Line data={prepararDadosGrafico()} options={opcoes} />
          </div>
        </div>
      )}

      <div className="tabela-section">
        <div className="tabela-header">
          <h2>Valores Históricos</h2>
          
          {valores.length > 0 && (
            <div className="botoes-exportar-valores">
              <button className="btn-export-small csv" onClick={exportarValoresCSV}>
                CSV
              </button>
              <button className="btn-export-small excel" onClick={exportarValoresExcel}>
                Excel
              </button>
            </div>
          )}
        </div>
        <h2>Valores Históricos</h2>
        
        {valores.length > 0 ? (
          <div className="tabela-wrapper">
            <table className="tabela-valores">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Valor</th>
                  <th>Fonte</th>
                </tr>
              </thead>
              <tbody>
                {valores
                  .sort((a, b) => new Date(b.data_coleta) - new Date(a.data_coleta))
                  .map((valor) => (
                    <tr key={valor.id}>
                      <td>{new Date(valor.data_coleta).toLocaleDateString('pt-BR')}</td>
                      <td>
                        {indicador.unidade} {parseFloat(valor.valor).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 4
                        })}
                      </td>
                      <td>
                        <span className={`badge-fonte ${valor.fonte}`}>
                          {valor.fonte}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="sem-dados">Nenhum valor registrado ainda</p>
        )}
      </div>
    </div>
  );
}

export default Detalhes;

import React, { useState, useEffect } from 'react';
import { getDashboard } from '../services/api';
import IndicadorCard from '../components/IndicadorCard';
import './Home.css';

function Home() {
  const [indicadores, setIndicadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      setLoading(true);
      const response = await getDashboard();
      setIndicadores(response.data);
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setErro('Erro ao carregar os indicadores. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando indicadores...</div>;
  }

  if (erro) {
    return <div className="erro">{erro}</div>;
  }

  return (
    <div className="home-container">
      <h1>Dashboard de Indicadores Econômicos</h1>
      
      <div className="indicadores-grid">
        {indicadores.length > 0 ? (
          indicadores.map((indicador) => (
            <IndicadorCard key={indicador.id} indicador={indicador} />
          ))
        ) : (
          <p>Nenhum indicador cadastrado.</p>
        )}
      </div>
      
      <button onClick={carregarDashboard} className="btn-atualizar">
        Atualizar Dados
      </button>
    </div>
  );
}

export default Home;

import React, { useState, useEffect} from 'react';
import { getDashboard } from '../services/api';
import IndicadorCard from '../components/IndicadorCard';
import './Home.css';

function Home() {
  const [indicadores, setIndicadores] = useState([]);
  const [indicadoresFiltrados, setIndicadoresFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');   
  

  useEffect(() => {
    carregarDashboard();
  }, []);

  useEffect(() => {
    filtrarIndicadores();
  }, [busca, filtroTipo, indicadores]);

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

  const filtrarIndicadores = () => {
    let resultado = [...indicadores];

    if (busca.trim() !== '') {
      resultado = resultado.filter(ind =>
        ind.nome.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (filtroTipo !== 'todos') {
      resultado = resultado.filter(ind => ind.tipo === filtroTipo);
    }

    setIndicadoresFiltrados(resultado);
  };

  const getTiposUnicos = () => {
    const tipos = [...new Set(indicadores.map(ind => ind.tipo))];
    return tipos.sort();
  };

  const limparFiltros = () => {
    setBusca('');
    setFiltroTipo('todos');
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando indicadores...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="home-container">
        <div className="erro">{erro}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1>Dashboard de Indicadores Econômicos</h1>
      
      <div className="filtros-container">
        <div className="busca-wrapper">
          <input
            type="text"
            className="input-busca"
            placeholder="Buscar indicador..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {busca && (
            <button className="btn-limpar-busca" onClick={() => setBusca('')}>
              ✕
            </button>
          )}
        </div>

        <div className="filtro-tipo-wrapper">
          <select
            className="select-tipo"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos os tipos</option>
            {getTiposUnicos().map(tipo => (
              <option key={tipo} value={tipo}>
                {tipo === 'moeda' && 'Moedas'}
                {tipo === 'indice' && 'Índices'}
                {tipo === 'outro' && 'Outros'}
                {!['moeda', 'indice', 'outro'].includes(tipo) && `${tipo}`}
              </option>
            ))}
          </select>
        </div>

        {(busca || filtroTipo !== 'todos') && (
          <button className="btn-limpar-filtros" onClick={limparFiltros}>
            Limpar Filtros
          </button>
        )}
      </div>

      <div className="resultado-info">
        {busca || filtroTipo !== 'todos' ? (
          <p>
            Mostrando <strong>{indicadoresFiltrados.length}</strong> de <strong>{indicadores.length}</strong> indicadores
          </p>
        ) : (
          <p>
            Total de <strong>{indicadores.length}</strong> indicadores
          </p>
        )}
      </div>

      <div className="indicadores-grid">
        {indicadoresFiltrados.length > 0 ? (
          indicadoresFiltrados.map((indicador) => (
            <IndicadorCard key={indicador.id} indicador={indicador} />
          ))
        ) : (
          <div className="sem-resultados">
            <p>Nenhum indicador encontrado</p>
            {(busca || filtroTipo !== 'todos') && (
              <button className="btn-limpar-filtros" onClick={limparFiltros}>
                Limpar Filtros
              </button>
            )}
          </div>
        )}
      </div>
      
      <button onClick={carregarDashboard} className="btn-atualizar">
        Atualizar Dados
      </button>
    </div>
  );
}

export default Home;

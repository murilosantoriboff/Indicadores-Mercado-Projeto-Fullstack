import React, { useState, useEffect } from 'react'
import { getIndicadores, createIndicador, createValor } from '../services/api';
import './Cadastro.css';

function Cadastro() {
    const [indicadores, setIndicadores] = useState([]);
    const [activeTab, setActiveTab] = useState('indicador');
    const [mensagem, setMensagem] = useState({tipo: '', texto: ''});
    const [novoIndicador, setNovoIndicador] = useState({
        nome: '',
        tipo: 'Moeda',
        unidade: 'R$',
        descricao: '',
        fonte_api: '',
    });
    const [novoValor, setNovoValor] = useState({
        indicador: '',
        valor: '',
        fonte: 'manual',
    });

    useEffect(() => {
        carregarIndicadores();
    }, []);

    const carregarIndicadores = async () => {
        try {
        const response = await getIndicadores();
        setIndicadores(response.data.results || response.data);
        } catch (error) {
        console.error('Erro ao carregar indicadores:', error);
        }
    };

    const handleIndicadorChange = (e) => {
        setNovoIndicador({
        ...novoIndicador,
        [e.target.name]: e.target.value,
        });
    };

    const handleValorChange = (e) => {
        setNovoValor({
        ...novoValor,
        [e.target.name]: e.target.value,
        });
    };

    const submitIndicador = async (e) => {
    e.preventDefault();
    
    console.log('=== INICIANDO CADASTRO ===');
    console.log('Dados do formulário:', novoIndicador);
    
    try {
        console.log('Chamando API...');
        const response = await createIndicador(novoIndicador);
        console.log('Resposta sucesso:', response.data);
        
        setMensagem({ tipo: 'sucesso', texto: '✅ Indicador cadastrado com sucesso!' });
        
        // Limpar formulário
        setNovoIndicador({
        nome: '',
        tipo: 'Moeda',
        unidade: 'R$',
        descricao: '',
        fonte_api: '',
        });
        
        // Recarregar lista
        carregarIndicadores();
        
        // Limpar mensagem após 3 segundos
        setTimeout(() => setMensagem({ tipo: '', texto: '' }), 3000);
    } catch (error) {
        console.log('=== ERRO CAPTURADO ===');
        console.log('Erro completo:', error);
        console.log('Resposta do servidor:', error.response);
        console.log('Status:', error.response?.status);
        console.log('Dados do erro:', error.response?.data);
        console.log('Headers:', error.response?.headers);
        
        setMensagem({ 
        tipo: 'erro', 
        texto: `❌ Erro: ${JSON.stringify(error.response?.data)}` 
        });
    }
    };


    const submitValor = async (e) => {
        e.preventDefault();
    
        if (!novoValor.indicador) {
        setMensagem({ tipo: 'erro', texto: '❌ Selecione um indicador!' });
        return;
        }

        try {
        await createValor({
            indicador: parseInt(novoValor.indicador),
            valor: parseFloat(novoValor.valor),
            fonte: novoValor.fonte,
        });
        
        setMensagem({ tipo: 'sucesso', texto: '✅ Valor adicionado com sucesso!' });
        
        // Limpar formulário
        setNovoValor({
            indicador: '',
            valor: '',
            fonte: 'manual',
        });
        
        // Limpar mensagem após 3 segundos
        setTimeout(() => setMensagem({ tipo: '', texto: '' }), 3000);
        } catch (error) {
        console.error('Erro ao adicionar valor:', error);
        setMensagem({ tipo: 'erro', texto: '❌ Erro ao adicionar valor.' });
        }
    };

  return (
    <div className="cadastro-container">
      <h1>Cadastro de Indicadores e Valores</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'indicador' ? 'active' : ''}`}
          onClick={() => setActiveTab('indicador')}
        >
          Novo Indicador
        </button>
        <button
          className={`tab ${activeTab === 'valor' ? 'active' : ''}`}
          onClick={() => setActiveTab('valor')}
        >
          Adicionar Valor
        </button>
      </div>

      {/* Mensagem de feedback */}
      {mensagem.texto && (
        <div className={`mensagem ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      {/* Formulário de Indicador */}
      {activeTab === 'indicador' && (
        <div className="form-section">
          <h2>Cadastrar Novo Indicador</h2>
          <form onSubmit={submitIndicador} className="form-cadastro">
            <div className="form-group">
              <label htmlFor="nome">Nome do Indicador *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={novoIndicador.nome}
                onChange={handleIndicadorChange}
                placeholder="Ex: Bitcoin, Inflação, IPCA..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipo">Tipo *</label>
              <select
                id="tipo"
                name="tipo"
                value={novoIndicador.tipo}
                onChange={handleIndicadorChange}
                required
              >
                <option value="Moeda">Moeda</option>
                <option value="Indice">Índice</option>
                <option value="Produto">Produto</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="unidade">Unidade *</label>
              <input
                type="text"
                id="unidade"
                name="unidade"
                value={novoIndicador.unidade}
                onChange={handleIndicadorChange}
                placeholder="Ex: R$, %, USD..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={novoIndicador.descricao}
                onChange={handleIndicadorChange}
                placeholder="Descrição opcional do indicador..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fonte_api">Fonte API (opcional)</label>
              <input
                type="text"
                id="fonte_api"
                name="fonte_api"
                value={novoIndicador.fonte_api}
                onChange={handleIndicadorChange}
                placeholder="URL da API de coleta automática..."
              />
            </div>

            <button type="submit" className="btn-submit">
                Cadastrar Indicador
            </button>
          </form>
        </div>
      )}

      {/* Formulário de Valor */}
      {activeTab === 'valor' && (
        <div className="form-section">
          <h2>Adicionar Valor a um Indicador</h2>
          <form onSubmit={submitValor} className="form-cadastro">
            <div className="form-group">
              <label htmlFor="indicador">Selecione o Indicador *</label>
              <select
                id="indicador"
                name="indicador"
                value={novoValor.indicador}
                onChange={handleValorChange}
                required
              >
                <option value="">-- Selecione --</option>
                {indicadores.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.nome} ({ind.tipo})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="valor">Valor *</label>
              <input
                type="number"
                id="valor"
                name="valor"
                value={novoValor.valor}
                onChange={handleValorChange}
                placeholder="Ex: 5.85"
                step="0.0001"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fonte">Fonte do Dado *</label>
              <select
                id="fonte"
                name="fonte"
                value={novoValor.fonte}
                onChange={handleValorChange}
                required
              >
                <option value="manual">Manual</option>
                <option value="api">API</option>
                <option value="scraping">Web Scraping</option>
              </select>
            </div>

            <button type="submit" className="btn-submit">
              Salvar Valor
            </button>
          </form>
        </div>
      )}
      {/* Lista de indicadores cadastrados */}
        <div className="lista-indicadores">
        <h2>Indicadores Cadastrados ({indicadores.length})</h2>
        
        {indicadores.length > 0 ? (
            <div className="tabela-indicadores">
            <table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Unidade</th>
                    <th>Criado em</th>
                </tr>
                </thead>
                <tbody>
                {indicadores.map((ind) => (
                    <tr key={ind.id}>
                    <td><strong>{ind.nome}</strong></td>
                    <td>
                        <span className="badge-tipo">{ind.tipo}</span>
                    </td>
                    <td>{ind.unidade}</td>
                    <td>
                        {new Date(ind.criado_em).toLocaleDateString('pt-BR')}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        ) : (
            <p className="sem-dados">Nenhum indicador cadastrado.</p>
        )}
        </div>
    </div>
  );
}

export default Cadastro;
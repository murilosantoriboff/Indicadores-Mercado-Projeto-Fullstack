import React, { useState, useEffect } from 'react';
import { getIndicadores, compararIndicadores } from '../services/api';
import './Comparacao.css';
import GraficoComparacao from '../components/GraficoComparacao';


function Comparacao(){
    const [indicadores, setIndicadores] = useState([]);
    const [selecionados, setSelecionados] = useState([]);
    const [resultadoComparacao, setResultadoComparacao] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    
    useEffect(() => {
        carregarIndicadores();
    }, []);

    const carregarIndicadores = async () => {
        try {
            const response = await getIndicadores();
            setIndicadores(response.data.results || response.data);
        } catch (erro) {
            console.log("Erro ao carregar os indicadores",erro);
            setErro("Erro ao carregar lista de indicadores");
        }
    };

    const handleCheckbox = async (id) => {
        if(selecionados.includes(id)) {
            setSelecionados(selecionados.filter(item => item !== id));
        } else {
            setSelecionados([...selecionados, id]);
        }
    };

    const compararSelecionados = async () => {
        if (selecionados.length < 2) {
            alert('Selecione pelo menos 2 indicadores para comparar!');
            return;
        }
        try {
            setLoading(true);
            setErro(null);
            const ids = selecionados.join(',');
            const response = await compararIndicadores(ids);
            setResultadoComparacao(response.data);
        } catch (error) {
            console.error('Erro ao comparar:', error);
            setErro('Erro ao comparar indicadores.');
        } finally {
            setLoading(false);
        }
    };


    const limparSelecao = async () => {
        setSelecionados([]);
        setResultadoComparacao([]);
    };


    return (
        <div className="comparacao-container">
            <h1>Comparar Indicadores</h1>

            <div className="selecao-section">
                <h2>Selecione os indicadores</h2>
                <div className="indicadores-checkboxes">
                {indicadores.map((ind) => (
                    <label key={ind.id} className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={selecionados.includes(ind.id)}
                        onChange={() => handleCheckbox(ind.id)}
                    />
                    <span>{ind.nome} ({ind.tipo})</span>
                    </label>
                ))}
                </div>

                <div className="botoes-acao">
                <button 
                    onClick={compararSelecionados} 
                    disabled={selecionados.length < 2}
                    className="btn-comparar"
                >
                    Comparar ({selecionados.length} selecionados)
                </button>
                <button onClick={limparSelecao} className="btn-limpar">
                    Limpar
                </button>
                </div>
            </div>

            {loading && <div className="loading">Carregando comparação...</div>}
            {erro && <div className="erro">{erro}</div>}

            {resultadoComparacao.length > 0 && (
                <div className="resultado-section">
                <h2>Resultados da Comparação</h2>

                <GraficoComparacao dadosComparacao={resultadoComparacao} />
                
                {resultadoComparacao.map((item) => (
                    <div key={item.indicador.id} className="indicador-resultado">
                    <h3>
                        {item.indicador.nome} ({item.indicador.tipo})
                    </h3>
                    
                    {item.valores.length > 0 ? (
                        <div className="tabela-container">
                        <table className="tabela-valores">
                            <thead>
                            <tr>
                                <th>Data</th>
                                <th>Valor</th>
                                <th>Variação</th>
                                <th>Fonte</th>
                            </tr>
                            </thead>
                            <tbody>
                            {item.valores.map((valor) => (
                                <tr key={valor.id}>
                                <td>
                                    {new Date(valor.data_coleta).toLocaleDateString('pt-BR')}
                                </td>
                                <td>
                                    {item.indicador.unidade} {parseFloat(valor.valor).toFixed(4)}
                                </td>
                                <td className={
                                    valor.variacao > 0 
                                    ? 'variacao-positiva' 
                                    : valor.variacao < 0 
                                    ? 'variacao-negativa' 
                                    : ''
                                }>
                                    {valor.variacao !== null 
                                    ? `${valor.variacao > 0 ? '+' : ''}${valor.variacao}%` 
                                    : '-'}
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
                        <p className="sem-dados">Nenhum valor registrado para este indicador.</p>
                    )}
                    </div>
                ))}
                </div>
            )}
        </div>
    );
}

export default Comparacao;
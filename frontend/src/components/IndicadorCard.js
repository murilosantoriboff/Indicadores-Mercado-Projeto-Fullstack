import React from 'react';
import './IndicadorCard.css';

function IndicadorCard({ indicador }) {
  const { nome, tipo, unidade, ultimo_valor, variacao_percentual, data_coleta } = indicador;

  const dataFormatada = data_coleta 
    ? new Date(data_coleta).toLocaleDateString('pt-BR')
    : 'Sem dados';

  const variacaoClass = variacao_percentual > 0 
    ? 'positiva' 
    : variacao_percentual < 0 
    ? 'negativa' 
    : 'neutra';

  return (
        <div className="indicador-card">
            <div className="card-header">
                <h3>{nome}</h3>
                <span className="badge">{tipo}</span>
            </div>
        
            <div className="card-body">
                {ultimo_valor !== null ? (
                <>
                    <div className="valor-principal">
                    <span className="unidade">{unidade}</span>
                    <span className="valor">{ultimo_valor.toFixed(4)}</span>
                    </div>
                    
                    {variacao_percentual !== null && (
                    <div className={`variacao ${variacaoClass}`}>
                        {variacao_percentual > 0 ? '↑' : '↓'} {Math.abs(variacao_percentual).toFixed(2)}%
                    </div>
                    )}
                    
                    <div className="data-coleta">
                    Última atualização: {dataFormatada}
                    </div>
                </>
                ) : (
                <div className="sem-dados">
                    Nenhum valor registrado
                </div>
                )}
            </div>
        </div>
    );
}

export default IndicadorCard;

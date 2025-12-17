import React from 'react';
import './IndicadorCard.css';

function IndicadorCard({ indicador }) {
  const { nome, tipo, unidade, ultimo_valor, variacao_percentual, data_coleta } = indicador;

  // Formata a data
  const dataFormatada = data_coleta 
    ? new Date(data_coleta).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Sem dados';

  // Formata o valor com separadores de milhar
  const valorFormatado = ultimo_valor !== null 
    ? new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(ultimo_valor)
    : null;

  // Define cor da variação
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
              <span className="valor">{valorFormatado}</span>
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

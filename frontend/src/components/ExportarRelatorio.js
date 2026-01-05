import React from 'react';
import * as XLSX from 'xlsx';
import './ExportarRelatorio.css';

function ExportarRelatorio({ indicadores, nomeArquivo = 'relatorio-indicadores' }) {
  
  // Função para preparar dados para exportação
  const prepararDados = () => {
    return indicadores.map(ind => ({
      'Nome': ind.nome,
      'Tipo': ind.tipo,
      'Último Valor': ind.ultimo_valor 
        ? parseFloat(ind.ultimo_valor).toFixed(4)
        : 'Sem dados',
      'Unidade': ind.unidade,
      'Fonte': ind.fonte_api ? 'API' : 'Manual',
      'Última Atualização': ind.data_ultima_atualizacao 
        ? new Date(ind.data_ultima_atualizacao).toLocaleDateString('pt-BR')
        : 'N/A',
      'Descrição': ind.descricao || '-'
    }));
  };

  // Exportar como CSV
  const exportarCSV = () => {
    const dados = prepararDados();
    
    // Criar cabeçalhos
    const headers = Object.keys(dados[0]);
    
    // Criar linhas CSV
    const csvContent = [
      headers.join(','), // Cabeçalho
      ...dados.map(row => 
        headers.map(header => {
          const valor = row[header].toString();
          // Escapar vírgulas e aspas
          return valor.includes(',') ? `"${valor}"` : valor;
        }).join(',')
      )
    ].join('\n');
    
    // Criar Blob e download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${nomeArquivo}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('CSV exportado com sucesso!');
  };

  // Exportar como Excel
  const exportarExcel = () => {
    const dados = prepararDados();
    
    // Criar worksheet
    const ws = XLSX.utils.json_to_sheet(dados);
    
    // Ajustar largura das colunas
    const wscols = [
      { wch: 25 }, // Nome
      { wch: 12 }, // Tipo
      { wch: 15 }, // Último Valor
      { wch: 10 }, // Unidade
      { wch: 10 }, // Fonte
      { wch: 18 }, // Última Atualização
      { wch: 40 }, // Descrição
    ];
    ws['!cols'] = wscols;
    
    // Criar workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Indicadores');
    
    // Adicionar informações adicionais
    const infoWs = XLSX.utils.aoa_to_sheet([
      ['Relatório de Indicadores Econômicos'],
      [''],
      [`Data de Geração: ${new Date().toLocaleString('pt-BR')}`],
      [`Total de Indicadores: ${indicadores.length}`],
      [''],
      ['Gerado por: Sistema de Indicadores de Mercado']
    ]);
    XLSX.utils.book_append_sheet(wb, infoWs, 'Informações');
    
    XLSX.writeFile(wb, `${nomeArquivo}.xlsx`);
    
    console.log('Excel exportado com sucesso!');
  };

  const exportarJSON = () => {
    const dados = prepararDados();
    const json = JSON.stringify(dados, null, 2);
    
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${nomeArquivo}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('JSON exportado com sucesso!');
  };

  if (!indicadores || indicadores.length === 0) {
    return (
      <div className="exportar-container">
        <p className="aviso-exportar">Nenhum dado disponível para exportar</p>
      </div>
    );
  }

  return (
    <div className="exportar-container">
      <div className="exportar-header">
        <span className="exportar-titulo">Exportar Relatório</span>
        <span className="exportar-count">({indicadores.length} registros)</span>
      </div>
      
      <div className="exportar-botoes">
        <button className="btn-exportar csv" onClick={exportarCSV}>
          CSV
        </button>
        
        <button className="btn-exportar excel" onClick={exportarExcel}>
          Excel
        </button>
        
        <button className="btn-exportar json" onClick={exportarJSON}>
          JSON
        </button>
      </div>
    </div>
  );
}

export default ExportarRelatorio;

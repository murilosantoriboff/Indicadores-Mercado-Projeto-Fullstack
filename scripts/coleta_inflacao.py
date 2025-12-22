"""
Script para coletar dados de inflação via web scraping
Fonte: Portal do IBGE
"""

import requests
from datetime import datetime


class ColetorInflacao:
    """
    Coleta dados de inflação do portal do IBGE
    """
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    def get_ipca_mensal(self):
        """
        Busca o IPCA do mês mais recente
        
        Returns:
            dict com dados do IPCA ou None se erro
        """
        # API pública do IBGE para IPCA
        url = "https://servicodados.ibge.gov.br/api/v3/agregados/1737/periodos/-1/variaveis/63?localidades=N1[all]"
        
        try:
            print("Buscando IPCA mensal...")
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            dados = response.json()
            
            if dados and len(dados) > 0:
                serie = dados[0]['resultados'][0]['series'][0]
                periodo = list(serie['serie'].keys())[0]
                valor = float(serie['serie'][periodo])
                
                # Formatar período (ex: 202312 -> Dezembro/2023)
                ano = periodo[:4]
                mes = periodo[4:]
                
                resultado = {
                    'indicador': 'IPCA',
                    'descricao': 'Índice Nacional de Preços ao Consumidor Amplo',
                    'valor': valor,
                    'periodo': f"{mes}/{ano}",
                    'tipo': 'indice',
                    'unidade': '%',
                    'fonte': 'scraping',
                    'data': datetime.now().isoformat()
                }
                
                print(f"IPCA {mes}/{ano}: {valor}%")
                return resultado
            else:
                print("Nenhum dado encontrado")
                return None
                
        except Exception as e:
            print(f"Erro ao buscar IPCA: {e}")
            return None
    
    def get_ipca_acumulado_ano(self):
        """
        Busca o IPCA acumulado no ano
        
        Returns:
            dict com dados do IPCA acumulado ou None se erro
        """
        url = "https://servicodados.ibge.gov.br/api/v3/agregados/1737/periodos/-12/variaveis/2265?localidades=N1[all]"
        
        try:
            print("Buscando IPCA acumulado...")
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            dados = response.json()
            
            if dados and len(dados) > 0:
                serie = dados[0]['resultados'][0]['series'][0]
                # Pegar último período
                periodos = list(serie['serie'].keys())
                ultimo_periodo = periodos[-1]
                valor = float(serie['serie'][ultimo_periodo])
                
                ano = ultimo_periodo[:4]
                
                resultado = {
                    'indicador': 'IPCA Acumulado',
                    'descricao': 'IPCA Acumulado nos últimos 12 meses',
                    'valor': valor,
                    'periodo': f"12 meses até {ano}",
                    'tipo': 'indice',
                    'unidade': '%',
                    'fonte': 'scraping',
                    'data': datetime.now().isoformat()
                }
                
                print(f"IPCA Acumulado 12 meses: {valor}%")
                return resultado
            else:
                print("Nenhum dado encontrado")
                return None
                
        except Exception as e:
            print(f"Erro ao buscar IPCA acumulado: {e}")
            return None
    
    def get_todos_indicadores(self):
        """
        Busca todos os indicadores de inflação
        
        Returns:
            list com todos os indicadores
        """
        indicadores = []
        
        ipca = self.get_ipca_mensal()
        if ipca:
            indicadores.append(ipca)
        
        ipca_acum = self.get_ipca_acumulado_ano()
        if ipca_acum:
            indicadores.append(ipca_acum)
        
        return indicadores


def testar_coleta():
    """
    Função para testar a coleta de dados
    """
    print("=" * 50)
    print("TESTE DE COLETA - INFLAÇÃO (IBGE)")
    print("=" * 50)
    
    coletor = ColetorInflacao()
    indicadores = coletor.get_todos_indicadores()
    
    print("\n" + "=" * 50)
    print(f"Total de indicadores coletados: {len(indicadores)}")
    print("=" * 50)
    
    for ind in indicadores:
        print(f"\n{ind['indicador']}")
        print(f"  Descrição: {ind['descricao']}")
        print(f"  Valor: {ind['valor']}%")
        print(f"  Período: {ind['periodo']}")
    
    return indicadores


if __name__ == "__main__":
    testar_coleta()

import requests
from datetime import timedelta, datetime
import json

# https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/documentacao

class ColetorBacen:
    def __init__(self):
        self.base_url = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata"
    
    def get_cotacao_dolar(self, data=None):
        """
        Busca cotação do dólar (USD) para uma data específica
        Args:
            data: Data no formato 'MM-DD-YYYY'. Se None, usa data atual
        Returns:
            dict com informações da cotação ou None se erro
        """
        if data is None:
            data = datetime.now().strftime('%m-%d-%Y')
        
        
        url = f"{self.base_url}/CotacaoDolarDia(dataCotacao=@dataCotacao)"
        params = {
            "@dataCotacao": f"'{data}'",
            "$format": "json"
        }
        
        try:
            print(f"🔍 Buscando cotação do dólar para {data}...")
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            dados = response.json()
            if dados.get('value') and len(dados['value']) > 0:
                cotacao = dados['value'][0]
                resultado = {
                    'moeda': 'Dólar',
                    'simbolo': 'USD',
                    'valor_compra': cotacao.get('cotacaoCompra'),
                    'valor_venda': cotacao.get('cotacaoVenda'),
                    'data': cotacao.get('dataHoraCotacao'),
                    'tipo': 'moeda',
                    'unidade': 'R$',
                    'fonte': 'api'
                }
                print(f"Dólar: R$ {resultado['valor_venda']:.4f}")
                return resultado
            else:
                print("Nenhum dado encontrado para esta data")
                return None
                
        except requests.exceptions.RequestException as e:
            print(f"Erro ao buscar cotação do dólar: {e}")
            return None
        
    def get_cotacao_euro(self, data=None):
        """
        Busca cotação do euro (EUR) para uma data específica
        
        Args:
            data: Data no formato 'MM-DD-YYYY'. Se None, usa data atual
            
        Returns:
            dict com informações da cotação ou None se erro
        """
        if data is None:
            data = datetime.now().strftime('%m-%d-%Y')
        
        # A API do Bacen usa código 'EUR' para Euro
        url = f"{self.base_url}/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)"
        params = {
            "@moeda": "'EUR'",
            "@dataCotacao": f"'{data}'",
            "$format": "json"
        }
        
        try:
            print(f"Buscando cotação do euro para {data}...")
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            dados = response.json()
            
            if dados.get('value') and len(dados['value']) > 0:
                cotacao = dados['value'][0]
                resultado = {
                    'moeda': 'Euro',
                    'simbolo': 'EUR',
                    'valor_compra': cotacao.get('cotacaoCompra'),
                    'valor_venda': cotacao.get('cotacaoVenda'),
                    'data': cotacao.get('dataHoraCotacao'),
                    'tipo': 'moeda',
                    'unidade': 'R$',
                    'fonte': 'api'
                }
                print(f"Euro: R$ {resultado['valor_venda']:.4f}")
                return resultado
            else:
                print("Nenhum dado encontrado para esta data")
                return None
                
        except requests.exceptions.RequestException as e:
            print(f"Erro ao buscar cotação do euro: {e}")
            return None
    
    def get_todas_cotacoes(self):
        """
        Busca todas as cotações disponíveis
        
        Returns:
            list com todas as cotações
        """
        cotacoes = []
        
        # Tentar data atual
        dolar = self.get_cotacao_dolar()
        if dolar:
            cotacoes.append(dolar)
        
        euro = self.get_cotacao_euro()
        if euro:
            cotacoes.append(euro)
        
        # Se não encontrou dados para hoje, tenta ontem
        if not cotacoes:
            print("Sem dados para hoje, tentando dia útil anterior...")
            ontem = (datetime.now() - timedelta(days=1)).strftime('%m-%d-%Y')
            
            dolar = self.get_cotacao_dolar(ontem)
            if dolar:
                cotacoes.append(dolar)
            
            euro = self.get_cotacao_euro(ontem)
            if euro:
                cotacoes.append(euro)
        
        return cotacoes


def testar_coleta():
    """
    Função para testar a coleta de dados
    """
    print("=" * 50)
    print("TESTE DE COLETA - API BANCO CENTRAL")
    print("=" * 50)
    
    coletor = ColetorBacen()
    cotacoes = coletor.get_todas_cotacoes()
    
    print("\n" + "=" * 50)
    print(f"Total de cotações coletadas: {len(cotacoes)}")
    print("=" * 50)
    
    for cotacao in cotacoes:
        print(f"\n{cotacao['moeda']} ({cotacao['simbolo']})")
        print(f"  Compra: R$ {cotacao['valor_compra']:.4f}")
        print(f"  Venda: R$ {cotacao['valor_venda']:.4f}")
        print(f"  Data: {cotacao['data']}")
    
    return cotacoes


if __name__ == "__main__":
    testar_coleta()
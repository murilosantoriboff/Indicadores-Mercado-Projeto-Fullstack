import requests
from datetime import datetime, timedelta


class ColetorMoedasMultiplas:

    
    def __init__(self):
        self.base_url = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata"

        self.moedas = {
            'USD': {
                'nome': 'Dólar Americano',
                'simbolo': 'US$',
                'pais': '🇺🇸'
            },
            'EUR': {
                'nome': 'Euro',
                'simbolo': '€',
                'pais': '🇪🇺'
            },
            'GBP': {
                'nome': 'Libra Esterlina',
                'simbolo': '£',
                'pais': '🇬🇧'
            },
            'JPY': {
                'nome': 'Iene Japonês',
                'simbolo': '¥',
                'pais': '🇯🇵'
            },
            'CHF': {
                'nome': 'Franco Suíço',
                'simbolo': 'CHF',
                'pais': '🇨🇭'
            },
            'CAD': {
                'nome': 'Dólar Canadense',
                'simbolo': 'C$',
                'pais': '🇨🇦'
            },
            'AUD': {
                'nome': 'Dólar Australiano',
                'simbolo': 'A$',
                'pais': '🇦🇺'
            },
            'ARS': {
                'nome': 'Peso Argentino',
                'simbolo': 'ARS$',
                'pais': '🇦🇷'
            },
            'CLP': {
                'nome': 'Peso Chileno',
                'simbolo': 'CLP$',
                'pais': '🇨🇱'
            },
            'CNY': {
                'nome': 'Yuan Chinês',
                'simbolo': '¥',
                'pais': '🇨🇳'
            },
        }
    
    def get_cotacao_moeda(self, codigo_moeda, data=None):
        if data is None:
            data = datetime.now().strftime('%m-%d-%Y')
        
        # Montar URL da API
        url = f"{self.base_url}/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)"
        params = {
            "@moeda": f"'{codigo_moeda}'",
            "@dataCotacao": f"'{data}'",
            "$format": "json"
        }
        
        try:
            print(f"Buscando {codigo_moeda}...")
            
            # Fazer requisição HTTP
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            # Converter resposta JSON
            dados = response.json()
            
            # Verificar se tem dados
            if dados.get('value') and len(dados['value']) > 0:
                cotacao = dados['value'][0]
                info_moeda = self.moedas.get(codigo_moeda, {})
                
                resultado = {
                    'codigo': codigo_moeda,
                    'nome': info_moeda.get('nome', codigo_moeda),
                    'simbolo': info_moeda.get('simbolo', codigo_moeda),
                    'pais': info_moeda.get('pais', ''),
                    'valor_compra': cotacao.get('cotacaoCompra'),
                    'valor_venda': cotacao.get('cotacaoVenda'),
                    'data': cotacao.get('dataHoraCotacao'),
                    'tipo': 'moeda',
                    'unidade': 'R$',
                    'fonte': 'api'
                }
                
                print(f"{resultado['pais']} {resultado['nome']}: R$ {resultado['valor_venda']:.4f}")
                return resultado
            else:
                print(f"Sem dados para {codigo_moeda}")
                return None
                
        except requests.exceptions.RequestException as e:
            print(f"Erro ao buscar {codigo_moeda}: {e}")
            return None
    
    def get_todas_moedas(self, tentar_dia_anterior=True):
        """
        Busca cotações de TODAS as moedas configuradas
        
        Args:
            tentar_dia_anterior: Se True, tenta dia anterior se hoje não tiver dados
            
        Returns:
            list com todas as cotações encontradas
        """
        print("\n" + "=" * 60)
        print("COLETANDO MÚLTIPLAS MOEDAS")
        print("=" * 60)
        
        cotacoes = []
        data_atual = datetime.now().strftime('%m-%d-%Y')
        
        # Tentar buscar cada moeda
        for codigo in self.moedas.keys():
            cotacao = self.get_cotacao_moeda(codigo, data_atual)
            
            if cotacao:
                cotacoes.append(cotacao)
        
        # Se não encontrou nenhuma moeda, tenta dia anterior
        if not cotacoes and tentar_dia_anterior:
            print("\nNenhuma cotação encontrada para hoje.")
            print("   Tentando último dia útil...")
            
            # Tentar até 5 dias atrás
            for dias_atras in range(1, 6):
                data_anterior = (datetime.now() - timedelta(days=dias_atras)).strftime('%m-%d-%Y')
                print(f"\n   Tentando {data_anterior}...")
                
                for codigo in self.moedas.keys():
                    cotacao = self.get_cotacao_moeda(codigo, data_anterior)
                    if cotacao:
                        cotacoes.append(cotacao)
                
                # Se encontrou pelo menos uma, para de tentar
                if cotacoes:
                    break
        
        return cotacoes
    
    def exibir_resumo(self, cotacoes):
        """
        Exibe resumo bonito das cotações coletadas
        
        Args:
            cotacoes: Lista de cotações
        """
        print("\n" + "=" * 60)
        print(f"RESUMO: {len(cotacoes)} moedas coletadas")
        print("=" * 60)
        
        if not cotacoes:
            print("Nenhuma cotação foi coletada.")
            return
        
        # Ordenar por nome
        cotacoes_ordenadas = sorted(cotacoes, key=lambda x: x['nome'])
        
        print("\n{:<5} {:<25} {:<10} {:<15}".format(
            "País", "Moeda", "Código", "Valor (R$)"
        ))
        print("-" * 60)
        
        for cotacao in cotacoes_ordenadas:
            print("{:<5} {:<25} {:<10} R$ {:<15.4f}".format(
                cotacao['pais'],
                cotacao['nome'],
                cotacao['codigo'],
                cotacao['valor_venda']
            ))


def testar_coleta():
    print("TESTE: COLETA DE MÚLTIPLAS MOEDAS")

    coletor = ColetorMoedasMultiplas()
    cotacoes = coletor.get_todas_moedas()
    coletor.exibir_resumo(cotacoes)
    
    return cotacoes


if __name__ == "__main__":
    testar_coleta()

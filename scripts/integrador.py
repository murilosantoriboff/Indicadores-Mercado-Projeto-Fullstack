"""
Script integrador que conecta os coletores com o Django
Salva os dados coletados automaticamente no banco de dados
VERSÃO 2.0 - Com suporte a múltiplas moedas
"""

import os
import sys
import django
from datetime import datetime

# Adicionar o diretório do backend ao PATH
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')
sys.path.append(BACKEND_DIR)

# Configurar Django ANTES de importar models
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Carregar variáveis de ambiente do .env
from pathlib import Path
env_path = Path(BACKEND_DIR) / '.env'
if env_path.exists():
    from dotenv import load_dotenv
    load_dotenv(env_path)
    print(f"Arquivo .env carregado de: {env_path}")
else:
    print(f"Arquivo .env não encontrado em: {env_path}")

# Setup Django
django.setup()

# Importar models do Django
from indicadores.models import Indicador, ValorIndicador

# Importar coletores
from coleta_moedas_multiplas import ColetorMoedasMultiplas
from coleta_inflacao import ColetorInflacao


class IntegradorDjango:

    
    def __init__(self):
        self.coletor_moedas = ColetorMoedasMultiplas()
        self.coletor_inflacao = ColetorInflacao()
    
    def buscar_ou_criar_indicador(self, nome, tipo, unidade, descricao='', fonte_api=''):

        indicador, criado = Indicador.objects.get_or_create(
            nome=nome,
            defaults={
                'tipo': tipo,
                'unidade': unidade,
                'descricao': descricao,
                'fonte_api': fonte_api,
            }
        )
        
        if criado:
            print(f"Indicador '{nome}' criado no banco de dados")
        else:
            print(f"Indicador '{nome}' já existe no banco de dados")
        
        return indicador
    
    def salvar_valor(self, indicador, valor, fonte='api'):
        valor_obj = ValorIndicador.objects.create(
            indicador=indicador,
            valor=valor,
            fonte=fonte
        )
        
        print(f"Valor {valor} salvo para '{indicador.nome}'")
        return valor_obj
    
    def processar_moedas(self):

        print("\n" + "=" * 60)
        print("PROCESSANDO MÚLTIPLAS MOEDAS (BACEN)")
        print("=" * 60)
        
        # Coletar todas as moedas de uma vez
        cotacoes = self.coletor_moedas.get_todas_moedas()
        
        if not cotacoes:
            print("Nenhuma cotação obtida do Bacen")
            return 0
        
        salvos = 0
        
        for cotacao in cotacoes:
            try:
                print(f"\nProcessando {cotacao['pais']} {cotacao['nome']}...")
                
                # Buscar ou criar indicador
                indicador = self.buscar_ou_criar_indicador(
                    nome=cotacao['nome'],
                    tipo='moeda',
                    unidade='R$',
                    descricao=f"Cotação do {cotacao['nome']} ({cotacao['codigo']}) em relação ao Real",
                    fonte_api='https://olinda.bcb.gov.br/olinda/servico/PTAX/'
                )
                
                # Verificar se já existe valor para hoje
                hoje = datetime.now().date()
                valor_existe = ValorIndicador.objects.filter(
                    indicador=indicador,
                    data_coleta__date=hoje
                ).exists()
                
                if valor_existe:
                    print(f"Valor de hoje já existe, pulando...")
                    continue
                
                # Salvar valor (usar cotação de venda)
                self.salvar_valor(
                    indicador=indicador,
                    valor=cotacao['valor_venda'],
                    fonte='api'
                )
                
                salvos += 1
                
            except Exception as e:
                print(f"Erro ao processar {cotacao['nome']}: {e}")
        
        print(f"\n✅ {salvos} valores de moedas salvos com sucesso!")
        return salvos
    
    def processar_inflacao(self):
        """
        Processa e salva dados de inflação do IBGE
        """
        print("\n" + "=" * 60)
        print("PROCESSANDO INFLAÇÃO (IBGE)")
        print("=" * 60)
        
        indicadores_inflacao = self.coletor_inflacao.get_todos_indicadores()
        
        if not indicadores_inflacao:
            print("Nenhum indicador de inflação obtido")
            return 0
        
        salvos = 0
        
        for ind_data in indicadores_inflacao:
            try:
                print(f"\nProcessando {ind_data['indicador']}...")
                
                # Buscar ou criar indicador
                indicador = self.buscar_ou_criar_indicador(
                    nome=ind_data['indicador'],
                    tipo='indice',
                    unidade='%',
                    descricao=ind_data['descricao'],
                    fonte_api='https://servicodados.ibge.gov.br/'
                )
                
                # Verificar se já existe valor recente (mesmo mês)
                valor_existe = ValorIndicador.objects.filter(
                    indicador=indicador,
                    data_coleta__month=datetime.now().month,
                    data_coleta__year=datetime.now().year
                ).exists()
                
                if valor_existe:
                    print(f"Valor do mês atual já existe, pulando...")
                    continue
                
                # Salvar valor
                self.salvar_valor(
                    indicador=indicador,
                    valor=ind_data['valor'],
                    fonte='scraping'
                )
                
                salvos += 1
                
            except Exception as e:
                print(f"Erro ao processar {ind_data['indicador']}: {e}")
        
        print(f"\n✅ {salvos} valores de inflação salvos com sucesso!")
        return salvos
    
    def executar_coleta_completa(self):

        print("COLETA AUTOMÁTICA")
        print(f"Data/Hora: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
        
        total_salvos = 0
        
        # Processar moedas
        try:
            salvos = self.processar_moedas()
            total_salvos += salvos
        except Exception as e:
            print(f"Erro geral ao processar moedas: {e}")
        
        # Processar inflação
        try:
            salvos = self.processar_inflacao()
            total_salvos += salvos
        except Exception as e:
            print(f"Erro geral ao processar inflação: {e}")
        
        # Resumo final
        print("\n" + "=" * 60)
        print("RESUMO DA COLETA")
        print("=" * 60)
        print(f"Total de valores salvos: {total_salvos}")
        print(f"Data/Hora finalização: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
        print("=" * 60)
        
        return total_salvos


def main():
    """
    Função principal
    """
    integrador = IntegradorDjango()
    integrador.executar_coleta_completa()


if __name__ == "__main__":
    main()

from rest_framework import serializers
from .models import Indicador, ValorIndicador

class IndicadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicador
        fields = ['id','nome','tipo','unidade','descricao','fonte_api','criado_em','atualizado_em']
        read_only_fields = ['id','criado_em','atualizado_em']
    
class ValorIndicadorSerializer(serializers.ModelSerializer):
    indicador_nome = serializers.CharField(source='indicador.nome', read_only=True)
    variacao = serializers.SerializerMethodField()

    class Meta:
        model = ValorIndicador
        fields = ['id', 'indicador', 'indicador_nome', 'valor', 'data_coleta', 'fonte', 'variacao']
        read_only_fields = ['id', 'data_coleta']

    def get_variacao(self, obj):
        # Retorna a variacao percentual calculada
        return obj.variacao_percentual()
        
class ValorIndicadorCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValorIndicador
        fields = ['indicador', 'valor', 'fonte']
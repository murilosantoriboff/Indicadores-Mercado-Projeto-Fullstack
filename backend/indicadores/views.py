from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Indicador, ValorIndicador
from .serializers import IndicadorSerializer, ValorIndicadorCreateSerializer, ValorIndicadorSerializer

class IndicadorViewSet(viewsets.ModelViewSet):
    queryset = Indicador.objects.all()
    serializer_class = IndicadorSerializer
    
    @action(detail=True, methods=['get'])
    def valores(self, request, pk=None):
        indicador = self.get_object()
        valores = ValorIndicador.objects.filter(indicador=indicador)
        serializer = ValorIndicadorSerializer(valores, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        total_indicadores = Indicador.objects.count()
        total_valores = ValorIndicador.objects.count()
        indicador_por_tipo = Indicador.objects.values('tipo').annotate(total=Count('id'))
        return Response({
            'total_indicadores':total_indicadores,
            'total_valores':total_valores,
            'indicadores_por_tipo':list(indicador_por_tipo)
        })

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        indicadores = Indicador.objects.all()
        resultado = []
        
        for indicador in indicadores:
            ultimo_valor = ValorIndicador.objects.filter(
                indicador=indicador
            ).order_by('-data_coleta').first()
            
            if ultimo_valor:
                resultado.append({
                    'id': indicador.id,
                    'nome': indicador.nome,
                    'tipo': indicador.tipo,
                    'unidade': indicador.unidade,
                    'ultimo_valor': float(ultimo_valor.valor),
                    'data_coleta': ultimo_valor.data_coleta,
                    'variacao_percentual': ultimo_valor.variacao_percentual(),
                    'fonte': ultimo_valor.fonte,
                })
            else:
                resultado.append({
                    'id': indicador.id,
                    'nome': indicador.nome,
                    'tipo': indicador.tipo,
                    'unidade': indicador.unidade,
                    'ultimo_valor': None,
                    'data_coleta': None,
                    'variacao_percentual': None,
                    'fonte': None,
                })
        
        return Response(resultado)
    
    @action(detail=False, methods=['get'])
    def comparar(self, request):
        ids = request.query_params.get('ids', '')
        
        if not ids:
            return Response(
                {'erro': 'Parâmetro ids é obrigatório. Ex: ?ids=1,2'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            ids_lista = [int(id.strip()) for id in ids.split(',')]
        except ValueError:
            return Response(
                {'erro': 'IDs inválidos. Use números separados por vírgula.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Busca os indicadores
        indicadores = Indicador.objects.filter(id__in=ids_lista)
        
        if not indicadores.exists():
            return Response(
                {'erro': 'Nenhum indicador encontrado com esses IDs.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        resultado = []
        
        for indicador in indicadores:
            # Busca todos os valores desse indicador
            valores = ValorIndicador.objects.filter(
                indicador=indicador
            ).order_by('-data_coleta')[:10]  # Últimos 10 valores
            
            valores_serializados = ValorIndicadorSerializer(valores, many=True).data
            
            resultado.append({
                'indicador': IndicadorSerializer(indicador).data,
                'valores': valores_serializados,
            })
        
        return Response(resultado)

class ValorIndicadorViewSet(viewsets.ModelViewSet):
    queryset = ValorIndicador.objects.all()
    serializer_class = ValorIndicadorSerializer

    def get_serializer_class(self):
        if self.create == 'create':
            return ValorIndicadorCreateSerializer
        return ValorIndicadorSerializer
    
    def get_queryset(self):
        queryset = ValorIndicador.objects.all()
        indicador_id = self.request.query_params.get('indicador', None)

        if indicador_id is not None:
            queryset.filter(indicador_id=indicador_id)
        
        return queryset.order_by('-data_coleta')
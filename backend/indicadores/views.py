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
from django.contrib import admin
from .models import Indicador, ValorIndicador

@admin.register(Indicador)
class IndicadorAdmin(admin.ModelAdmin):
    list_display = ['nome', 'tipo', 'unidade', 'atualizado_em']
    search_fields = ['nome']
    list_filter = ['tipo', 'criado_em']

@admin.register(ValorIndicador)
class ValorIndicadorAdmin(admin.ModelAdmin):
    list_display = ['indicador', 'valor', 'data_coleta', 'fonte']
    search_fields = ['indicador__nome']
    list_filter = ['fonte', 'data_coleta']
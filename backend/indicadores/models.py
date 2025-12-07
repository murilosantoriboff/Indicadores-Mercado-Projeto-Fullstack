from django.db import models
from django.utils import timezone

class Indicador(models.Model):
    """Model para armazenar os indicadores economicos
       Ex: Dolar, Euro, Cesta Basica, IGPM, etc
    """
    # Tipos de indicadores
    TIPO_CHOICES = [
        ('moeda', 'Moeda (Dolar, Euro, etc)'),
        ('indice', 'Indice (IGPM, INPC, etc)'),
        ('produto', 'Produto (Cesta Basica, etc)'),
        ('outro', 'Outro'),
    ]
    nome = models.CharField(max_length=100, unique=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    unidade = models.CharField(max_length=20)
    descricao = models.TextField(blank=True)
    fonte_api = models.CharField(max_length=200, blank=True)

    #timestamps

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-atualizado_em']
        verbose_name_plural = "Indicadores"

    def __str__(self):
        return f"{self.nome} ({self.tipo})"
    
class ValorIndicador(models.Model):
    """
    Armazena cada coleta de valor de um indicador
    Ex: Dólar custava R$ 5.00 em 2025-12-06
    """
    indicador = models.ForeignKey(Indicador, on_delete=models.CASCADE, related_name='valores')
    valor = models.DecimalField(max_digits=10, decimal_places=4)  # Ex: 5.2500
    data_coleta = models.DateTimeField(auto_now_add=True)  # Quando foi coletado
    
    # Campo para armazenar de onde veio
    fonte = models.CharField(max_length=100, choices=[
        ('api', 'API automática'),
        ('manual', 'Cadastro manual'),
        ('scraping', 'Web scraping'),
    ])
    
    class Meta:
        ordering = ['-data_coleta']
        verbose_name_plural = "Valores de Indicadores"
    
    def __str__(self):
        return f"{self.indicador.nome}: R$ {self.valor} ({self.data_coleta.strftime('%d/%m/%Y')})"
    
    def variacao_percentual(self):
        """
        Calcula a variação percentual em relação ao valor anterior
        """
        valor_anterior = ValorIndicador.objects.filter(
            indicador=self.indicador,
            data_coleta__lt=self.data_coleta
        ).order_by('-data_coleta').first()
        
        if not valor_anterior:
            return None
        
        variacao = ((self.valor - valor_anterior.valor) / valor_anterior.valor) * 100
        return round(variacao, 2)

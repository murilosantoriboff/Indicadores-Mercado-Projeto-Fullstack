from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ValorIndicadorViewSet, IndicadorViewSet

router = DefaultRouter()
router.register(r'indicadores', IndicadorViewSet, basename='indicador')
router.register(r'valores', ValorIndicadorViewSet, basename='valor')

urlpatterns = [
    path('', include(router.urls)),
]
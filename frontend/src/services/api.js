import axios from 'axios'

const URL_API = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: URL_API,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getIndicadores = () => api.get('/indicadores/');
export const getIndicador = (id) => api.get(`/indicadores/${id}/`);
export const createIndicador = (data) => api.post('/indicadores/', data);
export const updateIndicador = (id, data) => api.put(`/indicadores/${id}/`, data);
export const deleteIndicador = (id) => api.delete(`/indicadores/${id}/`);

export const getDashboard = () => api.get('/indicadores/dashboard/');

export const compararIndicadores = (ids) => api.get(`/indicadores/comparar/?ids=${ids}`);

export const getValores = () => api.get('/valores/');
export const createValor = (data) => api.post('/valores/', data);
export const getValoresPorIndicador = (indicadorId) => 
  api.get(`/valores/?indicador=${indicadorId}`);

export default api;
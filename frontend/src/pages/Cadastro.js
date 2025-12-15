import React, { useState, useEffect } from 'react'
import { getIndicadores, createIndicador, createValor } from '../services/api';
import './Cadastro.css';

function Cadastro() {
    const [indicadores, setIndicadores] = useState([]);
    const [activeTab, setActiveTab] = useState('indicador');
    const [mensagem, setMensagem] = useState({tipo: '', texto: ''});
    const [novoIndicador, setNovoIndicador] = useState({
        nome: '',
        tipo: 'moeda',
        unidade: 'R$',
        descricao: '',
        fonte_api: '',
    });
    const [novoValor, setNovoValor] = useState({
        indicador: '',
        valor: '',
        fonte: 'manual',
    });

    useEffect(() => {
        carregarIndicadores();
    }, []);

    // Continuar aqui, fazer a função de carregar os indicadores e de cadastrar um novo
};

export default Cadastro;
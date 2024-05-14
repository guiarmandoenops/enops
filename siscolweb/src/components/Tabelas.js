import React, { useState, useEffect } from 'react';

const Tabelas = () => {
    const [polos, setPolos] = useState([]);
    const [selectedPolo, setSelectedPolo] = useState('');
    const [municipios, setMunicipios] = useState([]);
    const [selectedMunicipio, setSelectedMunicipio] = useState('');
    const [setoresAbastecimento, setSetoresAbastecimento] = useState([]);
    const [zonasPressao, setZonasPressao] = useState([]);

    // Fetch Polos
    useEffect(() => {
        fetch('http://localhost:5000/polos')
            .then(response => response.json())
            .then(setPolos)
            .catch(error => console.error('Erro ao buscar polos:', error));
    }, []);

    // Fetch Municipios baseado no polo selecionado
    useEffect(() => {
        if (selectedPolo) {
            fetch(`http://localhost:5000/municipios/${selectedPolo}`)
                .then(response => response.json())
                .then(setMunicipios)
                .catch(error => console.error('Erro ao buscar municípios:', error));
        }
    }, [selectedPolo]);

    // Fetch Setores de Abastecimento baseado no município selecionado
    useEffect(() => {
        if (selectedMunicipio) {
            fetch(`http://localhost:5000/setores-abastecimento/municipio/${selectedMunicipio}`)
                .then(response => response.json())
                .then(setSetoresAbastecimento)
                .catch(error => console.error('Erro ao buscar setores de abastecimento:', error));
        }
    }, [selectedMunicipio]);

    // Fetch Zonas de Pressão
    useEffect(() => {
        fetch('http://localhost:5000/zonas-pressao')
            .then(response => response.json())
            .then(setZonasPressao)
            .catch(error => console.error('Erro ao buscar zonas de pressão:', error));
    }, []);

    return (
        <div>
            <h1>Tabelas de Dados</h1>
            <div>
                <h2>Polos</h2>
                <select onChange={e => setSelectedPolo(e.target.value)}>
                    <option value="">Selecione um Polo</option>
                    {polos.map(polo => (
                        <option key={polo.id_Polo} value={polo.id_Polo}>{polo.NomePolo}</option>
                    ))}
                </select>
                <ul>
                    {polos.map(polo => (
                        <li key={polo.id_Polo}>{polo.NomePolo}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Municípios</h2>
                <select onChange={e => setSelectedMunicipio(e.target.value)}>
                    <option value="">Selecione um Município</option>
                    {municipios.map(municipio => (
                        <option key={municipio.id_Municipio} value={municipio.id_Municipio}>{municipio.NomeMunicipio}</option>
                    ))}
                </select>
                <ul>
                    {municipios.map(municipio => (
                        <li key={municipio.id_Municipio}>{municipio.NomeMunicipio}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Setores de Abastecimento</h2>
                <ul>
                    {setoresAbastecimento.map(setor => (
                        <li key={setor.id_SetorAbastecimento}>{setor.NomeSetor}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Zonas de Pressão</h2>
                <ul>
                    {zonasPressao.map(zona => (
                        <li key={zona.id_ZonaPressao}>{zona.NomeZonaPressao}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Tabelas;

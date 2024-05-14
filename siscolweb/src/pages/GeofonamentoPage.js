import React, { useState, useEffect } from 'react';

const GeofonamentoPage = () => {
    const [formData, setFormData] = useState({
        dataSolicitacao: '',
        horaSolicitacao: '',
        polo: '',
        solicitante: '',
        responsavel: '',
        prioridade: '',
        municipio: '',
        logradouro: '',
        numero: '',
        complemento: '',
        cruzamento: '',
        bairro: '',
        referencia: '',
        numeroOS: '',
        tipoServico: '',
        setorAbastecimento: '',
        zonaPressao: '',
        microzona: '',
        numeroMZ: '',
        motivo: '',
        observacoes: ''
    });

    const clearForm = () => {
        setFormData({
            dataSolicitacao: '',
            horaSolicitacao: '',
            polo: '',
            solicitante: '',
            responsavel: '',
            prioridade: '',
            municipio: '',
            logradouro: '',
            numero: '',
            complemento: '',
            cruzamento: '',
            bairro: '',
            referencia: '',
            numeroOS: '',
            tipoServico: '',
            setorAbastecimento: '',
            zonaPressao: '',
            microzona: '',
            numeroMZ: '',
            motivo: '',
            observacoes: ''
        });
    };

    const [polos, setPolos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [setoresAbastecimento, setSetoresAbastecimento] = useState([]);
    const [zonasPressao, setZonasPressao] = useState([]);

    // Fetch Polos
    useEffect(() => {
        fetch('http://localhost:5000/polos')
            .then(response => response.json())
            .then(setPolos)
            .catch(error => console.error('Erro ao buscar polos:', error));
    }, []);

    // Atualiza Municípios quando um Polo é selecionado
    useEffect(() => {
        if (formData.polo) {
            fetch(`http://localhost:5000/municipios/${formData.polo}`)
                .then(response => response.json())
                .then(setMunicipios)
                .catch(error => console.error('Erro ao buscar municípios:', error));
        } else {
            setMunicipios([]);
        }
    }, [formData.polo]);

    // Atualiza Setores de Abastecimento quando um Município é selecionado
    useEffect(() => {
        if (formData.municipio && formData.polo) {
            fetch(`http://localhost:5000/setores-abastecimento/municipio/${formData.municipio}/polo/${formData.polo}`)
                .then(response => response.json())
                .then(setSetoresAbastecimento)
                .catch(error => console.error('Erro ao buscar setores de abastecimento:', error));
        } else {
            setSetoresAbastecimento([]);
        }
    }, [formData.municipio, formData.polo]);

    // Atualiza Zonas de Pressão quando um Setor de Abastecimento é selecionado
    useEffect(() => {
        if (formData.setorAbastecimento) {
            fetch(`http://localhost:5000/zonas-pressao/setor/${formData.setorAbastecimento}`)
                .then(response => response.json())
                .then(setZonasPressao)
                .catch(error => console.error('Erro ao buscar zonas de pressão:', error));
        } else {
            setZonasPressao([]);
        }
    }, [formData.setorAbastecimento]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lista dos campos obrigatórios
        const requiredFields = [
            'dataSolicitacao', 'horaSolicitacao', 'polo', 'solicitante', 'responsavel', 
            'prioridade', 'municipio', 'logradouro', 'bairro', 'numeroOS', 
            'tipoServico', 'setorAbastecimento', 'zonaPressao'
        ];

        // Adiciona condição especial para 'Número MZ' e 'Motivo' baseado em 'Possui Microzona'
        if (formData.microzona === 'Sim') {
            requiredFields.push('numeroMZ');
        } else if (formData.microzona === 'Não') {
            requiredFields.push('motivo');
        }

        // Checa se todos os campos obrigatórios estão preenchidos
        const allFieldsFilled = requiredFields.every(field => formData[field].trim() !== '');

        if (!allFieldsFilled) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        fetch('http://localhost:5000/geofonamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Solicitação enviada com sucesso!');
            clearForm();  // Limpa o formulário após o envio bem-sucedido
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Erro ao enviar solicitação!');
        });
    };
    return (
        <div className="container mt-4" style={{ paddingTop: '70px' }}>
            <h3 className="mb-3">Dados do Solicitante</h3>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-2">
                        <label className="form-label">Data da Solicitação</label>
                        <input type="date" className="form-control" name="dataSolicitacao" value={formData.dataSolicitacao} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Hora da Solicitação</label>
                        <input type="time" className="form-control" name="horaSolicitacao" value={formData.horaSolicitacao} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Polo</label>
                        <select className="form-select" name="polo" value={formData.polo} onChange={handleInputChange} disabled={!polos.length}>
                            <option value="">Selecione...</option>
                            {polos.map(polo => <option key={polo.id_Polo} value={polo.id_Polo}>{polo.NomePolo}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Solicitante</label>
                        <input type="text" className="form-control" name="solicitante" value={formData.solicitante} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Responsável</label>
                        <input type="text" className="form-control" name="responsavel" value={formData.responsavel} onChange={handleInputChange} />
                    </div>
                </div>

                {/* Continuação do formulário para Endereço e Dados Complementares */}
                <h3 className="mt-5 mb-3">Endereço</h3>
                <div className="row">
                    <div className="col-md-3">
                        <label className="form-label">Município</label>
                        <select className="form-select" name="municipio" value={formData.municipio} onChange={handleInputChange} disabled={!formData.polo || !municipios.length}>
                            <option value="">Selecione...</option>
                            {municipios.map(municipio => <option key={municipio.id_Municipio} value={municipio.id_Municipio}>{municipio.NomeMunicipio}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Logradouro</label>
                        <input type="text" className="form-control" name="logradouro" value={formData.logradouro} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Número</label>
                        <input type="text" className="form-control" name="numero" value={formData.numero} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Complemento</label>
                        <input type="text" className="form-control" name="complemento" value={formData.complemento} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Cruzamento</label>
                        <input type="text" className="form-control" name="cruzamento" value={formData.cruzamento} onChange={handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <label className="form-label">Bairro</label>
                        <input type="text" className="form-control" name="bairro" value={formData.bairro} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Referência</label>
                        <input type="text" className="form-control" name="referencia" value={formData.referencia} onChange={handleInputChange} />
                    </div>
                </div>

                <h3 className="mt-5 mb-3">Dados Complementares</h3>
                <div className="row">
                    <div className="col-md-2" style={{ marginBottom: '20px' }}>
                        <label className="form-label">Número da OS</label>
                        <input type="text" className="form-control" name="numeroOS" value={formData.numeroOS} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Tipo de Serviço</label>
                        <select className="form-select" name="tipoServico" value={formData.tipoServico} onChange={handleInputChange}>
                            <option value="">Selecione...</option>
                            <option value="Arrebentado de Rede">Arrebentado de Rede</option>
                            <option value="Caps Fora">Caps Fora</option>
                            <option value="Troca de Registro">Troca de Registro</option>
                            <option value="Vazamento">Vazamento</option>
                            <option value="Instalação de Registro">Instalação de Registro</option>
                            <option value="Interligação de Rede">Interligação de Rede</option>
                            <option value="Prolongamento">Prolongamento</option>
                            <option value="Remanejamento de Rede">Remanejamento de Rede</option>
                            <option value="Teste de Estanqueidade">Teste de Estanqueidade</option>
                            <option value="Manutenção de VRP">Manutenção de VRP</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Setor de Abastecimento</label>
                        <select className="form-select" name="setorAbastecimento" value={formData.setorAbastecimento} onChange={handleInputChange} disabled={!formData.municipio || !setoresAbastecimento.length}>
                            <option value="">Selecione...</option>
                            {setoresAbastecimento.map(setor => <option key={setor.id_SetorAbastecimento} value={setor.id_SetorAbastecimento}>{setor.NomeSetor}</option>)}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Zona de Pressão</label>
                        <select className="form-select" name="zonaPressao" value={formData.zonaPressao} onChange={handleInputChange} disabled={!setoresAbastecimento.length}>
                            <option value="">Selecione...</option>
                            {zonasPressao.map(zona => <option key={zona.id_ZonaPressao} value={zona.id_ZonaPressao}>{zona.NomeZonaPressao}</option>)}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Prioridade</label>
                        <select className="form-select" name="prioridade" value={formData.prioridade} onChange={handleInputChange}>
                            <option value="">Selecione...</option>
                            <option value="Alta">Alta</option>
                            <option value="Baixa">Baixa</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                        <label className="form-label">Possui Microzona?</label>
                        <select className="form-select" name="microzona" value={formData.microzona} onChange={handleInputChange}>
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Número MZ</label>
                        <input type="text" className="form-control" name="numeroMZ" value={formData.numeroMZ} onChange={handleInputChange} disabled={formData.microzona !== "Sim"} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Motivo</label>
                        <select className="form-select" name="motivo" value={formData.motivo} onChange={handleInputChange} disabled={formData.microzona !== "Não"}>
                            <option value="">Selecione...</option>
                            <option value="Rede Primária">Rede Primária</option>
                            <option value="Não Implantada">Não Implantada</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Observações</label>
                        <textarea className="form-control" name="observacoes" value={formData.observacoes} onChange={handleInputChange} placeholder="Digite suas observações aqui..." rows="3"></textarea>
                    </div>
                </div>
                <div className="row">
                </div>
                <button type="submit" className="btn btn-primary">Enviar</button>
                <button type="button" className="btn btn-secondary" onClick={clearForm}>Limpar</button>
            </form>
        </div>
    );
};

export default GeofonamentoPage;

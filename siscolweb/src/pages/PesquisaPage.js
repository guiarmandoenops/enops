import React, { useState } from 'react';

const PesquisaPage = () => {
    const [formData, setFormData] = useState({
        pde: '',
        municipio: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        dadosReclamacao: '',
        os: '',
        tipoReclamacao: '',
        setorAbastecimento: '',
        zonaPressao: '',
        omc: '',
        vrp: '',
        observacoesCliente: '',
        passadoPara: '',
        observacoesEquipe: '',
        historicoReclamacoes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData);
        // Implementar lógica de envio aqui
    };

    const clearForm = () => {
        setFormData({
            pde: '',
            municipio: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            dadosReclamacao: '',
            os: '',
            tipoReclamacao: '',
            setorAbastecimento: '',
            zonaPressao: '',
            omc: '',
            vrp: '',
            observacoesCliente: '',
            passadoPara: '',
            observacoesEquipe: '',
            historicoReclamacoes: ''
        });
    };

    return (
        <div className="container mt-4" style={{ paddingTop: '70px' }}>
            <form onSubmit={handleSubmit}>
                <h3>Dados do Cliente</h3>
                <div className="row g-3">
                    <div className="col-md-2">
                        <label className="form-label">PDE</label>
                        <input type="text" className="form-control" name="pde" value={formData.pde} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Município</label>
                        <input type="text" className="form-control" name="municipio" value={formData.municipio} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Logradouro</label>
                        <input type="text" className="form-control" name="logradouro" value={formData.logradouro} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-1">
                        <label className="form-label">Número</label>
                        <input type="text" className="form-control" name="numero" value={formData.numero} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Complemento</label>
                        <input type="text" className="form-control" name="complemento" value={formData.complemento} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Bairro</label>
                        <input type="text" className="form-control" name="bairro" value={formData.bairro} onChange={handleInputChange} />
                    </div>
                </div>

                <h3>Dados da Reclamação</h3>
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label">Dados da Reclamação</label>
                        <input type="text" className="form-control" name="dadosReclamacao" value={formData.dadosReclamacao} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">OS</label>
                        <input type="text" className="form-control" name="os" value={formData.os} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Tipo de Reclamação</label>
                        <input type="text" className="form-control" name="tipoReclamacao" value={formData.tipoReclamacao} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Setor de Abastecimento</label>
                        <input type="text" className="form-control" name="setorAbastecimento" value={formData.setorAbastecimento} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Zona de Pressão</label>
                        <input type="text" className="form-control" name="zonaPressao" value={formData.zonaPressao} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-1">
                        <label className="form-label">OMC</label>
                        <input type="text" className="form-control" name="omc" value={formData.omc} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-1">
                        <label className="form-label">VRP</label>
                        <input type="text" className="form-control" name="vrp" value={formData.vrp} onChange={handleInputChange} />
                    </div>
                </div>
                <textarea className="form-control mt-3" name="observacoesCliente" placeholder="Observações do Cliente" rows="3" value={formData.observacoesCliente} onChange={handleInputChange}></textarea>

                <h3>Dados da Equipe</h3>
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label">Passado Para</label>
                        <input type="text" className="form-control" name="passadoPara" value={formData.passadoPara} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Observações para a equipe</label>
                        <textarea className="form-control" name="observacoesEquipe" rows="3" value={formData.observacoesEquipe} onChange={handleInputChange}></textarea>
                    </div>
                    <div className="col-md-5">
                        <label className="form-label">Histórico de Reclamações</label>
                        <input type="text" className="form-control" name="historicoReclamacoes" value={formData.historicoReclamacoes} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="row g-3 mt-3">
                    <div className="col">
                        <button type="submit" className="btn btn-primary">Cadastrar</button>
                        <button type="button" className="btn btn-secondary" onClick={clearForm}>Limpar</button>
                        <button type="button" className="btn btn-secondary">Fechar</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PesquisaPage;

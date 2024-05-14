import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CadastroPage = () => {
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        unidade: '',
        login: '',
        matricula: '',
        email: '',
        perfil: '', // Ajustado para não ter valor padrão
        status: 'ativo' // Adicionado campo de status com valor padrão 'ativo'
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
        console.log('Form Data Submitted', formData);

        // Enviar os dados para a API
        fetch('http://localhost:5000/cadastro-usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert(data.message);
            // Limpa o formulário após sucesso
            setFormData({
                nomeCompleto: '',
                unidade: '',
                login: '',
                matricula: '',
                email: '',
                perfil: '',
                status: 'ativo' // Reset do status para padrão
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Erro ao cadastrar usuário!');
        });
    };

        return (
            <div className="container mt-4" style={{ paddingTop: '70px' }}>
                <h1 className="text-center display-4">Cadastrar Usuário</h1>
                <section className="cadastro-container">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label">Nome Completo</label>
                                                <input type="text" className="form-control" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleInputChange} />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Unidade</label>
                                                <input type="text" className="form-control" name="unidade" value={formData.unidade} onChange={handleInputChange} />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Login</label>
                                                <input type="text" className="form-control" name="login" value={formData.login} onChange={handleInputChange} />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Matrícula</label>
                                                <input type="text" className="form-control" name="matricula" value={formData.matricula} onChange={handleInputChange} />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Endereço de Email</label>
                                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} placeholder="exemplo@sabesp.com.br" />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Perfil</label>
                                                <select className="form-select" name="perfil" value={formData.perfil} onChange={handleInputChange}>
    <option value="">Selecione</option>
    <option value="Administrador">Administrador</option>
    <option value="Padrão">Padrão</option>
</select>

                                            </div>
                                            <div className="mb-3">
                                            <label className="form-label">Status</label>
                                            <select className="form-select" name="status" value={formData.status} onChange={handleInputChange}>
                                                <option value="ativo">Ativo</option>
                                                <option value="inativo">Inativo</option>
                                            </select>
                                        </div>
                                            <div className="mb-3 text-center">
                                                <button type="submit" className="btn btn-primary">Cadastrar</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    };

    export default CadastroPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacao from '../components/Paginacao';
import { Modal, Button } from 'react-bootstrap';

const UsuariosPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/usuarios')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Erro ao buscar usuários:', error));
    }, []);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleDelete = (id) => {
        fetch(`http://localhost:5000/usuarios/${id}`, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                setUsers(users.filter(user => user.id !== id));
                setShowModal(false);
                alert('Usuário excluído com sucesso!');
            } else {
                alert('Falha ao excluir o usuário!');
            }
        }).catch(error => {
            console.error('Erro ao excluir usuário:', error);
            alert('Erro ao excluir usuário!');
        });
    };

    const handleShowDeleteModal = (user) => {
        setUserToDelete(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="container mt-4" style={{ paddingTop: '70px' }}>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Visualizar Usuários</h1>
                <button className="btn btn-primary" onClick={() => navigate('/cadastro/usuarios')}>Novo Usuário</button>
            </div>
            <div className="table-responsive">
                <table className="table table-striped mt-4">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Perfil</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.nome}</td>
                                <td>{user.email}</td>
                                <td>{user.perfil}</td>
                                <td>{user.status}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm" onClick={() => console.log('Atualizar usuário com ID:', user.id)}>Atualizar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleShowDeleteModal(user)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Paginacao itemsPerPage={usersPerPage} totalItems={users.length} paginate={paginate} currentPage={currentPage} />
            </div>
            {/* Modal de Confirmação de Exclusão */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tem certeza que deseja excluir o usuário {userToDelete?.nome}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Não
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(userToDelete?.id)}>
                        Sim
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UsuariosPage;

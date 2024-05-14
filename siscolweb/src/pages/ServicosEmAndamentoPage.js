import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Paginacao from '../components/Paginacao'; // Certifique-se de que este componente está corretamente importado
import moment from 'moment';

const ServicosEmAndamentoPage = () => {
    const [fechamentos, setFechamentos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [fechamentosPerPage] = useState(5);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFechamentoId, setSelectedFechamentoId] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsData, setDetailsData] = useState({});
    const [funcionarios, setFuncionarios] = useState([]);



    useEffect(() => {
        fetch('http://localhost:5000/fechamentos')
            .then(response => {
                console.log('Response:', response);
                return response.json();
            })
            .then(data => {
                console.log('Fechamentos carregados:', data);
                setFechamentos(data);
            })
            .catch(error => console.error('Erro ao buscar fechamentos:', error));
    }, []);
    
    
    const handleDeleteConfirm = (id) => {
        setSelectedFechamentoId(id);
        setShowDeleteModal(true);
    };
    
    
    const handleDelete = () => {
        fetch(`http://localhost:5000/fechamentos/${selectedFechamentoId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                setFechamentos(prevFechamentos => prevFechamentos.filter(fechamento => fechamento.id !== selectedFechamentoId));
                setShowDeleteModal(false);
                alert('Fechamento excluído com sucesso!');
            } else {
                throw new Error('Falha ao excluir o fechamento');
            }
        })
        .catch(error => {
            console.error('Erro ao excluir fechamento:', error);
            alert('Erro ao excluir fechamento!');
        });
    };
    
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };
    const formatDate = (isoDate) => {
        if (!isoDate || new Date(isoDate).toString() === "Invalid Date") return '';
        // Cria um objeto Date a partir da string ISO
        const date = new Date(isoDate);
        // Corrige o deslocamento do fuso horário
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const correctedDate = new Date(date.getTime() + userTimezoneOffset);
        // Formata a data como 'dd/mm/yyyy'
        return correctedDate.toLocaleDateString('pt-BR');
    };
    
    
    const formatTime = (timeString) => {
        if (!timeString || !timeString.includes('T')) return '';
        // Extraí a parte do horário do timestamp ISO
        let timePart = timeString.split('T')[1];
        if (!timePart || !timePart.includes(':')) return '';
        // Remove os milissegundos e fuso horário, se houver
        timePart = timePart.split('.')[0];
        // Converte para 'hh:mm:ss' no fuso horário UTC
        const [hours, minutes, seconds] = timePart.split(':');
        // Retorna o tempo no formato 'hh:mm'
        return `${hours}:${minutes}`;
    };
    
const handleSaveAcatamento = async () => {
    console.log("selectedFechamentoId:", selectedFechamentoId); // Verifica se o ID está sendo capturado corretamente

    const payload = {
        IdSolicitacaoFechamento: selectedFechamentoId,
        Data: detailsData.data,
        PassadoPara: detailsData.passadoPara,
        Previsao: detailsData.previsaoH,
        Observacoes: detailsData.observacoesEditaveis
    };

    console.log("Payload sendo enviado:", payload); // Verifica se o payload está correto

    try {
        const response = await fetch('http://localhost:5000/acatamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta de erro do servidor:', errorText);
            throw new Error(`Falha ao salvar o acatamento: ${errorText}`);
        }

        

        alert('Acatamento salvo com sucesso!');
        setShowDetailsModal(false);
    } catch (error) {
        console.error('Erro ao salvar acatamento:', error);
        alert(`Erro ao salvar acatamento: ${error.message}`);
    }
};



    
const handleShowDetails = (fechamento) => {
    Promise.all([
        fetch(`http://localhost:5000/fechamentos/${fechamento.id}`).then(res => res.json()),
        fetch('http://localhost:5000/funcionarios-de-campos/nomes').then(res => res.json())
    ]).then(([detailsData, funcionariosData]) => {
        setDetailsData({
            ...detailsData,
            dataSolicitacao: formatDate(detailsData.dataSolicitacao),
            horaSolicitacao: formatTime(detailsData.horaSolicitacao),
            tipoServico: detailsData.tipoServico,
            observacoesEditaveis: '' // Explicitamente inicializar como vazio
        });
        setFuncionarios(funcionariosData);
        setSelectedFechamentoId(fechamento.id);
        setShowDetailsModal(true);
    }).catch(error => console.error('Erro ao buscar detalhes do fechamento ou funcionários:', error));
};




    
    // Paginação
    const indexOfLastFechamento = currentPage * fechamentosPerPage;
    const indexOfFirstFechamento = indexOfLastFechamento - fechamentosPerPage;
    const currentFechamentos = fechamentos.slice(indexOfFirstFechamento, indexOfLastFechamento);
    const paginate = pageNumber => setCurrentPage(pageNumber);      

    return (
        <div className="container mt-4" style={{ paddingTop: '40px', paddingBottom: '10px' }}>
            <h1>Serviços em Andamento</h1>
            <div className="table-responsive">
                <table className="table table-striped mt-4">
                <thead>
    <tr>
        <th>ID</th>
        <th>Polo Solicitante</th>
        <th>Data de Solicitação</th>
        <th>Hora de Solicitação</th>
        <th>Tipo de Serviço</th>
        <th>Status</th>
        <th>Ações</th>
    </tr>
</thead>

               
<tbody>
    {currentFechamentos.map(fechamento => (
        <tr key={fechamento.id} onClick={() => handleShowDetails(fechamento)}>
            <td>{fechamento.id}</td>
            <td>{fechamento.NomePolo}</td>
            <td>{formatDate(fechamento.dataSolicitacao)}</td>
            <td>{formatTime(fechamento.horaSolicitacao)}</td>
            <td>{fechamento.tipoServico}</td>
            <td>{fechamento.status}</td>
            <td>
            <Button variant="danger" onClick={(e) => {
    e.stopPropagation(); // Impede que o evento de clique no botão propague
    handleDeleteConfirm(fechamento.id);
}}>Excluir</Button>

            </td>
        </tr>
        
    ))}
</tbody>
<Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
    <Modal.Header closeButton>
        <Modal.Title>Confirmar Exclusão</Modal.Title>
    </Modal.Header>
    <Modal.Body>Tem certeza de que deseja excluir este registro?</Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
        </Button>
        <Button variant="danger" onClick={handleDelete}>
            Excluir
        </Button>
    </Modal.Footer>
</Modal>






                </table>
                <Paginacao itemsPerPage={fechamentosPerPage} totalItems={fechamentos.length} paginate={paginate} currentPage={currentPage} />

            </div>
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
    <Modal.Header closeButton>
        <Modal.Title>Acatamento</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
        <form>
            <div className="row">
                <div className="col-md-4">
                    <label>Data da Solicitação</label>
                    <input type="text" className="form-control" value={formatDate(detailsData.dataSolicitacao) || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Hora da Solicitação</label>
                    <input type="text" className="form-control" value={detailsData.horaSolicitacao || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Polo</label>
                    <input type="text" className="form-control" value={detailsData.NomePolo || ''} readOnly />
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-4">
                    <label>Solicitante</label>
                    <input type="text" className="form-control" value={detailsData.solicitante || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Responsável</label>
                    <input type="text" className="form-control" value={detailsData.responsavel || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Prioridade</label>
                    <input type="text" className="form-control" value={detailsData.prioridade || ''} readOnly />
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-4">
                    <label>Município</label>
                    <input type="text" className="form-control" value={detailsData.NomeMunicipio || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Logradouro</label>
                    <input type="text" className="form-control" value={detailsData.logradouro || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Número</label>
                    <input type="text" className="form-control" value={detailsData.numero || ''} readOnly />
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-4">
                    <label>Complemento</label>
                    <input type="text" className="form-control" value={detailsData.complemento || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Cruzamento</label>
                    <input type="text" className="form-control" value={detailsData.cruzamento || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Bairro</label>
                    <input type="text" className="form-control" value={detailsData.bairro || ''} readOnly />
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-4">
                    <label>Referência</label>
                    <input type="text" className="form-control" value={detailsData.referencia || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Número da OS</label>
                    <input type="text" className="form-control" value={detailsData.numeroOS || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Tipo de Serviço</label>
                    <input type="text" className="form-control" value={detailsData.tipoServico || ''} readOnly />
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-4">
                    <label>Setor de Abastecimento</label>
                    <input type="text" className="form-control" value={detailsData.NomeSetor || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Zona de Pressão</label>
                    <input type="text" className="form-control" value={detailsData.NomeZonaPressao || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Microzona</label>
                    <input type="text" className="form-control" value={detailsData.microzona || ''} readOnly />
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-4">
                    <label>Número MZ</label>
                    <input type="text" className="form-control" value={detailsData.numeroMZ || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Motivo</label>
                    <input type="text" className="form-control" value={detailsData.motivo || ''} readOnly />
                </div>
                <div className="col-md-4">
                    <label>Observações</label>
                    <textarea className="form-control" value={detailsData.observacoes || ''} readOnly rows="3"></textarea>
                </div>

                <h3>Acatamento</h3>
                <div className="row mt-3">
    <div className="col-md-6">
        <label>Data</label>
        <input type="date" className="form-control"
            value={detailsData.data || ''}
            onChange={e => setDetailsData({ ...detailsData, data: e.target.value })}
        />
    </div>
    <div className="col-md-6">
        <label>Passado Para</label>
        <select 
        className="form-control" 
        value={detailsData.passadoPara || ''} 
        onChange={e => setDetailsData({ ...detailsData, passadoPara: e.target.value })}
    >
        <option value="">Selecione um funcionário</option>
        {funcionarios.map((funcionario, index) => (
            <option key={index} value={funcionario.Nome}>{funcionario.Nome}</option>
        ))}
    </select>    </div>
</div>
<div className="row mt-3">
    <div className="col-md-6">
        <label>Previsão (h)</label>
        <input type="text" className="form-control"
            value={detailsData.previsaoH || ''}
            onChange={e => setDetailsData({ ...detailsData, previsaoH: e.target.value })}
        />
    </div>
    <div className="col-md-6">
        <label>Observações</label>
        <textarea className="form-control"
        value={detailsData.observacoesEditaveis || ''}
        onChange={e => setDetailsData({ ...detailsData, observacoesEditaveis: e.target.value })}
        rows="3"></textarea>
        </div>
</div>
            </div>
        </form>
    </Modal.Body>
    <Modal.Footer>
   
        <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
        Cancelar
    </Button>
    <Button variant="primary" onClick={handleSaveAcatamento}>
    Enviar
</Button>

    </Modal.Footer>
</Modal>



        </div>
    );
};

export default ServicosEmAndamentoPage;

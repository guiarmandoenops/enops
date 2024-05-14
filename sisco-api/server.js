const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');  // Usando a extensão que suporta autenticação do Windows
require('dotenv').config();

const app = express();

// Permitir solicitações de diferentes origens
app.use(cors());
app.use(express.json()); // para parsing application/json

app.get('/', (req, res) => {
    res.send('API está funcionando!');
});

// Configuração do banco de dados para usar autenticação integrada do Windows
const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true,
        trustedConnection: true
    },
    driver: "msnodesqlv8",
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_NAME};Trusted_Connection=yes;`
};

// Função assíncrona para iniciar o servidor e conectar ao banco de dados
async function startServer() {
    try {
        await sql.connect(config);
        console.log('Conectado ao banco de dados');

        const PORT = 5000;  // Use qualquer porta que esteja livre para você
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }
}

// Rota para buscar polos
app.get('/polos', async (req, res) => {
    try {
        const result = await sql.query('SELECT id_Polo, NomePolo FROM Tb_Polo');
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao buscar polos:', err);
        res.status(500).send('Erro ao buscar polos');
    }
});

// Rota para buscar municípios
app.get('/municipios', async (req, res) => {
    try {
        const result = await sql.query('SELECT id_Municipio, NomeMunicipio FROM Tb_Municipio');
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao buscar municípios:', err);
        res.status(500).send('Erro ao buscar municípios');
    }
});

// Rota para buscar setores de abastecimento
app.get('/setores-abastecimento', async (req, res) => {
    try {
        const result = await sql.query('SELECT id_SetorAbastecimento, NomeSetor FROM Tb_SetorAbastecimento');
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao buscar setores de abastecimento:', err);
        res.status(500).send('Erro ao buscar setores de abastecimento');
    }
});

// Rota para buscar zonas de pressão
app.get('/zonas-pressao', async (req, res) => {
    try {
        const result = await sql.query('SELECT id_ZonaPressao, NomeZonaPressao FROM Tb_ZonaPressao');
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao buscar zonas de pressão:', err);
        res.status(500).send('Erro ao buscar zonas de pressão');
    }
});

// Rota para buscar municípios por polo
app.get('/municipios/:poloId', async (req, res) => {
    try {
        const poloId = req.params.poloId;
        const request = new sql.Request();
        request.input('poloId', sql.Int, poloId);
        const query = `
            SELECT m.id_Municipio, m.NomeMunicipio 
            FROM Tb_Municipio m
            JOIN Tb_PoloMunicipio pm ON m.id_Municipio = pm.id_Municipio
            WHERE pm.id_Polo = @poloId;
        `;
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao buscar municípios:', err);
        res.status(500).send('Erro ao buscar municípios');
    }
});

// Rota para buscar setores de abastecimento por município
app.get('/setores-abastecimento/municipio/:municipioId', async (req, res) => {
    try {
        const municipioId = req.params.municipioId;
        const request = new sql.Request();
        request.input('municipioId', sql.Int, municipioId);
        const query = `
            SELECT sa.id_SetorAbastecimento, sa.NomeSetor 
            FROM Tb_SetorAbastecimento sa
            JOIN Tb_MunicipioSetor ms ON sa.id_SetorAbastecimento = ms.id_SetorAbastecimento
            WHERE ms.id_Municipio = @municipioId;
        `;
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao buscar setores de abastecimento:', err);
        res.status(500).send('Erro ao buscar setores de abastecimento');
    }
});

app.get('/fechamentos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT f.*, p.NomePolo, m.NomeMunicipio, s.NomeSetor, z.NomeZonaPressao, f.tipoServico, f.status
            FROM Tb_Fechamentos f
            LEFT JOIN Tb_Polo p ON f.id_Polo = p.id_Polo
            LEFT JOIN Tb_Municipio m ON f.id_Municipio = m.id_Municipio
            LEFT JOIN Tb_SetorAbastecimento s ON f.id_SetorAbastecimento = s.id_SetorAbastecimento
            LEFT JOIN Tb_ZonaPressao z ON f.id_ZonaPressao = z.id_ZonaPressao
            WHERE f.id = @id;
        `;
        const request = new sql.Request();
        request.input('id', sql.Int, id);
        const result = await request.query(query);
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send({ message: 'Fechamento não encontrado' });
        }
    } catch (err) {
        console.error('Erro ao buscar fechamento:', err);
        res.status(500).send({ message: 'Erro ao buscar fechamento', error: err.message });
    }
});

// Rota para buscar setores de abastecimento por município e polo
app.get('/setores-abastecimento/municipio/:municipioId/polo/:poloId', async (req, res) => {
    try {
        const { municipioId, poloId } = req.params;
        const query = `
            SELECT DISTINCT sa.id_SetorAbastecimento, sa.NomeSetor
            FROM Tb_SetorAbastecimento sa
            JOIN Tb_MunicipioSetor ms ON sa.id_SetorAbastecimento = ms.id_SetorAbastecimento
            JOIN Tb_PoloSetor ps ON sa.id_SetorAbastecimento = ps.id_SetorAbastecimento
            WHERE ms.id_Municipio = @municipioId AND ps.id_Polo = @poloId;
        `;
        const request = new sql.Request();
        request.input('municipioId', sql.Int, municipioId);
        request.input('poloId', sql.Int, poloId);
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao buscar setores de abastecimento:', err);
        res.status(500).send('Erro ao buscar setores de abastecimento');
    }
});

app.post('/acatamentos', async (req, res) => {
    const { IdSolicitacaoFechamento, Data, PassadoPara, Previsao, Observacoes } = req.body;
    console.log("Recebendo dados para novo acatamento:", req.body);
    try {
        const query = `INSERT INTO Tb_Acatamento (IdSolicitacaoFechamento, Data, PassadoPara, Previsao, Observacoes)
                       VALUES (@IdSolicitacaoFechamento, @Data, @PassadoPara, @Previsao, @Observacoes)`;
        const request = new sql.Request();
        request.input('IdSolicitacaoFechamento', sql.Int, IdSolicitacaoFechamento);
        request.input('Data', sql.Date, Data);
        request.input('PassadoPara', sql.NVarChar, PassadoPara);
        request.input('Previsao', sql.NVarChar, Previsao);
        request.input('Observacoes', sql.NVarChar, Observacoes);
        await request.query(query);

        await updateFechamentoStatus(IdSolicitacaoFechamento);

        res.status(200).send({ message: 'Acatamento criado e status do fechamento atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar acatamento ou ao atualizar status:', error);
        res.status(500).send({ message: 'Erro ao criar acatamento ou ao atualizar status', error: error.message });
    }
});

// Função para atualizar o status do fechamento
const updateFechamentoStatus = async (idFechamento) => {
    const request = new sql.Request();
    request.input('id', sql.Int, idFechamento);
    request.input('status', sql.NVarChar, 'Acatado'); // Define o novo status
    await request.query('UPDATE Tb_Fechamentos SET status = @status WHERE id = @id');
};

// Rota para buscar setores de abastecimento por polo
app.get('/setores-abastecimento/polo/:poloId', async (req, res) => {
    try {
        const poloId = req.params.poloId;
        const query = `
            SELECT sa.id_SetorAbastecimento, sa.NomeSetor
            FROM Tb_SetorAbastecimento sa
            JOIN tb_PoloSetor ps ON sa.id_SetorAbastecimento = ps.id_SetorAbastecimento
            WHERE ps.id_Polo = @poloId;
        `;
        const result = await sql.query(query, { poloId });
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao buscar setores de abastecimento por polo:', err);
        res.status(500).send('Erro ao buscar setores de abastecimento');
    }
});

app.get('/zonas-pressao/setor/:setorId', async (req, res) => {
    try {
        const setorId = req.params.setorId;
        const request = new sql.Request();
        request.input('setorId', sql.Int, setorId);

        const query = `
            SELECT zp.id_ZonaPressao, zp.NomeZonaPressao
            FROM Tb_ZonaPressao zp
            JOIN tb_SetorZonaPressao szp ON zp.id_ZonaPressao = szp.id_ZonaPressao
            WHERE szp.id_SetorAbastecimento = @setorId;
        `;

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao buscar zonas de pressão por setor:', err);
        res.status(500).send('Erro ao buscar zonas de pressão');
    }
});

// Rota para salvar um novo fechamento
app.post('/fechamentos', async (req, res) => {
    const data = req.body;
    try {
        const request = new sql.Request();
        request.input('dataSolicitacao', sql.Date, data.dataSolicitacao);
        request.input('horaSolicitacao', sql.Time, data.horaSolicitacao);
        request.input('id_Polo', sql.Int, data.polo);
        request.input('solicitante', sql.NVarChar, data.solicitante);
        request.input('responsavel', sql.NVarChar, data.responsavel);
        request.input('prioridade', sql.NVarChar, data.prioridade);
        request.input('id_Municipio', sql.Int, data.municipio);
        request.input('logradouro', sql.NVarChar, data.logradouro);
        request.input('numero', sql.NVarChar, data.numero);
        request.input('complemento', sql.NVarChar, data.complemento);
        request.input('cruzamento', sql.NVarChar, data.cruzamento);
        request.input('bairro', sql.NVarChar, data.bairro);
        request.input('referencia', sql.NVarChar, data.referencia);
        request.input('numeroOS', sql.NVarChar, data.numeroOS);
        request.input('tipoServico', sql.NVarChar, data.tipoServico);
        request.input('id_SetorAbastecimento', sql.Int, data.setorAbastecimento);
        request.input('id_ZonaPressao', sql.Int, data.zonaPressao);
        request.input('microzona', sql.NVarChar, data.microzona);
        request.input('numeroMZ', sql.NVarChar, data.numeroMZ);
        request.input('motivo', sql.NVarChar, data.motivo);
        request.input('observacoes', sql.NVarChar, data.observacoes);
        request.input('status', sql.NVarChar, 'Solicitado'); // Define o status como "Solicitado"

        const query = `
            INSERT INTO Tb_Fechamentos (
                dataSolicitacao, horaSolicitacao, id_Polo, solicitante, responsavel, prioridade,
                id_Municipio, logradouro, numero, complemento, cruzamento, bairro, referencia,
                numeroOS, tipoServico, id_SetorAbastecimento, id_ZonaPressao, microzona, numeroMZ,
                motivo, observacoes, status
            ) VALUES (
                @dataSolicitacao, @horaSolicitacao, @id_Polo, @solicitante, @responsavel, @prioridade,
                @id_Municipio, @logradouro, @numero, @complemento, @cruzamento, @bairro, @referencia,
                @numeroOS, @tipoServico, @id_SetorAbastecimento, @id_ZonaPressao, @microzona, @numeroMZ,
                @motivo, @observacoes, @status
            );
        `;
        await request.query(query);
        res.status(200).send({ message: "Fechamento salvo com sucesso!" });
    } catch (err) {
        console.error('Erro ao salvar fechamento:', err);
        res.status(500).send('Erro ao salvar fechamento');
    }
});

// Rota para buscar nomes dos funcionários de campo
app.get('/funcionarios-de-campos/nomes', async (req, res) => {
    try {
        const result = await sql.query('SELECT Nome FROM Tb_FuncionariosDeCampos');
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao buscar nomes dos funcionários de campos:', err);
        res.status(500).send('Erro ao buscar nomes dos funcionários de campos');
    }
});

// chama dados
app.get('/fechamentos', async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT f.id, f.dataSolicitacao, f.horaSolicitacao, f.solicitante, f.logradouro, p.NomePolo, f.tipoServico, f.status
            FROM Tb_Fechamentos AS f
            LEFT JOIN Tb_Polo AS p ON f.id_Polo = p.id_Polo
        `);
        console.log(result.recordset); // Isso deveria mostrar os resultados da consulta no terminal
        res.json(result.recordset);   // Envia o resultado como resposta JSON
    } catch (err) {
        console.error('Erro ao buscar fechamentos:', err);
        res.status(500).send('Erro ao buscar fechamentos');
    }
});

// Excluir um fechamento
app.delete('/fechamentos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Primeiro, verifica se o fechamento está acatado e se existem registros relacionados em Tb_Acatamento
        const checkAcatamento = await sql.query(`SELECT * FROM Tb_Acatamento WHERE IdSolicitacaoFechamento = ${id}`);
        
        if (checkAcatamento.recordset.length > 0) {
            // Se existem acatamentos, exclua-os primeiro
            await sql.query(`DELETE FROM Tb_Acatamento WHERE IdSolicitacaoFechamento = ${id}`);
        }

        // Agora, tenta excluir o fechamento
        const result = await sql.query(`DELETE FROM Tb_Fechamentos WHERE id = ${id}`);
        if (result.rowsAffected[0] > 0) {
            res.status(200).send({ message: 'Fechamento deletado com sucesso!' });
        } else {
            res.status(404).send({ message: 'Fechamento não encontrado' });
        }
    } catch (err) {
        console.error('Erro ao deletar fechamento:', err);
        res.status(500).send('Erro ao deletar fechamento');
    }
});


// Atualizar um fechamento
app.put('/fechamentos/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        // Adicione sua lógica de atualização aqui usando 'data' para obter os novos valores
        res.send({ message: 'Fechamento atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar fechamento:', err);
        res.status(500).send('Erro ao atualizar fechamento');
    }
});

// Rota para cadastrar um novo usuário
app.post('/cadastro-usuario', async (req, res) => {
    const { nomeCompleto, unidade, login, matricula, email, perfil, status } = req.body;
    try {
        const request = new sql.Request();
        request.input('nomeCompleto', sql.NVarChar, nomeCompleto);
        request.input('unidade', sql.NVarChar, unidade);
        request.input('login', sql.NVarChar, login);
        request.input('matricula', sql.NVarChar, matricula);
        request.input('email', sql.NVarChar, email);
        request.input('perfil', sql.NVarChar, perfil); // Alterado para inserir diretamente o texto
        request.input('status', sql.NVarChar, status);

        const query = `
            INSERT INTO Tb_CadastroUsuario (nomeCompleto, unidade, login, matricula, email, perfil, status)
            VALUES (@nomeCompleto, @unidade, @login, @matricula, @email, @perfil, @status);
        `;
        await request.query(query);
        res.status(200).send({ message: "Usuário cadastrado com sucesso!" });
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).send({ message: "Erro ao cadastrar usuário", error: err.message });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const request = new sql.Request();
        request.input('id', sql.Int, id);

        const query = `DELETE FROM Tb_CadastroUsuario WHERE id = @id;`;
        const result = await request.query(query);

        if (result.rowsAffected[0] > 0) {
            res.send({ message: 'Usuário deletado com sucesso!' });
        } else {
            res.status(404).send({ message: 'Usuário não encontrado' });
        }
    } catch (err) {
        console.error('Erro ao deletar usuário:', err);
        res.status(500).send({ message: 'Erro ao deletar usuário', error: err.message });
    }
});

// Rota para buscar todos os usuários
app.get('/usuarios', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Tb_CadastroUsuario');
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).send('Erro ao buscar usuários');
    }
});

// Chama a função para iniciar o servidor
startServer();
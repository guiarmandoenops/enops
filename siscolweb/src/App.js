import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Tabelas from './components/Tabelas'; // Certifique-se de que o caminho está correto

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FechamentoPage from './pages/FechamentoPage';
import PesquisaPage from './pages/PesquisaPage';
import VerificacaoDeFechamentoPage from './pages/VerificacaoDeFechamentoPage';
import GeofonamentoPage from './pages/GeofonamentoPage';
import CadastroUsuarioPage from './pages/CadastrarUsuarioPage';
import Usuarios from './pages/UsuariosPage';
import ServicosEmAndamentoPage from './pages/ServicosEmAndamentoPage';



function App() {
  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(response => response.text())
      .then(data => {
        console.log('Resposta do servidor:', data);
      })
      .catch(error => {
        console.error('Falha ao conectar com o servidor:', error);
      });
  }, []);

  return (
    <Router>
      <div className="main-container" style={{ backgroundImage: "url('../public/images/fundo1.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Header />
      
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cadastro/usuarios" element={<CadastroUsuarioPage />} />
            <Route path="/fechamento" element={<FechamentoPage />} />
            <Route path="/pesquisa" element={<PesquisaPage />} />
            <Route path="/verificacao-de-fechamento" element={<VerificacaoDeFechamentoPage />} />
            <Route path="/geofonamento" element={<GeofonamentoPage />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/servicos" element={<ServicosEmAndamentoPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

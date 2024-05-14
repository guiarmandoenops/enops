import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';


const Header = () => {
  const [expanded, setExpanded] = useState(false); // Estado para controlar a expansão da navbar

  return (
    <Navbar bg="info" variant="dark" expand="lg" fixed="top" expanded={expanded}>
      <div className="container">
      <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
          <img src="/images/logo.png" alt="SABESP" style={{ width: '50px', marginRight: '10px' }} /> {/* Substituir o texto "SABESP" pela imagem */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : true)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Cadastro" id="cadastro-nav-dropdown">
              <NavDropdown.Item as={Link} to="/usuarios" onClick={() => setExpanded(false)}>Usuários</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/cadastro/empresas" onClick={() => setExpanded(false)}>Empresas</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Solicitações" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/fechamento" onClick={() => setExpanded(false)}>Fechamento</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/pesquisa" onClick={() => setExpanded(false)}>Pesquisa</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/verificacao-de-fechamento" onClick={() => setExpanded(false)}>Verificação de Fechamento</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/geofonamento" onClick={() => setExpanded(false)}>Geofonamento</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/servicos" onClick={() => setExpanded(false)}>Serviços em Andamento</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Header;

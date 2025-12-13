import React from "react";
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar(){
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                Indicadores
                </Link>
                <ul className="navbar-menu">
                <li className="navbar-item">
                    <Link to="/" className="navbar-link">
                    Home
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link to="/comparacao" className="navbar-link">
                    Comparar
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link to="/cadastro" className="navbar-link">
                    Cadastrar
                    </Link>
                </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Comparacao from './pages/Comparacao';
import Cadastro from './pages/Cadastro';
import Detalhes from './pages/Detalhe';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/comparacao' element={<Comparacao/>}/>
          <Route path='/cadastro' element={<Cadastro/>}/>
          <Route path='/detalhes/:id' element={<Detalhes/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

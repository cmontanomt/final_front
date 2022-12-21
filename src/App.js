import { Component } from "react";

import Menu from './components/Menu'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageLogin from "./components/PageLogin";
import PageIndex from "./components/PageIndex";
import PageUsuarios from "./components/PageUsuarios";
import PageDeportes from "./components/PageDeportes";
import PageEquipos from "./components/PageEquipos";
import PageMarcadores from "./components/PageMarcadores";

class App extends Component {
  render() {
    return (
      <Router>
        <Menu />
        <Routes>
          <Route path='/' element={<PageIndex />} />
          <Route path='/index.html' element={<PageIndex />} />
          <Route path='/users.html' element={<PageUsuarios />} />
          <Route path='/deportes.html' element={<PageDeportes />} />
          <Route path='/equipos.html' element={<PageEquipos />} />
          <Route path='/marcadores.html' element={<PageMarcadores />} />
          <Route path='/login.html' element={<PageLogin />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
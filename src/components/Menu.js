import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/js/dist/collapse'
import 'bootstrap/js/dist/offcanvas'
import 'bootstrap/js/dist/dropdown'
import { Link } from 'react-router-dom'

import Cookies from 'universal-cookie'
const cookies = new Cookies();


class Menu extends Component {

    state = {
        isLogged: false,
        isAdmin: false
    }

    componentDidMount() {
        if (cookies.get("usu_rol")) {
            this.setState({ isLogged: true })
            if(cookies.get("usu_rol")==="admin") this.setState({isAdmin:true})
            else this.setState({isAdmin:false})
        } else {
            this.setState({ isLogged: false })
            // window.location.href="./" /// redirigir al inicio
        }
    }

    cerrarSesion() {
        cookies.remove("usu_id", { path: "/" })
        cookies.remove("usu_email", { path: "/" })
        cookies.remove("usu_nombres", { path: "/" })
        cookies.remove("usu_apellidos", { path: "/" })
        cookies.remove("usu_rol", { path: "/" })
        window.location.href = "./index.html"
        this.setState({ estaLoguin: false })
    }

    render() {
        return (
            <div className="hero_area">
                
                <header className="header_section">
                    <div className="container-fluid">
                        <nav className="navbar navbar-expand-lg custom_nav-container ">
                            <a className="navbar-brand" href="index.html">
                                <img src='../images/world-cup.png' width="20"/>
                            </a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <div className="d-flex ml-auto flex-column flex-lg-row align-items-center">
                                    <ul className="navbar-nav  ">
                                        <li className="nav-item ">
                                            <Link className="nav-link" to="index.html">Home </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="users.html" hidden={!this.state.isAdmin}>Usuarios </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="deportes.html" hidden={!this.state.isLogged}>Deportes</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="equipos.html" hidden={!this.state.isLogged}>Equipos</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="marcadores.html" hidden={!this.state.isLogged}>Marcadores</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="index.html" onClick={()=>this.cerrarSesion()} hidden={!this.state.isLogged}>Logout</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="login.html" hidden={this.state.isLogged}>Login</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </header>
                
            </div>
        );
    }
}
export default Menu;
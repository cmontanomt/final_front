import React, { Component } from 'react'
import axios from "axios";//
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import "bootstrap/dist/css/bootstrap.min.css";//
import { toHaveAccessibleDescription } from '@testing-library/jest-dom/dist/matchers';

var urlEventos

class PageIndex extends Component {

    state = {
        data: [],
        form: {
            dep_nombre:'all'
        },
        data_deportes:[]
    }


    peticionGet = () => {
        if (this.state.form.dep_nombre==="all") urlEventos = 'http://localhost:9000/api/eventos/10'
        else urlEventos= 'http://localhost:9000/api/eventos/'+this.state.form.dep_nombre+'/5'
        axios.get(urlEventos).then(response => {
            //console.log(response.data);
            this.setState({ data: response.data })
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionGetDeportes = () => {
        let url = 'http://localhost:9000/api/deportes'
        axios.get(url).then(response => {
            //console.log(response.data);
            //data_deportes = response.data
            this.setState({ data_deportes: response.data })
        }).catch(error => {
            console.log(error.message);
        })
    }

    handleChange = async e => {  /// función para capturar los datos del usuario. Es en 2do plano debe ser asincrona
        e.persist();           /// y por eso debemos especificar persistencia
        await this.setState({   /// await regresa la ejecución de la función asincrona despues de terminar
            form: {
                ...this.state.form, /// esta linea sirve para conservar los datos que ya tenia el arreglo
                [e.target.name]: e.target.value  /// los nombres de los imputs deben ser iguales a los del arreglo
            }
        });
        console.log(this.state.form);  /// probar por consola lo que se guarda
    }

    componentDidMount() {
        this.peticionGet()
        this.peticionGetDeportes()
    }


    render() {
        return (
            <section className="contact_section" >
                <div className="contact_container">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 mx-auto">
                                <div className="contact_form layout_padding">
                                    <div className="heading_container heading_center">
                                        <h2>
                                            Ultimos eventos
                                        </h2>
                                    </div>
                                    <div className="App ">
                                        <div className="d-grid gap-2 col-6 mx-auto">
                                            <select className="form-select" type="text" name="dep_nombre" id="dep_nombre" onChange={this.handleChange}>
                                                <option className="dropdown-item" value={"all"} >Todos</option>
                                                {this.state.data_deportes.map(registro => {
                                                    return <option className="dropdown-item" value={registro.dep_nombre}>{registro.dep_nombre}</option>
                                                })}
                                            </select>
                                            <button className="btn btn-primary" onClick={this.peticionGet}>Buscar <FontAwesomeIcon icon={faSearch} ></FontAwesomeIcon></button>  
                                        </div>
                                        <br />
                                        <table className="table " style={{ "textAlign": "center" }}>
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Fecha</th>
                                                    <th></th>
                                                    <th>Equipo1</th>
                                                    <th></th>
                                                    <th>Equipo2</th>
                                                    <th>Deporte</th>
                                                    <th>Descripción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-light">
                                                {this.state.data.map(evento => {
                                                    return (
                                                        <tr key={evento.sec}>
                                                            <td>{evento.fecha}</td>
                                                            <td><img src={evento.equi1_logo !== null ? evento.equi1_logo : '../images/sports.png'} width={30} height={30}/></td>
                                                            <td>{evento.equi1 + ": " + evento.marca1}</td>
                                                            <td><img src={evento.equi2_logo !== null ? evento.equi2_logo : '../images/sports.png'} width={30} height={30}/></td>
                                                            <td>{evento.equi2 + ": " + evento.marca2}</td>
                                                            <td>{evento.deporte}</td>
                                                            <td>{evento.descrip}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                        <br /><br />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default PageIndex
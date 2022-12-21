import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import React, { Component } from 'react';
import Cookies from 'universal-cookie'
const cookies = new Cookies();

const url = 'http://localhost:9000/api/equipos'
const field_id = '/equi_id/'

class PageEquipos extends Component {

    state = {
        data: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        form: {
            equi_id: '',
            equi_nombre: '',
            equi_logo:''
        },
        isLogged: false,
        isAdmin: false
    }

    peticionGet = () => {
        axios.get(url).then(response => {
            //console.log(response.data);
            this.setState({ data: response.data })
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPost = async () => {
        delete this.state.form.equi_id //esto borra el campo usu_id
        await axios.post(url, this.state.form).then(response => {
            console.log(response);
            this.modalInsertar()
            this.peticionGet()
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPut = () => {
        axios.put(url + field_id + this.state.form.equi_id, this.state.form).then(response => {
            this.modalInsertar()
            this.peticionGet()
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionDelete = () => {
        axios.delete(url + field_id + this.state.form.equi_id).then(response => {
            this.modalEliminar()
            this.peticionGet()
        }).catch(error => {
            console.log(error.message);
        })
    }

    seleccionar = (registro) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                equi_id: registro.equi_id,
                equi_nombre: registro.equi_nombre,
                equi_logo: registro.equi_logo
            }
        })
    }

    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar })
    }

    modalEliminar = () => {
        this.setState({ modalEliminar: !this.state.modalEliminar })
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

    //se ejecuta cuando lo realiza
    componentDidMount() {
        if (cookies.get("usu_rol")) {
            this.setState({ isLogged: true })
            if(cookies.get("usu_rol")==="admin") this.setState({isAdmin:true})
            else this.setState({isAdmin:false})
        } else {
            this.setState({ isLogged: false })
            window.location.href="/login.html" /// redirigir al inicio
        }
        this.peticionGet();
    }

    render() {

        const form = this.state.form

        return (
            <section className="contact_section2 contact_section">
                <div className="contact_container">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 mx-auto">
                                <div className="contact_form layout_padding">
                                    <div className="heading_container heading_center">
                                        <h2>
                                            Equipos
                                        </h2>
                                    </div>

                                    <div className="App">
                                        <div className="d-grid gap-2 col-6 mx-auto">
                                            <button className="btn btn-success"  onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }} >Agregar Equipo</button>
                                        </div>
                                        <br />
                                        <table className="table " style={{"textAlign":"center"}}>
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Equipo</th>
                                                    <th>Logo</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-light">
                                                {this.state.data.map(registro => {
                                                    return (
                                                        <tr>
                                                            <td>{registro.equi_id}</td>
                                                            <td>{registro.equi_nombre}</td>
                                                            <td><img src={registro.equi_logo !== null ? registro.equi_logo : '../images/sports.png'} width={40} height={40}/></td>
                                                            <td><button className="btn btn-primary"><FontAwesomeIcon icon={faEdit} onClick={() => { this.seleccionar(registro); this.modalInsertar() }} /></button>
                                                                {" "}
                                                                <button className="btn btn-danger" hidden={!this.state.isAdmin}><FontAwesomeIcon icon={faTrashAlt} onClick={() => { this.seleccionar(registro); this.modalEliminar() }} /></button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                        <br /><br />

                                        <Modal isOpen={this.state.modalInsertar}>
                                            <ModalHeader style={{ display: 'block' }}>
                                            </ModalHeader>
                                            <ModalBody>
                                                <div>
                                                    <label htmlFor="equi_id" hidden={this.state.tipoModal === 'insertar' ? true : false}>ID</label>
                                                    <input className="form-control" type="text" name="equi_id" id="equi_id" readOnly onChange={this.handleChange} value={form ? form.equi_id : this.state.data.length + 1} hidden={this.state.tipoModal === 'insertar' ? true : false}></input>
                                                    <br hidden={this.state.tipoModal === 'insertar' ? true : false} />
                                                    <label htmlFor="equi_nombre">Equipo</label>
                                                    <input className="form-control" type="text" name="equi_nombre" id="equi_nombre" onChange={this.handleChange} value={form ? form.equi_nombre : ''}></input>
                                                    <br />
                                                    <label htmlFor="equi_nombre">Logo</label>
                                                    <input className="form-control" type="text" name="equi_logo" id="equi_logo" onChange={this.handleChange} value={form ? form.equi_logo : ''}></input>
                                                    <br />
                                                </div>
                                            </ModalBody>
                                            <ModalFooter>
                                                {
                                                    this.state.tipoModal === 'insertar' ?
                                                        <button className="btn btn-success" onClick={() => this.peticionPost()}>Insertar</button>
                                                        :
                                                        <button className="btn btn-success" onClick={() => this.peticionPut()}>Modificar</button>
                                                }
                                                <button className="btn btn-danger" onClick={() => this.modalInsertar()} >Cancelar</button>
                                            </ModalFooter>
                                        </Modal>

                                        <Modal isOpen={this.state.modalEliminar}>
                                            <ModalBody>
                                                ¿Estas seguro que deseas eliminar?
                                            </ModalBody>
                                            <ModalFooter>
                                                <button className="btn btn-danger" onClick={() => this.peticionDelete()} >Si</button>
                                                <button className="btn btn-success" onClick={() => this.modalEliminar()} >No</button>
                                            </ModalFooter>
                                        </Modal>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        )
    }
}

export default PageEquipos;

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import React, { Component } from 'react';
import Cookies from 'universal-cookie'
const cookies = new Cookies();

var url_base = "http://150.230.185.202:9000"
const url = url_base + '/api/marcadores'
const field_id = '/mar_id/'

var data_equipos=[]
var data_deportes=[]

function findEquipo(id){
    let index = data_equipos.map(function(e) { return e.equi_id; }).indexOf(id);
    let equipo = data_equipos[index].equi_nombre;
    return equipo;
}

function findDeporte(id){
    let index = data_deportes.map(function(e) { return e.dep_id; }).indexOf(id);
    let deporte = data_deportes[index].dep_nombre;
    return deporte;
}

class PageMarcadores extends Component {

    state = {
        data: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        form: {
            mar_id: '',
            mar_fechaevento: '',
            mar_horaevento: '',
            mar_fecharegistro: '',
            mar_horaregistro: '',
            equi_id1: '',
            equi_id2: '',
            mar_marcadorequi1: '',
            mar_marcadorequi2: '',
            dep_id: '',
            usu_id: '',
            mar_descrip: ''
        },
        data_deportes:[],
        data_equipos:[],
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
    
    peticionGetDeportes = () => {
        let url = url_base + '/api/deportes'
        axios.get(url).then(response => {
            //console.log(response.data);
            data_deportes = response.data
            this.setState({ data_deportes: response.data })
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionGetEquipos = () => {
        let url = url_base + '/api/equipos'
        axios.get(url).then(response => {
            //console.log(response.data);
            data_equipos = response.data
            this.setState({ data_equipos: response.data })
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPost = async () => {
        delete this.state.form.mar_id //esto borra el campo usu_id
        await axios.post(url, this.state.form).then(response => {
            console.log(response);
            this.modalInsertar()
            this.peticionGet()
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPut = () => {
        axios.put(url + field_id + this.state.form.mar_id, this.state.form).then(response => {
            //console.log(response);
            this.modalInsertar()
            this.peticionGet()
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionDelete = () => {
        axios.delete(url + field_id + this.state.form.mar_id).then(response => {
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
                mar_id: registro.mar_id,
                mar_fechaevento: registro.mar_fechaevento,
                mar_horaevento: registro.mar_horaevento,
                mar_fecharegistro: registro.mar_fecharegistro,
                mar_horaregistro: registro.mar_horaregistro,
                equi_id1: registro.equi_id1,
                equi_id2: registro.equi_id2,
                mar_marcadorequi1: registro.mar_marcadorequi1,
                mar_marcadorequi2: registro.mar_marcadorequi2,
                dep_id: registro.dep_id,
                usu_id: registro.usu_id,
                mar_descrip: registro.mar_descrip
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
        this.peticionGetDeportes();
        this.peticionGetEquipos();
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
                                            Marcadores
                                        </h2>
                                    </div>

                                    <div className="App ">
                                        <div className="d-grid gap-2 col-6 mx-auto">
                                            <button className="btn btn-success" onClick={() => { this.setState({ form: {dep_id:1,equi_id1:1,equi_id2:1, mar_fecharegistro:new Date().toJSON().slice(0, 10),mar_horaregistro: new Date().setHours(new Date().getHours() - 5).toJSON().slice(11,16),usu_id: cookies.get("usu_id")}, tipoModal: 'insertar' }); this.modalInsertar(); }} >Agregar Marcador</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <table className="table " style={{ "textAlign": "center" }}>
                                    <thead className="table-dark">
                                        <tr>
                                            <th hidden={true}>ID</th>
                                            <th>Fecha del Evento</th>
                                            <th>Hora del Evento</th>
                                            <th hidden={!this.state.isAdmin}>Fecha de Registro</th>
                                            <th hidden={!this.state.isAdmin}>Hora de Registro</th>
                                            <th>Equipo 1</th>
                                            <th>Equipo 2</th>
                                            <th>Deporte</th>
                                            <th hidden={!this.state.isAdmin}>IDUsuario</th>
                                            <th>Descripción</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-light">
                                        {this.state.data.map(registro => {
                                            return (
                                                <tr>
                                                    <td hidden={true}>{registro.mar_id}</td>
                                                    <td>{registro.mar_fechaevento}</td>
                                                    <td>{registro.mar_horaevento}</td>
                                                    <td hidden={!this.state.isAdmin}>{registro.mar_fecharegistro}</td>
                                                    <td hidden={!this.state.isAdmin}>{registro.mar_horaregistro}</td>
                                                    <td>{findEquipo(Number(registro.equi_id1)) +": "+registro.mar_marcadorequi1}</td>
                                                    <td>{findEquipo(Number(registro.equi_id2)) +": "+registro.mar_marcadorequi2}</td>
                                                    <td>{findDeporte(Number(registro.dep_id))}</td>
                                                    <td hidden={!this.state.isAdmin}>{registro.usu_id}</td>
                                                    <td>{registro.mar_descrip}</td>
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

                                <Modal isOpen={this.state.modalInsertar} >
                                    <ModalHeader style={{ display: 'block' }}>
                                    </ModalHeader>
                                    <ModalBody>
                                        <div>
                                            <label htmlFor="mar_id" hidden={this.state.tipoModal === 'insertar' ? true : false}>ID</label>
                                            <input className="form-control" type="text" name="mar_id" id="mar_id" readOnly onChange={this.handleChange} value={this.state.tipoModal === 'insertar' ? this.state.data.length + 1 : form.mar_id} hidden={this.state.tipoModal === 'insertar' ? true : false}></input>
                                            <br hidden={this.state.tipoModal === 'insertar' ? true : false} />
                                            <label htmlFor="mar_fechaevento">Fecha del Evento</label>
                                            <input className="date form-control" type="date" name="mar_fechaevento" id="mar_fechaevento" onChange={this.handleChange} value={form ? form.mar_fechaevento : ''}></input>
                                            <br />
                                            <label htmlFor="mar_horaevento">Hora del Evento</label>
                                            <input className="form-control" type="time" name="mar_horaevento" id="mar_horaevento" onChange={this.handleChange}  value={form ? form.mar_horaevento : ''}></input>
                                            <br />
                                            <label htmlFor="mar_fecharegistro" hidden={true}>Fecha de Registro</label>
                                            <input className="form-control" type="date" name="mar_fecharegistro" hidden={true} id="mar_fecharegistro" onChange={this.handleChange} value={form ? form.mar_fecharegistro : ''}></input>
                                            <br hidden={true} />
                                            <label htmlFor="mar_horaregistro" hidden={true}>Hora de Registro</label>
                                            <input className="form-control" type="time" name="mar_horaregistro" hidden={true} id="mar_horaregistro" onChange={this.handleChange} value={form ? form.mar_horaregistro : ''}></input>
                                            <br hidden={true} />
                                            <label htmlFor="equi_id1">Equipo 1</label>
                                            <select className="form-select" type="text" name="equi_id1" id="equi_id1" onChange={this.handleChange} value={form ? form.equi_id1 : ''}>
                                                {this.state.data_equipos.map(registro => {
                                                    return <option className="dropdown-item" value={registro.equi_id}>{registro.equi_nombre}</option>})}
                                            </select>
                                            <br />
                                            <label htmlFor="mar_marcadorequi1">Marcador Equipo 1</label>
                                            <input className="form-control" type="text" name="mar_marcadorequi1" id="mar_marcadorequi1" onChange={this.handleChange} value={form ? form.mar_marcadorequi1 : ''}></input>
                                            <br />
                                            <label htmlFor="equi_id2">Equipo 2</label>
                                            <select className="form-select" type="text" name="equi_id2" id="equi_id2" onChange={this.handleChange} value={form ? form.equi_id2 : ''}>
                                                {this.state.data_equipos.map(registro => {
                                                    return <option className="dropdown-item" value={registro.equi_id}>{registro.equi_nombre}</option>})}
                                            </select><br />
                                            <label htmlFor="mar_marcadorequi2">Marcador Equipo 2</label>
                                            <input className="form-control" type="text" name="mar_marcadorequi2" id="mar_marcadorequi2" onChange={this.handleChange} value={form ? form.mar_marcadorequi2 : ''}></input>
                                            <br />
                                            <label htmlFor="dep_id">Deporte</label>
                                            <select className="form-select" type="text" name="dep_id" id="dep_id" onChange={this.handleChange} value={form ? form.dep_id : ''}>
                                                {this.state.data_deportes.map(registro => {
                                                    return <option className="dropdown-item" value={registro.dep_id}>{registro.dep_nombre}</option>})}
                                            </select>
                                            <br />
                                            <label htmlFor="usu_id" hidden={true}>Usuario</label>
                                            <input className="form-control" type="text" name="usu_id" hidden={true} id="usu_id" onChange={this.handleChange} value={form ? form.usu_id : ''}></input>
                                            <br hidden={true} />
                                            <label htmlFor="mar_descrip">Descripción</label>
                                            <input className="form-control" type="text" name="mar_descrip" id="mar_descrip" onChange={this.handleChange} value={form ? form.mar_descrip : ''}></input>
                                            <br />
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        {
                                            this.state.tipoModal === 'insertar' ?
                                                <button className="btn btn-success" onClick={() => {this.peticionPost()}}>Insertar</button>
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

            </section>

        )
    }
}

export default PageMarcadores;

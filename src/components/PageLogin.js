import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios'
import Cookies from 'universal-cookie'

var url_base = "http://150.230.185.202:9000"
const urlLogin = url_base + '/api/usuarios'

const cookies = new Cookies();


class PageLogin extends Component {
    state = {
        form: {
            username: '',
            password: '',
            usu_rol:'user',
            modalInsertar: false
        }

    }

    handleChange = async e => {
        await this.setState({
            form: {
                ...this.state.form, //conservar los datos
                [e.target.name]: e.target.value
            }
        })
        console.log(this.state.form)
    }

    iniciarSesion = async () => {
        let name = this.state.form.username
        let pwd = this.state.form.password
        console.log(name);
        if (name.length <= 0 || pwd.length <= 0) {
            alert('Se requieren todos los datos')
            return "Datos Vacios"
        }

        await axios.get(urlLogin + "/" + name + "/" + pwd)
            .then(response => {
                console.log(response.data)
                return response.data
            }).then(response => {
                if (response.length > 0) {
                    var resp = response[0] // para evitar llamados tan largos con corchetes
                    cookies.set("usu_id", resp.usu_id, { path: "/" })/// el path es para que se puedan acceder de cualquier pagina
                    cookies.set("usu_email", resp.usu_email, { path: "/" })
                    cookies.set("usu_nombres", resp.usu_nombres, { path: "/" })
                    cookies.set("usu_apellidos", resp.usu_apellidos, { path: "/" })
                    cookies.set("usu_rol", resp.usu_rol, { path: "/" })
                    alert("Bienveni@ " + resp.usu_nombres)
                    window.location.href = './'
                } else {
                    alert("Verificar Usario y/o Clave")
                }
            })
            .catch(error => {
                console.log(error)
            })

    }

    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar })
    }

    peticionPost = async () => {
        const url = 'http://localhost:9000/api/usuarios'
        await axios.post(url, this.state.form).then(response => {
            this.modalInsertar()
            alert('Usuario registrado')
        }).catch(error => {
            console.log(error.message);
        })
    }


    render() {
        const form = this.state.form

        return (
            <section className=" slider_section position-relative">
                <div className="container-fluid h-100">
                    <div className="row">
                        <div className="col-md-5 col-xl-4 offset-xl-1 ">
                            <div className="detail-box">
                                <h1>
                                    Login <br />
                                </h1>
                                <p>
                                    Ingrese los datos de usuario:
                                </p>

                                <div>
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Email address</label>
                                            <input type="email" className="form-control" name="username" onChange={this.handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Password</label>
                                            <input type="password" className="form-control" name="password" onChange={this.handleChange} />
                                        </div>
                                    </form>
                                </div>

                                <div className="btn-box">
                                    <a className="btn-1" onClick={() => this.iniciarSesion()}>
                                        Ingresar
                                    </a>
                                    <a className="btn-2" onClick={() => {this.setState({ form: {usu_rol:"user"}, tipoModal: 'insertar' }); this.modalInsertar() }}>
                                        Registrarse
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <Modal isOpen={this.state.modalInsertar}>
                                            <ModalHeader style={{ display: 'block' }}>
                                            </ModalHeader>
                                            <ModalBody>
                                                <div>
                                                    <label htmlFor="usu_email">Email</label>
                                                    <input className="form-control" type="email" name="usu_email" id="usu_email" onChange={this.handleChange}></input>
                                                    <br />
                                                    <label htmlFor="usu_clave">Clave</label>
                                                    <input className="form-control" type="password" name="usu_clave" id="usu_clave" onChange={this.handleChange}></input>
                                                    <br />
                                                    <label htmlFor="usu_nombres">Nombres</label>
                                                    <input className="form-control" type="text" name="usu_nombres" id="usu_nombres" onChange={this.handleChange}></input>
                                                    <br />
                                                    <label htmlFor="usu_apellidos">Apellidos</label>
                                                    <input className="form-control" type="text" name="usu_apellidos" id="usu_apellidos" onChange={this.handleChange}></input>
                                                </div>
                                            </ModalBody>
                                            <ModalFooter>
                                                <button className="btn btn-success" onClick={() => this.peticionPost()}>Registrarse</button>
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

                        <div className="col-md-7 px-0 h-100">
                            <div className="img_container h-100">
                                <div id="carouselExampleIndicators" className="carousel slide carousel-fade" data-ride="carousel">
                                    <div className="carousel-inner">
                                        <div className="carousel-item active">
                                            <div className="img-box">
                                                <img src="images/slider-img2.jpg" alt="" />
                                            </div>
                                        </div>
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

export default PageLogin
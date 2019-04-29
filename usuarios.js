import {
    Card,
    Container,
    Content,
    Icon,
    Text,
    Thumbnail,
    View,
} from "native-base";
import React, { Component } from "react";
import {
    AsyncStorage,
    Image,
    Modal,
    NetInfo,
    Platform,
    TouchableOpacity,
    BackHandler,
    SafeAreaView,
    FlatList,
} from "react-native";
import { ifIphoneX } from "react-native-iphone-x-helper";
import UserInactivity from "react-native-user-inactivity";
// libreria iconos personalizados
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import { NavigationEvents } from "react-navigation";
import icoMoonConfig from "../../../../selection.json";
import FooterCancel from "../../../helpers/components/FooterCancel.js";
import Loading from "../../../helpers/components/Loading";
import * as StringConstants from "../../../helpers/constants";
import {
    limpiarCaracteres,
    verificarPermisoVista,
} from "../../../helpers/helpers";
import { obtenerVariableSesion } from "../../../helpers/util";
import styles from "../../globalStyles";
import { consultarContratos } from "../directorio/controllers/main_controllers";
import ModalAdvertenciaInternet from "../modales/advertenciaInternet";
import ModalError from "../modales/error";
import ModalInformacion from "../modales/informacion";
import { consultarFotosUsuario } from "./controllers/main_controllers";
import {
    asignarUrlPhotosAUsuarios,
    calculoAnios,
    limpiarNombre,
    mapearIdentificacionUsuarios,
    mapearUsuariosConUrlPhoto,
    obtenerParentesco,
    permisoContrato,
} from "./helpers";
import AutorizacionesModel from "./model.js";
import page from "./styles";
import ModalGeneral from "../../../helpers/components/ModalGeneral.js";
import HeaderGeneral from "../../../helpers/components/HeaderGeneral.js";

const Linericon = createIconSetFromIcoMoon(
    icoMoonConfig,
    "icomoon",
    "icomoon.ttf"
);

export default class UsuariosAutorizaciones extends Component {
    state = {
        listaBenefic: [],
        userSel: 0,
        loadingVisible: true,
        beneficiariosVisibles: [],
        msgErrorModal: StringConstants.MSG_SERVICE_ERROR_BODY,
        titError: StringConstants.MSG_SERVICE_ERROR_TITLE,
        modalErrorVer: false,
        modeUsuario: "",
        offModulo: "",
        persona: [],
        beneficiario: [],
        contratos: [],
        modalVisibleError: false,
        modalVisibleErrorInternet: false,
        totalAceptados: 1,
        isConnected: null,
        blurSreen: false,
        icono: "",
        titulo: "",
        cuerpo: "",
        textoBtn: "",
        tipo: "danger",
        onPressBtn: () => {
            console.log("onPressBtn");
        },
        onPressClose: () => {
            console.log("onPressClose");
        },
        onGoBack: () => {
            console.log("onGoBack");
        },
        showModal: false,
    };

    AutorizacionesModel = new AutorizacionesModel();

    constructor(props) {
        super(props);
        /* setTimeout(()=>{
            this.inciar();
        },3000); */
        this.triggerModalError = this.triggerModalError.bind(this);
        this.triggerModalError2 = this.triggerModalError2.bind(this);
    }

    openModal = (
        icono,
        titulo,
        cuerpo,
        textoBtn,
        tipo,
        onPressBtn,
        onPressClose,
        onGoBack
    ) => {
        console.log("llama modal");
        this.setState({
            icono: icono,
            titulo: titulo,
            cuerpo: cuerpo,
            textoBtn: textoBtn,
            tipo: tipo,
            onPressBtn: onPressBtn,
            onPressClose: onPressClose,
            onGoBack: onGoBack,
            showModal: true,
            loadingVisible: false,
        });
    };

    initConfig = () => {
        obtenerVariableSesion(StringConstants.KEY_TIPO_DOCUMENTO).then(
            tipo_id => {
                obtenerVariableSesion(StringConstants.KEY_IDENTIFICACION).then(
                    num_id => {
                        obtenerVariableSesion(
                            StringConstants.KEY_NUM_CONTRATO
                        ).then(numContrato => {
                            this.setState({
                                user_data: {
                                    tipo_id: tipo_id,
                                    num_id: num_id,
                                },
                                numContrato: numContrato,
                            });
                            if (this.state.isConnected) {
                                this.AutorizacionesModel.siEsBeneficiario()
                                    .then(data => {
                                        if (
                                            data.errorDetalle.errorCode !== "OK"
                                        ) {
                                            this.AutorizacionesModel.consultarBeneficiario()
                                                .then(data2 => {
                                                    var contratos =
                                                        data2.contrato;
                                                    for (let infoCont of contratos) {
                                                        var infobene =
                                                            infoCont.informacionBeneficiarios;
                                                        if (
                                                            infobene.numIdentificacionBeneficiario ==
                                                                this.state
                                                                    .user_data
                                                                    .num_id &&
                                                            infobene.tipoIdentificacionBeneficiario ==
                                                                this.state
                                                                    .user_data
                                                                    .tipo_id
                                                        ) {
                                                            // Es beneficiario

                                                            let objSend = {};
                                                            let info =
                                                                infobene.informacionBeneficiarios;
                                                            objSend.caratula =
                                                                infobene.informacionBasicaContrato;
                                                            objSend.titularFamilia =
                                                                infobene.informacionBasicaContrato;
                                                            this.setState({
                                                                infoContrato: objSend,
                                                            });
                                                            this.setState({
                                                                modeUsuario:
                                                                    "Beneficiario",
                                                            });
                                                            this.seleccionarUsuario(
                                                                infobene
                                                            );
                                                            break;
                                                        } else {
                                                            // Es titular
                                                            consultarContratos(
                                                                tipo_id,
                                                                num_id,
                                                                this.contratosResponse.bind(
                                                                    this
                                                                )
                                                            );
                                                        }
                                                    }
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                    /* this.setState({
                                                        titError:
                                                            StringConstants.MSG_SERVICE_ERROR_TITLE,
                                                        msgErrorModal:
                                                            StringConstants.MSG_SERVICE_ERROR_BODY,
                                                        modalErrorVer: !this
                                                            .state
                                                            .modalErrorVer,
                                                    }); */
                                                    this.openModal(
                                                        "close",
                                                        StringConstants.MSG_SERVICE_ERROR_TITLE,
                                                        StringConstants.MSG_SERVICE_ERROR_BODY,
                                                        "Cerrar",
                                                        "error",
                                                        () => {
                                                            //this.irVista("MisDatos");
                                                            this.setState({
                                                                showModal: false,
                                                            });
                                                        },
                                                        () => {
                                                            //this.irVista("MisDatos");
                                                            this.setState({
                                                                showModal: false,
                                                            });
                                                        },
                                                        () => {
                                                            //this.irVista("MisDatos");
                                                            this.setState({
                                                                showModal: false,
                                                            });
                                                        }
                                                    );
                                                });
                                        } else {
                                            consultarContratos(
                                                tipo_id,
                                                num_id,
                                                this.contratosResponse.bind(
                                                    this
                                                )
                                            );
                                        }
                                    })
                                    .catch(err => {
                                        console.log(
                                            "!!! SERA QUE ES ESTE ???? ",
                                            err
                                        );
                                        /*this.setState({
                                            titError:
                                                StringConstants.MSG_SERVICE_ERROR_TITLE,
                                            msgErrorModal:
                                                StringConstants.MSG_SERVICE_ERROR_BODY,
                                            modalErrorVer: !this.state
                                                .modalErrorVer,
                                        });*/
                                        //this.triggerModalError2();
                                        this.openModal(
                                            "close",
                                            StringConstants.MSG_SERVICE_ERROR_TITLE,
                                            StringConstants.MSG_SERVICE_ERROR_BODY,
                                            "Cerrar",
                                            "error",
                                            () => {
                                                this.irVista(
                                                    "InicioAutorizaciones"
                                                );
                                                this.setState({
                                                    showModal: false,
                                                });
                                            },
                                            () => {
                                                this.irVista(
                                                    "InicioAutorizaciones"
                                                );
                                                this.setState({
                                                    showModal: false,
                                                });
                                            },
                                            () => {
                                                this.irVista(
                                                    "InicioAutorizaciones"
                                                );
                                                this.setState({
                                                    showModal: false,
                                                });
                                            }
                                        );
                                    });
                            } else {
                                this.setState({ loadingVisible: false });
                                /* this.setState({
                                    textoTituloModal: "Sin conexión a internet",
                                });
                                this.setState({
                                    textoErrorModal:
                                        "No es posible conectarse a internet, por favor verifica tu conexión",
                                });
                                this.setState({
                                    modalVisibleErrorInternet: !this.state
                                        .modalVisibleErrorInternet,
                                }); */

                                this.openModal(
                                    "outline-report_problem-24px",
                                    StringConstants.MSG_NO_INTERNET_CONNECTION_TITLE,
                                    StringConstants.MSG_NO_INTERNET_CONNECTION_BODY,
                                    "Cerrar",
                                    "warning",
                                    () => {
                                        this.irVista("Home");
                                        this.setState({
                                            showModal: false,
                                        });
                                    },
                                    () => {
                                        this.irVista("Home");
                                        this.setState({
                                            showModal: false,
                                        });
                                    },
                                    () => {
                                        this.irVista("Home");
                                        this.setState({
                                            showModal: false,
                                        });
                                    }
                                );
                            }
                        });
                    }
                );
            }
        );
    };

    contratosResponse = data => {
        console.log("!!!! DATO DE CONTRATOS !!!", data);
        if (data == "ERROR") {
            console.log("!!! DEBERÍA SALIR LA MODAL !!!");
            //this.triggerModalError2();
            this.openModal(
                "close",
                StringConstants.MSG_SERVICE_ERROR_TITLE,
                StringConstants.MSG_SERVICE_ERROR_BODY,
                "Cerrar",
                "error",
                () => {
                    this.irVista("InicioAutorizaciones");
                    this.setState({
                        showModal: false,
                    });
                },
                () => {
                    this.irVista("InicioAutorizaciones");
                    this.setState({
                        showModal: false,
                    });
                },
                () => {
                    this.irVista("InicioAutorizaciones");
                    this.setState({
                        showModal: false,
                    });
                }
            );
        } else {
            // Filtrar el contrato con el contrato seleccionado
            var contrato_actual = data.contratos.filter(contrato => {
                if (contrato.caratula.numContrato == this.state.numContrato) {
                    return contrato;
                }
            });
            this.setState({ contrato_actual: contrato_actual });
            var listBen =
                contrato_actual[0].titularFamilia.informacionBeneficiarios;
            let index = listBen.findIndex(
                usuarioIn => usuarioIn.tipoUsuario == "TITULAR"
            );
            let removed = listBen.splice(index, 1);
            listBen.splice(0, 0, removed[0]);

            if (listBen.length == 0) {
                this.consultarBeneficiario();
            } else {
                this.cargarBeneficiarios();
            }
        }
    };

    onAction = active => {
        console.log("Venció sesión");
        console.log(active);
        this.setState({
            active,
        });
        console.log(this.state.blurSreen);
        if (!active && !this.state.blurSreen) {
            this.setState({ modalErrorVer: false });
            this.setState({ modalVisibleError: false });
            this.setState({ modalVisibleErrorInternet: false });
            this.props.navigation.navigate("Inactividad");
        } else {
            console.log("action si");
        }
    };

    inciar() {
        if (this.state.isConnected) {
            this.triggerModalError = this.triggerModalError.bind(this);
            this.AutorizacionesModel.contratosUsuario()
                .then(data => {
                    // Tiene contratos
                    if (data.errorDetalle.errorCode == "OK") {
                        let listBen = [];
                        listBen =
                            data.contratos[0].titularFamilia
                                .informacionBeneficiarios;

                        if (listBen.length == 0) {
                            this.consultarBeneficiario();
                        } else {
                            this.setState({ modeUsuario: "Titular" });
                            this.cargarBeneficiarios();
                        }
                    } else {
                        // COMO BENEFICIARIO
                        this.consultarBeneficiario();
                    }
                })
                .catch(err => {
                    console.log(err);
                    /* this.setState({
                        titError: StringConstants.MSG_SERVICE_ERROR_TITLE,
                        msgErrorModal: StringConstants.MSG_SERVICE_ERROR_BODY,
                        modalErrorVer: !this.state.modalErrorVer,
                    }); */
                    this.openModal(
                        "close",
                        StringConstants.MSG_SERVICE_ERROR_TITLE,
                        StringConstants.MSG_SERVICE_ERROR_BODY,
                        "Cerrar",
                        "error",
                        () => {
                            //this.irVista("MisDatos");
                            this.setState({
                                showModal: false,
                            });
                        },
                        () => {
                            //this.irVista("MisDatos");
                            this.setState({
                                showModal: false,
                            });
                        },
                        () => {
                            //this.irVista("MisDatos");
                            this.setState({
                                showModal: false,
                            });
                        }
                    );
                });
            // this.cargarBeneficiarios();
        } else {
            this.setState({ loadingVisible: false });
            /*   this.setState({ textoTituloModal: "Sin conexión a internet" });
            this.setState({
                textoErrorModal:
                    "No es posible conectarse a internet, por favor verifica tu conexión",
            });
            this.setState({
                modalVisibleErrorInternet: !this.state
                    .modalVisibleErrorInternet,
            }); */
            this.openModal(
                "outline-report_problem-24px",
                StringConstants.MSG_NO_INTERNET_CONNECTION_TITLE,
                StringConstants.MSG_NO_INTERNET_CONNECTION_BODY,
                "Cerrar",
                "warning",
                () => {
                    this.irVista("Home");
                    this.setState({
                        showModal: false,
                    });
                },
                () => {
                    this.irVista("Home");
                    this.setState({
                        showModal: false,
                    });
                },
                () => {
                    this.irVista("Home");
                    this.setState({
                        showModal: false,
                    });
                }
            );
        }
    }

    consultarBeneficiario() {
        this.AutorizacionesModel.consultarBeneficiario()
            .then(data => {
                let esBeneficiario = false;
                let pararValidacion = false;
                let info = {};
                let objSend = {};
                for (let infobene of data.contrato) {
                    if (
                        infobene.informacionBeneficiarios
                            .numIdentificacionBeneficiario ==
                            this.state.identificacion &&
                        this.state.numContrato ==
                            infobene.informacionBasicaContrato.numContrato
                    ) {
                        //Detectada  informacion del beneficiario
                        if (!pararValidacion) {
                            esBeneficiario = true;
                            objSend = infobene.informacionBasicaContrato;
                            info = infobene.informacionBeneficiarios;
                            objSend.caratula =
                                infobene.informacionBasicaContrato;
                            objSend.titularFamilia =
                                infobene.informacionBasicaContrato;
                            this.setState({ infoContrato: objSend });
                            this.setState({ modeUsuario: "Beneficiario" });
                            //this.seleccionarUsuario(infobene.informacionBeneficiarios);
                            //Cerrar modal
                            this.setState({ loadingVisible: false });
                            pararValidacion = true;
                        }
                    }
                }
                if (!esBeneficiario) {
                    // NO debe poder ingresar
                    /* this.state.textoTituloModal = "Acceso restringido";
                    this.state.textoErrorModal =
                        "No tienes permisos habilitados para esta sección.";
                    this.state.offModulo = "Home";
                    this.triggerModalError(); */
                    this.openModal(
                        "lock",
                        StringConstants.MSG_NO_ACCESS_TITLE,
                        StringConstants.MSG_NO_ACCESS_BODY,
                        "Cerrar",
                        "info",
                        () => {
                            this.irVista("Home");
                            this.setState({
                                showModal: false,
                            });
                        },
                        () => {
                            this.irVista("Home");
                            this.setState({
                                showModal: false,
                            });
                        },
                        () => {
                            this.irVista("Home");
                            this.setState({
                                showModal: false,
                            });
                        }
                    );
                } else {
                    let convDatosUsu = JSON.stringify(info);
                    let infoEnv = limpiarCaracteres(convDatosUsu);
                    this.seleccionarUsuario(infoEnv);
                    pararValidacion = true;
                }
            })
            .catch(err => {
                console.log(err);
                /* this.setState({
                    titError: StringConstants.MSG_SERVICE_ERROR_TITLE,
                    msgErrorModal: StringConstants.MSG_SERVICE_ERROR_BODY,
                    modalErrorVer: !this.state.modalErrorVer,
                }); */
                this.openModal(
                    "close",
                    StringConstants.MSG_SERVICE_ERROR_TITLE,
                    StringConstants.MSG_SERVICE_ERROR_BODY,
                    "Cerrar",
                    "error",
                    () => {
                        //this.irVista("MisDatos");
                        this.setState({
                            showModal: false,
                        });
                    },
                    () => {
                        //this.irVista("MisDatos");
                        this.setState({
                            showModal: false,
                        });
                    },
                    () => {
                        //this.irVista("MisDatos");
                        this.setState({
                            showModal: false,
                        });
                    }
                );
            });
    }

    handleBackButton = () => {
        this.irVista("InicioAutorizaciones");
        return true;
    };

    async componentWillMount() {
        if (Platform.OS == "android") {
            BackHandler.addEventListener(
                "hardwareBackPress",
                this.handleBackButton
            );
        }
        this.state.loadingVisible = true;

        this.props.navigation.addListener("didBlur", payload => {
            NetInfo.isConnected.removeEventListener(
                "connectionChange",
                this.handleConnectivityChange
            );
        });
        let permisoVista = await verificarPermisoVista("autorizaciones");
        console.log("permisos vista en consultar ", permisoVista);
        if (permisoVista) {
            this.setState({
                contratos: this.props.navigation.state.params.contratos,
            });

            this.setState({
                persona: this.props.navigation.state.params.persona,
            });

            this.setState({
                beneficiario: this.props.navigation.state.params.beneficiario,
            });
            this.initConfig();
            console.log("contratos ", this.state.contratos);
            console.log("persona ", this.state.persona);
            console.log("beneficiario ", this.state.beneficiario);
        } else {
            this.openModal(
                "lock",
                StringConstants.MSG_NO_ACCESS_TITLE,
                StringConstants.MSG_NO_ACCESS_BODY,
                "Cerrar",
                "info",
                () => {
                    this.irVista("Home");
                    this.setState({
                        showModal: false,
                    });
                },
                () => {
                    this.irVista("Home");
                    this.setState({
                        showModal: false,
                    });
                },
                () => {
                    this.irVista("Home");
                    this.setState({
                        showModal: false,
                    });
                }
            );
        }
    }

    handleConnectivityChange = isConnected => {
        this.setState({ isConnected: isConnected });
        if (!isConnected) {
            this.setState({ isConnected: isConnected });
            this.openModal(
                "outline-report_problem-24px",
                StringConstants.MSG_NO_INTERNET_CONNECTION_TITLE,
                StringConstants.MSG_NO_INTERNET_CONNECTION_BODY,
                "Cerrar",
                "warning",
                () => {
                    this.irVista("Home");
                    this.setState({
                        showModal: false,
                    });
                },
                () => {
                    this.irVista("Home");
                    this.setState({
                        showModal: false,
                    });
                },
                () => {
                    this.irVista("Home");
                    this.setState({
                        showModal: false,
                    });
                }
            );
        }
    };

    triggerModalError() {
        this.setState({
            modalVisibleError: !this.state.modalVisibleError,
        });

        /*  if (this.state.offModulo) {
             this.irVista(offModulo);
         } */
    }

    triggerModalError2() {
        this.setState({
            loadingVisible: false,
            modalErrorVer: !this.state.modalErrorVer,
        });

        if (this.state.modalErrorVer == true) {
            this.irVista("InicioAutorizaciones");
        }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            "connectionChange",
            this.handleConnectivityChange
        );

        NetInfo.isConnected.fetch().done(isConnected => {
            this.setState({ isConnected });
            if (!isConnected) {
                this.setState({ noAccess: true });
            }
        });
        AsyncStorage.getItem("numContrato", (errs, result) => {
            this.setState({ numContrato: result });
        });
        AsyncStorage.getItem("identificacion", (errs, result) => {
            this.setState({ identificacion: result });
        });
        AsyncStorage.getItem("nombreHeader", (errs, result) => {
            if (result != null) {
                if (permisoContrato(result) == "NO") {
                    /* this.state.textoTituloModal = "Acceso restringido";
                    this.state.textoErrorModal =
                        "No tienes permisos habilitados para esta sección.";
                    this.setState({ offModulo: "Home" });
                    this.triggerModalError(); */
                    this.openModal(
                        "lock",
                        StringConstants.MSG_NO_ACCESS_TITLE,
                        StringConstants.MSG_NO_ACCESS_BODY,
                        "Cerrar",
                        "info",
                        () => {
                            this.irVista("Home");
                            this.setState({
                                showModal: false,
                            });
                        },
                        () => {
                            this.irVista("Home");
                            this.setState({
                                showModal: false,
                            });
                        },
                        () => {
                            this.irVista("Home");
                            this.setState({
                                showModal: false,
                            });
                        }
                    );
                }
            }
        });
    }

    cargarBeneficiarios() {
        let { beneficiariosVisibles } = this.state;
        this.AutorizacionesModel.contratosUsuario()
            .then(data => {
                console.log("cargarBeneficiarios()");
                console.log(data);
                let listaBenefic = [];
                let listBen = [];

                let convDatosUsu = JSON.stringify(
                    data.contratos[0].titularFamilia.informacionBeneficiarios
                );
                let info = limpiarCaracteres(convDatosUsu);
                //mapeo para agregar urlPhoto= null en caso de que algun beneficiario no tenga validarlo como vacio
                info = mapearUsuariosConUrlPhoto(info);
                //mapeo identifaciones de los usuarios
                let mapeoUsuariosIdentificación = mapearIdentificacionUsuarios(
                    info
                );
                //Consulto foto de los usuarios
                listBen = info;
                let usuAcept = []; // Informacion de usuarios aceptados
                let total = listBen.length;
                let totalAceptados = 0;
                let item = 1;
                let caratula = data.contratos[0].caratula;
                let pararValidacion = false;
                this.setState({ infoContrato: data.contratos[0] });
                listaBenefic = [];
                //Consulto foto de los usuarios
                consultarFotosUsuario(mapeoUsuariosIdentificación, response => {
                    let fotosUsuarios = [];
                    if (response != null) {
                        fotosUsuarios = response.data;
                    }
                    //asigno cada uno de las imagenes obtenidas  a su respectivo usuario
                    listBen = asignarUrlPhotosAUsuarios(fotosUsuarios, listBen);
                    let index = listBen.findIndex(
                        usuarioIn => usuarioIn.tipoUsuario == "TITULAR"
                    );
                    let removed = listBen.splice(index, 1);
                    listBen.splice(0, 0, removed[0]);
                    console.log(
                        "Listado de Beneficiarios con FOTO !!!",
                        listBen
                    );
                    let numbene = 1;
                    for (let infobene of listBen) {
                        if (infobene.tipoUsuario == "TITULAR") {
                            infobene.idbene = 0;
                        } else {
                            infobene.idbene = numbene;
                            numbene++;
                        }
                        console.log("edw ", infobene);
                        let td = infobene.tipoIdentificacionBeneficiario;
                        let numd = infobene.numIdentificacionBeneficiario;

                        this.AutorizacionesModel.personaConsultar(td, numd)
                            .then(data => {
                                let vigenciaContrato =
                                    new Date().getTime() <
                                    new Date(
                                        infobene.fechaFinVigencia
                                    ).getTime();
                                let estadoC = infobene.parentesco;
                                let esHijo =
                                    infobene.estadoBeneficiarioContrato;
                                let edad = calculoAnios(
                                    data.persona[0].personaNatural.datosBasicos
                                        .fechaNacimiento
                                );
                                let viewFoto =
                                    infobene.urlPhoto != null ? (
                                        <Card
                                            bordered
                                            style={[page.circleUsuario]}
                                        >
                                            <Thumbnail
                                                square
                                                large
                                                style={[page.circleImgUsuario]}
                                                source={{
                                                    uri: infobene.urlPhoto,
                                                }}
                                            />
                                        </Card>
                                    ) : null;
                                if (
                                    (esHijo == "ACTIVO" &&
                                        estadoC == "HI" &&
                                        edad < 18 &&
                                        vigenciaContrato) ||
                                    (estadoC == "T" &&
                                        numd == this.state.identificacion &&
                                        esHijo == "ACTIVO" &&
                                        vigenciaContrato)
                                ) {
                                    infobene.viewFoto = viewFoto;
                                    infobene.isPressed = false;
                                    beneficiariosVisibles.push(infobene);
                                    totalAceptados++;
                                }

                                console.log(usuAcept);
                                console.log(beneficiariosVisibles);

                                this.setState({
                                    beneficiariosVisibles,
                                    totalAceptados: totalAceptados,
                                });
                                //  Visto el ultimo usuario
                                if (item == total) {
                                    let detenerLoader = true;
                                    //(C1)
                                    // No  tiene beneficiarios
                                    if (
                                        totalAceptados == 0 &&
                                        !pararValidacion
                                    ) {
                                        let titularCONbenef = false;
                                        for (let infB of listBen) {
                                            if (
                                                infB.parentesco == "T" &&
                                                infB.numIdentificacionBeneficiario ==
                                                    this.state.identificacion
                                            ) {
                                                //  Es  un titular  CON beneficios
                                                titularCONbenef = true;
                                            }
                                        }
                                        // Se busca que sea titular SIN beneficios
                                        if (!titularCONbenef) {
                                            // NO debe poder ingresar
                                            /* this.state.textoTituloModal =
                                                "Acceso restringido";
                                            this.state.textoErrorModal =
                                                "No tienes permisos habilitados para esta sección.";
                                            this.setState({
                                                offModulo: "Home",
                                            });
                                            this.triggerModalError(); */
                                            this.openModal(
                                                "lock",
                                                StringConstants.MSG_NO_ACCESS_TITLE,
                                                StringConstants.MSG_NO_ACCESS_BODY,
                                                "Cerrar",
                                                "info",
                                                () => {
                                                    this.irVista("Home");
                                                    this.setState({
                                                        showModal: false,
                                                    });
                                                },
                                                () => {
                                                    this.irVista("Home");
                                                    this.setState({
                                                        showModal: false,
                                                    });
                                                },
                                                () => {
                                                    this.irVista("Home");
                                                    this.setState({
                                                        showModal: false,
                                                    });
                                                }
                                            );
                                            pararValidacion = true;
                                        }
                                    }
                                    // D1, Solicitante con
                                    console.log("edwwww ", listBen);
                                    if (
                                        !pararValidacion &&
                                        totalAceptados == 1
                                    ) {
                                        console.log("edw 1 !!!!!");
                                        for (let infB of listBen) {
                                            // Con beneficios
                                            if (
                                                (infB.parentesco == "T" && // titular
                                                    infB.numIdentificacionBeneficiario ==
                                                        this.state
                                                            .identificacion) ||
                                                (infB.parentesco == "HI" &&
                                                    beneficiariosVisibles.indexOf(
                                                        infB
                                                    ) != -1)
                                                // usuAcept.indexOf(infB) !=
                                                //  -1)
                                            ) {
                                                this.seleccionarUsuario(infB);
                                                detenerLoader = false;
                                                pararValidacion = true;
                                            }
                                        }
                                    }

                                    // F1, Titular sin beneficios...
                                    if (
                                        totalAceptados == 0 &&
                                        !pararValidacion
                                    ) {
                                        console.log("edw 2 !!!!!");
                                        // 1 solo beneficiario
                                        let titularCONbenef = false;
                                        for (let infB of listBen) {
                                            if (
                                                infB.parentesco == "T" &&
                                                infB.numIdentificacionBeneficiario ==
                                                    this.state.identificacion
                                            ) {
                                                //  Es  un titular  CON beneficios
                                                titularCONbenef = true;
                                            }
                                        }
                                        // Titular sin beneficios
                                        console.log(listBen[0]);
                                        let visibleModalAccess = true;
                                        if (!titularCONbenef) {
                                            // Ir a la siguiente pantalla
                                            this.seleccionarUsuario(
                                                beneficiariosVisibles[0]
                                            );
                                            pararValidacion = true;
                                            detenerLoader = false;
                                            visibleModalAccess = false;
                                        } else {
                                            this.seleccionarUsuario(listBen[0]);
                                            detenerLoader = false;
                                            pararValidacion = false;
                                            visibleModalAccess = false;
                                        }

                                        // NO debe poder ingresar
                                        /* this.state.textoTituloModal =
                                            "Acceso restringido";
                                        this.state.textoErrorModal =
                                            "No tienes permisos habilitados para esta sección.";
                                        this.triggerModalError();
                                        this.setState({ offModulo: "Home" }); */
                                        if (visibleModalAccess) {
                                            this.openModal(
                                                "lock",
                                                StringConstants.MSG_NO_ACCESS_TITLE,
                                                StringConstants.MSG_NO_ACCESS_BODY,
                                                "Cerrar",
                                                "info",
                                                () => {
                                                    this.irVista("Home");
                                                    this.setState({
                                                        showModal: false,
                                                    });
                                                },
                                                () => {
                                                    this.irVista("Home");
                                                    this.setState({
                                                        showModal: false,
                                                    });
                                                },
                                                () => {
                                                    this.irVista("Home");
                                                    this.setState({
                                                        showModal: false,
                                                    });
                                                }
                                            );
                                            pararValidacion = true;
                                        }
                                    }

                                    if (detenerLoader) {
                                        this.setState({
                                            loadingVisible: false,
                                        });
                                    }
                                }
                                item = item + 1;
                            })
                            .catch(err => {
                                console.log(err);
                                /* this.setState({
                                    titError:
                                        StringConstants.MSG_SERVICE_ERROR_TITLE,
                                    msgErrorModal:
                                        StringConstants.MSG_SERVICE_ERROR_BODY,
                                    modalErrorVer: !this.state.modalErrorVer,
                                }); */
                                this.openModal(
                                    "close",
                                    StringConstants.MSG_SERVICE_ERROR_TITLE,
                                    StringConstants.MSG_SERVICE_ERROR_BODY,
                                    "Cerrar",
                                    "error",
                                    () => {
                                        //this.irVista("MisDatos");
                                        this.setState({
                                            showModal: false,
                                        });
                                    },
                                    () => {
                                        //this.irVista("MisDatos");
                                        this.setState({
                                            showModal: false,
                                        });
                                    },
                                    () => {
                                        //this.irVista("MisDatos");
                                        this.setState({
                                            showModal: false,
                                        });
                                    }
                                );
                            });
                    }

                    this.setState({
                        listaBenefic: listaBenefic,
                        totalAceptados: totalAceptados,
                    });
                    if (listaBenefic.length > 1) {
                        this.setState({
                            loadingVisible: false,
                        });
                    }
                });
            })
            .catch(err => {
                console.log(err);
                /* this.setState({
                    titError: StringConstants.MSG_SERVICE_ERROR_TITLE,
                    msgErrorModal: StringConstants.MSG_SERVICE_ERROR_BODY,
                    modalErrorVer: !this.state.modalErrorVer,
                }); */
                this.openModal(
                    "close",
                    StringConstants.MSG_SERVICE_ERROR_TITLE,
                    StringConstants.MSG_SERVICE_ERROR_BODY,
                    "Cerrar",
                    "error",
                    () => {
                        //this.irVista("MisDatos");
                        this.setState({
                            showModal: false,
                        });
                    },
                    () => {
                        //this.irVista("MisDatos");
                        this.setState({
                            showModal: false,
                        });
                    },
                    () => {
                        //this.irVista("MisDatos");
                        this.setState({
                            showModal: false,
                        });
                    }
                );
            });
    }

    irVista(vista, data = {}) {
        if (this.state.isConnected) {
            data.contratos = this.state.contratos;
            data.persona = this.state.persona;
            data.beneficiario = this.state.beneficiario;
            this.props.navigation.replace(vista, data);
        } else {
            this.setState({ loadingVisible: false });
            /*  this.setState({ textoTituloModal: "Sin conexión a internet" });
            this.setState({
                textoErrorModal:
                    "No es posible conectarse a internet, por favor verifica tu conexión",
            });
            this.setState({
                modalVisibleErrorInternet: !this.state
                    .modalVisibleErrorInternet,
            }); */
            this.openModal(
                "outline-report_problem-24px",
                StringConstants.MSG_NO_INTERNET_CONNECTION_TITLE,
                StringConstants.MSG_NO_INTERNET_CONNECTION_BODY,
                "Cerrar",
                "warning",
                () => {
                    this.irVista("Home");
                    this.setState({
                        showModal: false,
                    });
                },
                () => {
                    this.irVista("Home");
                    this.setState({
                        showModal: false,
                    });
                },
                () => {
                    this.irVista("Home");
                    this.setState({
                        showModal: false,
                    });
                }
            );
        }
    }

    seleccionarUsuario(userSel) {
        let { beneficiariosVisibles } = this.state;
        beneficiariosVisibles.forEach((bene, index) => {
            bene.isPressed =
                bene.numIdentificacionBeneficiario ==
                userSel.numIdentificacionBeneficiario
                    ? 1
                    : 0;
            beneficiariosVisibles[index] = bene;
        });

        this.setState(
            {
                beneficiariosVisibles,
            },
            () => {
                setTimeout(() => {
                    userSel.modeUsuario = this.state.modeUsuario;
                    userSel.totalAceptados = this.state.totalAceptados;
                    console.log(
                        "!!!!! USUARIO QUE SE VA A LA VISTA DE SERVICIOS ---",
                        userSel
                    );
                    this.irVista("ServiciosAutorizaciones", {
                        userSel: userSel,
                    });
                }, 2000);
            }
        );
    }

    visibilidadModalError = visibilidad => {
        this.setState({
            modalVisibleError: !this.state.modalVisibleError,
        });
        this.irVista("Home");
    };

    visibilidadModalAdvertenciaInternet = visibilidad => {
        this.setState({
            modalVisibleErrorInternet: !this.state.modalVisibleErrorInternet,
        });
        this.irVista("Home");
    };

    ocultarModalInternet = visibilidad => {
        this.setState({
            modalVisibleErrorInternet: !this.state.modalVisibleErrorInternet,
        });
    };

    render() {
        const resizeMode = "stretch";
        if (this.state.loadingVisible) {
            return (
                <Modal
                    visible={this.state.loadingVisible}
                    transparent={true}
                    onRequestClose={() => {}}
                >
                    <Loading />
                </Modal>
            );
        }
        return (
            <Container>
                <UserInactivity
                    timeForInactivity={StringConstants.TIME_INACTIVITY}
                    onAction={this.onAction}
                >
                    <Content
                        bounces={false}
                        padder={false}
                        style={{
                            paddingBottom: 0,
                            backgroundColor: "#ffff",
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 6,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,

                            elevation: 8,
                        }}
                    >
                        <Modal
                            animationType="slide"
                            visible={this.state.showModal}
                            transparent={false}
                            onRequestClose={() => {}}
                        >
                            <ModalGeneral
                                icono={this.state.icono}
                                titulo={this.state.titulo}
                                cuerpo={this.state.cuerpo}
                                textoBtn={this.state.textoBtn}
                                tipo={this.state.tipo}
                                onPressBtn={this.state.onPressBtn}
                                onPressClose={this.state.onPressClose}
                                onGoBack={this.state.onGoBack}
                            />
                        </Modal>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.modalVisibleError}
                            onRequestClose={() => {}}
                        >
                            <ModalInformacion
                                mostrarModal={this.visibilidadModalError}
                                mensaje={this.state.textoErrorModal}
                                titulo={this.state.textoTituloModal}
                            />
                        </Modal>
                        <NavigationEvents
                            onWillBlur={payload => {
                                this.setState({ blurSreen: true });
                            }}
                            onWillFocus={payload => {
                                this.setState({ blurSreen: false });
                            }}
                        />
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.modalErrorVer}
                            onRequestClose={() => {}}
                        >
                            <ModalError
                                mostrarModal={this.triggerModalError2}
                                titulo={this.state.titError}
                                mensaje={this.state.msgErrorModal}
                            />
                        </Modal>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.modalVisibleErrorInternet}
                            onRequestClose={() => {}}
                        >
                            <ModalAdvertenciaInternet
                                mostrarModal={
                                    this.visibilidadModalAdvertenciaInternet
                                }
                                mensaje={this.state.textoErrorModal}
                                titulo={this.state.textoTituloModal}
                                navigation={this.props.navigation}
                                ocultarModal={this.ocultarModalInternet}
                            />
                        </Modal>

                        <View
                            style={[
                                styles.contentForm,
                                { paddingBottom: "55%" },
                            ]}
                        >
                            <HeaderGeneral
                                title={"Consultar autorización"}
                                /* isVisibleClose={true}
                            onPressClose={() => {
                                this.irVista("InicioAutorizaciones");
                            }} */
                                isVisibleBack={true}
                                onPressBack={() => {
                                    this.irVista("InicioAutorizaciones");
                                }}
                                floatIcon={
                                    <Linericon
                                        name="outline-find_in_page-24px"
                                        style={{
                                            color: "#88bc00",
                                            fontSize: 30,
                                        }}
                                    />
                                }
                            />
                            <Text
                                style={[
                                    page.genTextAutor,
                                    styles.mb25,
                                    styles.mt30,
                                ]}
                            >
                                Selecciona el{" "}
                                <Text style={[page.genTextAutorBold]}>
                                    usuario
                                </Text>{" "}
                                que deseas consultar:
                            </Text>
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    style={{ flex: 1 }}
                                    data={this.state.beneficiariosVisibles}
                                    extraData={this.state}
                                    renderItem={this.renderItem}
                                    keyExtractor={(item, index) =>
                                        index.toString()
                                    }
                                />
                            </View>
                        </View>

                        {/* Footer */}
                        <FooterCancel
                            onPressButton={() => {
                                this.irVista("InicioAutorizaciones");
                            }}
                        />
                    </Content>
                </UserInactivity>
            </Container>
        );
    }

    renderItem = object => {
        let { beneficiariosVisibles } = this.state;
        let disabled = false;
        beneficiariosVisibles.forEach(item => {
            if (item.isPressed) {
                disabled = true;
            }
        });
        let item = object.item;
        let infobene = item;
        let viewFoto = item.viewFoto;
        let isPressed = item.isPressed;
        let childView = (
            <View
                style={[
                    page.boxUsuario,
                    styles.fila,
                    styles.centroVertical,
                    styles.ladoLado,
                ]}
            >
                {viewFoto}
                <View style={[styles.cortaTexto, styles.pl10]}>
                    <Text style={[page.nombreUser]}>
                        {limpiarNombre(infobene.nombreBeneficiario)}
                    </Text>
                    <Text style={[page.docUser]}>
                        {infobene.tipoIdentificacionBeneficiario}{" "}
                        {infobene.numIdentificacionBeneficiario}
                    </Text>
                    <Text style={[page.rolUser]}>
                        Beneficiario{" "}
                        <Text style={[page.rolBoldUser]}>
                            {obtenerParentesco(infobene.parentesco)}
                        </Text>
                    </Text>
                </View>
                <Icon
                    name="arrow-right"
                    type="MaterialCommunityIcons"
                    style={{
                        color: isPressed ? "#29b6f6" : "#9E9E9E",
                        marginRight: 10,
                    }}
                />
            </View>
        );
        let parentView = isPressed ? (
            <View style={{ paddingHorizontal: 10, width: "100%" }}>
                <Card bordered>{childView}</Card>
            </View>
        ) : (
            <TouchableOpacity
                disabled={disabled}
                onPress={() => {
                    this.seleccionarUsuario(infobene);
                }}
                transparent
                style={[
                    page.boxUsuario,
                    styles.fila,
                    styles.centroVertical,
                    styles.ladoLado,
                ]}
            >
                {childView}
            </TouchableOpacity>
        );

        return parentView;
    };
}

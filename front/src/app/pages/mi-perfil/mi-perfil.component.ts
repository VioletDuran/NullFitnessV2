import { Component, OnInit, ViewChild } from '@angular/core';
import { VistaPerfilService } from 'src/app/services/VistaPerfil/vista-perfil.service';
import { ServicioLoginService } from 'src/app/services/Login/servicio-login.service';
import Swal from 'sweetalert2';
import {Router} from "@angular/router";
import { datosModificables,usuarioFinal } from 'src/app/services/VistaPerfil/vista-perfil.type';
import { Rutina } from 'src/app/services/ejerciciosPrivados/ejercicio-privado.type';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent implements OnInit {
  arrayMostrar:Rutina[] = [];
  Usuario: usuarioFinal | any = {
    idusuario : "", 
    nombreusuario : "", 
    edad : "", 
    peso : "", 
    nacionalidad : "", 
    contextura : "", 
    objetivo : "", 
    cantidad_ejercicio : "",
    foto: ""
  };
  datosCargados: boolean = false;
  fileTemp:any;
  tipoUsuario: string = "";
  @ViewChild('fotoRut') formularioRut!:NgForm
  @ViewChild('fotoUsu') formularioUsu!:NgForm

  constructor(private perfil:VistaPerfilService, private estado:ServicioLoginService, private router:Router) { }

  ngOnInit(): void {
    //Se cargan los datos en caso de que el usuario tenga el token activo
    this.estado.loggedIn();
    if(!this.estado.isLoggedIn){
      this.router.navigate(['']);
      Swal.fire({
        title: 'No estas logeado',
        text: 'Porfavor inicia sesion para entrar a tu perfil.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green'
      })
    }
    if(this.datosCargados == false){
      this.perfil.cargarDatos(this.estado.idUsuario).subscribe((valor) =>{
        this.Usuario = valor;
        if(this.Usuario.peso != null){
          this.Usuario.peso = this.Usuario.peso + " Kg";
        }
        if(this.Usuario.cantidad_ejercicio != null){
          this.Usuario.cantidad_ejercicio = this.Usuario.cantidad_ejercicio + " Semanal";
        }
        if(this.Usuario.edad != null){
          this.Usuario.edad = this.Usuario.edad + " Años";
        }
        this.tipoUsuario = this.estado.tipoUsuario;
        this.datosCargados = true;
      })
    }

    // Se obtienen las rutinas desde la promesa
    this.perfil.obtenerRutinas(this.estado.idUsuario).subscribe((valor) =>{
      this.arrayMostrar = valor;
    })
  }

  //Metodo para cambiar la foto del usuario.
  cambiarFoto($event:any) {
    const [ file ] = $event.target.files;
    let extension = 'jpg';
    let nombreFinal = this.Usuario.idusuario + '.' + extension;

    this.fileTemp = {
      fileRaw:file,
      fileName:nombreFinal,
    }

    Swal.fire({
      title: 'Deseas confirmar el archivo?',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      allowOutsideClick: false,
      preConfirm:() => {
        this.enviarFoto();
      }
    }).then(() => this.formularioUsu.resetForm())
  }

  //Se envia la foto al back para proceder a guardarla.
  enviarFoto(){

    const body = new FormData();
    body.append('myFile', this.fileTemp.fileRaw, this.fileTemp.fileName);
    this.perfil.guardarFoto(body).subscribe((valor)=>{
      if(valor == true){
        Swal.fire({
          title: "Foto cambiada con exito!",
          icon: "success",
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'green',
          preConfirm:() => {
            location.reload();
          }
        })
      }
      
    })
  }
  

  //Se ciera la sesion del usuario
  cerrarSesion(){
    this.estado.logout();
    this.router.navigate(['']);
    Swal.fire({
      title: 'Cerraste sesion de forma correcta',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green'
    })
  }

  //Pop up para obtener la informacion del usuario a editar.
  editarInformacion(){
    Swal.fire({
      title: "Informacion de usuario",
      text: "Ingresa la informacion para editar.",
      html: `<form>
             <input type="number" class="swal2-input" placeholder="edad" id="edad">
             <hr>
             <input type="number" class="swal2-input" placeholder="peso" id = "peso">
             <hr>
             <select class="swal2-input" id="country" name="country" style="width: 17rem"">
              <option value="pret" id = "pret" selected="selected">Seleccionar pa&#237;s</option>
              <option value="AF" id ="AF">Afganist&#225;n</option>
              <option value="AL" id ="AL">Albania</option>
              <option value="DE" id ="DE">Alemania</option>
              <option value="AD" id ="AD">Andorra</option>
              <option value="AO" id ="AO">Angola</option>
              <option value="AI" id ="AI">Anguila</option>
              <option value="AQ" id ="AQ">Ant&#225;rtida</option>
              <option value="AG" id ="AG">Antigua y Barbuda</option>
              <option value="AN" id ="AN">Antillas Neerlandesas</option>
              <option value="SA" id ="SA">Arabia Saud&#237;</option>
              <option value="DZ" id ="DZ">Argelia</option>
              <option value="AR" id ="AR">Argentina</option>
              <option value="AM" id ="AM">Armenia</option>
              <option value="AW" id ="AW">Aruba</option>
              <option value="AU" id ="AU">Australia</option>
              <option value="AT" id ="AT">Austria</option>
              <option value="BS" id ="BS">Bahamas</option>
              <option value="BH" id ="BH">Bahr&#233;in</option>
              <option value="BD" id ="BD">Bangladesh</option>
              <option value="BB" id ="BB">Barbados</option>
              <option value="BE" id ="BE">B&#233;lgica</option>
              <option value="BZ" id ="BZ">Belice</option>
              <option value="BJ" id ="BJ">Ben&#237;n</option>
              <option value="BM" id ="BM">Bermudas</option>
              <option value="BY" id ="BY">Bielorrusia</option>
              <option value="BO" id ="BO">Bolivia</option>
              <option value="BA" id ="BA">Bosnia y Herzegovina</option>
              <option value="BW" id ="BW">Botsuana</option>
              <option value="BR" id ="BR">Brasil</option>
              <option value="BN" id ="BN">Brun&#233;i Darussalam</option>
              <option value="BG" id ="BG">Bulgaria</option>
              <option value="BF" id ="BF">Burkina Faso</option>
              <option value="BI" id ="BI">Burundi</option>
              <option value="BT" id ="BT">But&#225;n</option>
              <option value="CV" id ="CV">Cabo Verde</option>
              <option value="KH" id ="KH">Camboya</option>
              <option value="CM" id ="CM">Camer&#250;n</option>
              <option value="CA" id ="CA">Canad&#225;</option>
              <option value="BQ" id ="BQ">Caribe Neerland&#233;s</option>
              <option value="TD" id ="TD">Chad</option>
              <option value="CL" id ="CL">Chile</option>
              <option value="CN" id ="CN">China</option>
              <option value="CY" id ="CY">Chipre</option>
              <option value="CO" id ="CO">Colombia</option>
              <option value="KM" id ="KM">Comoras</option>
              <option value="CG" id ="CG">Congo</option>
              <option value="KR" id ="KR">Corea</option>
              <option value="KP" id ="KP">Corea</option>
              <option value="CI" id ="CI">Costa de Marfil</option>
              <option value="CR" id ="CR">Costa Rica</option>
              <option value="HR" id ="HR">Croacia</option>
              <option value="CU" id ="CU">Cuba</option>
              <option value="CW" id ="CW">Curazao</option>
              <option value="DK" id ="DK">Dinamarca</option>
              <option value="DJ" id ="DJ">Djibouti</option>
              <option value="DM" id ="DM">Dominica</option>
              <option value="EC" id ="EC">Ecuador</option>
              <option value="US" id ="US">EE.UU.</option>
              <option value="EG" id ="EG">Egipto</option>
              <option value="SV" id ="SV">El Salvador</option>
              <option value="ER" id ="ER">Eritrea</option>
              <option value="SK" id ="SK">Eslovaquia</option>
              <option value="SI" id ="SI">Eslovenia</option>
              <option value="ES" id ="ES">Espa&#241;a</option>
              <option value="EE" id ="EE">Estonia</option>
              <option value="ET" id ="ET">Etiop&#237;a</option>
              <option value="FJ" id ="FJ">Fiji</option>
              <option value="PH" id ="PH">Filipinas</option>
              <option value="FI" id ="FI">Finlandia</option>
              <option value="FR" id ="FR">Francia</option>
              <option value="GM" id ="GM">Gambia</option>
              <option value="GE" id ="GE">Georgia</option>
              <option value="GH" id ="GH">Ghana</option>
              <option value="GI" id ="GI">Gibraltar</option>
              <option value="GD" id ="GD">Granada</option>
              <option value="GR" id ="GR">Grecia</option>
              <option value="GL" id ="GL">Groenlandia</option>
              <option value="GP" id ="GP">Guadalupe</option>
              <option value="GU" id ="GU">Guam</option>
              <option value="GT" id ="GT">Guatemala</option>
              <option value="GF" id ="GF">Guayana Francesa</option>
              <option value="GN" id ="GN">Guinea</option>
              <option value="GQ" id ="GQ">Guinea Ecuatorial</option>
              <option value="GW" id ="GW">Guinea-Bissau</option>
              <option value="GY" id ="GY">Guyana</option>
              <option value="HT" id ="HT">Hait&#237;</option>
              <option value="HN" id ="HN">Honduras</option>
              <option value="HK" id ="HK">Hongkong, China</option>
              <option value="HU" id ="HU">Hungr&#237;a</option>
              <option value="IN" id ="IN">India</option>
              <option value="ID" id ="ID">Indonesia</option>
              <option value="IQ" id ="IQ">Irak</option>
              <option value="IR" id ="IR">Ir&#225;n</option>
              <option value="IE" id ="IE">Irlanda</option>
              <option value="IS" id ="IS">Islandia</option>
              <option value="KY" id ="KY">Islas Caim&#225;n</option>
              <option value="CK" id ="CK">Islas Cook</option>
              <option value="FO" id ="FO">Islas Feroe</option>
              <option value="FK" id ="FK">Islas Malvinas</option>
              <option value="MP" id ="MP">Islas Marianas del Norte</option>
              <option value="MH" id ="MH">Islas Marshall</option>
              <option value="SB" id ="SB">Islas Salom&#243;n</option>
              <option value="IL" id ="IL">Israel</option>
              <option value="IT" id ="IT">Italia</option>
              <option value="JM" id ="JM">Jamaica</option>
              <option value="JP" id ="JP">Jap&#243;n</option>
              <option value="JO" id ="JO">Jordania</option>
              <option value="KZ" id ="KZ">Kazajist&#225;n</option>
              <option value="KE" id ="KE">Kenia</option>
              <option value="KG" id ="KG">Kirguizist&#225;n</option>
              <option value="KI" id ="KI">Kiribati</option>
              <option value="KW" id ="KW">Kuwait</option>
              <option value="LA" id ="LA">Laos</option>
              <option value="LS" id ="LS">Lesoto</option>
              <option value="LV" id ="LV">Letonia</option>
              <option value="LB" id ="LB">L&#237;bano</option>
              <option value="LR" id ="LR">Liberia</option>
              <option value="LY" id ="LY">Libia</option>
              <option value="LI" id ="LI">Liechtenstein</option>
              <option value="LT" id ="LT">Lituania</option>
              <option value="LU" id ="LU">Luxemburgo</option>
              <option value="MO" id ="MO">Macao, China</option>
              <option value="MK" id ="MK">Macedonia</option>
              <option value="MG" id ="MG">Madagascar</option>
              <option value="MY" id ="MY">Malasia</option>
              <option value="MW" id ="MW">Malawi</option>
              <option value="MV" id ="MV">Maldivas</option>
              <option value="ML" id ="ML">Mal&#237;</option>
              <option value="MT" id ="MT">Malta</option>
              <option value="MA" id ="MA">Marruecos</option>
              <option value="MQ" id ="MQ">Martinica</option>
              <option value="MU" id ="MU">Mauricio</option>
              <option value="MR" id ="MR">Mauritania</option>
              <option value="YT" id ="YT">Mayotte</option>
              <option value="MX" id ="MX">M&#233;xico</option>
              <option value="FM" id ="FM">Micronesia</option>
              <option value="MD" id ="MD">Moldavia</option>
              <option value="MC" id ="MC">M&#243;naco</option>
              <option value="MN" id ="MN">Mongolia</option>
              <option value="ME" id ="ME">Montenegro</option>
              <option value="MS" id ="MS">Montserrat</option>
              <option value="MZ" id ="MZ">Mozambique</option>
              <option value="MM" id ="MM">Myanmar</option>
              <option value="NA" id ="NA">Namibia</option>
              <option value="NR" id ="NR">Nauru</option>
              <option value="NP" id ="NP">Nepal</option>
              <option value="NI" id ="NI">Nicaragua</option>
              <option value="NE" id ="NE">N&#237;ger</option>
              <option value="NG" id ="NG">Nigeria</option>
              <option value="NU" id ="NU">Niue</option>
              <option value="NO" id ="NO">Noruega</option>
              <option value="NC" id ="NC">Nueva Caledonia</option>
              <option value="NZ" id ="NZ">Nueva Zelanda</option>
              <option value="OM" id ="OM">Om&#225;n</option>
              <option value="NL" id ="NL">Pa&#237;ses Bajos</option>
              <option value="PK" id ="PK">Pakist&#225;n</option>
              <option value="PW" id ="PW">Palaos</option>
              <option value="PS" id ="PS">Palestina</option>
              <option value="PA" id ="PA">Panam&#225;</option>
              <option value="PG" id ="PG">Pap&#250;a Nueva Guinea</option>
              <option value="PY" id ="PY">Paraguay</option>
              <option value="PE" id ="PE">Per&#250;</option>
              <option value="PF" id ="PF">Polinesia Francesa</option>
              <option value="PL" id ="PL">Polonia</option>
              <option value="PT" id ="PT">Portugal</option>
              <option value="PR" id ="PR">Puerto Rico</option>
              <option value="QA" id ="QA">Qatar</option>
              <option value="GB" id ="GB">Reino Unido</option>
              <option value="CF" id ="CF">Rep&#250;blica Centroafricana</option>
              <option value="CZ" id ="CZ">Rep&#250;blica Checa</option>
              <option value="DO" id ="DO">Rep&#250;blica Dominicana</option>
              <option value="GA" id ="GA">Rep&#250;blica Gabonesa</option>
              <option value="RE" id ="RE">Reuni&#243;n</option>
              <option value="RW" id ="RW">Ruanda</option>
              <option value="RO" id ="RO">Ruman&#237;a</option>
              <option value="RU" id ="RU">Rusia</option>
              <option value="WS" id ="WS">Samoa</option>
              <option value="AS" id ="AS">Samoa Americana</option>
              <option value="KN" id ="KN">San Crist&#243;bal y Nieves</option>
              <option value="SM" id ="SM">San Marino</option>
              <option value="PM" id ="PM">San Pedro y Miquel&#243;n</option>
              <option value="VC" id ="VC">San Vicente y las Granadinas</option>
              <option value="SH" id ="SH">Santa Elena</option>
              <option value="LC" id ="LC">Santa Luc&#237;a</option>
              <option value="ST" id ="ST">Santo Tom&#233; y Pr&#237;ncipe</option>
              <option value="SN" id ="SN">Senegal</option>
              <option value="RS" id ="RS">Serbia</option>
              <option value="SC" id ="SC">Seychelles</option>
              <option value="SL" id ="SL">Sierra Leona</option>
              <option value="SG" id ="SG">Singapur</option>
              <option value="SX" id ="SX">Sint Maarten</option>
              <option value="SY" id ="SY">Siria</option>
              <option value="SO" id ="SO">Somalia</option>
              <option value="LK" id ="LK">Sri Lanka</option>
              <option value="SZ" id ="SZ">Suazilandia</option>
              <option value="ZA" id ="ZA">Sud&#225;frica</option>
              <option value="SD" id ="SD">Sud&#225;n</option>
              <option value="SS" id ="SS">Sud&#225;n del Sur</option>
              <option value="SE" id ="SE">Suecia</option>
              <option value="CH" id ="CH">Suiza</option>
              <option value="SR" id ="SR">Surinam</option>
              <option value="TH" id ="TH">Tailandia</option>
              <option value="TW" id ="TW">Taiw&#225;n</option>
              <option value="TZ" id ="TZ">Tanzania</option>
              <option value="TJ" id ="TJ">Tayikist&#225;n</option>
              <option value="TL" id ="TL">Timor Oriental</option>
              <option value="TG" id ="TG">Togo</option>
              <option value="TK" id ="TK">Tokelau</option>
              <option value="TO" id ="TO">Tonga</option>
              <option value="TT" id ="TT">Trinidad y Tobago</option>
              <option value="TN" id ="TN">T&#250;nez</option>
              <option value="TC" id ="TC">Turcas y Caicos</option>
              <option value="TM" id ="TM">Turkmenist&#225;n</option>
              <option value="TR" id ="TR">Turqu&#237;a</option>
              <option value="TV" id ="TV">Tuvalu</option>
              <option value="AE" id ="AE">UAE</option>
              <option value="UA" id ="UA">Ucrania</option>
              <option value="UG" id ="UG">Uganda</option>
              <option value="UY" id ="UY">Uruguay</option>
              <option value="UZ" id ="UZ">Uzbekist&#225;n</option>
              <option value="VU" id ="VU">Vanuatu</option>
              <option value="VA" id ="VA">Vaticano</option>
              <option value="VE" id ="VE">Venezuela</option>
              <option value="VN" id ="VN">Vietnam</option>
              <option value="WF" id ="WF">Wallis y Futuna</option>
              <option value="YE" id ="YE">Yemen</option>
              <option value="ZM" id ="ZM">Zambia</option>
              <option value="ZW" id ="ZW">Zimbabue</option>
              </select>
             <hr>
             <select class="swal2-input" id="contextura" name="contextura" style="width: 17rem"">
             <option value="preter" id ="preter">Seleccionar contextura</option>
             <option value="ECTO" id ="ECTO">Ectoformo</option>
             <option value="ENDO" id ="ENDO">Endoformo</option>
             <option value="MESO" id ="MESO">Mesoformo</option>
             </select>
             <hr>
             <select class="swal2-input" id="objetivo" name="objetivo" style="width: 17rem"">
             <option value="preter" id ="preter">Seleccionar objetivo</option>
             <option value="DEFI" id ="DEFI">Definir</option>
             <option value="GANA" id ="GANA">Ganar masa muscular</option>
             <option value="BAJA" id ="BAJA">Bajar grasa</option>
             </select>
             <hr>
             <input type="number" class="swal2-input" placeholder="cantidad de ejercicio semanal" id = "cantidad">
      </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      preConfirm: () =>{

        const edad = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#edad'))?.value;
        let edadUsuario = Number(edad);

         const peso = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#peso'))?.value;
        let pesoUsuario = Number(peso);

        const cantidad = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#cantidad'))?.value;
        let cantidadUsuario = Number(cantidad);

        const nacionalidad = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#country'))?.value;
        let nacionalidadUsuario = document.getElementById(nacionalidad!)!.textContent

        const contextura = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#contextura'))?.value;
        let contexturaUsuario = document.getElementById(contextura!)!.textContent

        const objetivo = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#objetivo'))?.value;
        let objetivoUsuario = document.getElementById(objetivo!)!.textContent
        
        if(edadUsuario < 16 || edadUsuario > 99){
          Swal.showValidationMessage(`Porfavor ingresa una edad valida`);
        }
        else if(pesoUsuario < 40 || pesoUsuario > 300 )
        {
          Swal.showValidationMessage(`Porfavor ingresa un peso valido`);
        }
        else if(nacionalidad == "pret"){
          Swal.showValidationMessage(`Porfavor eliga una nacionalidad valida`);
        }
        else if(contextura == "preter"){
          Swal.showValidationMessage(`Porfavor eliga una contextura valida`);
        }else if(objetivo == "preter"){
          Swal.showValidationMessage(`Porfavor eliga un objetivo valida`);
        }else if(cantidadUsuario < 0 || cantidadUsuario > 7 || cantidad == ''){
          Swal.showValidationMessage(`Porfavor ingresa una cantidad de ejercicio valida`);
        }else{
          let datosUsuario: datosModificables  = {
            idusuario: this.estado.idUsuario,
            edad: edad!,
            peso: peso!,
            nacionalidad: nacionalidadUsuario!,
            contextura: contexturaUsuario!,
            objetivo: objetivoUsuario!,
            cantidad_ejercicio: cantidad!
          }
          this.perfil.actualizarInformacionUsuario(datosUsuario).subscribe((valor) =>
            {
              if(valor == true){
                Swal.fire({
                  title: 'Modificacion Correcta',
                  text: 'Se modifico tu informacion correctamente.',
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: 'green',
                  preConfirm: () => {
                     location.reload();
                  }

                })
            }
          })

        }
      }
    })
  }
  cambiarFotoPriv($event: any,idrutinas:any) {
    const [ file ] = $event.target.files; 
    let extension = 'jpg';
    let nombreFinal = idrutinas + '_rutinaPriv' + '.' + extension;
    this.fileTemp = {
      fileRaw:file,
      fileName:nombreFinal,
    }
    Swal.fire({
      title: 'Deseas confirmar el archivo?',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      allowOutsideClick: false,
      preConfirm:() => {
        this.enviarFotoRutina();
      }
    }).then(()=>
     {
      this.formularioRut.resetForm();
     })
  }

  enviarFotoRutina() {
    const body = new FormData();
    body.append('myFile', this.fileTemp.fileRaw, this.fileTemp.fileName);
    this.perfil.guardarFotoRutina(body).subscribe((valor)=>{
      if(valor == true){
        Swal.fire({
          title: "Foto cambiada con exito!",
          icon: "success",
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'green',
          preConfirm:() => {
            location.reload();
          }
        })
      }
      
    })
  }

}

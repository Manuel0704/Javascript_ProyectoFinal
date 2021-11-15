//================================================
//DEFINIENDO OBJETOS
//================================================

class Cliente
{
    constructor (pNombre, pApellido, pLitros, pId)
    {
        this.id = pId;
        this.nombre = pNombre;
        this.apellido = pApellido;
        this.litros = pLitros;
    }
}

//================================================
//DEFINIENDO LAS FUNCIONES
//================================================

function crearAlertaCompletado(pIdInput, ptextoCompletado, pIdNuevo, pIdTxt)
{
    if(pIdNuevo.length == 0)
    {
        pIdInput.append(
            `<div id="${pIdTxt}" class="inputCompletado">
                Campo ${ptextoCompletado} completado
            </div>`)
    }
}

function AddSectionClientsDOM()
{
    $("#Clientes").attr('class', 'SeccionClientes');
    $("#Clientes").html(
        `<div id="SeccionClientes__titulo" class="SeccionClientes__titulo">Clientes</div>
        <div id="SeccionClientes__contenido">
            <div id="SelectedClientes" class="SeccionClientes__section SeccionClientes__section--selected">
                <div class="SeccionClientes__headSection">
                    <p class="SeccionClientes__sectionTitulo">Clientes seleccionados</p>
                    <button id="btnHide_1" class="SeccionClientes__btnHide"><i class="fas fa-bars"></i></button>
                </div>
                <ul id="ulSelectedClientes" class="SeccionClientes__listaClientes"></ul>
            </div>
            <div id="CurrentClientes" class="SeccionClientes__section SeccionClientes__section--current">
                <div class="SeccionClientes__headSection">
                    <p class="SeccionClientes__sectionTitulo">Clientes en sesión actual</p>
                    <button id="btnHide_2" class="SeccionClientes__btnHide"><i class="fas fa-bars"></i></button>
                </div>
                <ul id="ulCurrentClientes" class="SeccionClientes__listaClientes"></ul>
            </div>
            <div id="SavedClientes" class="SeccionClientes__section SeccionClientes__section--saved">
                <div class="SeccionClientes__headSection">
                    <p class="SeccionClientes__sectionTitulo">Clientes registrados</p>
                    <button id="btnHide_3" class="SeccionClientes__btnHide"><i class="fas fa-bars"></i></button>
                </div>
                <ul id="ulSavedClientes" class="SeccionClientes__listaClientes"></ul>
            </div>
        </div>`);
}

function AddSectionCalcDOM()
{
    $("#Calculo").attr('class', 'SeccionCalculo');
    $("#Calculo").html(`<div id="SeccionCalculo__titulo" class="SeccionCalculo__titulo">Cálculo</div>
    <ul id="ulCalculo" class="SeccionCalculo__listaCalculo"></ul>`)
}

function AddClientToList(lista, idField, nameField, surnameField, litersField, AddToList)
{
    switch (AddToList)
    {
        case 1:
            lista.prepend(`<li class="SeccionClientes__selectedLi" > Id: ${idField} <br> Nombre: ${nameField} <br> Apellido: ${surnameField} <br> Litros: ${litersField}</li>`)
        break;
        case 2:
            lista.prepend(`<li class="SeccionClientes__currentLi" > Id: ${idField} <br> Nombre: ${nameField} <br> Apellido: ${surnameField} <br> Litros: ${litersField} <button id="btn_Select_${idField}" class="SeccionClientes__btnSelect">seleccionar</button> </li>`)
        break;
        case 3:
            lista.prepend(`<li class="SeccionClientes__checkedLi" > Id: ${idField} <br> Nombre: ${nameField} <br> Apellido: ${surnameField} <br> Litros: ${litersField} <button id="btn_Select_${idField}" class="SeccionClientes__btnSelect">seleccionar</button> </li>`)
        break;
        default:
            alert("CLIENTE NO AGREGADO AL DOM!")
        break; 
    }
}

function getData()
{
    return localStorage.getItem("inscripcion");
}

function saveData(nombre, apellido, litros, id)
{
    let inscripciones = getData();
    let dataJs = null;
    let inscripcionesSave = null;

    if (inscripciones)
    {
        inscripcionesSave = JSON.parse(inscripciones);
        inscripcionesSave.push(new Cliente(nombre, apellido, litros, id));
    }
    else
    {
        dataJs = [{"nombre": nombre, "apellido": apellido, "litros": litros, "id": id}];
        inscripcionesSave = dataJs;
    }
    localStorage.setItem("inscripcion", JSON.stringify(inscripcionesSave));
}

function calcularPagoPorCliente()
{
    $("#Calculo").show();

    let montoPago = parseInt($("#box_amount").val());
    let totalConsumido = 0;
    let pagosClientes = [];

    if (ClientsSelectedList.length != 0)
    { 
        //se calcula el total de litros consumidos accediendo a los litros consumidos de cada clientes
        for (let currentClient of ClientsSelectedList)
        {
            totalConsumido = totalConsumido + currentClient.litros;
        }
        
        console.log("total consumido " + totalConsumido);//imprimiendo para comprobar

        //asignando los pagos correpondientes de cada cliente respecto al total en un nuevo arreglo
        for (let i = 0; i < ClientsSelectedList.length; i++)
        {
            pagosClientes.push((ClientsSelectedList[i].litros / totalConsumido) * montoPago);
            $("#ulCalculo").append(`<li class="ulCalculo__pago">Pago del cliente ${ClientsSelectedList[i].nombre}: ${pagosClientes[i]}</li>`);
        }
    }
    else
    {
        alert ("SELECCIONE ALGÚN CLIENTE PARA CALCULAR LOS PAGOS!")   
    }

}

function AddClientToSelected(pId, pName, pSurname, pLiters)
{
    let isSelected = false;
    for (const client of ClientsSelectedList)
    {
        if (client.id == pId)
        {
            isSelected = true;
        }
    }

    if (isSelected)
    {
        alert("CLIENTE YA SELECCIONADO");
    }
    else
    {
        AddClientToList($("#ulSelectedClientes"), pId, pName, pSurname, pLiters, 1);
        ClientsSelectedList.push(new Cliente(pName, pSurname, parseInt(pLiters), pId));
    }
}

function addingClient(pNameField, pSurNameField, pLitersField, pId)
{
    // AGREGAR AL LOCAL STORAGE
    saveData(pNameField, pSurNameField, parseInt(pLitersField), pId);

    // MOSTRAR EN EL DOM LAS SECCIONES
    if (!hayClientes)
    {
        $("#Clientes").show();
        hayClientes = true;
    }

    //AGREGAR AL DOM
    AddClientToList($("#ulCurrentClientes"), pId, pNameField, pSurNameField, pLitersField, 2);

    //AGREGAR EL EVENTO AL BOTON
    $(`#btn_Select_${pId}`).click(function(e){AddClientToSelected(pId, pNameField, pSurNameField, pLitersField)});
}

function registerClientDOM(nameField, surnameField, litersField)
{
    let existCoincidence = false;
    let registeredClients = JSON.parse(getData());
    
    //SI ALGUN CAMPO ESTA VACIO
    if (nameField == "" || surnameField == "" || litersField == "")
    {
        alert("COMPLETAR CAMPOS");
    }
    //SI ES QUE NO HAY CLIENTES REGISTRADOS (EN EL LOCAL STORAGE)
    else if (registeredClients == null)
    {
        cantClientes++; //LA CANTIDAD DE CLIENTES AUMENTA
        addingClient(nameField, surnameField, litersField, cantClientes);
    }
    //SI ES QUE SI HAY CLIENTES REGISTRADOS
    else
    {
        //VERIFICANDO LA EXISTENCIA DE UN CLIENTE YA REGISTRADO
        for (let dCliente of registeredClients)
        {
            if (nameField == dCliente.nombre && surnameField == dCliente.apellido)
            {
                existCoincidence = true;
            }
        }
        if (existCoincidence)
        {
            alert("CLIENTE YA REGISTRADO!")
        }
        else
        {
            cantClientes++;//LA CANTIDAD DE CLIENTES AUMENTA
            addingClient(nameField, surnameField, litersField, cantClientes);
        }
    }
}

function AddEventToBtns(dataArray)
{
    for (const client of dataArray)
    {
        $(`#btn_Select_${client.id}`).click(function (e) {AddClientToSelected(client.id, client.nombre, client.apellido, client.litros)});
    }
}

function ComprobarLista(response)
{
    $("#Clientes").show();
    let existeLista = getData();
    let arrayLista = JSON.parse(existeLista);

    //Agregando clientes de la URL
    for (const itUser of response)
    {
        AddClientToList($("#ulSavedClientes"), itUser.id, itUser.nombre, itUser.apellido, itUser.litros, 3);
    }
    AddEventToBtns(response)

    //Agregando la cantidad de clientes traida de la URL
    cantClientes = cantClientes + response.length;

    //Si existen los datos
    if (existeLista)
    {
        hayClientes = true;
        //Agregando la cantidad de clientes en el local storage
        cantClientes = cantClientes + arrayLista.length;
        //recorriendo el array de clientes e imprimiendolo en la seccion Clientes DOM
        for (const itCliente of arrayLista)
        {
            AddClientToList($("#ulSavedClientes"), itCliente.id, itCliente.nombre, itCliente.apellido, itCliente.litros, 3);
        }
        AddEventToBtns(arrayLista);
    }
}

//================================================
//INICIO DEL CODIGO
//================================================

let input_name      =   $("#box_name");
let input_surname   =   $("#box_surname");
let input_liters    =   $("#box_liters")

let input_submit_button =   $("#button_submit");
let input_calc_button   =   $("#button_cal");
let hayClientes     =   false;

let ClientsSelectedList = [];
let cantClientes = 0;

AddSectionCalcDOM();
AddSectionClientsDOM();

$.get('https://my-json-server.typicode.com/Manuel0704/MyFakeJSONS/clients', (response) => ComprobarLista(response));

input_name.change(function (e) {crearAlertaCompletado($("#campo_Nombre"), "Nombre", $("#inputNameCompletado"), "inputNameCompletado");});

input_surname.change(function (e) {crearAlertaCompletado($("#campo_Apellido"), "Apellido", $("#inputSurnameCompletado"), "inputSurnameCompletado");});//LISTO

input_liters.change(function (e) {crearAlertaCompletado($("#campo_Litros"), "Litros", $("#inputLitersCompletado"), "inputLitersCompletado");});//LISTO

input_submit_button.click(function (e) {registerClientDOM(input_name.val(), input_surname.val(),  input_liters.val())});

input_calc_button.click(function (e) {calcularPagoPorCliente()});//FALTA FUNCION

$("#SeccionClientes__titulo").click(function (e) {$("#SeccionClientes__contenido").slideToggle(500)});
for (let i = 0; i < 3; i++)
{
    $(`#btnHide_${i + 1}`).click(function (e) {$(`#btnHide_${i + 1}`).parent().parent().children(".SeccionClientes__listaClientes").slideToggle(500)});
}

$(document).ready($("#loadScreen").fadeOut(1000, function (e) {$(".MiFormulario__campo").animate({opacity: '1.0'}, 1500, function(){console.log("EXITO")})}));
$(document).ready(function () {
    Obtenerclientes();
});
var UrlServices = "http://localhost:63780";

function Obtenerclientes() {
    $.ajax({
        type: "GET",
        url: UrlServices + "/api/cliente/ObtenerClientes",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $('#tbody-clientes').empty();
            $.each(data, function (i, item) {
                var rows =
                    "<tr>" +
                    "<td id='cedula-cliente-" + item.IdCliente + "'>" + item.Cedula + "</td>" +
                    "<td id='nombre-cliente-" + item.IdCliente + "'>" + item.Nombre + "</td>" +
                    "<td id='apellido-cliente-" + item.IdCliente + "'>" + item.Apellido + "</td>" +
                    "<td id='apellido-telefono-" + item.IdCliente + "'>" + item.Telefono + "</td>" +
                    "<td>" +
                        "<a type ='button' class='btn btn-primary' " +
                    "onclick='ActivarModalEditar(" + item.IdCliente + ")'>" +
                            "<span class='glyphicon glyphicon-edit'></span>" +    
                        "</a >" +
                        "<a type='button' class='btn btn-danger' " +
                            "onclick='ActivarModalEliminar(-" + item.IdCliente + ")'>" +
                            "<span class='glyphicon glyphicon-trash'></span>" +
                        "</a>" +
                    "</td>" +
                    "</tr>";
                $('#tbody-clientes').append(rows);
            });
        },
        error: function (data) {
            alert("Error: por favor verifique la conexión de los servicios");
        }
    });
}

function ActivarModalEditar(Idcliente) {
    var Cedulacliente = $("#cedula-cliente-" + Idcliente).text();
    var Nombrecliente = $("#nombre-cliente-" + Idcliente).text();
    var ApellidoCliente = $("#apellido-cliente-" + Idcliente).text();
    var TelefonoCliente = $("#telefono-cliente-" + Idcliente).text();

    $("#modal-title-crear-editar").val("Editar cliente");
    $("#input-id-cliente").val(Idcliente);
    $("#input-cedula").val(Cedulacliente);
    $("#input-nombre").val(Nombrecliente);
    $("#input-apellido").val(ApellidoCliente);
    $("#input-telefono").val(TelefonoCliente);
    $("#modal-crear-editar").modal('show');
}

function ActivarModalCrear() {
    $("#modal-title-crear-editar").val("Crear cliente");
    $("#modal-crear-editar").modal('show');
}

function ActivarModalEliminar(Idcliente) {
    $("#modal-p-mensaje").text("¿Está seguro que desea elimnar este cliente?");
    $("#input-cliente-eliminar").val(Idcliente);
    $("#modal-eliminar").modal('show');
}

function CrearEditarcliente() {
    var cliente = {};
    if ($("#input-cliente-eliminar").val() == '' || $("#input-cliente-eliminar").val() > 0) {
        cliente = {
            Idcliente: $("#input-id-cliente").val(),
            Cedula: $("#input-cedula").val(),
            Nombre: $("#input-nombre").val(),
            Apellido: $("#input-apellido").val(),
            Telefono: $("#input-telefono").val()
        }
    } else if ($("#input-cliente-eliminar").val() < 0) {
        cliente = {
            Idcliente: $("#input-cliente-eliminar").val(),
            Cedula: null,
            Nombre: null
        }
    }
    var json = JSON.stringify(cliente);
    $.ajax({
        type: "POST",
        url: UrlServices + "/api/cliente/CrearEditarCliente",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: json,
        success: function (data) {
            LimpiarFormulario();
            Obtenerclientes();
            $('#modal-crear-editar').modal('hide');
            $("#modal-body-alerta").empty();
            $("#modal-titulo-alerta").text("Éxito");
            $("#modal-body-alerta").append("<p>" + data.Nota + "</p>");
            $("#input-cliente-eliminar").val(null);
            $('#modal-eliminar').modal('hide');
            $('#modal-alerta').modal('show');
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

function LimpiarFormulario() {
    $("#input-id-cliente").val(null);
    $("#input-cedula").val(null);
    $("#input-nombre").val(null);
    $("#input-apellido").val(null);
    $("#input-telefono").val(null);
}

function ValidarCamposRequerdos() {
    var Error = 0;
    if ($("#input-cedula").val() == '') {
        Error = 1;
        $("#input-cedula").addClass('input-error');
    }
    if ($("#input-nombre").val() == '') {
        Error = 1;
        $("#input-nombre").addClass('input-error');
    }
    if ($("#input-apellido").val() == '') {
        Error = 1;
        $("#input-apellido").addClass('input-error');
    }
    if ($("#input-telefono").val() == '') {
        Error = 1;
        $("#input-telefono").addClass('input-error');
    }
    if (Error == 1) {
        alert("Todos los campos son obligatorios");
    } else {
        $("#input-cedula").removeClass('input-error');
        $("#input-nombre").removeClass('input-error');
        $("#input-apellido").removeClass('input-error');
        $("#input-telefono").removeClass('input-error');
        CrearEditarcliente();
    }
}


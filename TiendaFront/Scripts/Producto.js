$(document).ready(function () {
    ObtenerProductos();
});

var UrlServices = "http://localhost:63780";

function ObtenerProductos() {
    $.ajax({
        type: "GET",
        url: UrlServices + "/api/Producto/ObtenerProductos",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $('#tbody-productos').empty();
            $.each(data, function (i, item) {
                var rows =
                    "<tr>" +
                    "<td id='nombre-producto-" + item.IdProducto + "'>" + item.NombreProducto + "</td>" +
                    "<td>" + item.ValorUnitario + "</td>" +
                    "<td>" +
                        "<a type ='button' class='btn btn-primary' " +
                            "onclick='ActivarModalEditar(" + item.IdProducto + "," + item.ValorUnitario + ")'>" +
                            "<span class='glyphicon glyphicon-edit'></span>" +
                        "</a >" +
                        "<a type='button' class='btn btn-danger' " +
                           "onclick='ActivarModalEliminar(-" + item.IdProducto + ")'>" +
                            "<span class='glyphicon glyphicon-trash'></span>" +
                        "</a >" +
                    "</td>" +
                    "</tr>";
                $('#tbody-productos').append(rows);
            });
        },
        error: function (data) {
            alert("Error: por favor verifique la conexión de los servicios");
        }
    });
}

function ActivarModalEditar(IdProducto, ValorUnitario) {
    var NombreProducto = $("#nombre-producto-" + IdProducto).text();
    $("#modal-title-crear-editar").val("Editar producto");
    $("#input-id-producto").val(IdProducto);
    $("#input-nombre-producto").val(NombreProducto);
    $("#input-valor-unitario").val(ValorUnitario);
    $("#modal-crear-editar").modal('show');
}

function ActivarModalCrear() {
    $("#modal-title-crear-editar").val("Crear producto");
    $("#modal-crear-editar").modal('show');
}

function ActivarModalEliminar(IdProducto) {
    $("#modal-p-mensaje").text("¿Está seguro que desea elimnar este producto?");
    $("#input-producto-eliminar").val(IdProducto);
    $("#modal-eliminar").modal('show');
}

function CrearEditarProducto() {
    var producto = {};
    if ($("#input-producto-eliminar").val() == '' || $("#input-producto-eliminar").val() > 0) {
        producto = {
            IdProducto: $("#input-id-producto").val(),
            NombreProducto: $("#input-nombre-producto").val(),
            ValorUnitario: $("#input-valor-unitario").val()
        }
    } else if ($("#input-producto-eliminar").val() < 0) {
        producto = {
            IdProducto: $("#input-producto-eliminar").val(),
            NombreProducto: null,
            ValorUnitario: null
        }
    }
    var json = JSON.stringify(producto);
    $.ajax({
        type: "POST",
        url: UrlServices + "/api/Producto/CrearEditarProducto",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: json,
        success: function (data) {
            LimpiarFormulario();
            ObtenerProductos();
            $('#modal-crear-editar').modal('hide');
            $("#modal-body-alerta").empty();
            $("#modal-titulo-alerta").text("Éxito");
            $("#modal-body-alerta").append("<p>" + data.Nota + "</p>");
            $("#input-producto-eliminar").val(null);
            $('#modal-eliminar').modal('hide');
            $('#modal-alerta').modal('show');
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

function LimpiarFormulario() {
    $("#input-id-producto").val(null);
    $("#input-nombre-producto").val(null);
    $("#input-valor-unitario").val(null);
}

function ValidarCamposRequerdos() {
    var Error = 0;
    if ($("#input-nombre-producto").val() == '') {
        Error = 1;
        $("#input-nombre-producto").addClass('input-error');
    }
    if ($("#input-valor-unitario").val() == '') {
        Error = 1;
        $("#input-valor-unitario").addClass('input-error');
    }
    if (Error == 1) {
        alert("Todos los campos son obligatorios");
    } else {
        $("#input-valor-unitario").removeClass('input-error');
        $("#input-valor-unitario").removeClass('input-error');
        CrearEditarProducto();
    }
}

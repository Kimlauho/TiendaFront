$(document).ready(function () {
    Obtenerventas();
    ObtenerClientes();
    ObtenerProductos();
});
var UrlServices = "http://localhost:63780";

function Obtenerventas() {
    var venta = {
        Idventa: null,
    }
    var json = JSON.stringify(venta);
    $.ajax({
        type: "Post",
        url: UrlServices + "/api/venta/ObtenerVentas",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: json,
        success: function (data) {
            $('#accordion-group-ventas').empty();
            $.each(data, function (i, item) {
                var rows =
                    "<div class='panel panel-default'>" +
                        "<div class='panel-heading'>" +
                            "<h4 class='panel-title'>" +
                                "<a type='button' class='btn btn-primary' onclick='ActivarModalCrear(" + item.IdVenta + ",{IdDetalleVenta})'>" +
                                    "<span class='glyphicon glyphicon-plus' ></span > " +
                                "</a>" +
                                "<a type='button' class='btn btn-danger'  onclick='ActivarModalEliminar(-" + item.IdVenta + ",null)'>" +
                                    "<span class='glyphicon glyphicon-trash' ></span > " +
                                "</a>" +
                                "<a class='accordion-toggle'  style='margin-left: 2%;' data-toggle='collapse' data-parent='#accordion' href='#collapse-" + i + "'>" +
                                item.IdVenta + "  - " + item.Nombre + " " + item.Apellido + "        -  Valor Total: " + item.ValorTotal +
                                "</a>" +
                            "</h4>" +
                        "</div>" +
                        "<div id='collapse-" + i +"' class='panel-collapse collapse in'>" +
                            "<div class='panel-body'>" +
                                "<table class='table table-striped table-condensed'>" +
                                    "<thead>" +
                                    "<tr>" +
                                    "<th>Nombre Producto</th>" +
                                    "<th>Valor Unitario</th>" +
                                    "<th class='space-width-td'></th>" +
                                    "</tr>" +
                                    "</thead>" +
                                    "<tbody>{tbody}</tbody>" +
                                    "</table>" +
                            "</div>" +
                        "</div>" +
                    "</div>";
                var trs = "";
                $.each(item._DetalleVenta, function (x, itemDetalle) {
                    rows = rows.replace("{IdDetalleVenta}", itemDetalle.IdDetalleVenta);
                        trs +=     
                        "<tr>" +
                            "<td id='nombre-producto-" + itemDetalle.IdDetalleVenta + "'>" + itemDetalle.NombreProducto + "</td>" +
                            "<td id='valor-unitario" + itemDetalle.IdDetalleVenta + "'>" + itemDetalle.ValorUnitario + "</td>" +
                            "<td>" +
                                "<a type='button' class='btn btn-primary'  onclick='ActivarModalEditar(" + itemDetalle.IdDetalleVenta + "," + item.IdVenta + "," + itemDetalle.IdProducto + ")'>" +
                                    "<span class='glyphicon glyphicon-edit' ></span > " +
                                "</a>" +
                                "<a type='button' class='btn btn-danger'  onclick='ActivarModalEliminar(" + item.IdVenta + ",-" + itemDetalle.IdDetalleVenta + ")'>" +
                                    "<span class='glyphicon glyphicon-trash' ></span > " +
                                "</a>" +
                            "</td>" +
                        "</tr>";
                });
                rows = rows.replace(",{IdDetalleVenta}", '');
                rows = rows.replace("{tbody}", trs);               
                $('#accordion-group-ventas').append(rows);
            });
        },
        error: function (data) {
            alert("Error: por favor verifique la conexión de los servicios");
        }
    });
}

function ObtenerClientes() {
    $.ajax({
        type: "GET",
        url: UrlServices + "/api/Cliente/ObtenerClientes",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $('#select-cliente').empty();
            var listaClientes = "";
            $.each(data, function (i, item) {
                listaClientes += "<option value='" + item.IdCliente + "'>" + item.Nombre + " " + item.Apellido + "</option>";
            });
            $("#select-cliente").append(listaClientes);
        },
        error: function (data) {
            alert("Error: por favor verifique la conexión de los servicios");
        }
    });
}

function ObtenerProductos() {
    $.ajax({
        type: "GET",
        url: UrlServices + "/api/Producto/ObtenerProductos",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $('#select-producto').empty();
            var listaProductos = "";
            $.each(data, function (i, item) {
                listaProductos += "<option value='" + item.IdProducto + "'>" + item.NombreProducto + "</option>";
            });
            $("#select-producto").append(listaProductos);
        },
        error: function (data) {
            alert("Error: por favor verifique la conexión de los servicios");
        }
    });
}

function ActivarModalEditar(IdDetalleVenta,IdVenta,IdProducto) {
    $("#select-cliente option[value='" + IdProducto + "']").attr("selected", "selected");
    $("#modal-title-crear-editar").val("Editar productos venta");
    $("#input-id-venta").val(IdVenta);
    $("#input-id-Detalle-Venta").val(IdDetalleVenta);
    $("#div-select-productos").show();
    $("#div-select-clientes").hide();
    $("#div-valor-total").hide();
    $("#modal-crear-editar").modal('show');
}

function ActivarModalCrear(IdVenta,IdDetalleVenta) {
    if (typeof IdVenta != "undefined") {
        $("#input-id-venta").val(IdVenta);
        $("#input-id-detalle-venta").val(IdDetalleVenta);
        $("#div-select-productos").show();
        $("#div-select-clientes").hide();
        $("#div-valor-total").hide();
        $("#modal-title-crear-editar").val("Editar detalle venta");
    } else {
        $("#input-id-venta").val(null);
        $("#input-id-detalle-venta").val(null);
        $("#div-select-productos").hide();
        $("#div-valor-total").hide();
        $("#div-select-clientes").show();
        $("#modal-title-crear-editar").val("Crear venta");
    }
    $("#modal-crear-editar").modal('show');
}

function ActivarModalEliminar(Idventa,IdDetalleVenta) {
    $("#modal-p-mensaje").text("¿Está seguro que desea elimnar este venta?");
    $("#input-venta-eliminar").val(Idventa);
    $("#input-detalle-venta-eliminar").val(IdDetalleVenta);
    $("#modal-eliminar").modal('show');
}

function CrearEditarVenta() {
    var venta = {};
    if ($("#input-venta-eliminar").val() == '' || $("#input-venta-eliminar").val() > 0) {
        venta = {
            IdVenta: $("#input-id-venta").val(),
            IdCliente: $("#select-cliente option:selected").val(),
            _DetalleVenta: $("#input-id-venta").val() == '' ? null : [{
                IdDetalleVenta: $("#input-id-Detalle-Venta").val() == '' ? null : $("#input-id-Detalle-Venta").val(),
                IdProducto: $("#select-producto option:selected").val()
            }]
        }
    } else if ($("#input-venta-eliminar").val() < 0) {
        venta = {
            Idventa: $("#input-venta-eliminar").val(),
            _DetalleVenta: $("#input-detalle-venta-eliminar").val() == '' ? null : [{
                IdDetalleVenta: $("#input-detalle-venta-eliminar").val()
            }]
        }
    }
    var json = JSON.stringify(venta);
    $.ajax({
        type: "POST",
        url: UrlServices + "/api/venta/CrearEditarVenta",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: json,
        success: function (data) {
            LimpiarFormulario();
            Obtenerventas();
            $('#modal-crear-editar').modal('hide');
            $("#modal-body-alerta").empty();
            $("#modal-titulo-alerta").text("Éxito");
            $("#modal-body-alerta").append("<p>" + data.Nota + "</p>");
            $("#input-venta-eliminar").val(null);
            $('#modal-alerta').modal('show');
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

function LimpiarFormulario() {
    $("#input-id-venta").val(null);
    $("#input-id-Detalle-Venta").val(null);
    $("#input-valor-total").val(0);
}
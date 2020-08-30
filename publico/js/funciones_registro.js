$(document).ready(function () {
});

var host = "whales.matanga.net.ar"; 
var port = 5000;
var endpoint = 'http://' + host + ':' + port;

// crea dropdown list de provincias
$('#provincia-group').on('click', () => { 

    $.ajax({
        url: endpoint + '/provincias',
        type: 'GET',
        dataType: 'json',
        success: (response) => {

            $("#provincia-group").empty();
            for( item of response ){
                var id_provincia= item.id_provincia;
                var nombre = item.nombre;
                
                $("#provincia-group").append("<option value=" + id_provincia + ">" + nombre + "</option>");
            }
        },
        error: () => {
            console.log("Ocurrió un error.");
        }    
    });
});

// añadido de foto en el front
$('#imagen-group').on('change', () => {

    var nombreFoto = $('#imagen-group')[0].files[0].name;
    $("#imagen-nombre-group").text(nombreFoto);
    //console.log(foto);

    //$("#avatar").attr("src",$('#imagen-group')[0].files[0]);

});

// envia form completo al backend
$('#formularioRegistro').on('click', (e) => {
    // https://forum.jquery.com/topic/upload-file-and-json-data-in-the-same-post-request-using-jquery-ajax
    e.preventDefault();

    var fd = new FormData();
    
    fd.append('imagen', $('#imagen-group')[0].files[0]);
    fd.append('nombre', $("#nombre-group").val());
    fd.append('apellido', $("#apellido-group").val());
    fd.append('direccion', $("#direccion-group").val());
    fd.append('ciudad', $("#ciudad-group").val());
    fd.append('id_provincia', $("#provincia-group option:selected").val());
    fd.append('telefono', $("#telefono-group").val());
    fd.append('email', $("#email-group").val());
    fd.append('pass', $("#pass-group").val());
    fd.append('dni', Number($("#dni-group").val()));
    fd.append('id_estado', $("#perfil-group option:selected").val());
    
    // quita todo lo añadido en notificaciones por errores
    $("#correo-group").removeClass('error')
        .removeAttr("data-toggle", "tooltip").removeAttr("title", "El correo ya existe")
        .removeAttr("data-placement", "right");

    $("#contrasena-group").removeClass("error")
        .removeAttr("data-toggle", "tooltip").removeAttr("title", "Los campos de password no coinciden")
        .removeAttr("data-placement", "left");

    $("#notificaciones").text("");

    var k = false;

    if ( $("#pass-group").val() === $("#pass-repetir-group").val() ) {
        k = true;
    } else {

        $("#contrasena-group").addClass("error")
        .attr("data-toggle", "tooltip").attr("title", "Los campos de password no coinciden")
        .attr("data-placement", "right"); 

        $("#notificaciones").text("");
        $("#notificaciones").text("Los campos de contraseña no coinciden");
    }

    if ( k === true && $("#nombre-group").val() != "" && $("#apellido-group").val() != "" &&
        $("#direccion-group").val() != "" && $("#ciudad-group").val() != "" &&
        $("#provincia-group option:selected").val() != "" && $("#telefono-group").val() != "" &&
        $("#email-group").val() != "" && $("#pass-group").val() != "" && Number($("#dni-group").val()) != "" &&
        $("#imagen-group").val() != "" && $("#perfil-group option:selected").val() != "" ) {
            
            $.ajax({
                url: endpoint + "/usuarios/" + $("#email-group").val(),
                type: 'GET',
                dataType: 'json',
                success: (response) => {
                    var existe = response.length;   // devuelve > 0 si hay al menos un usuario con el mismo correo
        
                    if ( existe === 0 ) {   // si es 0 no existe el correo, se añade el nuevo usuario
        
                        $.ajax({
                
                            url: endpoint + "/usuarios",
                            //dataType: 'json',
                            type: 'POST',
                            processData: false,
                            //contentType: 'application/json',
                            contentType: 'multipart/form-data',
                            contentType: false,
                            data: fd,
                            //success: (datos) => {
                            complete: (datos) => {

                                console.log(datos);

                                if ( datos ) {

                                    $("#notificaciones").text("");
                                    $("#notificaciones").text("Usuario creado correctamente");

                                } else {

                                    $("#notificaciones").text("");
                                    $("#notificaciones").text("Ocurrió un error");

                                }
    
                            },
                            error: () => {
                                console.log("Ocurrió un error.");
                            }
        
                        })
                
                    } else {

                            $("#correo-group").addClass("error")
                            .attr("data-toggle", "tooltip").attr("title", "El correo ya existe")
                            .attr("data-placement", "right");
                        
                            $("#notificaciones").text("");
                            $("#notificaciones").text("El correo ya existe");
                
                    }
        
                },
                error: () => {
                    console.log("Ocurrió un error.");
                }    
            });

    } else {

        if ( k === true ) {
            $("#notificaciones").text("");
            $("#notificaciones").text("Debe completar todos los campos");
        }

    }

});
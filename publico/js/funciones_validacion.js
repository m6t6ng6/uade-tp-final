$(document).ready(function () {
});

var host = "whales.matanga.net.ar"; 
var port = 5000;
var endpoint = 'http://' + host + ':' + port;

$('#formularioValidacion').on('click', (e) => {
    e.preventDefault();

    $("#correo-group").removeClass('error')
        .removeAttr("data-toggle", "tooltip").removeAttr("title", "El correo ya existe")
        .removeAttr("data-placement", "right");

    $("#contrasena-group").removeClass("error")
        .removeAttr("data-toggle", "tooltip").removeAttr("title", "Los campos de password no coinciden")
        .removeAttr("data-placement", "left");

    $("#codigo-group").removeClass("error")
        .removeAttr("data-toggle", "tooltip").removeAttr("title", "Los campos de password no coinciden")
        .removeAttr("data-placement", "left"); 

    $("#notificaciones").text("");

    if ( $("#code-group").val() != "" && $("#email-group").val() != "" &&
    $("#password-group").val() != "" ) {
        
        $.ajax({
            url: endpoint + "/usuarios/validacion",
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                "codigo": $("#code-group").val(),
                "email": $("#email-group").val(),
                "pass": $("#password-group").val()
            }),
            success: (response) => {
                var estado = response.status;

                if ( estado === 202 ) {
              
                    $("#notificaciones").text("");
                    $("#notificaciones").text("Usuario validado correctamente.");

                    setTimeout(() => window.location.replace("http://whales.matanga.net.ar/login.html"), 3000);

                } else if ( estado === 401 ) {
            
                    $("#correo-group").addClass("error")
                        .attr("data-toggle", "tooltip").attr("title", "no autorizado")
                        .attr("data-placement", "right");

                    $("#contrasena-group").addClass("error")
                        .attr("data-toggle", "tooltip").attr("title", "no autorizado")
                        .attr("data-placement", "right");

                    $("#codigo-group").addClass("error")
                        .attr("data-toggle", "tooltip").attr("title", "no autorizado")
                        .attr("data-placement", "right");
                  
                    $("#notificaciones").text("");
                    $("#notificaciones").text("No se pudo validar el usuario.");
            
                }
            },
            error: () => {
                console.log("Ocurrió un error.");
            } 

        });

    } else {

        $("#notificaciones").text("");
        $("#notificaciones").text("Debe completar todos los campos");
    }

});
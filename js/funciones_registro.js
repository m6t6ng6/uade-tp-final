$(document).ready(function () {
});

// crea dropdown list de provincias
$('#provincia-group').on('click', () => { 

    $.ajax({
        url: 'http://localhost:5000/provincias',
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

// envia form completo al backend
$('#formularioRegistro').on('click', () => {

    console.log("Envia el formulario de registro al backend.");

    // quita todo lo añadido en notificaciones por errores
    $("#correo-group").removeClass('error')
        .removeAttr("data-toggle", "tooltip").removeAttr("title", "El correo ya existe")
        .removeAttr("data-placement", "right");

    $("#notificaciones").text("");

    if ( $("#nombre-group").val() != "" && $("#apellido-group").val() != "" &&
         $("#direccion-group").val() != "" && $("#ciudad-group").val() != "" &&
         $("#provincia-group option:selected").val() != "" && $("#telefono-group").val() != "" &&
         $("#email-group").val() != "" && $("#pass-group").val() != "" && Number($("#dni-group").val()) != "" &&
         $("#imagen-group").val() != "" && $("#perfil-group option:selected").val() != "" ) {
             
            $.ajax({
                url: "http://localhost:5000/usuarios/" + $("#email-group").val(),
                type: 'GET',
                dataType: 'json',
                success: (response) => {
                    var existe = response.length;   // devuelve > 0 si hay al menos un usuario con el mismo correo
        
                    if ( existe === 0 ) {   // si es 0 no existe el correo, se añade el nuevo usuario
        
                        $.ajax({
                
                            url: "http://localhost:5000/usuarios",
                            dataType: 'json',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({
                                "nombre": $("#nombre-group").val(),
                                "apellido": $("#apellido-group").val(),
                                "direccion": $("#direccion-group").val(),
                                "ciudad": $("#ciudad-group").val(),
                                "id_provincia": $("#provincia-group option:selected").val(),
                                "telefono": $("#telefono-group").val(),
                                "email": $("#email-group").val(),
                                "pass": $("#pass-group").val(),
                                "dni": Number($("#dni-group").val()),
                                "imagen": $("#imagen-group").val(),
                                "id_estado": $("#perfil-group option:selected").val() 
                            }),
                            success: (datos) => {
                                console.log(datos);
       
                            },
                            error: () => {
                                console.log("Ocurrió un error.");
                            }
        
                        })
                
                    } else {
                
                        $("#correo-group").addClass("error")
                            .attr("data-toggle", "tooltip").attr("title", "El correo ya existe")
                            .attr("data-placement", "right");
                        
                        $("#notificaciones").text("El correo ya existe");
                
                    }
        
                },
                error: () => {
                    console.log("Ocurrió un error.");
                }    
            });

         } else {
             
            $("#notificaciones").text("Debe completar todos los campos");

         }
    
});
$(document).ready(function(){
    // C O N T A D O R E S
    var i=0;
    //AGREGANDO CLASE ACTIVE AL PRIMER ENLACE=================
  //  $(".perfil").hide();
    $(".Categorias[category='todos']").addClass('active_color');
    //FILTRANDO PRODUCTOS======================================
    $(".Categorias").click(function(){
        var catProduct= $(this).attr('category');
        console.log(catProduct);

        //ASIGNANDO LA CLASE ACTIVE AL ENLACE CORRESPONDIENTE
        $(".Categorias").removeClass('active_color');
        $(this).addClass('active_color');

        //OCULTANDO PRODUCTOS=============================
        $(".producto_card").css('transform', 'scale(0)')
        function hideProducts (){
            $(".producto_card").hide();

        } setTimeout(hideProducts,400);
        //MOSTRANDO PRODUCTOS=============================
        function showProducts(){
        
        $('.producto_card[category="'+catProduct+'"]').show();
        $('.producto_card[category="'+catProduct+'"]').css('transform', 'scale(1)');

        } setTimeout(showProducts,400);
    });
    //MOSTRAR TODOS LOS PRODUCTOS===========================
    $(".Categorias[category='todos']").click(function(){
        function showAllProducts(){
        $(".producto_card").show();
        $('.producto_card').css('transform', 'scale(1)');
        }setTimeout(showAllProducts,400);
    });
    //LLENAR EL PERFIL
     $('#pagprincipal').click(function(){
        var email = $("#email").val();
        console.log(email);
        var ciudad=  $("#ciudad").val();
        console.log(ciudad);
        $("#descripcion").val(email);
        $(".perfil").show();
        console.log( $("#descripcion").val());

     });
     // CARGAR EL CARRITO 
     $('.comprar').click(function(){
     
         i++;
         $('.carrito').text( "Tu carrito: " + i);

     });
     // VOLVER A LA PAG PRINCIPAL 
     $('#VolverPrincipal').click(function(){
         console.log("click");
        $('.carrito').text( "Tu carrito: " + i);
    });

 });

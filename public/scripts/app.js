var longitudActual = 0;
var contador = 110;

document.getElementById('contador').readOnly = true;

function cuenta(){
 var longitud = document.getElementById('textarea').value.length;

 if(longitud > longitudActual){

    var resto = longitud - longitudActual;
    var valor = contador - resto;
    longitudActual = longitud;
    contador = valor;
    document.getElementById('contador').value = valor;
 }

 if(longitudActual > longitud){

   var adicion = longitudActual - longitud;
   var valor = contador + adicion;
   longitudActual = longitud;
   contador = valor;
   document.getElementById('contador').value = valor;

 }

 if(contador <= 10){
   document.getElementById('contador').className="alerta";
 }else{
   document.getElementById('contador').className="tnormal";
 }


}

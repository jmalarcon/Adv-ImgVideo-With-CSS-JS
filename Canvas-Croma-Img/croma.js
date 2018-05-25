/*
por José Manuel Alarcón Aguín
campusMVP.es
  ___ __ _ _ __ ___  _ __  _   _ ___ _ __ _____   ___ __   ___ ___ 
 / __/ _` | '_ ` _ \| '_ \| | | / __| '_ ` _ \ \ / | '_ \ / _ / __|
| (_| (_| | | | | | | |_) | |_| \__ | | | | | \ V /| |_) |  __\__ \
 \___\__,_|_| |_| |_| .__/ \__,_|___|_| |_| |_|\_/ | .__(_\___|___/
                    |_|                            |_|             
*/
//Carga de la foto con croma
let tmpImg = document.createElement('img');
tmpImg.addEventListener('load', procesaCroma);
tmpImg.src = 'imgs/superman-croma.jpg';

///FUNCIONES PARA DETERMINAR LA TRANSPARENCIA DEL CROMA

//Función "naive" (ingenua) para determinar la transparencia de un pixel de la imagen en función de sus componentes
//Umbrales de detección de color
const umbralRojo = 130,
      umbralVerde = 110,
      umbralAzul = 150;
function getAlpha1(rojo,verde,azul, alfa) {
    if (rojo<umbralRojo && verde>umbralVerde && azul<umbralAzul   ) {
        return 0;    //Transparencia total
    }
    else {
        return alfa;
    }
}

//Función simple pero más elaborada para calcular transparencia.
//Cambiar constantes para afinar
//Con valores por defecto pone transparencias de más
const pesoRojoAzul = 1;
const pesoVerde = 1;
function getAlpha2(rojo, verde, azul, alfa) {
    var res = pesoRojoAzul*(rojo+azul)-pesoVerde*(verde);
    if (res >= 1)
        return alfa;
    else
        return 0;   //Transparencia total
}

///Función más elaborada 
var ratioColor = 1.9, umbral = 110;
function getAlpha3(r,g,b, alpha) {
    if (g>r && g>b && (g>r*ratioColor || g>b*ratioColor) && g > umbral)
        return 0;
    else
        return alpha;
}

////CREACIÓN DE LA TRANSPARENCIA

//La función que hace la transparencia
function procesaCroma() {
    let cvCroma = document.getElementById('croma');
    cvCroma.width = tmpImg.width;
    cvCroma.height = tmpImg.height;
    let ctx = cvCroma.getContext('2d');
    ctx.drawImage(tmpImg, 0, 0);

    let datosImg = ctx.getImageData(0, 0, cvCroma.width, cvCroma.height);
    let pixels = datosImg.data;

    for(let i=0; i<pixels.length; i+=4){
        let rojo = pixels[i],
            verde = pixels[i+1],
            azul = pixels[i+2],
            alfa = pixels[i+3];
            //Cambio de transparencia en función de diversas funciones de ajuste (getAlpha de 1 a 3)
            pixels[i+3] = getAlpha1(rojo, verde, azul, alfa);
            //Corrección de bordes (funciona bien con los bordes,pero a cambio estropea los colores internos)
            //pixels[i+1] = Math.min(verde, azul);
    }
        
    //Ahora limpio el canvas y pinto el resultado
    ctx.clearRect(0, 0, cvCroma.width, cvCroma.height);
    //pinto la imagen sin el fondo verde
    ctx.putImageData(datosImg, 0, 0);
}
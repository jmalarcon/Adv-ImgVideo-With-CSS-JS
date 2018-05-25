/*
por José Manuel Alarcón Aguín
campusMVP.es
  ___ __ _ _ __ ___  _ __  _   _ ___ _ __ _____   ___ __   ___ ___ 
 / __/ _` | '_ ` _ \| '_ \| | | / __| '_ ` _ \ \ / | '_ \ / _ / __|
| (_| (_| | | | | | | |_) | |_| \__ | | | | | \ V /| |_) |  __\__ \
 \___\__,_|_| |_| |_| .__/ \__,_|___|_| |_| |_|\_/ | .__(_\___|___/
                    |_|                            |_|             
*/

//Inicializa la cámara y empieza a capturar el vídeo
navigator.mediaDevices.getUserMedia({video: true})
  .then(camaraLista)
  .catch(err => console.error('getUserMedia() error:', err));

let imgCapt = null; //el objeto ImageCapture que dará acceso a la cámara

function camaraLista(mediaStream) {
  const videoTrack = mediaStream.getVideoTracks()[0];
  imgCapt = new ImageCapture(videoTrack);
  pintaFrame();
}

///FUNCIONES PARA DETERMINAR LA TRANSPARENCIA DEL CROMA

//Función "naive" (ingenua) para determinar la transparencia de un pixel de la imagen en función de sus componentes
//Umbrales de detección de color
const umbralRojo = 150,
      umbralVerde = 90,
      umbralAzul = 100;
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
const pesoRojoAzul = 0.7;
const pesoVerde = 1.2;
function getAlpha2(rojo, verde, azul, alfa) {
    var res = pesoRojoAzul*(rojo+azul)-pesoVerde*(verde);
    if (res >= 1)
        return alfa;
    else
        return 0;   //Transparencia total
}

///Función más elaborada
var ratioColor = 1.5, umbral = 90;
function getAlpha3(r,g,b, alpha) {
    if (g>r && g>b && (g>r*ratioColor || g>b*ratioColor) && g > umbral)
        return 0;
    else
        return alpha;
}

////CREACIÓN DE LA TRANSPARENCIA

//La función que hace la transparencia
function pintaFrame() {
    if (!imgCapt)
        return;

    imgCapt.grabFrame().then(imgCamara => {
            let cvCroma = document.getElementById('croma');

            let ctx = cvCroma.getContext('2d');
            // ctx.drawImage(imgCamara, 0, 0, cvCroma.width, cvCroma.height);  //Para reescalar la imagen del a cámara al tamaño de la imagen de fondo
            //Usa el tamaño real de la cámara, sin rescalar. Comentar la anterior y descomentar la siguiente.
            ctx.drawImage(imgCamara, 0, 0);
            
            // let datosImg = ctx.getImageData(0, 0, cvCroma.width, cvCroma.height);   //Imagen de cámara al tamaño del fondo
            //Comentar la anterior y descomentar la siguiente para que se use el tamaño real de la imagen de cámara
            let datosImg = ctx.getImageData(0, 0, imgCamara.width, imgCamara.height);

            let pixels = datosImg.data;

            for(let i=0; i<pixels.length; i+=4){
                let rojo = pixels[i],
                    verde = pixels[i+1],
                    azul = pixels[i+2],
                    alfa = pixels[i+3];
                    //Cambio de transparencia en función de diversas funciones de ajuste (getAlpha de 1 a 3)
                    pixels[i+3] = getAlpha3(rojo, verde, azul, alfa);
                    //Corrección de bordes (funciona bien con los bordes,pero a cambio estropea los colores internos)
                    //pixels[i+1] = Math.min(verde, azul);
            }
            //Ahora limpio el canvas y pinto el resultado
            ctx.clearRect(0, 0, cvCroma.width, cvCroma.height);
            //pinto la imagen sin el fondo verde
            // ctx.putImageData(datosImg, 0, 0);
            //Para centrarla abajo, comentar lo anterior y descomentar la siguiente
            ctx.putImageData(datosImg, (cvCroma.width-imgCamara.width)/2, cvCroma.height-imgCamara.height);
        
            window.requestAnimationFrame(pintaFrame);
        }).catch(err => console.error('Se ha producido un error al acceder a la cámara: ', err));
}
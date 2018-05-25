/*
por José Manuel Alarcón Aguín
campusMVP.es
  ___ __ _ _ __ ___  _ __  _   _ ___ _ __ _____   ___ __   ___ ___ 
 / __/ _` | '_ ` _ \| '_ \| | | / __| '_ ` _ \ \ / | '_ \ / _ / __|
| (_| (_| | | | | | | |_) | |_| \__ | | | | | \ V /| |_) |  __\__ \
 \___\__,_|_| |_| |_| .__/ \__,_|___|_| |_| |_|\_/ | .__(_\___|___/
                    |_|                            |_|             
*/
const detectorCaras = new FaceDetector();

//Esta función detecta las caras en una imagen o un objeto canvas que le pasemos
async function detectarCaras(img) {
    let caras = await detectorCaras.detect(img);
    return caras;
}

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

//Pinta lo de la cámara identificando caras
//La función que hace la transparencia
function pintaFrame() {
    if (!imgCapt)
        return;

    imgCapt.grabFrame().then(async imgCamara => {
            let cvCroma = document.getElementById('camara');
            cvCroma.width = imgCamara.width;
            cvCroma.height = imgCamara.height;

            let ctx = cvCroma.getContext('2d');
            ctx.drawImage(imgCamara, 0, 0);

            var carasDetectadas = await detectarCaras(imgCamara);
            carasDetectadas.forEach(cara => {
                //console.log(cara.boundingBox);
                let caja = cara.boundingBox;
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'red';
                ctx.rect(caja.x, caja.y, caja.width, caja.height);
                ctx.stroke();
                
            });

            window.requestAnimationFrame(pintaFrame);

        }).catch(err => console.error('Se ha producido un error al acceder a la cámara: ', err));
}
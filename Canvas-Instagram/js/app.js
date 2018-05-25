/*
por José Manuel Alarcón Aguín
campusMVP.es
  ___ __ _ _ __ ___  _ __  _   _ ___ _ __ _____   ___ __   ___ ___ 
 / __/ _` | '_ ` _ \| '_ \| | | / __| '_ ` _ \ \ / | '_ \ / _ / __|
| (_| (_| | | | | | | |_) | |_| \__ | | | | | \ V /| |_) |  __\__ \
 \___\__,_|_| |_| |_| .__/ \__,_|___|_| |_| |_|\_/ | .__(_\___|___/
                    |_|                            |_|             
*/
/* variables auxiliares */
var currFilter = 'filter-ninguno';
var imgPrincipal = document.getElementById('MainImage');
var imgPrincipalContenedor =  document.getElementById('MainImageContainer');
var previews = document.getElementsByClassName('preview');
var selArch = document.getElementById('SelectorArchivos');
var imgOriginal = document.createElement("img");    //Guardará la imagen original, en memoria

/* Funciones auxiliares */
function cargarImagenEnCanvas(imgSrc) {
    //Copiamos la imagen al canvas
    imgOriginal.addEventListener('load', function(){
        imgPrincipal.width = imgOriginal.width;
        imgPrincipal.height = imgOriginal.height;
        var contexto = imgPrincipal.getContext('2d');
        contexto.drawImage(imgOriginal, 0, 0);
    });
    imgOriginal.src = imgSrc;
}

//Pinta la imagen de nuevo desde la original y le aplica el filtro indicado
function aplicarFiltro(filtro, color, blendMode) {
    //Copiamos la imagen al canvas
    var contexto = imgPrincipal.getContext('2d');
    //Se limpia la actual
    contexto.clearRect(0, 0, imgPrincipal.width, imgPrincipal.height)
    //Se pinta la imagen
    if (filtro && filtro != '') contexto.filter = filtro;
    contexto.drawImage(imgOriginal, 0, 0);
    contexto.filter = 'none';
    //Y se aplica un modo de mezcla en caso de que sea necesario (versión "sucia" y no totalmente funcional tratando de clonar las de CSS. ¡¡No todas funcionan!!)
    if (color && blendMode && blendMode != '') {
        contexto.globalCompositeOperation = blendMode;
        contexto.fillStyle = color;
        contexto.fillRect(0, 0, imgPrincipal.width, imgPrincipal.height);
    }
}

//Carga la imagen indicada por su origen en la principal y todas las vistas previas
function cargaImagen(imgSrc) {
    cargarImagenEnCanvas(imgSrc);
    for(let i=0; i<previews.length; i++) {
        previews[i].getElementsByTagName('img')[0].src = imgSrc;
    }
    //Se muestran las vistas previas
    document.getElementById('Previews').classList.remove('d-none');
    //y el botón de grabar
    document.getElementById('Grabar').classList.remove('d-none');
}

/* Eventos */
//Click en el botón de cargar
document.getElementById('Cargar').addEventListener('click', function(ev){
    selArch.click();
});

document.getElementById('Grabar').addEventListener('click', function(ev){
    var imgfinalBase64 = imgPrincipal.toDataURL();
    var enlaceDescarga = document.getElementById('descargar');
    //Por defecto graba en PNG, pero se puede cambiar el tipo a otros formatos (jpg, bmp, webp, tiff, ico...)
    //Por ejemplo, comentando esta línea siguiente y descomentando las dos posteriores se cambia a JPG
    enlaceDescarga.download = "Imagen.png"
    // enlaceDescarga.type = 'image/jpg';
    // enlaceDescarga.download = "Imagen.jpg"
    enlaceDescarga.href = imgfinalBase64;
    enlaceDescarga.click();
});

//Cuando se seleccione un archivo de imagen
selArch.addEventListener('change', function(ev){
    if (!FileReader) {
        alert("Debes utilizar un navegador moderno que soporte FileReader!!")
        return;
    }

    let archs = selArch.files;
    if (archs && archs.length > 0 && archs[0].type.match(/image\/.*/)){
        let fr = new FileReader();
        //Se carga la imagen en las imágenes cuando acabe de leerse el archivo
        fr.onload = function() {
            cargaImagen(fr.result);
        }
        //Se lee la imagen desde disco
        fr.readAsDataURL(archs[0]);
    }
});

//Al pulsar sobre cualquier preview
document.getElementById('Previews').addEventListener('click', function(ev){
    //Se determina cuál es el elemento sobre el que se ha pulsado
    let currImg =  ev.target ? ev.target: ev.srcElement;
    //Todas las imágenes tienen un div envolviéndolas con un elemento ::before que las cubre, y por eso se detecta en éste.
    //No puede aplicarse el filtro directamente a las imágenes porque éstas no pueden contener otros elementos y es necesario para el elemento ::before de algunos filtros.
    if(currImg.tagName == 'DIV') {
        //se averigua qué filtro tiene
        currFilter = window.getComputedStyle(currImg).getPropertyValue('filter');
        //Y si tiene color y modo de mezcla en el elemento :before
        var color = window.getComputedStyle(currImg, '::before').getPropertyValue('background-color');
        var blendMode = window.getComputedStyle(currImg, '::before').getPropertyValue('mix-blend-mode');
        //y se le aplica a la imagen principal aplicándole el mismo filtro de CSS al Canvas
        aplicarFiltro(currFilter, color, blendMode);
    }
});
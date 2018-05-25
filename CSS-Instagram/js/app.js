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

/* Funciones auxiliares */

//Carga la imagen indicada por su origen en la principal y todas las vistas previas
function cargaImagen(imgSrc) {
    imgPrincipalContenedor.classList.remove(currFilter);
    imgPrincipal.src = imgSrc;
    for(let i=0; i<previews.length; i++) {
        previews[i].getElementsByTagName('img')[0].src = imgSrc;
    }
    //Se muestran las vistas previas
    document.getElementById('Previews').classList.remove('d-none');
}

/* Eventos */
//Click en el botón de cargar
document.getElementById('Cargar').addEventListener('click', function(ev){
    selArch.click();
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
    let antFilter = currFilter;
    //Todas las imágenes tienen un div envolviéndolas con un elemento ::before que las cubre, y por eso se detecta en éste.
    //No puede aplicarse el filtro directamente a las imágenes porque éstas no pueden contener otros elementos y es necesario para el elemento ::before de algunos filtros.
    if(currImg.tagName == 'DIV') {
        //se averigua qué filtro tiene
        for(let i=0; i<currImg.classList.length; i++) {
            if (currImg.classList[i].startsWith('filter')) {
                currFilter = currImg.classList[i];
                break;
            }
        }
        //y se le aplica a la imagen principal quitándole antes el otro
        imgPrincipalContenedor.classList.remove(antFilter);
        imgPrincipalContenedor.classList.add(currFilter);
    }
});
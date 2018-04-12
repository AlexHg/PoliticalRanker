//PoliticalRanker
var $PR = {
    // Obtiene el boton para activar el analizador
    button: document.querySelector("#AnalyzerActionButton"), 
    // Obtiene el campo donde se ingresa el parrafo
    input: document.querySelector("#AnalyzerIN"),
    // Obtiene el campo donde se pondrá el resultado
    output: document.querySelector("#AnalyzerOUT"),
    // Obtiene la coleccion de palabras en PRCollection.js
    collection: PRCollection,
}
function acent_rmv(s) {
    var r=s.toLowerCase();
    r = r.replace(new RegExp(/\s/g),"");
    r = r.replace(new RegExp(/[àáâãäå]/g),"a");
    r = r.replace(new RegExp(/[èéêë]/g),"e");
    r = r.replace(new RegExp(/[ìíîï]/g),"i");
    r = r.replace(new RegExp(/ñ/g),"n");                
    r = r.replace(new RegExp(/[òóôõö]/g),"o");
    r = r.replace(new RegExp(/[ùúûü]/g),"u");        
    return r;
}

var Analyzer = function() {
    var result = []; // Resultado a guardar
    var output_text = ""; // Resultado a imprimir

    // Toma el texto insertado y cambia a minusculas todas las letras
    var input_text = $PR.input.value.toLowerCase();
    
    // Recorre las categorias de la coleccion
    for(var categoria in $PR.collection){
        // Contador de coincidencias entre las palabras de una categoria y el texto insertado
        var contador = 0; 
        // Lista de palabras en la categoria
        var palabras_list = $PR.collection[categoria]; 
        // Recorre las palabras de cada categoria
        for(var palabra_index in palabras_list){
            //Convierte todas las letras de la palabra en minusculas
            var palabra = palabras_list[palabra_index].toLowerCase(); 

            var p1 = " "+palabra; // Palabra con un espacio anterior
            var p2 = palabra+" "; // Palabra con un espacio posterior

            // Busca coincidencias de entre las dos palabras y el texto insertado
            if( input_text.indexOf(p1) > -1 ){
                contador++; // Contador + 1
            }else if( input_text.indexOf(p2) > -1 ){
                contador++; // Contador + 1
            }else{
                //Signos especiales y palabras sin espaciado
                switch(palabra){
                    case "!":
                    case "¡":
                    case "?":
                    case "¿":
                        if( input_text.indexOf(palabra) > -1 ){
                            contador++; // Contador + 1
                        }
                        break;
                }
            }
        }
        // Agrega el resultado de la categoria a un string 
        output_text += categoria+": "+contador+"<br>";
        //- y a un arreglo
        result[categoria] = contador;
       
    }
    // Imprime el resultado en pantalla
    $PR.output.innerHTML = output_text;
    //- y en consola
    console.log(result);
}


$PR.button.addEventListener(
    "click", Analyzer
);
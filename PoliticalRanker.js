
//PoliticalRanker
var $PR = {
    // Obtiene el boton para activar el analizador
    button: document.querySelector("#AnalyzerActionButton"), 
    // Obtiene el campo donde se ingresa el parrafo
    input: document.querySelector("#AnalyzerIN"),
    // Obtiene el campo donde se pondrá el resultado
    output: document.querySelector("#AnalyzerOUTs"),
    // Obtiene el lienzo donde se dibujará la grafica de radar
    canvas: document.getElementById("resultadosRadar"),
    // Obtiene el campo donde se pondrá la interpretación
    interpretacion: document.getElementById("interpretacion"),
    // Obtiene la coleccion de palabras en PRCollection.js
    collection: PRCollection
    
}


var Analyzer = function() {
    // Reinicia los valores globales
    var $PRcat = [];
    var $PResult = [];
    var $PRcat2 = [];
    var $PResult2 = [];

    var result = []; // Resultado a guardar tipo 1
    var result2 = []; // Resultado a guardar tipo 2
    var output_text = ""; // Resultado a imprimir

    // Toma el texto insertado y cambia a minusculas todas las letras
    var input_text = $PR.input.value.toLowerCase();
    
    // El comparador guarda el valor mayor del arreglo de acuerdo al contador y a la prioridad
    var comparador = {
        categoria: "",
        contador: -1, // Mayor es mejor
        prioridad: 1000 // Menor es mejor
    }
    var comparador2 = {
        categoria: "",
        contador: -1,
        prioridad: 1000
    }

    // Recorre las categorias de la coleccion
    for(var categoria in $PR.collection){
        
        // Contador de coincidencias entre las palabras de una categoria y el texto insertado
        var contador = 0; 
        // Lista de palabras en la categoria
        var cat = $PR.collection[categoria];
        var palabras_list = cat.palabras; 
        var prioridad = cat.prioridad;
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
        if(cat.tipo == 1){ 
            result[categoria] = contador; 
            
            if(
                (contador > comparador.contador) ||
                (contador == comparador.contador && prioridad < comparador.prioridad)
            ){
                comparador.categoria = categoria;
                comparador.contador = contador;
                comparador.prioridad = prioridad;
            }

             // Los agrega a las listas de datos a graficar (grafica de radar)
            $PRcat.push(categoria);
            $PResult.push(contador); 

            
        }
        else if(cat.tipo == 2){ 
            result2[categoria] = contador; 
            //console.log(result2);
            if(
                (contador > comparador2.contador) ||
                (contador == comparador2.contador && prioridad < comparador2.prioridad)
            ){
                comparador2.categoria = categoria;
                comparador2.contador = contador;
                comparador2.prioridad = prioridad;
            }

            $PRcat2.push(categoria);
            $PResult2.push(contador);
        }    
       
    }
    // Imprime el resultado en pantalla
    //$PR.output.innerHTML = output_text;
    //- y en consola
    //console.log(result);

    // Agrega las cartas de los resultados obtenidos
    addCards($PRcat2, $PResult2, $PR.output);
    // Dibuja la grafica de radar con los resultados obtenidos
    RadarChart($PR.canvas, $PRcat, $PResult);

    if(comparador.contador > 0 && comparador2.contador > 0){
        $PR.interpretacion.innerHTML = "<b>INTERPRETACION:</b> El texto es " + comparador.categoria + " y " + comparador2.categoria;
    } else {
        $PR.interpretacion.innerHTML = "";
    }
    
}

function addCards(pr_labels, pr_data, output){
    output.innerHTML = "";
    for(var i = 0; i < pr_labels.length ; i++){
        output.innerHTML += '<div class="v-card"><span class="number">'+pr_data[i]+'</span><span class="class">'+pr_labels[i]+'</span></div>';
    }
}

function callFB(){
    var fbl = document.querySelector("[name=facebook]").value; 
    var graph_access_token = "242130709666458|_qhwNK6gw62BzBgql2eb5u4ElqA";
    var url = "https://graph.facebook.com/v2.12/"+fbl+"?access_token="+graph_access_token;

    ajax_get( url, function( data ) {
        if(data.name != null){
            $PR.input.value = data.name;
        }else if(data.description != null){
            $PR.input.value = data.description;
        }
    });

    
}

function RadarChart(canvas, pr_labels, pr_data){
    var myRadarChart = new Chart(canvas, {
        type: 'radar',
        borderColor: "white",
        data: {
            labels: pr_labels,
            datasets: [{
                label: 'Función',
                data: pr_data,
                backgroundColor: [
                    'rgba(0, 123, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 123, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scale: {
                // Hides the scale
                display: true,
                ticks: {
                    suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                    // OR //
                    beginAtZero: true   // minimum value will be 0.
                }
            },
            fullWidth: false
        }
    });
}      

function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    var flag = 0;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                //console.log(err.message + " in " + xmlhttp.responseText);
                alert("El recurso que busca no existe");
                return;
            }
            callback(data);
        }else if(xmlhttp.status == 400 || xmlhttp.status == 404 || xmlhttp.status == 403){
            if(flag == 0){
                alert("El recurso que busca no existe");
                flag = 1;
            }
            
        }
    };
 
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

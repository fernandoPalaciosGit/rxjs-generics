##PROBLEMAS DE EJECUCIONES ASINCRONAS
 CALLBACK HELL: encadenar multiples llamadas asincronas
- RACE CONDITIONS: lanzar dos reques asincronas en el mismo callstack y resolver el orden de llegada

- MEMORY LEAKS : la memoria de los nodos o hilos donde se ejecutan las instrucciones asincronas se paralizan

- COMPLEX STATE MACHINES

- UNCAUGHT ASYNC ERRORS:


##DISEÑO DE TAREAS ASINCRONAS (modelos antiguos)
VARIABLES DE CONTROL: cuando se quieren lanzar varias peticiones asincronas a un servicio, se pueden tener FLAGs de control de estado en cada peticion que permitan saber al otro contexto de ejecucion asincrona si puede o no resolver su estado.
El problema de esta nmodalidad es que no escala muy bien por complejidad, y el codigo deja de mantenerse


##NUEVA METODOLOGIA
programar las funciones a traves de unas funiones flexibles reutilizables.


la idea del ejercicio es utilizar el stream de datos que proporciona los eventos de mouse como un array de datos a iterar.
como las accines del usuario sobre el mouse se sucriben y asocian a evenmtos del mbrowser de manera asincrona, hay que andar con cuidado en el manejo de informacion de este stream de eventos.
se trata de aprender como relacionar estos dos patrones y usarlo para resolber problemas de asincronia


#Patrones de diseño
- ITERADOR:
- OBSERVER:

### ITERADOR: prodcer + consumer
[1, 2, 3].iterator() -> devuelve un iterador
- esta modalidad la utikliza el for of,
- se puede aplicar a cualquier modelo de datos: arrays, hashmaps
- en este patron, el [consumer es quien pide los datos] al iterador, es el encargado de la secuencia

### OBSERVER
document.addEventListener('mousemove', function next(ev) {log(ev)} , false);
el stream de datos generados por la interaccion del usuario es el producer: 'mouseevent'
el callbaxk asociado es el consumer
en este caso es el [producer que hace push] para la secuencia de operaciones

- se puede deducir que son patrones simetricos, y se puede usar para resolver problemas de asincronia


#APLICACIONES
existe una proliferacion de APIs en la web qu eutilizan esta idea: acciones asincronas que hacen push de datos sobre la aplicaion (browser)
---
DOM Events
Websockets
server side events (Bidirectional comunication)
node streams
Services workes
Httprequest
setinterval
---

- CONCLUSION: es un error, deberiamos tener una unica interfaz que usemos para ejecutar (hacer push) de acciones asincronas


OBSERVABLES: son una coleccion de llamadas que llegan unas tras otras.
-----
const mouseMoves = Observable.forEach(elementDom, 'mousemove'); // lo construiremos con la libreria de Ngrx
const subscriptions = moseMoves.forEach(
    (event) => log('occurs for each event'),
    (error) => log('occurs on any error event'),
    () => log('occurs at the end of the observable iteration')
);
subscriptions.dispose(); //end the observer over mouse events;
-----
En este caso el [producer] es el Observer de eventos de mouse (mouseMoves)
el [consumer] son las suscripciones de manejo de estado (subscriptions)

el metodo de dispose detiene el push de resolucion del observer.  NO ejecuta el callback de finalizacion de stream.


INTERFAZES
[takeUntil] ObservableResolution = ObservableSource.takeUntil(ObservableStopper)

se trata de construir un observable que solucionara el observableSource cuando el observable stopper envie cualquier señal.
De esta manera no es necesario desbindear (dipose) el observableSource, porque ya tenemo uno encargado de dar la señal de finish
Aplicado a las interfaces de DomListener, con este metodo ya no es necesario detener el listener.(no mas removeEventListener)

NO CREES EVENTOS DE DESUBSCRIPTION: mejor es crear streams de datos que generen una condicion para que el stream de eventos finalize.

[switchLastest]: interfaz para controlar una coleccion de Observables
se trata de descartar la secuencia de observables a medida que se van introdduciendo en nuestra coleccion
de manera que si un stream de datos que llega a la coleccion es lo suficientemente largo como para no resolverse antes de que el sigiente observable de datos llegue a nuestra coleccion, se cancelara y tendra importancia este ultimo que entra (es como una prioridad de colas)
internamente llama al observer.dispose() del observable que llego fuera de tiempo

normalmente tratamos con 3 acciones asincronas a la vez: mouse events, peticion asincrona y animacion
La idea es combinar todas estas acciones con Observers


---------------------------
PROBLEMA DEL RACE CONDITION DE UN CONTROL AUTOCOMPLETE [UTOCOMPLETE BOX]
- nos topamos con un race condition de los resultados de busqueda de un input frente a los que pueda estar buscando secuencialmente el usuario
- hay qeu controlar los tiempos de carga de estas request http que te devuelven los datos
el sistema deberia ser lo suficientemnte eficaz para que anteponga (resulva) los resultados de las nuevas busquedas frente a las primeras que se realizaron (las que ya no ninteresan al usuario). -> [switchLatest]
- el [debouncing | throttle] se debe respetar: esto es que antes de añadir un nuevo Observer http a la pila Observers hay que esperar un tiempo que permita al usuario construir una palabra adecuada

PASOS PARA DETERMINAR EL SISTEMA DE OBSERVER
- Que coleccion de observers tengo (eventos de mouse -> keypress) [1]
- Que coleccion de observers necesito (resultados de busqueda -> resultsSet) [2]
- como obtener los datos de los observers que tengo a lo que neecesito (requests http -> fetch) [3]
- una vez que tengo la coleccion de observers que necesito, como hago para extraer los datos  (callback onNext: updateResults) [4]

estoy declarando las condiciones necesarias para que finalizen los streams de datos, no voy a controlar la secuencia de ejecucion de interfaces [solo comportamiento de los Observers (coleccion de stream)]

[javascript]
const keyPressMouse = Observable.forEach(input, 'mousedown'); [1]
const searchResults =
        // una puerata de entrada a una determinada secuencia de datos cada 250 milisegundos
        keyPressMouse.throttle(250)
        // mapeamos el stream de inputs para resolver querys al servidor de searches
        .map((input) => {
            // descartamos el anterior stream de datos por cuando se resuelva el que entra en la pila
            return getJson(`/search?q=${input.value}`).takeUntil(keyPressMouse) [3]
        })
        // generamos una lista de resultados (en formato de stream)
        .concatAll(); [2]

// REFACTOR
// generamos una lista de resultados, una  pila de streams, el ultimo que llega es el primero y revoca los mas lentos
const searchResults.throttle(250).map((input) => getJson(`/search?q=${input.value}`)).switchLatest();

// resolver los datos
searchResults.forEach(
    (resultSet) => log(resultSet), [4]
    (error) => log('server down')
);
------------

PROMISE
se utilizan como metodo para controlar las acciones asincronas
por ahora estamos tratando nuestras acciones como stream de datos y estos gestionado por Observables
pero las Promesas tienen un problema: [no pueden ser canceladas]

es una interfaz sencilla que permite resolver elegantemente acciones directas, pero en una interfaz de usuaio lideamos con acciones continuas, que debemos cancelar (streams)

Un observable esta diseñado para resolver varios datos, o uno solo como hace la promesa
ideal para resolver eventos

COMPORTAMIENTO LAZY DE UN OBSERVABLE
un observable no empieza a resolver datos hasta que no iteras sobre sus resultados
hasta el momento lo que hace es acumular y resolver las acciones para almacenar streams, pero no genera el output hasta que no lo iteras

para la mayoria de casos a resolver en una interfaz UI en los que hay que modelas peticiones asincronas, un observable es mas adecuado que una promesa.
- porque se pueden cancelar
- se pueden reintentar
- porque algunas request pueden a su vez resolver stream de datos

EJEMPLO DE PLAYER (cada vez que el uusario hace click en ver un video)
// el usuario se debe autorizar (para ver el video) de manera asincrona por cualquier video que desee ver: será un observable que lanza onNext cuando finaliza y on error cuando el video no se puede ver (por motivo de restricciones)
const playerAttempts = Observable.forEach(movieThumbnail, 'click');
const cancels = Observable.forEach(cancelButton, 'click');
const authorizations = player.init().map(() => {// este stream solo devuelve un valor de inicializacion
    return playerAttempts.map((movie) => {
        return player.authorize(movie)
            .catch((error) => Observable.empty)
            .takeUntil(cancels);
    }).concatAll();
}).concatAll();

authorizations.forEach(
    (licence) => player.play(licence),
    (error) => log('can´t play right now'),
);

REDUCE()
al construir un array, cuando quieres hacer una comparacion de varios elementos, debes usar un reduce(), porqu es el unico metodo del prototype de arrray que maneja 2 valores en el iterador.

ZIP -> CREMALLERA
se trata de un metodo que hace merge entre arrays
recibe el nombre por su comportamiento, ya que escoje cada indice de los arrays y los mergea hasta que no encuentra ningulna correclacion y deja de mergear 

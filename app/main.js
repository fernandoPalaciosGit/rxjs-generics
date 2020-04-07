import { fromEvent, interval, Observable, } from 'rxjs';
import {
    take,
    takeUntil,
    concatMap,
    map,
    switchMap,
    distinctUntilChanged,
    retry,
    throttleTime, filter, tap
} from 'rxjs/operators';
import ObservableTest from './observable_prototype';

// todo: EXAMPLE 1: Subscribing to an event and subscribe thrice
const button = document.getElementById('button');
const buttonClickEvent$ = fromEvent(button, 'click').pipe(take(3));
buttonClickEvent$.subscribe(() => {
    console.info('STOP example 1 on 3 click');
});

// todo: EXAMPLE 2 : stop buffering until click on event
const buttonStop = document.getElementById('button-stop');
const onStopButton = fromEvent(buttonStop, 'click');
const bufferExample$ = interval(1000).pipe(takeUntil(onStopButton));
bufferExample$.subscribe((x) => console.info('buffer'));

// todo: EXAMPLE : subscribe to drags
const boxDrag = document.getElementById('box-drag');
const draggable = document.querySelector('.draggable');
const onMouseDown$ = fromEvent(draggable, 'mousedown');
const onMouseMove$ = fromEvent(boxDrag, 'mousemove');
const onMouseOut$ = fromEvent(boxDrag, 'mouseout'); // todo: cancel mouseDrag on move out the box
const onMouseUp$ = fromEvent(boxDrag, 'mouseup');
const onMouseDrag$ = onMouseDown$
    .pipe(concatMap(({ offsetX, offsetY }) => {
        return onMouseMove$.pipe(map(({ pageX, pageY }) => ({
            horizontal: pageX - boxDrag.offsetLeft - offsetX,
            vertical: pageY - boxDrag.offsetTop - offsetY
        })), takeUntil(onMouseUp$))
    }));

onMouseDrag$.subscribe(({ horizontal, vertical }) => {
    draggable.style.left = `${horizontal}px`;
    draggable.style.top = `${vertical}px`;
});


// todo: EXAMPLE4: create an observable to search in wikipedia
let URL = "https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&list=search&format=json&search=";
const getSearchWikipedia = (term) => fetch(`${URL}${encodeURIComponent(term)}`).then((response) => response.json()).then(([, search]) => search);
// creamos un observable de una peticion xhr
const getResultsSearch = (term) => new Observable((observable) => {
    let clearSearch = false;

    if (!clearSearch) {
        getSearchWikipedia(term).then((results) => {
            observable.next(results);
            observable.complete();
        }).catch((error) => {
            // observable.error(error); // this will remove the subscription NOT USE UNTIL WE MUST NOT SHOW RESULTS
            retry(); // when the server or the connection is down, retry three times the request of this observable
        });
    }
    return () => clearSearch = true;
});
// test del observable
getResultsSearch('terminator').subscribe((result) => console.log(result));

// todo: EXAMPLE: asociamos el input al observable de la search
function onSubscribeSearchesWikipedia() {
    const onTypeSearch$ = fromEvent(searchInput, 'keypress');
    const closeSearches$ = fromEvent(document.getElementById('button-close-search'), 'click');

    return onTypeSearch$.pipe(
        throttleTime(300),
        filter(({ keyCode }) => keyCode !== 32), // avoid sending when press space
        map(() => searchInput.value),
        distinctUntilChanged(), // evitamos que se puedan repetir las busquedas, observables que sresuelvan los mismo datos
        filter((search) => search.trim().length > 0), // avoid sending empty string
        switchMap((search) => getResultsSearch(search)), // esto permite quedarese con el ultimo observable que se lanza, asi los anteriores dse descartan , incluso si aun estan en proceso de resolverse (se descarta el tiempo de httpRequest)
        takeUntil(closeSearches$.pipe(tap(closeSearchesWikipedia))) // trakeUntil llamara internamente al dispose del observer tanto del onTypeSearch$ como del closeSearches$ (se dejara dejara de ssuscribir eventos en esos elementos)
    )
}

// todo: EXAMPLE6: open and close searches
const searchButton = document.getElementById('button-search');
const containerTextArea = document.getElementById('container');
const resultsTextArea = document.getElementById('textArea');
const searchInput = document.getElementById('input-text');

function openSearchesWikipedia() {
    containerTextArea.style.display = 'block';
}

function closeSearchesWikipedia() {
    containerTextArea.style.display = 'none';
    resultsTextArea.value = '';
    searchInput.value = '';
}

function printResults(result) {
    resultsTextArea.value = result;
}

function logErrorResults(error) {
    console.log(error)
}

fromEvent(searchButton, 'click').pipe(
    // accion 1 cuuando onclick: se abre el formulario
    tap(openSearchesWikipedia),
    // accion 2 onclick: inicializo el autocomplete
    switchMap(() => onSubscribeSearchesWikipedia()), // necesito resolverlo com switch para que tras continuos clicks, solo me quede con el ultimo onTypeSearch$
).subscribe(printResults, logErrorResults);


// todo: EXAMPLE 7 - test Observable prototype
const buttonSearch = document.getElementById('search-button-test-observable');
const onClickSearch$ = ObservableTest.fromEvent(buttonSearch, 'click');

onClickSearch$
    .map(({ pageX }) => `${pageX + 50}px`)
    .take(3)
    .subscribe(
        (result) => console.log('click', result),
        () => console.log('error'),
        () => console.log('complete')
    );

// todo: EXAMPLE 8 - test object observation
const modelData = {name: 'Juanito'};
ObservableTest.objectObservation(modelData).subscribe((changes) => {
    console.log(changes);
});
modelData.name = `${modelData.name} Valderrama`;
modelData.name = `${modelData.name} de la Huerta`;

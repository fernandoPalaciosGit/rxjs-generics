import { fromEvent, interval, Observable } from 'rxjs';
import {
    take,
    takeUntil,
    concatMap,
    map,
    switchMap,
    distinctUntilChanged,
    retry,
    throttleTime, filter
} from 'rxjs/operators';

// todo: EXAMPLE 1: Subscribing to an event and subscribe thrice
const button = document.getElementById('button-example-1');
const buttonClickEvent$ = fromEvent(button, 'click').pipe(take(3));
buttonClickEvent$.subscribe(() => {
    console.info('STOP example 1 on 3 click');
});

// todo: EXAMPLE 2: stop buffering until click on event
const buttonStop2 = document.getElementById('button-stop-example-2');
const onStopButton2 = fromEvent(buttonStop2, 'click');
const bufferExample2$ = interval(1000).pipe(takeUntil(onStopButton2));
bufferExample2$.subscribe((x) => console.info('buffer-example-2'));

// todo: EXAMPLE 3: subscribe to drags
const boxDrag3 = document.getElementById('box-drag-example3');
const draggable3 = document.querySelector('.draggable');
const onMouseDown$ = fromEvent(draggable3, 'mousedown');
const onMouseMove$ = fromEvent(boxDrag3, 'mousemove');
const onMouseOut$ = fromEvent(boxDrag3, 'mouseout'); // todo: cancel mouseDrag on move out the box
const onMouseUp$ = fromEvent(boxDrag3, 'mouseup');
const onMouseDrag$ = onMouseDown$
    .pipe(concatMap(({ offsetX, offsetY }) => {
        return onMouseMove$.pipe(map(({ pageX, pageY }) => ({
            horizontal: pageX - boxDrag3.offsetLeft - offsetX,
            vertical: pageY - boxDrag3.offsetTop - offsetY
        })), takeUntil(onMouseUp$))
    }));

onMouseDrag$.subscribe(({ horizontal, vertical }) => {
    draggable3.style.left = `${horizontal}px`;
    draggable3.style.top = `${vertical}px`;
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
            retry(3); // when the server or the connection is down, retry three times the request of this observable
        });
    }
    return () => clearSearch = true;
});
// test del observable
getResultsSearch('terminator').subscribe((result) => console.log(result));

// todo: EXAMPLE5: asociamos el input al observable de la search
const searchInput5 = document.getElementById('input-text-example5');
const resultsTextArea5 = document.getElementById('textArea-example5');
const onTypeSearch$ = fromEvent(searchInput5, 'keypress');
const resutlsWikipedia$ = onTypeSearch$.pipe(
    throttleTime(300),
    filter(({keyCode}) => keyCode !== 32), // avoid sending when press space
    map(() => searchInput5.value),
    distinctUntilChanged(), // evitamos que se puedan repetir las busquedas, observables que sresuelvan los mismo datos
    filter((search) => search.trim().length > 0), // avoid sending empty string
    switchMap((search) => getResultsSearch(search)) // esto permite quedarese con el ultimo observable que se lanza, asi los anteriores dse descartan , incluso si aun estan en proceso de resolverse (se descarta el tiempo de httpRequest)
);

resutlsWikipedia$.subscribe((result) => {
    resultsTextArea5.value = result;
}, (error) => console.log(error));
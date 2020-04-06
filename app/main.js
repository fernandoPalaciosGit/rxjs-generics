import { fromEvent, interval } from 'rxjs';
import { take, takeUntil, concatMap, combineAll, map } from 'rxjs/operators';

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
const onMouseOut$ = fromEvent(boxDrag3, 'mouseout');
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

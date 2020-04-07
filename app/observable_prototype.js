const emptyCallback = () => {
};

class Observable {
    constructor(onNextCallBack) {
        this.onNextCallBack = onNextCallBack;
    }

    subscribe(onNext, onError, onComplete) {
        if (typeof onNext === 'function') {
            this.onNextCallBack({
                onNext, onError: onError || emptyCallback, onComplete: onComplete || emptyCallback,
            })
        } else {
            this.onNextCallBack(onNext);
        }
    }

    map(callbackMapOnNext) {
        const observableContextPrevious = this;
        return new Observable(function (observer) {
            return observableContextPrevious.subscribe( // resuelves el observer enterior de la cola
                (result) => observer.onNext(callbackMapOnNext(result)), // comunicas al siguiente observer lo que devuelve al resolver el contexto anterior con tu callback
                (error) => observer.onError(error), // le comunicas el error que rejecta el observer anterior
                () => observer.onComplete(), // le comunicas que has acabado de resolver el observer amterior
            )
        });
    }

    filter(callbackFilterOnNext) {
        const observableContextPrevious = this;
        return new Observable(function (observer) {
            return observableContextPrevious.subscribe(
                (result) => callbackFilterOnNext(result) && observer.onNext(result),
                (error) => observer.onError(error),
                () => observer.onComplete(),
            )
        });
    }

    static fromEvent(domEl, event) {
        return new Observable(function (observer) {
            const handler = (ev) => observer.onNext(ev);

            domEl.addEventListener(event, handler);

            // Subscription!!
            return {
                dispose: () => domEl.removeEventListener(event, handler)
            }
        })
    }
}

const buttonSearch = document.getElementById('searchButton');
const onClickSearch$ = Observable.fromEvent(buttonSearch, 'click');
onClickSearch$.subscribe(
    () => console.log('click'),
    () => console.log('error'),
    () => console.log('complete')
);
onClickSearch$.dispose();


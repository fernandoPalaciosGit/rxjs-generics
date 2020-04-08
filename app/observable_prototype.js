const emptyCallback = () => {
};

class Observable {
    constructor(onNextCallBack) {
        this.onNextCallBack = onNextCallBack;
    }

    subscribe(onNext, onError, onComplete) {
        if (typeof onNext === 'function') {
            return this.onNextCallBack({
                onNext, onError: onError || emptyCallback, onComplete: onComplete || emptyCallback,
            })
        } else {
            return this.onNextCallBack(onNext);
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

    // take; subscribe  onnext until accummulator, else oncompleted
    take(counter) {
        const observableContextPrevious = this;
        let retry = 0;
        return new Observable((observer) => {
            const subscriptionPrevious = observableContextPrevious.subscribe(
                (result) => {
                    if (retry < counter) {
                        retry++;
                        observer.onNext(result);
                    } else {
                        observer.onComplete();
                        subscriptionPrevious.dispose();
                    }
                },
                (error) => observer.onError(error),
                () => observer.onComplete(),
            );
            return subscriptionPrevious;
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
        });
    }

    // @deprecate in es6  -> Use rxjs-observe
    static objectObservation(object) {
        return new Observable(function (observer) {
            const handler = (result) => observer.onNext(result);

            Object.observe(object, handler);

            return {
                dispose: () => Object.unobserve(object, handler)
            }
        });
    }
}

export default Observable;

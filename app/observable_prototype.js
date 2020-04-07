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

    static fromEvent(domEl, event) {
        return new Observable(function (observer) {
            const handler = (ev) => observer.onNext(ev);

            domEl.addEventListener(event, handler);

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


Array.prototype.map = function (iterable) {
    const results = [];
    this.forEach(function (itemInArray) {
        results.push(iterable(itemInArray));
    });
    return results;
};

Array.prototype.filter = function (iterable) {
    const results = [];
    this.forEach(function (itemInArray) {
        if (iterable(itemInArray)) {
            results.push(itemInArray);
        }
    });
    return results;
};

Array.prototype.concatAll = function () {
    const results = [];
    this.forEach(function (subArray) {
        results.push.apply(results, subArray);
    });
    return results;
};

Array.prototype.concatMap = function (iterable) {
    return this.map((...args) => iterable.apply({}, args)).concatAll();
};

Array.prototype.reduce = function (iterator, initialValue) {
    let counter,
        accumulatedValue = [];

    // If the array is empty, do nothing
    if (this.length === 0) {
        return accumulatedValue;
    } else {
        // If the user didn't pass an initial value, use the first item.
        if (arguments.length === 1) {
            counter = 1;
            accumulatedValue = this[0];
        } else if (arguments.length >= 2) {
            counter = 0;
            accumulatedValue = initialValue;
        } else {
            throw 'Invalid arguments';
        }

        // Loop through the array, feeding the current value and the result of
        // the previous computation back into the combiner function until
        // we've exhausted the entire array and are left with only one value.
        while (counter < this.length) {
            accumulatedValue = iterator(accumulatedValue, this[counter]);
            counter++;
        }

        return [accumulatedValue];
    }
};

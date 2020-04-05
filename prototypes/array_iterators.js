// @Override
Array.prototype.map = function (iterator) {
    const results = [];
    this.forEach(function (itemInArray) {
        results.push(iterator(itemInArray));
    });
    return results;
};

// @Override
Array.prototype.filter = function (iterator) {
    const results = [];
    this.forEach(function (itemInArray) {
        if (iterator(itemInArray)) {
            results.push(itemInArray);
        }
    });
    return results;
};

// @Override
Array.prototype.flat = function () {
    const results = [];
    this.forEach(function (subArray) {
        results.push.apply(results, subArray);
    });
    return results;
};

// @Override
Array.prototype.flatMap = function (iterator) {
    return this.map((...args) => iterator.apply({}, args)).concatAll();
};

// @Override
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

Array.prototype.zip = function (right, iterator) {
    const counter = Math.min(this.length, right.length);
    const range = Array.from(Array(counter).keys());

    return range.map((index) => iterator(this[index], right[index]));
};

import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import NEW_RELEASES from './mocks/new_releases';
import NAMES from './mocks/names';
import MOVIE_LIST from './mocks/movie_lists';
import FLATTEN_IDS from './mocks/flatten_ids';
import MOVIE_LIST_BOXART from './mocks/movie_list_boxart';

describe('arrays', () => {
    let result;
    let expected;

    beforeEach(() => {
        result = [];
        expected = [];
    });

    afterEach(() => {
        expect(result).to.be.eql(expected);
    });

    it('Print all the names in an array', () => {
        expected = ['Ben', 'Jafar', 'Matt', 'Priya', 'Brian'];
        NAMES.forEach((name) => result.push(name));
    });

    it('Implement map()', () => {
        Array.prototype.map = function (iterable) {
            const results = [];
            this.forEach(function (itemInArray) {
                results.push(iterable(itemInArray));
            });
            return results;
        };
    });

    it('Project an array of videos into an array of {id,title}', () => {
        expected = [
            { id: 70111470, title: 'Die Hard' },
            { id: 654356453, title: 'Bad Boys' },
            { id: 65432445, title: 'The Chamber' },
            { id: 675465, title: 'Fracture' }
        ];
        result = NEW_RELEASES.map(({ id, title }) => ({ id, title }));
    });

    it('Implement filter()', () => {
        Array.prototype.filter = function (iterable) {
            const results = [];
            this.forEach(function (itemInArray) {
                if (iterable(itemInArray)) {
                    results.push(itemInArray);
                }
            });
            return results;
        };
    });

    it('Use forEach() to collect only those videos with a rating of 5.0', () => {
        expected = [
            {
                id: 654356453,
                title: 'Bad Boys',
                boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys.jpg',
                uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
                rating: 5,
                bookmark: [
                    {
                        id: 432534,
                        time: 65876586
                    }
                ],
            },
            {
                id: 675465,
                title: 'Fracture',
                boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture.jpg',
                uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
                rating: 5,
                bookmark: [
                    {
                        id: 432534,
                        time: 65876586
                    }
                ]
            }
        ];
        result = NEW_RELEASES.filter(({ rating }) => rating === 5.0);
    });

    it('Chain filter and map to collect the ids of videos that have a rating of 5.0', () => {
        expected = [654356453, 675465];
        result = NEW_RELEASES
            .filter(({ rating }) => rating === 5.0)
            .map(({ id }) => id);
    });

    it('Flatten the movieLists array into an array of video ids', () => {
        expected = [70111470, 654356453, 65432445, 675465];
        MOVIE_LIST.forEach(({ videos }) => {
            videos.forEach(({ id }) => {
                result.push(id);
            });
        });
    });

    it('Implement concatAll()', () => {
        Array.prototype.concatAll = function () {
            const results = [];
            this.forEach(function (subArray) {
                results.push.apply(results, subArray);
            });
            return results;
        };
        expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        result = FLATTEN_IDS.concatAll();
    });

    it('Use map() and concatAll() to project and flatten the movieLists into an array of video ids', () => {
        expected = [70111470, 654356453, 65432445, 675465];
        result = MOVIE_LIST.map(({ videos }) => {
            return videos.map(({ id }) => id);
        }).concatAll();
    });

    describe('should concat arrays from mapping nested objects', () => {
        const videosList = [
            {
                id: 70111470,
                title: 'Die Hard',
                boxart: 'http://cdn-0.nflximg.com/images/2891/DieHard150.jpg'
            },
            {
                id: 654356453,
                title: 'Bad Boys',
                boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys150.jpg'
            },
            {
                id: 65432445,
                title: 'The Chamber',
                boxart: 'http://cdn-0.nflximg.com/images/2891/TheChamber150.jpg'
            },
            { id: 675465, title: 'Fracture', boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture150.jpg' },
        ];

        it('Retrieve id, title, and a 150x200 box art url for every video', () => {
            expected = videosList;
            result = MOVIE_LIST_BOXART.map(({ videos }) => {
                return videos.map(({ id, title, boxarts }) => {
                    return boxarts
                        .filter(({ width, height }) => width === 150 && height === 200)
                        .map(({ url }) => ({
                            id, title,
                            boxart: url,
                        }));
                }).concatAll();
            }).concatAll();
        });

        it('Implement concatMap()', () => {
            expected = [];
            Array.prototype.concatMap = function (iterable) {
                return this.map((...args) => iterable.apply({}, args)).concatAll();
            };
        });

        it('Use concatMap() to retrieve id, title, and 150x200 box art url for every video', () => {
            expected = videosList;
            result = MOVIE_LIST_BOXART.concatMap(({ videos }) => {
                return videos.concatMap(({ id, title, boxarts }) => {
                    return boxarts
                        .filter(({ width, height }) => width === 150 && height === 200)
                        .map(({ url }) => ({
                            id, title,
                            boxart: url,
                        }));
                });
            });
        });
    });

    describe('Implement reduce()', () => {
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

        it('returns an array with the accumulated value', () => {
            expected = [6];
            result = [1, 2, 3].reduce((acc, value) => acc + value, 0);
        });

        it('returns an empty array', () => {
            expected = [];
            result = [].reduce((acc, value) => acc + value, 0);
        });

        it('should takes first item as an accumulator', () => {
            expected = [10];
            result = [5, 2, 3].reduce((acc, value) => acc + value);
        });

        it('should throws an error if hasn´t arguments', () => {
            const errorResult = () => [1, 2, 3].reduce();
            expect(errorResult).to.throw('Invalid arguments');
        });

        it('Retrieve the largest rating.', () => {
            const ratings = [2, 3, 1, 4, 5];
            expected = [5];
            result = ratings.reduce((acc, value) => {
                return acc > value ? acc : value;
            });
        });
    });
});
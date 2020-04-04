import { describe, it, beforeEach, afterEach } from 'mocha';

const NAMES = ["Ben", "Jafar", "Matt", "Priya", "Brian"];
const NEW_RELEASES = [
    {
        "id": 70111470,
        "title": "Die Hard",
        "boxart": "http://cdn-0.nflximg.com/images/2891/DieHard.jpg",
        "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
        "rating": 4.0,
        "bookmark": []
    },
    {
        "id": 654356453,
        "title": "Bad Boys",
        "boxart": "http://cdn-0.nflximg.com/images/2891/BadBoys.jpg",
        "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
        "rating": 5.0,
        "bookmark": [{ id: 432534, time: 65876586 }]
    },
    {
        "id": 65432445,
        "title": "The Chamber",
        "boxart": "http://cdn-0.nflximg.com/images/2891/TheChamber.jpg",
        "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
        "rating": 4.0,
        "bookmark": []
    },
    {
        "id": 675465,
        "title": "Fracture",
        "boxart": "http://cdn-0.nflximg.com/images/2891/Fracture.jpg",
        "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
        "rating": 5.0,
        "bookmark": [{ id: 432534, time: 65876586 }]
    }
];

describe('arrays', () => {
    let result;

    beforeEach(() => {
        result = [];
    });

    afterEach(() => {
        console.log(result);
    });

    it('Print all the names in an array', () => {
        NAMES.forEach((name) => result.push(name));
    });

    it('Implement map()', () => {
        Array.prototype.map = function (projectionFunction) {
            var results = [];
            this.forEach(function (itemInArray) {
                results.push(projectionFunction(itemInArray));
            });
            return results;
        };
    });

    it(' Project an array of videos into an array of {id,title}', () => {
        result = NEW_RELEASES.map(({ id, title }) => ({ id, title }));
    });

    it('Implement filter()', () => {
        Array.prototype.filter = function (predicateFunction) {
            var results = [];
            this.forEach(function (itemInArray) {
                if (predicateFunction(itemInArray)) {
                    results.push(itemInArray);
                }
            });
            return results;
        };
    });

    it('Use forEach() to collect only those videos with a rating of 5.0', () => {
        result = NEW_RELEASES.filter(({ rating }) => rating === 5.0);
    });

    it(' Chain filter and map to collect the ids of videos that have a rating of 5.0', () => {
        result = NEW_RELEASES
            .filter(({ rating }) => rating === 5.0)
            .map(({ id }) => id);
    });
});
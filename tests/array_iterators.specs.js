import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import NEW_RELEASES from './mocks/new_releases';
import NAMES from './mocks/names';
import MOVIE_LIST from './mocks/movie_lists';

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
        Array.prototype.map = function (projectionFunction) {
            const results = [];
            this.forEach(function (itemInArray) {
                results.push(projectionFunction(itemInArray));
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
        Array.prototype.filter = function (predicateFunction) {
            const results = [];
            this.forEach(function (itemInArray) {
                if (predicateFunction(itemInArray)) {
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
                        "id": 432534,
                        "time": 65876586
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
                        "id": 432534,
                        "time": 65876586
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

    it(' Flatten the movieLists array into an array of video ids', () => {

    });
});
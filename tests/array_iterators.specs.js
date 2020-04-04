import { describe, it, beforeEach, afterEach } from 'mocha';
import NEW_RELEASES from './mocks/new_releases';
import NAMES from './mocks/names';
import MOVIE_LIST from './mocks/movie_lists';

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
            const results = [];
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
        result = NEW_RELEASES.filter(({ rating }) => rating === 5.0);
    });

    it(' Chain filter and map to collect the ids of videos that have a rating of 5.0', () => {
        result = NEW_RELEASES
            .filter(({ rating }) => rating === 5.0)
            .map(({ id }) => id);
    });

    it(' Flatten the movieLists array into an array of video ids', () => {
        
    });
});
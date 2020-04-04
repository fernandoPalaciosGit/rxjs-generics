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

    it('Retrieve id, title, and a 150x200 box art url for every video', () => {
        expected = [
            { "id": 70111470, "title": "Die Hard", "boxart": "http://cdn-0.nflximg.com/images/2891/DieHard150.jpg" },
            { "id": 654356453, "title": "Bad Boys", "boxart": "http://cdn-0.nflximg.com/images/2891/BadBoys150.jpg" },
            {
                "id": 65432445,
                "title": "The Chamber",
                "boxart": "http://cdn-0.nflximg.com/images/2891/TheChamber150.jpg"
            },
            { "id": 675465, "title": "Fracture", "boxart": "http://cdn-0.nflximg.com/images/2891/Fracture150.jpg" },
        ];
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
});
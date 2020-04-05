import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import NEW_RELEASES from './mocks/new_releases';
import NAMES from './mocks/names';
import MOVIE_LIST from './mocks/movie_lists';
import FLATTEN_IDS from './mocks/flatten_ids';
import MOVIE_LIST_BOXART from './mocks/movie_list_boxart';
import VIDEO_LIST from './mocks/video_list';
import MOVIE_LIST_INTERESTING_MOMENTS from './mocks/movie_list_interesting_moment';
import * as VIDEOS_SCHEMA from './mocks/query_list_videos';
import {} from '../prototypes/array_iterators';

describe('Testing array iteration interfaces', () => {
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

    it('Project an array of videos into an array of {id,title}', () => {
        expected = [
            { id: 70111470, title: 'Die Hard' },
            { id: 654356453, title: 'Bad Boys' },
            { id: 65432445, title: 'The Chamber' },
            { id: 675465, title: 'Fracture' }
        ];
        result = NEW_RELEASES.map(({ id, title }) => ({ id, title }));
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

    it('Use map() and flat() to project and flatten the movieLists into an array of video ids', () => {
        expected = [70111470, 654356453, 65432445, 675465];
        result = MOVIE_LIST.map(({ videos }) => {
            return videos.map(({ id }) => id);
        }).flat();
    });

    describe('should concat arrays from mapping nested objects', () => {

        beforeEach(() => {
            expected = [
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
            ]
        });

        it('Retrieve id, title, and a 150x200 box art url for every video', () => {
            result = MOVIE_LIST_BOXART.map(({ videos }) => {
                return videos.map(({ id, title, boxarts }) => {
                    return boxarts
                        .filter(({ width, height }) => width === 150 && height === 200)
                        .map(({ url }) => ({
                            id, title,
                            boxart: url,
                        }));
                }).flat();
            }).flat();
        });

        it('Implement flat()', () => {
            expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            result = FLATTEN_IDS.flat();
        });

        it('Use flatMap() to retrieve id, title, and 150x200 box art url for every video', () => {
            result = MOVIE_LIST_BOXART.flatMap(({ videos }) => {
                return videos.flatMap(({ id, title, boxarts }) => {
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

    it('Retrieve url of the largest boxart', () => {
        const boxarts = [
            { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
            { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture150.jpg" },
            { width: 300, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" },
            { width: 425, height: 150, url: "http://cdn-0.nflximg.com/images/2891/Fracture425.jpg" }
        ];
        expected = ["http://cdn-0.nflximg.com/images/2891/Fracture425.jpg"];
        result = boxarts.reduce((acc, val) => {
            return (acc.width * acc.height > val.width * val.height ? acc : val);
        }).map(({ url }) => url);
    });

    it('Reducing with an initial value', () => {
        expected = [{
            "65432445": "The Chamber",
            "675465": "Fracture",
            "70111470": "Die Hard",
            "654356453": "Bad Boys"
        }];
        result = VIDEO_LIST.reduce((acc, { id, title }) => {
            // IMPORTANT: never override an object by reference, take a copy
            const copyAcc = { ...acc }; // be careful, this is a shallow copy, only works with one order dimension, nested object will pass as reference)
            copyAcc[id] = title;
            return copyAcc;
        }, {});
    });

    it('Retrieve the id, title, and smallest box art url for every video.', () => {
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
        result = MOVIE_LIST_BOXART.flatMap(({ videos }) => {
            return videos.flatMap(({ id, title, boxarts }) => {
                return boxarts.reduce((acc, boxart) => {
                    return acc.width * acc.height < boxart.width * boxart.height ? acc : boxart;
                }).map(({ url }) => ({ id, title, boxart: url }));
            });
        });
    });

    describe('implement Zip', () => {
        const BOOKMARKS = [
            { id: 470, time: 23432 },
            { id: 453, time: 234324 },
            { id: 445, time: 987834 }
        ];

        beforeEach(() => {
            expected = [
                { "videoId": 65432445, "bookmarkId": 470 },
                { "videoId": 675465, "bookmarkId": 453 },
                { "videoId": 70111470, "bookmarkId": 445 }
            ];
        });

        it('Combine videos and bookmarks by index, create a {videoId, bookmarkId}', () => {
            for (let counter = 0; counter < Math.min(VIDEO_LIST.length, BOOKMARKS.length); counter++) {
                result.push({
                    videoId: VIDEO_LIST[counter].id,
                    bookmarkId: BOOKMARKS[counter].id,
                });
            }
        });

        it('use zip prototype', () => {
            result = VIDEO_LIST.zip(BOOKMARKS, (video, book) => ({
                videoId: video.id,
                bookmarkId: book.id,
            }));
        });
    });

    it('Retrieve each video\'s id, title, middle interesting moment time, and smallest box art url', () => {
        expected =
            [{
                "id": 70111470,
                "title": "Die Hard",
                "time": 323133,
                "url": "http://cdn-0.nflximg.com/images/2891/DieHard150.jpg"
            }, {
                "id": 654356453,
                "title": "Bad Boys",
                "time": 6575665,
                "url": "http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg"
            }, {
                "id": 65432445,
                "title": "The Chamber",
                "time": 3452343,
                "url": "http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg"
            }, {
                "id": 675465,
                "title": "Fracture",
                "time": 3453434,
                "url": "http://cdn-0.nflximg.com/images/2891/Fracture120.jpg"
            }];
        result = MOVIE_LIST_INTERESTING_MOMENTS.flatMap(({ videos }) => {
            return videos.flatMap(({ id, title, boxarts, interestingMoments }) => {
                const moments = interestingMoments.filter(({ type }) => type === 'Middle');
                const boxart = boxarts.reduce((accBox, nextBox) => accBox.width * accBox.height < nextBox.width * nextBox.height ? accBox : nextBox);
                return moments.zip(boxart, ({ time }, { url }) => ({ id, title, time, url }));
            });
        });
    });

    it('Converting from Arrays to Trees', () => {
        expected = [
            {
                "name": "New Releases",
                "videos": [
                    {
                        "id": 65432445,
                        "title": "The Chamber"
                    },
                    {
                        "id": 675465,
                        "title": "Fracture"
                    }
                ]
            },
            {
                "name": "Thrillers",
                "videos": [
                    {
                        "id": 70111470,
                        "title": "Die Hard"
                    },
                    {
                        "id": 654356453,
                        "title": "Bad Boys"
                    }
                ]
            }
        ];
        result = VIDEOS_SCHEMA.GENRES.map(({ name, id }) => ({
            name,
            videos: VIDEOS_SCHEMA.TAPES.filter(({ listId }) => listId === id).map(({ id, title }) => ({ id, title }))
        }))
    });

    it('Converting from Arrays to Deeper Trees', () => {
        expected = [
            {
                "name": "New Releases",
                "videos": [
                    {
                        "id": 65432445,
                        "title": "The Chamber",
                        "time": 32432,
                        "boxart": "http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg"
                    },
                    {
                        "id": 675465,
                        "title": "Fracture",
                        "time": 3534543,
                        "boxart": "http://cdn-0.nflximg.com/images/2891/Fracture120.jpg"
                    }
                ]
            },
            {
                "name": "Thrillers",
                "videos": [
                    {
                        "id": 70111470,
                        "title": "Die Hard",
                        "time": 645243,
                        "boxart": "http://cdn-0.nflximg.com/images/2891/DieHard150.jpg"
                    },
                    {
                        "id": 654356453,
                        "title": "Bad Boys",
                        "time": 984934,
                        "boxart": "http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg"
                    }
                ]
            }
        ];
        result = VIDEOS_SCHEMA.GENRES.map((genre) => ({
            name: genre.name,
            videos: VIDEOS_SCHEMA.TAPES.filter(({ listId }) => listId === genre.id)
                .flatMap(({ id, title }) => {
                    const bookMark = VIDEOS_SCHEMA.BOOKMARKS.filter(({ videoId }) => videoId === id);
                    const boxart = VIDEOS_SCHEMA.BOXARTS.filter(({ videoId }) => videoId === id)
                        .reduce((acc, next) => acc.width * acc.height < next.width * next.height ? acc : next);

                    return bookMark.zip(boxart, ({ time }, { url }) => ({
                        id, title, time, boxart: url
                    }));
                })
        }));
    });
});

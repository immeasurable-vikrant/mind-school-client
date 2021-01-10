import "babel-polyfill";
const _ = require('lodash');
const fs = require("fs");
const cheerio = require('cheerio');
const moment = require('moment');
// curl -XDELETE localhost:9200/*

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
};

function rewind(_input) {
    let input = _input;
    if(input[0] === 'a') {
        input = input.replaceAt(0, '1');
    }

    const regex = /^(\d+)\s(\w+)\sago$/;
    const filtered = regex.exec(input);

    const days = filtered[1];
    const duration = filtered[2];

    return moment().subtract(days, duration).format("YYYY-MM-DD HH:mm:ss").toString();
}

function __object(__object__) {
    function T() {}
    T.prototype = __object__;
    return new T();
}

const __user = {
    no: 0,
    name: '',
    picture: '',
    instructor: false
};
// let user = __object(__user);

const __comment = {
    no: 0,
    date: Date.now,
    fromNow: '',
    name: '',
    user: 0,
    rating: 0,
    helpful: false,
    origin: '',
    content: ''
};
// let comment = __object(__comment);

var user = [];
var comment = [];
var instructor = [];
var reply = [];

var headers = [];
var user_list = [];
var comment_list = [];

function parseHtml(root) {
    const search = '.ratings-and-reviews__review-container';

    const nodes = root('*').find(search);
    if (nodes) {
        nodes.each(function(i, elem) {
            headers.push(headers.length);
            // console.log("headers:" + headers.length + ":");
        });
    }

    parseNodes(root);
}

function parseNodes(root) {
    const search = '.ratings-and-reviews__review-container';

    const nodes = root('*').find(search);
    if (nodes) {
        nodes.each(function(i, elem) {
            parseUser(root(elem));
            parseInstructor(root(elem));
        })
    }
}

function parseUser(elem) {
    const src = elem.children('.ratings-and-reviews__review-author-avatar').attr('src');

    const picture = src.split('/').pop();

    const container_detail = elem.children('.ratings-and-reviews__review-detail-container');

    const name = container_detail.children('.ratings-and-reviews__review-detail-user-name').text().trim().replace('\n', '');

    const filtered = user.filter(x => x.name === name);
    if(filtered.length <= 0) {
        user.push({
            no: user.length,
            name: name,
            picture: picture,
            instructor: false
        });
    }

    const format = container_detail.children('.ratings-and-reviews__review-detail-created').children('span').text().trim().replace('\n', '');

    const date = rewind(format);
    const fromNow = moment(date, "YYYY-MM-DD HH:mm:ss").fromNow();

    const container_comment = elem.children('.ratings-and-reviews__review-comment-container');

    const star = container_comment.children('.star-rating--static').children('span').children('span').text().trim().replace('\n', '');

    const split = star.split(' ');
    const rating = parseFloat(split[1]);

    const content = container_comment.children('.ratings-and-reviews__review-comment-content').children('p').text().trim().replace('\n', '');

    comment.push({
        no: comment.length,
        date: date,
        fromNow: fromNow,
        name: name,
        user: 0,
        rating: rating,
        helpful: false,
        origin: '',
        content: content
    });
}

function parseInstructor(elem) {
    const container_origin = elem.children('.ratings-and-reviews__review-detail-container');

    const origin = container_origin.children('.ratings-and-reviews__review-detail-user-name').text().trim().replace('\n', '');

    const container_response = elem.children('.ratings-and-reviews__review-comment-container').children('.ratings-and-reviews__review-response-container');

    const container_detail = container_response.children('.ratings-and-reviews__review-response-detail-container');

    const ellipsis = container_detail.children('.ellipsis').children('span').text().trim().replace('\n', '');

    if(ellipsis.includes('Instructor')) {
        const split = ellipsis.split('(');
        const name = split[0].trim();

        const filtered = instructor.filter(x => x.name === name);
        if(filtered.length <= 0) {
            instructor.push({
                no: instructor.length,
                name: name,
                picture: '',
                instructor: true
            });
        }

        const format = container_detail.children('.ratings-and-reviews__review-response-detail-created').children('span').text().trim().replace('\n', '');

        const date = rewind(format);
        const fromNow = moment(date, "YYYY-MM-DD HH:mm:ss").fromNow();

        const content = container_response.children('.ratings-and-reviews__review-response-comment').children('p').text().trim().replace('\n', '');

        reply.push({
            no: reply.length,
            date: date,
            fromNow: fromNow,
            name: name,
            user: 0,
            rating: 0,
            helpful: false,
            origin: origin,
            content: content
        });
    }
}

function combineAll() {
    if (!Array.prototype.findIndex) {
        console.log('!Array.prototype.findIndex');
    }

    var user_count = 0;
    var comment_count = 0;

    _.map(instructor, function (elem) {
        user_list.push({
            no: user_list.length,
            name: elem.name,
            picture: elem.picture,
            instructor: true
        });
        user_count++;
    });

    _.map(user, function (elem) {
        user_list.push({
            no: user_list.length,
            name: elem.name,
            picture: elem.picture,
            instructor: false
        });
        user_count++;
    });

    user_list = _.sortBy(user_list, "no");

    _.map(comment, function (elem) {
        const data = elem;
        const filtered = user_list.filter(x => (x.name === data.name) && x.instructor === false);

        if (filtered.length > 0) {
            const index = user_list.findIndex(x => (x.name === data.name) && x.instructor === false);
            comment_list.push({
                no: comment_list.length,
                date: data.date,
                fromNow: data.fromNow,
                user: index,
                name: data.name,
                rating: data.rating,
                helpful: data.helpful,
                indent: 0,
                origin: data.origin,
                content: data.content
            });
            comment_count++;
        }
    });

    _.map(reply, function (elem) {
        const data = elem;
        const filtered = user_list.filter(x => (x.name === data.name) && x.instructor === true);

        if (filtered.length > 0) {
            const index = user_list.findIndex(x => (x.name === data.name) && x.instructor === true);
            comment_list.push({
                no: comment_list.length,
                date: data.date,
                fromNow: data.fromNow,
                user: index,
                name: data.name,
                rating: data.rating,
                helpful: data.helpful,
                indent: 1,
                origin: data.origin,
                content: data.content
            });
            comment_count++;
        }
    });

    comment_list = _.sortBy(comment_list, "no");

    console.log("headers: [" + headers.length + "]");
    console.log("user_list: [" + user_list.length + " = " + user.length + " + " + instructor.length + "]");
    console.log("comment_list: [" + comment_list.length + " = " + comment.length + " + " + reply.length + "]");
}

exports.escape = function () {
    const file = './models/parser/temp/unescapeformat.txt';
    fs.readFile(file, "UTF-8", function (err, contents) {
        const q = escape(contents);

        fs.writeFile("./models/parser/temp/escapeFormat.txt", q, function (err, data) {
            if (err) {
                return console.log(err);
            }

            console.log("File Created");
        });
    });
};

exports.parse = function () {
    fs.readFile("./models/parser/temp/unescapeformat.txt", "UTF-8", function (err, contents) {
        const root = cheerio.load(contents);

        parseHtml(root);

        combineAll();

        const json_user = JSON.stringify(user_list, null, '\t').trim();

        fs.writeFile("./models/parser/temp/parsedUser.json", json_user, function (err) {
            if (err) {
                console.log(err);
                return err;
            }

            console.log("{User} File Parsed to JSON");
        });

        const json_comment = JSON.stringify(comment_list, null, '\t').trim();

        fs.writeFile("./models/parser/temp/parsedComment.json", json_comment, function (err) {
            if (err) {
                console.log(err);
                return err;
            }

            console.log("{Comment} File Parsed to JSON");
        });
    });
};

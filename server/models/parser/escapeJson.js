const fs = require("fs");
var HTMLParser = require('fast-html-parser');
// curl -XDELETE localhost:9200/*

var json = {
    no: 0,
    total: {
        lectures: 0,
        time: ''
    },
    header: [{
        no: 0,
        title: '',
        lectures: 0,
        body: [{
            sub_no: 0,
            content: '',
            preview: false,
            time: ''
        }]
    }]
};

var lectures = [];

var bodys = [];

var previews = [];

var times = [];

function parseHtml(root) {
    const search = '.section-container span.lecture-title-text';

    var nodes = root.querySelectorAll(search);
    if (nodes) {
        nodes.forEach(function (el) {
            const combined = el.rawText.trim().replace('\n', '');

            json.header.push({
                no: json.header.length,
                title: combined,
                body: []
            });

            console.log("header:" + json.header.length + ":" + combined + ":");

        });
    }

    parseContent(root);
    parsePreview(root);
    parseTime(root);
    parseTotalTime(root);
    parseLecture(root);
}

function parseTotalTime(root) {
    const search = '.curriculum-header-container span.curriculum-header-length';

    var nodes = root.querySelectorAll(search);
    if (nodes) {
        nodes.forEach(function (el) {
            const combined = el.rawText.trim().replace('\n', '');

            json.total.time = combined;
        });
    }
}

function parseLecture(root) {
    const search = '.section-container span.num-sections';

    var nodes = root.querySelectorAll(search);
    if (nodes) {
        nodes.forEach(function (el) {
            const combined = el.rawText.trim().replace('\n', '');

            const split = combined.split(' ');
            const count = parseInt(split[0]);

            lectures.push(count);

            console.log("lecture:" + lectures.length + ":" + count + ":");
        });
    }
}

function parseContent(root) {
    const search = '.lectures-container .lecture-container div.title';

    var nodes = root.querySelectorAll(search);
    if (nodes) {
        nodes.forEach(function (el) {
            const combined = el.rawText.trim().replace('\n', '');

            bodys.push(combined);
        });
    }
}

function parsePreview(root) {
    const search = '.lectures-container .lecture-container';

    var nodes = root.querySelectorAll(search);
    if (nodes) {
        nodes.forEach(function (el) {
            const attr = el.rawAttrs;

            const split = attr.split('-');
            const pop = split.pop();
            const no = parseInt(pop.replace('\"', ' '));

            if (attr.includes('preview')) {
                previews.push(no);
            }
        });
    }
}

function parseTime(root) {
    const search = '.lectures-container .lecture-container span.content-summary';

    var nodes = root.querySelectorAll(search);
    if (nodes) {
        nodes.forEach(function (el) {
            const combined = el.rawText.trim().replace('\n', '');

            // const split = combined.split(':');
            // const hour = parseInt(split[0]);
            // const min = parseInt(split[1]);

            times.push(combined);
        });
    }
}

function combineAll() {
    var lecture_count = 0;
    var body_count = 0;
    var preview_count = 0;
    var time_count = 0;
    var total_count = 0;

    json.header.forEach(function (header) {
        header.lectures = lectures[lecture_count];

        for (var i = 0; i < header.lectures; i++) {
            var preview = false;
            for (var k = 0; k < previews.length; k++) {
                if (previews[k] === body_count) {
                    preview = true;
                }
            }

            header.body.push({
                sub_no: i,
                content: bodys[body_count],
                preview: preview,
                time: times[time_count]
            });

            total_count++;

            body_count++;
            preview_count++;
            time_count++;
        }

        lecture_count++;
    });

    json.total.lectures = total_count;
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
    json.header.pop();
    bodys.pop();

    fs.readFile("./models/parser/temp/unescapeformat.txt", "UTF-8", function (err, contents) {
        var root = HTMLParser.parse(contents);
        parseHtml(root);

        combineAll();

        fs.writeFile("./models/parser/temp/parsedFormat.json", JSON.stringify(json, null, '\t').trim(), function (err) {
            if (err) {
                console.log(err);
                return err;
            }

            console.log("File Parsed to JSON");
        });
    });
};
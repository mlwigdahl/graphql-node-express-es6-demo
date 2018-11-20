'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _graphql = require('graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = (0, _graphql.buildSchema)('\n    type Query {\n        course(id: Int!): Course\n        courses(topic: String): [Course]\n    },\n    type Mutation {\n        updateCourseTopic(id: Int!, topic: String!): Course\n    }\n    type Course {\n        id: Int\n        title: String\n        author: String\n        description: String\n        topic: String\n        url: String\n    }\n');

var coursesData = [{
    id: 1,
    title: 'The Complete Node.js Developer Course',
    author: 'Andrew Mead, Rob Percival',
    description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB <spit>, Mocha, and more!',
    topic: 'Node.js',
    url: 'https://codingthesmartway.com/courses/nodejs/'
}, {
    id: 2,
    title: 'Node.js, Express & MongoDB Dev to Deployment',
    author: 'Brad Traversy',
    description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
    topic: 'Node.js',
    url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
}, {
    id: 3,
    title: 'JavaScript: Understanding The Weird Parts',
    author: 'Anthony Alicea',
    description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
    topic: 'JavaScript',
    url: 'https://codingthesmartway.com/courses/understand-javascript/'
}];

var getCourse = function getCourse(args) {
    return coursesData.filter(function (course) {
        return course.id == args.id;
    })[0];
};

var getCourses = function getCourses(args) {
    return args.topic ? coursesData.filter(function (course) {
        return course.topic === args.topic;
    }) : coursesData;
};

var updateCourseTopic = function updateCourseTopic(_ref) {
    var id = _ref.id,
        topic = _ref.topic;

    coursesData.map(function (course) {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    var course = coursesData.filter(function (course) {
        return course.id === id;
    })[0];
    return course;
};

var rootValue = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
};

var app = (0, _express2.default)();
app.use('/graphql', (0, _expressGraphql2.default)({
    schema: schema,
    rootValue: rootValue,
    graphiql: true
}));

var port = 3000;

app.get('/', function (req, res) {
    return res.send('<h1>Hi!  You should use the "/graphql" endpoint here...</h1>');
});

app.listen(port, function () {
    return console.log('Express GraphQL server now listening on localhost:' + port + '/graphql!');
});
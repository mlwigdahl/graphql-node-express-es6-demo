import express from 'express';
import express_graphql from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

const coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB <spit>, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    },
];

const getCourse = args => coursesData.filter(course => course.id == args.id)[0];

const getCourses = args => args.topic ? coursesData.filter(course => course.topic === args.topic) : coursesData;

const updateCourseTopic = ({id, topic}) => {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    const course = coursesData.filter(course => course.id === id)[0];
    return course;
}

const rootValue = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
};

const app = express();
app.use('/graphql', express_graphql({
    schema,
    rootValue,
    graphiql: true
}));

const port = 3000;

app.get('/', (req, res) => res.send('<h1>Hi!  You should use the "/graphql" endpoint here...</h1>'));

app.listen(port, () => console.log(`Express GraphQL server now listening on localhost:${port}/graphql!`));
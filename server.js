'use strict';

const Hapi = require('@hapi/hapi');

const mongoose = require('mongoose');

/*const init = async() => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hello World!';
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();*/

const server = new Hapi.Server({
    host: 'localhost',
    port: 3000,
    routes: {
        cors: true
    }
});

server.app.db = mongoose.connect(
    'mongodb://localhost/hapijslogin', { useNewUrlParser: true }
)

const init = async() => {
    await server
        .register({ plugin: require('./routes/Users') }, {
            routes: {
                prefix: '/users'
            }
        })
        .catch(err => {
            console.log(err);
        })

    await server.start();
    console.log(`server running at : ${server.info.uri}`);
}

init();
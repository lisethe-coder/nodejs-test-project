// It creates a server with a host name and port
'use strict';
require('dotenv').config();

const Hapi = require('hapi');
const Joi = require('joi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');


const server =  new Hapi.Server()

server.connection({
	port: process.env.SERVER_PORT,
	host: process.env.MAC_IP_ADDRESS,
	routes: {
		cors: true,
	}
});

const options = {
	info: {
		'title': 'Test API Documentation',
		'version': Pack.version,
	}
}

server.route({
	method: 'GET',
	path: '/{name}',
	config: {
		tags: ['api'],
		description: 'Get name',
		notes: 'Return a todo item by the id passes in the path',
		validate: {
			params: {
				name: Joi.string()
					.required()
					.description('The name for the endpoint'),
			}
		}
	},
	handler: function (request, reply) {
		reply('hello ' + request.params.name + '!!');
	}
});

server.route({
	method: 'GET',
	path: '/api/photos/{photoId}',
	handler: function (request, reply) {
		if (request.params.photoId) {
			reply('No content')
		}
	}
})

server.route({
	method: 'POST',
	path: '/api/guarantor',
	config: {
		tags: ['api'],
		validate: {
			payload: Joi.object({
				firstName: Joi.string(),
				surname: Joi.string(),
				mobileNumber: Joi.string(),
				email: Joi.string(),
			})
		}
	},
	handler: function (request, reply) {
		reply('success!');
	}
})

server.register([
	Inert,
	Vision,
	{
		'register': HapiSwagger,
		'options': options,
	}
], (err) => {
	server.start((err) => {
		if (err) {
			throw err;
		}
		console.log(`Server running at: ${server.info.uri}`);
	});
})


// // Adds a route
// const options = {
// 	message: 'Hello world!!',
// }
//
// server.register([
// 	require('myPlugin'),
// 	require('/path')
// ], (error) => {
// 	if (error) {
// 		console.log('Failed to load plugin: ', error);
// 	}
// });


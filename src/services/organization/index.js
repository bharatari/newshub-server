'use strict';

const service = require('feathers-sequelize');
const organization = require('./organization-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: organization(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/organization', service(options));

  // Get our initialize service to that we can bind hooks
  const organizationService = app.service('/api/organization');

  // Set up our before hooks
  organizationService.before(hooks.before);

  // Set up our after hooks
  organizationService.after(hooks.after);
};

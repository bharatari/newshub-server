'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const populate = require('./populate');
const create = require('./create');

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    globalHooks.protectOrganization({ model: 'room' }),
    globalHooks.restrictChangeOrganization({ model: 'room' }),
  ],
  find: [
    populate(),
  ],
  get: [
    populate(),
  ],
  create: [
    create(),
    globalHooks.addToOrganization(),
  ],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};

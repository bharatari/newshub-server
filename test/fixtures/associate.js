const async = require('async');

module.exports = async function (models) {
  const organization = await models.organization.findOne({
    where: {
      name: 'utdtv',
    },
  });

  const alternate = await models.organization.findOne({
    where: {
      name: 'themercury'
    },
  });

  const roles = [
    { email: 'normal', roles: null, organizations: [{ id: alternate.id, roles: null }] },
    { email: 'admin', roles: 'admin' },
    { email: 'master', roles: 'master' },
    { email: 'masterdeny', roles: 'master, deny!user:update' },
    { email: 'device', roles: 'device:create' },
    { email: 'approve', roles: 'admin, reservation:approve' },
    { email: 'approvespecial', roles: 'reservation:approve, technology-director, reservation:special-requests' },
    { email: 'adminadvisor', roles: 'admin, advisor' },
    { email: 'deny', roles: 'deny!user:update, user:update' },
    { email: 'ownerdeny', roles: 'user:update, deny!user:update!owner' },
    { email: 'ownerdenyproperty', roles: 'user:update!owner, deny!user:roles:update!owner' },
    { email: 'ownerdenyoverlap', roles: 'user:update, deny!user:update!owner, user:roles:update!owner' },
    { email: 'ownerdenyreservation', roles: 'reservation:update, deny!reservation:update!owner, roomReservation:update, deny!roomReservation:update!owner' },
    { email: 'ownerdenyreservationproperty', roles: 'reservation:update, deny!reservation:approved:update!owner, roomReservation:update, deny!roomReservation:approved:update!owner' },
    { email: 'editroles', roles: 'member' },
    { email: 'radiouser', roles: null },
    { email: 'radioadmin', roles: 'reservation:update, roomReservation:update' },
    { email: 'nondatabase', roles: 'not-database-role' },
  ];

  try {
    for (let i = 0; i < roles.length; i++) {
      const user = await models.user.findOne({ where: { email: roles[i].email } });

      await user.addOrganization(user.currentOrganizationId, { through: { roles: roles[i].roles }});
    
      if (roles[i].organizations) {
        for (let e = 0; e < roles[i].organizations.length; e++) {
          await user.addOrganization(roles[i].organizations[e].id, { through: { roles: roles[i].organizations[e].roles }});
        }
      }
    }
  } catch (e) {
    throw e;
  }
};

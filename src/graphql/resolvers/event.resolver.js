const { event } = require('../../lib');

module.exports = {
  Query: {
    event: async (_, {id}) => {
      try {                
        const data = await event.Event.getById(id);
        return data;
      } catch (err) {
        throw new Error('Error al obtener evento');
      }
    },    
    events: async (_, {pag, num, ord, asc, filter}) => {
      try {        
        console.log(pag, num)
        const data = await event.Event.list(filter, {pag, num, ord, asc});
        const totalCount = await event.Event.count(filter);
        return {
            totalCount: totalCount.count,
            totalEdges: data.data.length,
            status: data.status,
            pag, hasMore: ((pag + 1) * num < totalCount),
            edges: data.data.map(async (node) => ({node}))
        }
      } catch (err) {
        throw new Error('Error al obtener eventos');
      }
    },
    usersEvent: async (_, {eventId}) => {
      return await event.Event.listUsersEvent(eventId)
    },
    userEvents: async (_, {userId}) => {
      return await event.Event.listUserEvents(userId)
    }
  },
  Mutation: {
    createEvent: async (_, {input}) => {
      console.log(input)
      try {                
        const data = await event.Event.addEvent(input);
        return data;
      } catch (err) {
        throw new Error('Error al agregar evento');
      }      
    },
    updateEvent: async (_, {input}) => {
      try {
        const data = await event.Event.updateEvent(input);
        return data;        
      } catch (err) {
        throw new Error('Error al actualizar evento');
      }
    },
    deleteEvent: async (_, {id}) => {
      try {        
        const data = await event.Event.deleteEvent(id);
        return data;        
      } catch (err) {
        throw new Error('Error al eliminar evento');
      }
    },
    addUserEvent: async (_, {userId, eventId}) => {
      try {        
        const data = await event.Event.addUserEvent(userId, eventId);
        return data;        
      } catch (err) {
        throw new Error('Error al agregar usuario al evento');
      }
    },
    updateUserEvent: async (_, {userId, eventId, status}) => {
      try {        
        const data = await event.Event.updateUserEvent(userId, eventId, status);
        return data;        
      } catch (err) {
        throw new Error('Error al actualizar status de la invitacion evento');
      }
    }
  },
};


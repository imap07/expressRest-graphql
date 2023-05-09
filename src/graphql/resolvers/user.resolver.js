const { user } = require('../../lib');

module.exports = {
  Query: {
    user: async (_, {id}) => {
      try {        
        const data = await user.User.getById(id);
        console.log(data)
        return data;
      } catch (err) {
        throw new Error('Error al obtener usuario');
      }
    },    
    users: async (_, {pag, num, ord, asc, filter}) => {
      try {        
        const data = await user.User.list(filter, {pag, num, ord, asc});
        const totalCount = await user.User.count(filter);
        return {
          totalCount: totalCount.count,
          totalEdges: data.data.length,
          status: data.status,
          pag, hasMore: ((pag + 1) * num < totalCount),
          edges: data.data.map(async (node) => ({node}))
        }
      } catch (err) {
        throw new Error('Error al obtener usuarios');
      }
    },
  },
  Mutation: {
    addUser: async (_, {input}) => {
      try {        
        const data = await user.User.addUser(input);
        return data;
      } catch (err) {
        throw new Error('Error al agregar usuario');
      }      
    },
    updateUser: async (_, {input}) => {
      try {        
        const data = await user.User.updateUser(input);
        return data;        
      } catch (err) {
        throw new Error('Error al actualizar usuario');
      }
    },
    deleteUser: async (_, {id}) => {
      try {        
        const data = await user.User.deleteUser(id);
        return data;        
      } catch (err) {
        throw new Error('Error al eliminar usuario');
      }
    }
  },
};


const {session, user} = require('../../lib/');

module.exports = {
    Query: {
    },
    Mutation: {
        login: async (_, {email, password}) =>{
            const logIn = await session.Session.login(email, password);
            return logIn;
        },
        setPassword: async(_, {userId, password}) => {;
            return await session.Session.setPassword(userId, password);
        }
    }
};

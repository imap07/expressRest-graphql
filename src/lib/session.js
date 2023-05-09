const Sequelize = require("sequelize"),
    user = require('./user'),
    model = require('../models/session');
const crypto = require('crypto');

class Session {

    static login = async (email, password) => {
        try {
            let userData = await user.User.getByEmail(email);
            console.log(user.data)
            if (userData.error) return { error: 'Usuario o contraseña incorrectos', status: 401 };
            const validPassword = await user.User.validatePassword(userData.data.id, password);
            if (!validPassword) return { error: 'Usuario o contraseña incorrectos', status: 401 };
            const id = crypto.randomUUID();
            await model.Session.create({
                id, userId: userData.data.id
            });
            let _session = await this.getById(id);
            if(_session.error){
                return { error: 'Error al iniciar sesion', status: 404 };    
            }
            return { data: _session.data, status: 200 };
        } catch (error) {
            console.log(err);
            return { error: 'Error al iniciar sesion', status: 500, cause: err };
        }
    };

    static getById = async (id) => {
        try {
            let data = await model.Session.findByPk(id);
            if (!data) {
                return { error: 'Sesion no encontrada', status: 404 };
            }
            if (data) data = data.get({plain: true});
            const _user =  await user.User.getById(data.userId)
            data = {...data, _user}
            return {data, status: 200};
        } catch (error) {
            console.log(err);
            return { error: 'Error al obtener sesion', status: 500 };
        }
    };

    static update = async (input) => {
        try {
            const prev = this.getById(input.id);
            if (!prev) throw new Error(`Session ${input.id} no existe`);
            await model.Session.update(input, {where: {id: input.id}});
            return await this.getById(input.id);
        } catch (error) {
            logError(error, '0EX26S4L');
        }
    };
}

module.exports = {
    Session
};

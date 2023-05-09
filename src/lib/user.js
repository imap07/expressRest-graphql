const model = require('../models/user'),
    Sequelize = require("sequelize"),
    sha256 = require('crypto-js/sha256'),
    hex = require('crypto-js/enc-hex'),
    Op = Sequelize.Op;
// Función para obtener todos los usuarios
class User {
    // Función para obtener un usuario por su id
    static getById = async (id) => {
        try {
            let data = await model.User.findByPk(id);
            if (!data) {
                return { error: 'User no encontrado', status: 404 };
            }
            if (data) data = data.get({plain: true});
            console.log(data)
            return {data, status: 200};
        } catch (err) {
            console.log(err);
            return { error: 'Error al obtener usuario', status: 500 };
        }
    };

     // Función para filtrado de datos
    static processFilter(filter) {
        let where = {};
        for (let x in filter) switch (x) {
            case 'query':
                where = {
                    ...where,
                    [Op.and]: filter.query.trim().split(' ').map(query => ({
                        [Op.or]: [
                            {
                                name: {
                                    [Op.like]: `%${query}%`
                                }
                            },
                            {
                                email: {
                                    [Op.like]: `%${query}%`
                                }
                            }
                        ]
                    }))
                };
                break;
            case 'id':
                if (filter.id) if (filter.id.length > 0) where.id = {[Op.in]: filter.id};
                break;
        }
        return where;
    }

     // Función para obtener conteo de usuarios
    static count = async (filter) => {
        try {
            let data = await model.User.count({
                where: this.processFilter(filter)
            });
            return { count: data, status: 200 };
        } catch (error) {
            console.log(error);
            return { error: 'Error al obtener conteo de usuarios', status: 500 };
        }
    };

     // Función para obtener listado de usuarios
    static list = async (filter, options) => {
        try {
            const where = this.processFilter(filter),
                order = options.ord ? [[options.ord, options.asc ? 'ASC' : 'DESC']] : [['updatedAt', 'DESC']],
                limit = options.num || 10,
                offset = (options.pag || 0) * limit;
            let data = await model.User.findAll({
                where, limit, offset, order
            });            
            data = data.map(x => x.get({plain: true}));
            return { data, status: 200 };
        } catch (error) {
            return { error: 'Error al obtener listado de usuarios', status: 500 };
        }
    };
    
    // Función para agregar un usuario
    static addUser = async (input) => {
        try {
            const userEmail = await this.getByEmail(input.email, true);
            if(userEmail.status === 409){
                return { error: "El email ya esta registrado", status: 409 };
            }
            const user = await model.User.create(input);
            this.setPassword(user.id, input.password)
            return { data: user, status: 200 };
        } catch (err) {
            throw new Error('Error al agregar usuario', err);
        }
    };
    
    // Función para actualizar un usuario
    static updateUser = async (input) => {
        try {
            const user = await model.User.findByPk(input.id);
            if (user) {
                await user.update(input);
                return { data: user, status: 200 };
            } else {
                return { error: 'Usuario no encontrado', status: 404 };
            }
        } catch (err) {
            console.log(err);
            return { error: 'Error al actualizar usuario', status: 500, cause: err };
        }
    };
    
    // Función para eliminar un usuario
    static deleteUser = async (id) => {
        try {
            const user = await model.User.findByPk(id);
            if (user) {
                await user.destroy();
                return { data: true, status: 200 };
            } else {
                return { error: 'Usuario no encontrado', status: 404 };
            }
        } catch (err) {
            console.log(err);
            return { error: 'Error al actualizar usuario', status: 500, cause: err };
        }
    };

    static validatePassword = async (userId, password) => {
        try {
            const lastPasswordData = await model.UserPassword.findOne({
                where: {userId}, order: [['createdAt', 'DESC']]
            });
            if (!lastPasswordData) throw new Error(`User ${userId} no tiene password definido`);
            const passwordData = lastPasswordData.get({plain: true}).passwordData;
            let hashedPwd2 = hex.stringify(sha256(`${password}`));
            return passwordData === hashedPwd2;
        } catch (error) {
            console.log(error, 'VXZ732TQ');
        }
    }

    static setPassword = async (userId, passwordData) => {
        try {
            if (!await this.getById(userId)) throw new Error(`User ${userId} no existe`);
            if (passwordData.toString().length !== 64) throw new Error(`Password Inválido`);
            await model.UserPassword.create({userId, passwordData});
        } catch (error) {
            console.log(error, 'AWXKXEI1');
        }
    };

    static getByEmail = async (email, create = false) => {
        try {
            let data = await model.User.findOne({where: {email}});
            if (!data && !create) {
                return { error: 'Email de usuario no encontrado', status: 404 };
            }else if(data && create){
                return { status: 409 };
            }
            data = data.get({ plain: true });
            return {data, status: 200};
        } catch (err) {
            console.log(err);
            return { error: 'Error al obtener evento', status: 500 };
        }
    };
}


module.exports = {
    User
};

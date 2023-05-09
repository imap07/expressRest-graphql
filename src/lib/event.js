const { user } = require('.');
const model = require('../models/event'),
    Sequelize = require("sequelize"),
    moment = require('moment');
const { User } = require('./user');
    crypto = require('crypto');
    Op = Sequelize.Op;

    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3,}Z$/;

const validateEventInput = (input) => {
    if (!dateRegex.test(input.start_time)) {
        return { error: 'Formato inválido en start_time', status: 400 };
    }

    if (!dateRegex.test(input.end_time)) {
        return { error: 'Formato inválido en end_time', status: 400 };
    }

    if (moment(input.start_time).isAfter(input.end_time)) {
        return { error: 'La fecha de inicio no puede ser mayor que la fecha de fin', status: 400 };
    }

    if (!input.title) {
        return { error: 'Datos de entrada incompletos', status: 400 };
    }

    return null;
};

class Event {
    // Función para obtener un usuario por su id
    static getById = async (id) => {
        try {
            const data = await model.Event.findByPk(id);
            if (!data) {
                return { error: 'Evento no encontrado', status: 404 };
            }
            return {data, status: 200};
        } catch (err) {
                console.log(err);
                return { error: 'Error al obtener evento', status: 500 };
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
                                title: {
                                    [Op.like]: `%${query}%`
                                }
                            },
                            {
                                description: {
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
            let data = await model.Event.count({
                where: this.processFilter(filter)
            });
            return { count: data, status: 200 };
        } catch (error) {
            console.log(error);
            return { error: 'Error al obtener conteo de eventos', status: 500 };
        }
    };

     // Función para obtener listado de usuarios
    static list = async (filter, options) => {
        try {
            const where = this.processFilter(filter),
                order = options.ord ? [[options.ord, options.asc ? 'ASC' : 'DESC']] : [['updatedAt', 'DESC']],
                limit = options.num || 10,
                offset = (options.pag || 0) * limit;
            let data = await model.Event.findAll({
                where, limit, offset, order
            });             
            data = data.map(x => x.get({plain: true}));
            return { data, status: 200 };
        } catch (error) {            
            return { error: 'Error al obtener listado de eventos', status: 500 };
        }
    };

    // Función para agregar un evento
    static addEvent = async (input) => {
        try {
            if (!input.id) input.id = crypto.randomUUID();
            const validationError = validateEventInput(input);
            if (validationError) {
                return validationError;
            }
            const data = await model.Event.create(input);
            return { data: data, status: 200 };
        } catch (err) {
            console.log(err);
            return { error: 'Error al agregar evento', status: 500, cause: err };
        }
    };
    
    // Función para actualizar un usuario
    static updateEvent = async (input) => {
        try {
            const validationError = validateEventInput(input);
            if (validationError) {
                return validationError;
            }
            const data = await model.Event.findByPk(input.id);
            if (data) {
                await data.update(input);
                return { data: data, status: 200 };
            } else {
                return { error: 'Evento no encontrado', status: 404 };
            }
        } catch (err) {
            console.log(err);
            return { error: 'Error al actualizar evento', status: 500, cause: err };
        }
    };
    
    // Función para eliminar un usuario
    static deleteEvent = async (id) => {
        try {
            const data = await model.Event.findByPk(id);
            if (data) {
                await data.destroy();
                return { data: true, status: 200 };
            } else {
                return { error: 'Evento no encontrado', status: 404 };
            }
        } catch (err) {
            console.log(err);
            return { error: 'Error al actualizar evento', status: 500, cause: err };
        }
    };

    static addUserEvent = async (userId, eventId) => {
        try {
            const eventData = await this.getById(eventId);
            const userData = await User.getById(userId)
            if (!eventData.error && !userData.error) {
                const attendee = await model.UserEvent.findOne({where:{userId, eventId}})
                if(attendee){
                    return {data: false, error: 'El usuario ya fue dado de alta en el evento', status: 409}
                }else{
                    await model.UserEvent.create({userId, eventId});
                    return { data: true, status: 200 };
                }
            } else {
                return { data: false, error: 'Evento no encontrado', status: 404 };
            }
        } catch (err) {
            console.log(err);
            return { error: 'Error al agregar evento', status: 500, cause: err };
        }
    };

    static listUsersEvent = async (eventId) => {
        try {
            let eventData = await this.getById(eventId);
            if (!eventData.error) {
                let userIds = await model.UserEvent.findAll({where: {eventId}});
                userIds = userIds.map(x => x.get({plain: true}));
                let data = {
                    userEvent: userIds,
                    event: eventData.data.dataValues
                }
                console.log(data)
                return {data, status: 200}
            } else {
                return { error: 'Evento no encontrado', status: 404 };
            }
        } catch (err) {
            console.log(err);
            return { error: 'Error al agregar evento', status: 500, cause: err };
        }
    };

    static listUserEvents = async (userId) => {
        try {
            const userData = await User.getById(userId)
            if (!userData.error) {
                let eventIds = await model.UserEvent.findAll({where: {userId}});
                eventIds = eventIds.map(x => x.get({plain: true}));                
                for(let a in eventIds){
                    const event = await this.getById(eventIds[a].eventId);
                    eventIds[a] = {
                        ...eventIds[a],
                        event: event.data.dataValues
                    }
                }
                console.log(eventIds)
                return {data: eventIds, status: 200}
            } else {
                return { error: 'Evento de usuario no encontrados', status: 404 };
            }
        } catch (err) {
            console.log(err);
            return { error: 'Error al agregar evento', status: 500, cause: err };
        }
    };

    static updateUserEvent = async (userId, eventId, status) => {
        try {
            const eventData = await this.getById(eventId);
            const userData = await User.getById(userId)
            if (!eventData.error && !userData.error) {
                const attendee = await model.UserEvent.findOne({where:{userId, eventId}})
                if(attendee){
                    await model.UserEvent.update({status},{where:{userId, eventId}});
                    return { data: true, status: 200 };
                    
                }else{
                    return {data: false, error: 'No se pudo actualizar el estatus del evento', status: 404}
                }
            } else {
                return { data: false, error: 'Evento no encontrado', status: 404 };
            }
        } catch (err) {
            console.log(err);
            return { error: 'Error al agregar evento', status: 500, cause: err };
        }
    };
}


module.exports = {
    Event
};

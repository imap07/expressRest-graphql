const { event } = require('../lib');
class EventController {
    async getEvent(req, res, next) {
        try {
            const id = req.params.id;
            const data = await event.Event.getById(id);
            if (data.error) {
                return res.status(data.status).json({ error: data.error });
            }
            res.status(200).json({ data: data.data });
        } catch (error) {
            next(ApiError.internalError(error.message));
        }
    }

    async getEvents(req, res, next) {
        try {
            const {num, pag, ord, asc, filter} = req.query
            const data = await event.Event.list(filter, {num, pag, ord, asc});
            const totalCount = await event.Event.count(filter, {num, pag, ord, asc});
            if (data.error) {
                return res.status(data.status).json({ error: data.error });
            }
            res.status(200).json({ totalCount: totalCount.count, data: data.data });
        } catch (error) {
            next(ApiError.internalError(error.message));
        }
    }

    async create(req, res, next) {
        try {
            const input = req.body;
            const data = await event.Event.addEvent(input);
            if (data.error) {
                return res.status(data.status).json({ error: data.error });
            }
            res.status(200).json({ data: data.data });
        } catch (error) {
            next(ApiError.internalError(error.message));
        }
    }

    async update(req, res, next) {
        try {
            const id = req.params.id;
            const input = req.body;
            const data = await event.Event.updateEvent({...input, id});
            if (data.error) {
                return res.status(data.status).json({ error: data.error });
            }
            res.status(200).json({ data: data.data});
        } catch (error) {
            next(ApiError.internalError(error.message));
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id;
            const data = await event.Event.deleteEvent(id);
            if (data.error) {
                return res.status(data.status).json({ error: data.error });
            }
            res.status(200).json({ data: data.data });
        } catch (error) {
            next(ApiError.internalError(error.message));
        }
    }
}

module.exports = new EventController();
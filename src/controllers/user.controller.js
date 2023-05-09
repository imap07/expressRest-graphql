const { user } = require('../lib');
class UserController {
    async getUser(req, res, next) {
        try {
            const id = req.params.id;
            const data = user.User.getById(id);
            res.status(201).json({data: data.data, error: data.error});
        } catch (error) {
            next(ApiError.internalError(error.message));
        }
    }

    async getUsers(req, res, next) {
        try {
            const {num, pag, ord, asc, filter} = req.query
            const data = await user.User.list(filter, {num, pag, ord, asc});
            const totalCount = await user.User.count(filter, {num, pag, ord, asc});
            res.status(201).json({data: data.data, error: data.error, totalCount: totalCount.count});
        } catch (error) {
            next(ApiError.internalError(error.message));
        }
    }
}

module.exports = new UserController();
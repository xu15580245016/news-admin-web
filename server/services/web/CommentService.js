const CommentModel = require('../../models/CommentModel')

const CommentService = {
    getList: async (newsId) => {
        return await CommentModel.find({ newsId }).sort({ createTime: -1 })
    },
    add: async (data) => {
        return await CommentModel.create(data)
    }
}

module.exports = CommentService

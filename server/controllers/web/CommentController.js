const CommentService = require("../../services/web/CommentService")

const CommentController = {
    getList: async (req, res) => {
        const { newsId } = req.query
        const result = await CommentService.getList(newsId)
        res.send({
            ActionType: 'OK',
            data: result
        })
    },
    add: async (req, res) => {
        const { newsId, content, username } = req.body
        const result = await CommentService.add({
            newsId,
            content,
            username: username || '匿名用户',
            createTime: new Date()
        })
        res.send({
            ActionType: 'OK',
            data: result
        })
    },
}

module.exports = CommentController

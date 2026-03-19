var express = require('express');
const CommentController = require('../../controllers/web/CommentController');

var CommentRouter = express.Router();

CommentRouter.get('/webapi/news/commentList', CommentController.getList)
CommentRouter.post('/webapi/news/commentSubmit', CommentController.add)

module.exports = CommentRouter;

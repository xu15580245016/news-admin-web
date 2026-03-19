const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentType = {
    newsId: String,
    content: String,
    username: String,
    createTime: Date,
}

const CommentModel = mongoose.model("comment", new Schema(CommentType))
module.exports = CommentModel

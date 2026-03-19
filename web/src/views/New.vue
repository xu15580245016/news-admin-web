<!---->
<template>
    <el-row>
        <el-col :span="17" :offset="1">
            <h2>{{ currentNews.title }}</h2>
            <div class="time">{{ formatTime.getTime(currentNews.editTime) }}</div>
            <el-divider border-style="dashed" />
            <div v-html="currentNews.content"></div>
            
            <!-- 评论区 -->
            <el-divider border-style="dashed" />
            <div class="comment-section">
                <h3>评论区</h3>
                
                <!-- 评论提交 -->
                <el-form :model="commentForm" label-width="80px" style="margin-bottom: 20px;">
                    <el-form-item label="昵称">
                        <el-input v-model="commentForm.nickname" placeholder="请输入昵称"></el-input>
                    </el-form-item>
                    <el-form-item label="评论内容">
                        <el-input type="textarea" v-model="commentForm.content" placeholder="请输入评论内容" rows="4"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitComment">提交评论</el-button>
                    </el-form-item>
                </el-form>
                
                <!-- 评论列表 -->
                <div v-if="comments.length > 0">
                    <div v-for="comment in comments" :key="comment._id" class="comment-item">
                        <div class="comment-header">
                            <span class="comment-nickname">{{ comment.nickname }}</span>
                            <span class="comment-time">{{ formatTime.getTime(comment.createTime) }}</span>
                        </div>
                        <div class="comment-content">{{ comment.content }}</div>
                    </div>
                </div>
                <div v-else class="no-comments">暂无评论，快来发表第一条评论吧！</div>
            </div>
        </el-col>
        <el-col :span="4" :push="1">
            <el-card class="box-card">
                <template #header>
                    <div class="card-header">
                        <span>最近新闻</span>
                    </div>
                </template>
                <div v-for="item in topNews" :key="item._id" class="text item" style="padding: 5px;"
                    @click="handleChange(item._id)">
                    <span>{{ item.title }}</span>
                    <div class="bottom">
                        <time class="time">{{ formatTime.getTime(item.editTime) }}</time>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup>
import { reactive, ref, toRefs, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import formatTime from '../util/formatTime'

const route = useRoute()
const router = useRouter()
const currentNews = ref({})
const topNews = ref([])
const comments = ref([])
const commentForm = ref({
    nickname: '',
    content: ''
})

const stop = watchEffect(async () => {
    // 函数体
    if (!route.params.id) return
    const res = await axios.get(`/webapi/news/list/${route.params.id}`)
    const resulet = await axios.get(`/webapi/news/toplist?limit=4`)
    // console.log(res.data.data);
    if (res.data.data.length === 0) return router.push('/home')
    currentNews.value = res.data.data[0]
    topNews.value = resulet.data.data
    // 获取评论列表
    await getComments()
})
onBeforeUnmount(() => {
    // 函数体
    stop()
})

const handleChange = (id) => {
    // 函数体
    router.push(`/new/${id}`)
}

// 获取评论列表
const getComments = async () => {
    if (!route.params.id) return
    try {
        const res = await axios.get(`/webapi/news/commentList`, {
            params: {
                newsId: route.params.id
            }
        })
        comments.value = res.data.data || []
    } catch (error) {
        console.error('获取评论失败:', error)
    }
}

// 提交评论
const submitComment = async () => {
    if (!route.params.id) return
    if (!commentForm.value.nickname || !commentForm.value.content) {
        alert('请填写昵称和评论内容')
        return
    }
    try {
        await axios.post(`/webapi/news/commentSubmit`, {
            newsId: route.params.id,
            nickname: commentForm.value.nickname,
            content: commentForm.value.content
        })
        // 提交成功后清空表单并重新获取评论
        commentForm.value = {
            nickname: '',
            content: ''
        }
        await getComments()
        alert('评论提交成功')
    } catch (error) {
        console.error('提交评论失败:', error)
        alert('评论提交失败，请稍后重试')
    }
}
</script>

<style lang='scss' scoped>
.el-row {
    margin-top: 20px;
}

.comment-section {
    margin-top: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.comment-item {
    padding: 15px 0;
    border-bottom: 1px solid #eee;
}

.comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.comment-nickname {
    font-weight: bold;
    color: #333;
}

.comment-time {
    font-size: 12px;
    color: #999;
}

.comment-content {
    color: #666;
    line-height: 1.5;
}

.no-comments {
    text-align: center;
    padding: 30px 0;
    color: #999;
}

@media screen and (max-width: 768px) {
    .comment-section {
        padding: 10px;
    }
    
    .el-form {
        label-width: 60px;
    }
}
</style>
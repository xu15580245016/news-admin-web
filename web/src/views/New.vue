<template>
    <el-row>
        <el-col :span="17" :offset="1">
            <h2>{{ currentNews.title }}</h2>
            <div class="time">{{ formatTime.getTime(currentNews.editTime) }}</div>
            <el-divider border-style="dashed" />
            <div v-html="currentNews.content"></div>
            
            <el-divider />
            
            <div class="comment-section">
                <h3>评论</h3>
                <div class="comment-form">
                    <el-input
                        v-model="commentContent"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入评论内容"
                    />
                    <div class="comment-form-bottom">
                        <el-input
                            v-model="commentUsername"
                            placeholder="请输入用户名（选填）"
                            style="width: 200px;"
                        />
                        <el-button type="primary" @click="submitComment">提交评论</el-button>
                    </div>
                </div>
                
                <div class="comment-list">
                    <div v-if="comments.length === 0" class="no-comment">暂无评论，快来抢沙发吧！</div>
                    <div v-for="item in comments" :key="item._id" class="comment-item">
                        <div class="comment-header">
                            <span class="comment-username">{{ item.username }}</span>
                            <span class="comment-time">{{ formatTime.getTime(item.createTime) }}</span>
                        </div>
                        <div class="comment-content">{{ item.content }}</div>
                    </div>
                </div>
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
import { ref, watchEffect, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import formatTime from '../util/formatTime'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const currentNews = ref({})
const topNews = ref([])
const comments = ref([])
const commentContent = ref('')
const commentUsername = ref('')

const fetchComments = async () => {
    if (!route.params.id) return
    const res = await axios.get(`/webapi/news/commentList?newsId=${route.params.id}`)
    comments.value = res.data.data || []
}

const submitComment = async () => {
    if (!commentContent.value.trim()) {
        ElMessage.warning('请输入评论内容')
        return
    }
    if (!route.params.id) return
    
    try {
        await axios.post('/webapi/news/commentSubmit', {
            newsId: route.params.id,
            content: commentContent.value,
            username: commentUsername.value || '匿名用户'
        })
        ElMessage.success('评论提交成功')
        commentContent.value = ''
        fetchComments()
    } catch (error) {
        ElMessage.error('评论提交失败')
    }
}

const stop = watchEffect(async () => {
    if (!route.params.id) return
    const res = await axios.get(`/webapi/news/list/${route.params.id}`)
    const resulet = await axios.get(`/webapi/news/toplist?limit=4`)
    if (res.data.data.length === 0) return router.push('/home')
    currentNews.value = res.data.data[0]
    topNews.value = resulet.data.data
    fetchComments()
})

onBeforeUnmount(() => {
    stop()
})

const handleChange = (id) => {
    router.push(`/new/${id}`)
}
</script>

<style lang='scss' scoped>
.el-row {
    margin-top: 20px;
}

.comment-section {
    margin-top: 30px;
    
    h3 {
        margin-bottom: 20px;
    }
}

.comment-form {
    margin-bottom: 30px;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 8px;
    
    .comment-form-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    }
}

.comment-list {
    .no-comment {
        text-align: center;
        padding: 40px;
        color: #999;
    }
}

.comment-item {
    padding: 15px;
    border-bottom: 1px solid #eee;
    
    &:last-child {
        border-bottom: none;
    }
    
    .comment-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        
        .comment-username {
            font-weight: bold;
            color: #409eff;
        }
        
        .comment-time {
            color: #999;
            font-size: 12px;
        }
    }
    
    .comment-content {
        color: #666;
        line-height: 1.6;
    }
}
</style>

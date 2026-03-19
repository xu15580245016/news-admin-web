<!---->
<template>
    <div class="navbar">
        <el-menu :default-active="route.fullPath" class="el-menu-demo" mode="horizontal" :router="true" style="width: 100%;">
            <el-menu-item index="/home">首页</el-menu-item>
            <el-menu-item index="/news">新闻中心</el-menu-item>
            <el-menu-item index="/product">产品与服务</el-menu-item>
            <el-menu-item index="/" @click="handleClick" style="margin-left: auto;">登录</el-menu-item>
        </el-menu>
    </div>
</template>

<script setup>
import { reactive, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()


const handleClick = () => {
    // 函数体
    window.location.href = 'http://localhost:5173/#/login'
}
</script>

<style lang='scss' scoped>
.navbar {
    position: sticky;
    top: 0;
    z-index: 9999;
}
</style>
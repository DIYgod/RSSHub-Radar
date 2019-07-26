<template>
    <div class="list">
        <el-main>
            <div class="title">支持列表</div>
            <div class="content">
                未完成的功能
            </div>
        </el-main>
    </div>
</template>

<script>
export default {
    name: 'List',
    data: () => ({
    }),
}
</script>

<style lang="less" scoped>
.list {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 10px;
}

.title {
    font-size: 25px;
    font-weight: bold;
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 10px;
    color: #f5712c;
}

.content {
    margin-top: 20px;
    color: #222;
}
</style>

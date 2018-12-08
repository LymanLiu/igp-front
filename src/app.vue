<template>
    <div id="app"
         :style="{backgroundImage: bgiUrl}">
        <router-view></router-view>
    </div>
</template>
<script>
    import loginBg from '@/static/images/login-bg.jpg';
    import bg from '@/static/images/bg.jpg';

    export default {
        data() {
            return {
                bgiUrl: bg
            };
        },
        created() {
            if (!sessionStorage.getItem('ACCESS_TOKEN')) {
                this.$router.replace({
                    name: 'login'
                })
            }
            const src = localStorage.getItem('bgiUrl') || loginBg;
            this.bgiUrl = `url(${src})`
        },
        methods: {},
        watch: {
            '$store.state.refreshBgI'(n) {
                const src = localStorage.getItem('bgiUrl') || bg;
                this.bgiUrl = `url(${src})`

            }
        }
    };
</script>
<style scoped lang="less">
    #app {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-repeat: no-repeat;
        background-size: cover;
    }
</style>



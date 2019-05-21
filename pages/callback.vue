<template>
    
</template>

<script>
export default {
    data() {
        return {
            user: {},
            error: null,
        }
    },
    mounted() {
        axios.get('http://localhost:3000/server/authorize/callback', {
            params: this.$route.query,
        }).then(res => {
            this.user = res.data.user;
        }).catch(err => {
            this.error = err;
        })
    }
}
</script>

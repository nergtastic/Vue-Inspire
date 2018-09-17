<template>
    <div class="login">
        <form @submit.prevent="login(user);user = {}">
            <div class="form-group">
                <input type="email" name="email" id="email" placehoder="Email" v-model="user.email">
                <input type="password" name="password" id="password" placeholder="Password" v-model="user.password">
            </div>
            <button class="btn btn-outline-dark" type="submit">Login</button>
        </form>
        <div class="register">Need to get setup?</div>
        <em class="btn btn-link" @click="toggle">Register</em>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                user: {

                }
            }
        },
        computed: {},
        methods: {
            login(user) {
                this.$store.dispatch('login', user)
            },
            toggle() {
                this.$router.push("register")
            }
        },
        components: {}
    }
</script>

<style scoped>

.register {
    margin: 15px;
    display: block;
}

</style>
<template>
    <div class="register">
        <form @submit.prevent="register(user);user = {}">
            <div class="form-group">
                <p>Please fill out this form to create a new account.</p>
                <p>All fields are required.</p>
                <input class="form-group-item" type="name" name="name" id="name" placeholder="Name" v-model="user.name"
                    required>
                <input class="form-group-item" type="email" name="email" id="email" placehoder="Email" v-model="user.email"
                    required>
                <input class="form-group-item" type="password" name="password" id="password" placeholder="Password"
                    v-model="user.password" required>
            </div>
            <button class="btn btn-outline-dark" type="submit">Register</button>
        </form>

    </div>
</template>

<script>
    export default {
        name: 'register',
        data() {
            return {
                user: {

                }
            }
        },
        computed: {

        },
        methods: {
            register(user) {
                this.$store.dispatch('register', user)
            },
            toggle() {
                this.$router.push('login')
            }
        },
        components: {}
    }
</script>

<style scoped>
    .form-group-item {
        display: block;
        margin: auto;
        margin-bottom: 10px;
    }
</style>
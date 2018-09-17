import vue from 'vue'
import vuex from 'vuex'
import router from '../router'
import firebase from 'firebase/app'
import 'firebase/auth'
import db from '../utils/firebaseInit'
import axios from 'axios'

let bgImage = axios.create({
    baseURL: 'http://bcw-sandbox.herokuapp.com/api/images',
    timeout: 5000
})

let quote = axios.create({
    baseURL: 'http://bcw-sandbox.herokuapp.com/api/quotes',
    timeout: 5000
})

let weather = axios.create({
    baseURL: 'http://bcw-sandbox.herokuapp.com/api/weather',
    timeout: 5000
})

vue.use(vuex)

export default new vuex.Store({
    state: {
        user: {},
        tasks: [],
        bgPic: {}
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        setTasks(state, tasks) {
            state.tasks = tasks
        },
        setPic(state, bgPic) {
            state.bgPic = bgPic
        },
        setQuote(state, myQuote) {
            state.myQuote = myQuote
        },
        setWeather(state, myWeather) {
            state.myWeather = myWeather
        }
    },
    actions: {
        register({ commit, dispatch }, newUser) {
            firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
                .then(res => {
                    commit('setUser', res)
                    router.push({ name: 'Dashboard' })
                    firebase.auth().currentUser.updateProfile({ displayName: newUser.name })
                        .then(res => {
                            console.log("Profile updated with name: ", newUser.name)
                        })
                        .catch(err => { console.error(err) })
                }).catch(err => {
                    console.error(err)
                })
        },
        login({ commit, dispatch }, creds) {
            firebase.auth().signInWithEmailAndPassword(creds.email, creds.password)
                .then(res => {
                    commit('setUser', res.user)
                    router.push({ name: 'Dashboard' })
                }).catch(err => {
                    console.error(err)
                })
        },
        authenticate({ commit, dispatch }) {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    commit('setUser', user)
                    dispatch('getTasks')
                    router.push({ name: 'Dashboard' })
                } else {
                    commit('setUser', {})
                    router.push({ name: 'Login' })
                }
            })
        },
        logout({ commit, dispatch }) {
            firebase.auth().signOut()
                .then(res => {
                    commit('setUser', {})
                    router.push({ name: 'Login' })
                })
                .catch(err => {
                    console.error(err)
                })
        },
        getTasks({ state, commit, dispatch }) {
            db.collection('tasks').where("user", "==", state.user.uid).get().then(querySnapShot => {
                let tasks = []
                querySnapShot.forEach(doc => {
                    if (doc.exists) {
                        let task = doc.data()
                        task.id = doc.id
                        tasks.push(task)
                    }
                })
                commit('setTasks', tasks)
            })
        },
        createTask({ commit, dispatch }, newTask) {
            db.collection('tasks').add(newTask).then(doc => {
                console.log("Created new task with ID: ", doc.id)
                dispatch('getTasks')
            })
        },
        deleteTask({ commit, dispatch }, id) {
            db.collection('tasks').doc(id).delete().then(() => {
                dispatch('getTasks')
            })
        },
        getImage({ commit, dispatch }) {
            bgImage.get('').then(res => {
                console.log('bgImage: ', res.data)
                console.log('Found: ', res.data.large_url)
                console.log('Also found: ', res.data.url)
                commit('setPic', res.data)
            })
                .catch(err => { console.error(err) })
        },
        getQuote({ commit, dispatch }) {
            quote.get('').then(res => {
                console.log('Picked this quote out for you: ', res.data)
                commit('setQuote', res.data)
            })
                .catch(err => { console.error(err) })
        },
        getWeather({ commit, dispatch }) {
            weather.get('').then(res => {
                console.log('Found your weather: ', res.data)
                commit('setWeather', res.data)
            })
                .catch(err => { console.error(err) })
        }
    }
})


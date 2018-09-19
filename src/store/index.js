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
        bgPic: {},
        myWeather: {},
        myQuote: {}
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
                dispatch('getTasks')
            })
        },
        deleteTask({ commit, dispatch }, id) {
            db.collection('tasks').doc(id).delete().then(() => {
                dispatch('getTasks')
            })
        },
        completeTask({ commit, dispatch }, task) {
            db.collection('tasks').doc(task.id).update(task).then(() => {
                dispatch('getTasks')
            })
        },
        getImage({ commit, dispatch }) {
            bgImage.get('').then(res => {
                console.log('Image data: ', res.data)
                commit('setPic', res.data)
            })
                .catch(err => { console.error(err) })
        },
        getQuote({ commit, dispatch }) {
            quote.get('').then(res => {
                console.log(res.data)
                let fixedQuote = {}
                fixedQuote.author = res.data.author
                fixedQuote.quote = res.data.quote.toString();
                fixedQuote.quote = fixedQuote.quote.replace('&#146;', "'")
                fixedQuote.quote = fixedQuote.quote.replace("&#145;", "`")
                fixedQuote.quote = fixedQuote.quote.replace("&#147;", "\"")
                fixedQuote.quote = fixedQuote.quote.replace("&#148;", "\"")
                console.log(res.data.quote)
                console.log(fixedQuote.quote.replace("How", "Why not"))
                commit('setQuote', fixedQuote)
            })
                .catch(err => { console.error(err) })
        },
        getWeather({ commit, dispatch }) {
            weather.get('').then(res => {
                // res.data.main.temp = Math.round(res.data.main.temp * 9 / 5 - 459.67)
                let newWeather = {}
                newWeather.temp = Math.round(res.data.main.temp * 9 / 5 - 459.67)
                newWeather.name = res.data.name
                newWeather.status = res.data.weather[0].main
                console.log('Your weather: ', newWeather)
                commit('setWeather', newWeather)
            })
                .catch(err => { console.error(err) })
        }
    }
})


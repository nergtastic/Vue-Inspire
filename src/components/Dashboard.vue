<template>
  <div class="row bg-inspire" :style="{ 'background-image': 'url(' + bgPic.large_url + ')'}" style="height: 100vh; width: 100%; margin-top: -60px;">
    <div class="col-12">
      <div class="col-1 weather-display bg-block" v-if="myWeather">
        <h4>{{myWeather.name}}:</h4>
        <h4>{{myWeather.temp}}°F</h4>
        <h4>{{myWeather.status}}</h4>
      </div>
      <div class="col-2 offset-5 bg-block greeting">
        <h1>Hello, {{user.displayName}}!</h1>
        <button class="btn btn-small" @click="logout" v-if="user.email">Logout</button>
      </div>
      <div class="task-view bg-block stretch">
        <div class="list">
          <h5>Your tasks today:</h5>
          <a v-if="tasks.length == 0" class="list-item">Hover here to add tasks.</a>
          <div v-for="(task, index) in tasks ">
            <button class="btn btn-check bg-success" @click="completeTask(task)">&#x2713;</button>
            <a v-if="task.completed == false" class="list-item" @click="showTaskDetails(task)">{{task.name}}</a>
            <a v-if="task.completed == true" style="text-decoration:line-through;" @click="showTaskDetails(task)">{{task.name}}</a>
            <button class="btn btn-del bg-danger" @click="deleteTask(task.id)">x</button>
          </div>
        </div>
        <div class="task-form">
          <div id="taskName" class="task-description"></div>
          <div id="taskDescription" class="task-description">Click a task for more info.</div>
          <form @submit.prevent="createTask(); newTask={ } ">
            <a>New Task:</a><br />
            <input type="text" name="name" id="name" placeholder="Task name " v-model="newTask.name" required><br />
            <input type="text" name="description" id="description" placeholder="Description" v-model="newTask.description"
              required><br />
            <button class="btn btn-secondary btn-task bg-info" type="submit">Add Task</button>
          </form>
        </div>
      </div>
      <div class="bg-block refresh-display col-1">
        <button class="btn btn-small btn-refresh" @click="getImage">&#8635;</button> New image
      </div>
      <div class="col-4 offset-4 quote bg-block grow" v-if="myQuote">
        <h6>{{myQuote.quote}}</h6>
        <h6>- {{myQuote.author}}</h6>
      </div>
      <div class="search-area bg-block">
        <form method="get" action="http://www.google.com/search" target="_blank">
          <input value="" name="q" placeholder="Google search" />
          <input type="hidden" value="en" name="hl" />
          <input type="hidden" value="lang_en" name="lr" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dashboard',
    data() {
      return {
        newTask: {},
      };
    },
    mounted() {
      this.$store.dispatch("getTasks");
      this.$store.dispatch("getImage");
      this.$store.dispatch("getQuote");
      this.$store.dispatch("getWeather");
    },
    methods: {
      getImage() {
        this.$store.dispatch('getImage')
      },
      getQuote() {
        this.$store.dispatch('getQuote')
      },
      getWeather() {
        this.$store.dispatch('getWeather')
      },
      createTask() {
        this.newTask.user = this.user.uid
        this.newTask.completed = false
        this.$store.dispatch('createTask', this.newTask)
      },
      deleteTask(id) {
        this.$store.dispatch('deleteTask', id)
      },
      logout() {
        this.$store.dispatch('logout')
      },
      showTaskDetails(task) {
        document.getElementById('taskDescription').innerText = '';
        document.getElementById('taskName').innerText = '';
        document.getElementById('taskName').innerText = task.name;
        document.getElementById('taskDescription').innerText = task.description;
      },
      completeTask(task) {
        if (task.completed == true) {
          task.completed = false;
        } else if (task.completed == false) {
          task.completed = true;
        }
        this.$store.dispatch('completeTask', task)
      },
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      tasks() {
        return this.$store.state.tasks;
      },
      bgPic() {
        return this.$store.state.bgPic;
      },
      myQuote() {
        return this.$store.state.myQuote;
      },
      myWeather() {
        return this.$store.state.myWeather;
      }
    }
  }
</script>

<!-- Add "scoped " attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .bg-inspire {
    background: no-repeat center center fixed;
    -webkit-background-size: cover;
  }

  .quote {
    position: fixed;
    text-align: center;
    color: #ffffff;
    bottom: 0;
    margin-bottom: 10px;
  }

  .task-view {
    position: fixed;
    text-align: center;
    color: #ffffff;
    top: 1%;
    right: 0;
    margin-bottom: 10px;
    margin-right: 30px;
    overflow: hidden;
    width: 250px;
    height: 200px;
    display: inline-block;
  }

  .list {
    display: inline-block;
    margin-bottom: 30px;
    overflow-y: auto;
    min-height: 150px;
    max-width: 200px;
    min-width: 50%;
  }

  .list-item {
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .task-form {
    max-width: 250px;
  }

  .bg-block {
    background-color: rgba(0, 0, 0, .5);
    border-radius: 5px;
    padding: 25px;
  }

  .weather-display {
    position: fixed;
    text-align: center;
    color: #ffffff;
    margin: 10px;
    left: 0;
    height: auto;
    min-width: 150px;
  }

  .refresh-display {
    position: fixed;
    text-align: center;
    color: #ffffff;
    margin: 10px;
    left: 0;
    bottom: 0;
    height: auto;
    min-width: 200px;
  }

  .search-area {
    max-width: 300px;
    min-width: 300px;
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 10px;
    text-align: center;
  }

  .input-search {
    width: 250px;
  }

  .btn-small {
    height: 25px;
    padding: 0px 5px;
    margin-top: 10px;
    background-color: darkcyan;
    color: #ffffff;
  }

  .btn-del {
    height: 15px;
    width: 12px;
    padding: 0px 2px 2px 1px;
    margin: -2px 0px 0px 8px;
    line-height: 10px;
    font-size: 10px;
    color: #ffffff;
  }

  .btn-check {
    height: 15px;
    width: 12px;
    padding: 0px 0px 2px 1px;
    margin: -2px 0px 0px 8px;
    line-height: 10px;
    font-size: 10px;
    color: #ffffff;
  }

  .btn-task {
    margin: 10px;
    height: 25px;
    padding: 0px 5px;
  }

  .btn-refresh {
    margin: 5px 10px 10px -5px;
  }

  .greeting {
    top: 10px;
    color: #ffffff;
    min-width: 200px;
  }

  .task-description {
    color: #ffffff;
    margin-top: -15px;
    margin-bottom: 10px;
    min-height: 15px;
  }

  .grow {
    transition: all .2s ease-in-out;
  }

  .grow:hover {
    transform: scale(1.2);
    margin-bottom: 50px;
  }

  .stretch {
    transition: all .2s ease-in-out;
  }

  .stretch:hover {
    height: 800px;
    overflow: hidden;
  }

  .task-view:hover {
    height: auto;
  }
</style>
<template>
  <div class="row bg-inspire" :style="{ 'background-image': 'url(' + bgPic.large_url + ')'}" style="height: 100vh; width: 100%; margin-top: -60px;">
    <div class="col-12">
      <div class="col-1 weather-display bg-block">
        <h4>Current Temp:</h4>
        <h4>{{myWeather}}°F</h4>
      </div>
      <div class="col-2 offset-5 bg-block greeting">
        <h1>Hello, {{user.displayName}}!</h1>
        <button class="btn btn-small" @click="logout" v-if="user.email">Logout</button>
      </div>
      <div class="task-view bg-block stretch">
        <div class="list">
          <h5>Your tasks today:</h5>
          <div v-for="(task, index) in tasks ">
            <a class="list-item">{{task.name}}</a><button class="btn btn-del bg-danger" @click="deleteTask(task.id)">x</button>
          </div>
        </div>
        <div class="task-form">
          <form @submit.prevent="createTask(); newTask={ } ">
            <a>New Task:</a><br />
            <input type="text" name="name" id="name" placeholder="Task name " v-model="newTask.name" required><br />
            <input type="text" name="description" id="description" placeholder="Description" v-model="newTask.description"
              required><br />
            <button class="btn btn-secondary btn-task" type="submit">Add to Tasks</button>
          </form>
        </div>
      </div>
      <div class="col-4 offset-4 quote bg-block grow">
        <h6>{{myQuote.quote}}</h6>
        <h6>- {{myQuote.author}}</h6>
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
        isModalVisible: false,
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
        this.$store.dispatch()
      },
      getQuote() {
        this.$store.dispatch()
      },
      getWeather() {
        this.$store.dispatch()
      },
      createTask() {
        this.newTask.user = this.user.uid
        this.newTask.completed = false
        console.log('Creating that task for you...', this.newTask)
        this.$store.dispatch('createTask', this.newTask)
      },
      deleteTask(id) {
        this.$store.dispatch('deleteTask', id)
      },
      showModal() {
        this.isModalVisible = true;
      },
      closeModal() {
        this.isModalVisible = false;
      },
      logout() {
        this.$store.dispatch('logout')
      }
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
        return Math.round(this.$store.state.myWeather.main.temp * 9 / 5 - 459.67);
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
    margin-right: 40px;
    overflow: hidden;
    width: 250px;
    max-height: 200px;
    display: inline-block;
  }

  .list {
    display: inline-block;
    margin-bottom: 30px;
    overflow-y: auto;
    min-height: 150px;
    max-width: 170px;
  }

  .list-item {
    width: 10px;
    text-overflow: ellipsis;
  }

  .task-form {
    margin: 0px 20px;
    float: right;
  }

  .bg-block {
    background-color: rgba(0, 0, 0, .7);
    border-radius: 5px;
    padding: 25px;
  }

  .weather-display {
    text-align: center;
    color: #ffffff;
    height: 100px;
    margin: 10px;
    left: 0;
    height: auto;
  }

  .btn-small {
    height: 25px;
    padding: 0px 5px;
    margin-top: 10px;
    background-color: darkcyan;
  }

  .btn-del {
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

  .greeting {
    top: -100px;
    color: #ffffff;
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
    width: 30%;
    overflow: hidden;
  }
</style>
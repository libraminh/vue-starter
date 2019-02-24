<template>
  <div>
    <router-link to="/home">Home</router-link>
    <router-link to="/about">About</router-link>

    <!-- Module Todos Store -->
    <h3>Module Todos Store</h3>
    <ul>
      <li v-for="item in todos">{{item.title}} - {{item.completed}}</li>
    </ul>

    <!-- Todos Store -->
    <h3>Todos Store</h3>
    <ul>
      <li v-for="todos in completedTodos">{{todos.title}} - {{todos.completed}}</li>
    </ul>
    <button
      @click="updateTitleAction({
        newTitle: 'New Title Updated',
        id: 2
      })"
    >Change Title</button>

    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { mapActions } from "vuex"

export default {
  name: `App`,
  data() {
    return {
      show: true
    };
  },
  computed: {
    ...mapGetters(["completedTodos"]),
    todos() {
      // Get state data from Todos module (store/modules/Todos)
      return this.$store.state.Todos.todos;
    }
  },
  methods: {
    ...mapActions(["updateTitleAction"])
    // Trigger an action without mapActions
    // changeTitle() {
    //   this.$store.dispatch('updateTitleAction', {
    //     newTitle: 'New Title Updated',
    //     id: 2
    //   })
    // }
  }
};
</script>


<style lang="scss">
</style>

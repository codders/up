<template>
  <v-app dark>
    <v-navigation-drawer
      v-if="$store.getters.activeUser"
      v-model="drawer"
      :mini-variant="false"
      :clipped="false"
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template #append>
        <div class="pa-2">
          <v-btn block @click="signOut()"> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="deep-purple" dark dense fixed app>
      <v-app-bar-nav-icon
        v-if="$store.getters.activeUser"
        @click="drawer = !drawer"
      />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>
        Created by Arthur Taylor &mdash;
        <a href="https://github.com/codders/up" target="_new">Source Code</a>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      items: [
        {
          icon: 'apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'accessibility_new',
          title: 'Show up',
          to: '/up',
        },
        {
          icon: 'group',
          title: 'Friends',
          to: '/friends',
        },
        {
          icon: 'face',
          title: 'Profile',
          to: '/profile',
        },
      ],
      right: true,
      rightDrawer: false,
      title: 'Up',
    }
  },
  methods: {
    signOut() {
      this.$store.dispatch('signOut').then(() => {
        if (this.$route.path !== '/') {
          this.$nuxt.$router.replace('/')
        }
      })
    },
  },
}
</script>

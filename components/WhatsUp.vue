<template>
  <div class="up">
    <p>{{ email }} wants to {{ activity }}</p>  
  </div>
</template>

<script>
export default {
  props: {
    activity: {
      type: String,
      default: 'activity'
    },
    email: {
      type: String,
      default: 'bob@example.com'
    }
  }
}
</script>

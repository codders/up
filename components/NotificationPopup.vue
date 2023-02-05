<template>
    <div v-if="visible" class="popover">
        <h2>{{ notificationSender }} {{ notificationType }}</h2>
        <p>{{ notificationDescription }}</p>
    </div>
</template>

<style>
div.popover {
    padding: 5px;
    border: 1px solid white;
    border-radius: 2px;
}
</style>

<script>
export default {
    name: "NotificationPopup",
    computed: {
        visible() {
            if (this.$store.state.notifications.length === 0) {
                return false
            }
            return true
        },
        notificationSender() {
            if (this.$store.state.notifications.length > 0) {
                return this.$store.state.notifications[0].name
            }
            return undefined
        },
        notificationDescription() {
            if (this.$store.state.notifications.length > 0) {
                return this.$store.state.notifications[0].description
            }
            return undefined
        },
        notificationType() {
            if (this.$store.state.notifications.length > 0) {
                switch (this.$store.state.notifications[0].messageType) {
                    case "SHOW_UP":
                        return "is up!"
                    case "MATCH":
                        return "has matched with you!"
                }
            }
            return undefined
        }
    },
    watch: {
        visible(newVisible, oldVisible) {
            const vm = this;
            this.$log.debug("Got visibility change: from " + oldVisible + " to " + newVisible)
            if (newVisible && !oldVisible) {
                const newId = this.$store.state.notifications[0].id;
                setTimeout(function () {
                    vm.$store.commit('clearNotification', newId)
                }, 5000)
            }
        }
    }
}

</script>
<template>
    <SpaceXcomponent/>
</template>

<script>
// @ is an alias to /src
import SpaceXcomponent from '@/components/SpaceXinner.vue'

export default {
  name: 'SpaceX',
  components: {
    SpaceXcomponent
  }
}
</script>

<style lang="scss">
    @import "@/assets/styles/global.scss";
</style>
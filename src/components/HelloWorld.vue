<template>
  <div class="landing"><h1><router-link to="/spacex/1/null/null/null">Go To SpaceX launchpad Project</router-link></h1></div>
</template>

<script>
export default {
  mounted() {
    var par = {
        page_no: 1,
        start_date: 'null',
        end_date: 'null',
        launch_status: 'null',
      };
      this.$router.push({ name: "SpaceX", params: par });
  }

}
</script>

<style>

</style>
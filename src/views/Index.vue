<template>
  <div>
    <NavBar></NavBar>
    <div class="pa-4 mt-4">
      <TablePorts></TablePorts>
    </div>
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar';
  import TablePorts from '@/components/TablePorts';

  export default {
    name: 'Index',
    components: {
      NavBar,
      TablePorts
    }
  }
</script>
<style>
  .container{
    /* background:red; */
    width: 100%;
    height: 100vh;
  }
</style>

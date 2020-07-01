<template>
  <div>
    <h1>hello world</h1>
    <div>
      <span>count is {{count}}</span>
      <button @click="count++">add</button>
    </div>
  </div>
</template>

<script>
import {ref, computed} from 'vue';

export default {
  setup(){
    const count = ref(0);
    function add() {
      count.value++;
    }
    const double = computed(() => count.value * 2);
    return {
      count,
      add,
      double,
    }
  }
}
</script>

<template>
  <nav aria-label="Page navigation example" id="pagination">
    <ul class="pagination">
      <li class="page-item">
        <a :class="{ 'page-link': true, 'disabled': selectedPage == 0 }" href="#pagination" aria-label="Previous" @click="$emit('page-clicked', selectedPage-1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li v-for="i in totalPages" :class="{'page-item': true, 'active': selectedPage == i-1 }" :key="i">
        <a @click="$emit('page-clicked', i-1)" class="page-link" href="#pagination">{{ i }}</a>
      </li>
      <li class="page-item">
        <a :class="{ 'page-link': true, 'disabled': selectedPage+1 == totalPages }" href="#pagination" aria-label="Next" @click="$emit('page-clicked', selectedPage+1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "TableFooterComp",
  props: ["totalPages", "pageSize", "selectedPage"],
};
</script>

<style scoped>
</style>
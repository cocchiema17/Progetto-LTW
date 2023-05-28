<template>
  <nav id="pagination" class="mt-3">
    <ul class="pagination justify-content-center">
      <li class="page-item">
        <a
          :class="{ 'page-link': true, disabled: selectedPage == 0 }"
          href="#pagination"
          aria-label="Previous"
          @click="$emit('page-clicked', selectedPage - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li
        v-for="i in visiblePages"
        :class="{ 'page-item': true, active: selectedPage == i - 1 }"
        :key="i"
      >
        <a
          v-if="Number.isInteger(i)"
          @click="$emit('page-clicked', i - 1)"
          class="page-link"
          href="#pagination"
          >{{ i }}</a
        >
        <a v-else class="page-link disabled" href="#pagination">{{  i }}</a>
      </li>
      <li class="page-item dropdown" v-if="extraPages.length > 0">
        <a
          class="page-link dropdown-toggle"
          href="#pagination"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
        </a>
        <ul class="dropdown-menu" style="max-height: 350px; overflow-y: auto">
          <li v-for="i in extraPages" :key="i">
            <a
              @click="$emit('page-clicked', i - 1)"
              class="dropdown-item"
              href="#pagination"
              >{{ i }}</a
            >
          </li>
        </ul>
      </li>
      <li class="page-item">
        <a
          :class="{
            'page-link': true,
            disabled: selectedPage + 1 == totalPages,
          }"
          href="#pagination"
          aria-label="Next"
          @click="$emit('page-clicked', selectedPage + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    selectedPage: Number,
    totalPages: Number,
  },
  computed: {
    visiblePages() {
      if (this.totalPages <= 5) {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
      } else {
        return [1, 2, "...", this.totalPages];
      }
    },
    extraPages() {
      if (this.totalPages <= 5) {
        return [];
      } else {
        return Array.from({ length: this.totalPages - 3 }, (_, i) => i + 3);
      }
    },
  },
};
</script>
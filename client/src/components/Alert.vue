<template>
  <div :class="'alert alert-' + type" role="alert">
    {{ msg }}
  </div>
</template>


<script>
export default {
  name: "AlertComp",
  props: ["msg", "type"],
};
</script>

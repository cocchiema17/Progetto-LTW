<template>
  <input class="form-control" type="text" ref="inputRef" />
</template>

<script>
import { useCurrencyInput } from "vue-currency-input";

export default {
  name: "CurrencyInput",
  props: {
    modelValue: Number
  },
  setup() {
    const { inputRef } = useCurrencyInput({
      currency: 'EUR'
    });

    return { inputRef };
  },
};
</script>
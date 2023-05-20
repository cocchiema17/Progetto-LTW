<template>
  <div>
    <input class="form-control text-end" ref="inputRef" type="text" required />
  </div>
</template>

<script>
import { watch } from "vue";
import { useCurrencyInput } from "vue-currency-input";

export default {
  name: "MoneyImputComp",
  props: {
    modelValue: Number,
  },
  setup(props) {
    const { inputRef, setValue } = useCurrencyInput({ currency: "EUR" });

    watch(
      () => props.modelValue, // Vue 2: props.value
      (val) => {
        setValue(val === 0 ? null : val);
      }
    );

    return { inputRef };
  },
};
</script>
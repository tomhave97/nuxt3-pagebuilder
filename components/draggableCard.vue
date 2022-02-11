<template>
  <div>
    <Suspense>
      <template #default>
        <div class="cursor-pointer">
          <div :class="!!isOpen ? 'border-b-0' : ''" class="border rounded-sm px-4 py-2" @click="changeOpenState">
            <slot name="default"/>
          </div>

          <div class=" px-4 py-2 border rounded-sm border-t-0 " v-show="isOpen">
            <transition tag="div" name="dropdown" appear>
                <slot name="dropdown"/>
            </transition>
          </div>
        </div>
      </template>

      <template #fallback>
        Loading...
      </template>
    </Suspense>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "draggableCard",
  setup() {
    const isOpen = ref(true);

    const changeOpenState = () => {
      isOpen.value = !isOpen.value;
    }

    return {
      isOpen,
      changeOpenState,
    }
  }
})
</script>

<style scoped>
  .dropdown-enter-from {
    height: 0;
  }

  .dropdown-enter-to {
    height: auto;
  }

  .dropdown-enter-active {
    transition: all 0.4s ease;
  }
</style>
<template>
  <div class="flex flex-row">
    <div class="border-r h-screen lg:w-1/6 py-8">
      <draggable
          :list="components"
          :sort="false"
          :group="{ name: 'components', pull: 'clone', put: false }"
          item-key="name"
          :clone="cloneElement"
      >
        <template #item="{element}">
          <div class="py-2 px-8 flex flex-row justify-between items-center hover:bg-gray-100 cursor-pointer" @click="addToList(element)">
            <span>{{ element.name }}</span> <span>+</span>
          </div>
        </template>
      </draggable>
    </div>
    <div class="p-8 lg:w-3/6 overflow-y-scroll h-screen">
      <draggable
          class="border rounded-md min-h-[2.5rem]"
          :component-data="{
            tag: 'div',
            type: 'transition',
            name: !drag ? 'flip-list' : null,
          }"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false;"
          @drop=""
          :list="listedComponents"
          group="components"
          item-key="id"
          :sort="true"
      >
        <template #item="{element}" :key="element.id">
          <div :key="element.id">
            <draggable-card >
              <template #default>
            <span class="flex flex-row justify-between items-center">
              <span class="font-semibold"> {{ element.name }}</span>
              <span @click="removeFromList(element.id)"> X </span>
            </span>
              </template>

              <template #dropdown>
                <div class="flex flex-col border-t py-4">
                  <template v-for="component in element.fields" :key="element.id">
                    <div class="my-4 flex flex-col">
                      <label class="mb-1 font-semibold text-sm" :for="element.id + component.label + component.id"> {{ component.label }} </label>
                      <input class="border rounded-md p-2" :id="element.id + component.label + component.id" v-model="component.value">
                    </div>
                  </template>
                </div>
              </template>
            </draggable-card>
          </div>

        </template>

        <template #footer>
          <div class="flex items-center justify-center h-10 text-gray-400"> Drag n' Drop to add an Page Element.</div>
        </template>
      </draggable>
    </div>
    <div class="border-l lg:w-2/6 overflow-y-scroll h-screen">
      <pre>{{ printData }}</pre>
    </div>
  </div>



</template>

<script lang="ts">
import {defineComponent, ref } from 'vue';
import draggable from 'vuedraggable';
import DraggableCard from "~/components/draggableCard.vue";
import { nanoid } from 'nanoid/non-secure'

import componentJson from "~/components.json";
import axios from "axios";

import { debouncedWatch } from "@vueuse/core";

export default defineComponent({
  components: {
    DraggableCard,
    draggable,
  },
  async setup() {
    const listedComponents = ref([])
    const components = componentJson.components;
    const drag = ref(false);

    const printData = ref([]);

    const dragOptions = {
      animation: 100,
      group: "description",
      disabled: false,
      ghostClass: "ghost"
    }

    const removeFromList = (id) => {
      listedComponents.value = listedComponents.value.filter((component) => component.id !== id)
    }

    const addToList = (element) => {
      listedComponents.value.push(JSON.parse(JSON.stringify({...element, id: nanoid(24)})));
    }

    const cloneElement = (element) => {
      return JSON.parse(JSON.stringify({...element, id: nanoid(24)}))
    }

    const callChangeHook = async (newValue) => {
      const { data } = await axios.post('/api/changeService', newValue)
      printData.value = data
    }

    debouncedWatch(listedComponents.value, (newValue) => {
      callChangeHook(newValue);
    },
        { debounce: 500 }
    )

    return {
      listedComponents,
      components,
      removeFromList,
      addToList,
      cloneElement,
      dragOptions,
      drag,
      callChangeHook,
      printData,
      nanoid,
    }
  }
})
</script>

<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
import { defineStore } from 'pinia'

export const useSetComponents = defineStore({
    id: 'setComponents',
    state: () => ({
        id: 0,
        orderIndex: 0,
        components: []
   }),

    getters: {
        all: state => state.components,
        one: (state) => {
            return (id) => state.components.find((component) => component.id == id)
        }
    },

    actions: {
        add(component) {
            if (!component.orderIndex) {
                component.orderIndex = this.orderIndex++;
            }

            this.components.push({...component, id: this.id + 1});
            this.id++
            this.orderIndex++
        },
        update(component) {
            if (!component.id) {
                console.log('Failed Updating, id not given for', component);
            }

            this.components = this.components.map(item => {
                return component.id === item.id ? component : item;
            });

            this.handleOrderIndex
        },
        delete(id) {
            const componentToDelete = this.components.find(component => component.id === id);
            this.components = this.components.filter(component => component.id !== id);
            this.handleOrderIndex(componentToDelete.orderIndex)
            this.orderIndex--
        },
        handleOrderIndex(orderIndex) {
            this.components = this.components.map(component => {
                if (component.orderIndex >= orderIndex) {
                    return {
                        ...component,
                        orderIndex: component.orderIndex--
                    }
                }
            })
        },
    },
})
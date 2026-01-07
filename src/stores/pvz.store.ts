import { ref } from 'vue'
import { defineStore } from 'pinia'
import {TaskType, type PVZ} from '@/types/index'
export const usePVZStore = defineStore('pvz', {
    state: () => ({
        pvzList: [] as Array<PVZ>
    }),

    actions: {
        addPVZ(id: number, location: string) {
            const newPVZ = {
                id: id,
                location: location,
                boxes: []
            }
            this.pvzList.push(newPVZ)
        },
        addBoxes(id: number, pvzId: number, taskType: TaskType) {
            const validTaskTypes = Object.values(TaskType)

            if(!validTaskTypes.includes(taskType as TaskType)){
                console.error(`Неверный тип задачи: ${taskType}. Допустимые: ${validTaskTypes.join(', ')}`)

                return
            }

            const pvz = this.pvzList.find(p => p.id === pvzId)
            if (pvz) {
                pvz.boxes.push({
                    id: id,
                    pvzId: pvzId,
                    taskType: taskType
                })
            }
        }
    }
})

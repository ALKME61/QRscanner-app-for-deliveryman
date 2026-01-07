import { TaskType } from "./index"

export interface box {
    id: number,
    pvzId: number,
    taskType: TaskType
}

export interface PVZ {
    id: number,
    location: string,
    boxes: Array<box>
}
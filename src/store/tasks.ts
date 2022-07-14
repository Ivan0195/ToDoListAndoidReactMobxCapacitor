import {makeAutoObservable} from "mobx";
import AppStatus from "./appStatus";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {todolistsAPI} from "../api/todolists-api";

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

export const Tasks = makeAutoObservable(
    {

        tasks: {} as TasksStateType,

        fetchTasks(todolistId: string){
            AppStatus.setAppStatus('loading')
            todolistsAPI.getTasks(todolistId)
                .then((res) => {
                    this.tasks = {...this.tasks, [todolistId]: res.data.items}
                    AppStatus.setAppStatus('succeeded')
                })
        },

        addTask(title: string, todolistId: string) {
            AppStatus.setAppStatus('loading')
            todolistsAPI.createTask(todolistId, title)
                .then(res => {
                    if (res.data.resultCode === 0) {
                        this.tasks = {
                            ...this.tasks,
                            [res.data.data.item.todoListId]: [res.data.data.item, ...this.tasks[res.data.data.item.todoListId]]
                        }
                        AppStatus.setAppStatus('succeeded')
                    } else {
                        handleServerAppError(res.data);
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error)
                })
        },

        removeTask(taskId: string, todolistId: string) {
            todolistsAPI.deleteTask(todolistId, taskId)
                .then(res => {
                    this.tasks = {...this.tasks, [todolistId]: this.tasks[todolistId].filter(t => t.id !== taskId)}
                })
        },

        updateTask(taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) {
            const task = this.tasks[todolistId].find(t => t.id === taskId)
            if (!task) {
                console.warn('task not found in the state')
                return
            }

            const apiModel: UpdateTaskModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: task.status,
                ...domainModel
            }

            todolistsAPI.updateTask(todolistId, taskId, apiModel)
                .then(res => {
                    if (res.data.resultCode === 0) {
                        this.tasks = {
                            ...this.tasks,
                            [todolistId]: this.tasks[todolistId]
                                .map(t => t.id === taskId ? {...t, ...apiModel} : t)
                        }
                    } else {
                        handleServerAppError(res.data);
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error);
                })
        },

        changeTaskStatus() {

        }

    }
)

export default Tasks
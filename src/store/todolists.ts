import {makeAutoObservable} from "mobx";
import {todolistsAPI, TodolistType} from "../api/todolists-api";
import AppStatus, {RequestStatusType} from "./appStatus";

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

class ToDoLists {

    toDoLists = [] as Array<TodolistDomainType>

    constructor() {
        makeAutoObservable(this)
    }

    setToDoLists(toDoLists: Array<TodolistType>) {
        this.toDoLists = toDoLists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
    }

    addToDoList(title: string) {
        AppStatus.setAppStatus('loading')
        todolistsAPI.createTodolist(title)
            .then((res) => {
                this.toDoLists = [{...res.data.data.item, filter: 'all', entityStatus: 'idle'}, ...this.toDoLists]
                AppStatus.setAppStatus('succeeded')
            })
    }

    removeToDoList(todolistId: string) {
        AppStatus.setAppStatus('loading')
        this.changeToDoListEntityStatus(todolistId, 'loading')
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                this.toDoLists.filter(tl => tl.id !== todolistId)
                AppStatus.setAppStatus('succeeded')
            })
    }

    changeToDoListTitle(id: string, title: string) {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                this.toDoLists = this.toDoLists.map(tl => tl.id === id ? {...tl, title: title} : tl)
            })
    }

    changeToDoListFilter(id: string, filter: FilterValuesType) {
        this.toDoLists = this.toDoLists.map(tl => tl.id === id ? {...tl, filter: filter} : tl)
    }

    changeToDoListEntityStatus(id: string, status: RequestStatusType) {
        this.toDoLists = this.toDoLists.map(tl => tl.id === id ? {...tl, entityStatus: status} : tl)
    }

    fetchToDoLists() {
        AppStatus.setAppStatus('loading')
        todolistsAPI.getTodolists()
            .then((res) => {
                this.setToDoLists(res.data)
                AppStatus.setAppStatus('succeeded')
            })
    }
}
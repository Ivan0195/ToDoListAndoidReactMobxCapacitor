import React, { useCallback, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Navigate} from "react-router-dom";
import Todolists, {FilterValuesType} from "../store/todolists";
import {TaskStatuses} from "../store/tasks";
import Tasks from "../store/tasks";
import { AddItemForm } from '../components/AddItemForm/AddItemForm';
import Todolist from './ToDoList';
import {observer} from "mobx-react-lite";
import {Auth} from "../store/auth";
import ToDoLists from "../store/todolists";

type PropsType = {
    demo?: boolean
}

const TodolistsList: React.FC<PropsType> = ({demo = false}) => {

    const todolists = ToDoLists.toDoLists
    const tasks = Tasks.tasks

    useEffect(() => {
        if (Auth.authState.isLoggedIn) {
            Todolists.fetchToDoLists()
        }}, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
       Tasks.removeTask(id, todolistId)
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        Tasks.addTask(title, todolistId)
    }, [])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        Tasks.updateTask(id, {status}, todolistId)
    }, [])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        Tasks.updateTask(id, {title: newTitle}, todolistId)
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        Todolists.changeToDoListFilter(todolistId, value)
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        Todolists.removeToDoList(id)
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        Todolists.changeToDoListTitle(id, title)
    }, [])

    const addTodolist = useCallback((title: string) => {
        Todolists.addToDoList(title)
    }, [])


    const isLoggedIn = Auth.authState.isLoggedIn
    if (!isLoggedIn){
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}

export default observer(TodolistsList)
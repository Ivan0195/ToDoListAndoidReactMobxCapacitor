import React, {useEffect} from 'react';
import './App.css';
import AppStatus from "./store/appStatus";
import {ErrorSnackbar} from "./components/ErrorSnackbar/ErrorSnackbar";
import {Navigate, Route, Routes} from 'react-router-dom'
import {Menu} from '@mui/icons-material';
import {AppBar, Button, CircularProgress, Container, LinearProgress, Toolbar, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TodolistsList from "./toDoLists/ListOfToDoLists";
import Login from "./LogInFlow/Login";
import {observer} from "mobx-react-lite";
import {Auth} from "./store/auth";


const App = observer( () => {

        useEffect(() => {
            Auth.initializeApp()
        }, [])

        if (!AppStatus.appStatus.isInitialized) {
            return <div
                style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
                <CircularProgress/>
            </div>
        }

        const logOutHandler = () => {
            Auth.logOut()
        }


        return (
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            News
                        </Typography>
                        {Auth.authState.isLoggedIn && <Button color="inherit" onClick={logOutHandler}>LogOut</Button>}

                    </Toolbar>
                    {AppStatus.appStatus.status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path={'/'} element={<TodolistsList/>}/>
                        <Route path={'login'} element={<Login/>}/>
                        <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>}/>
                        <Route path="*" element={<Navigate to={'/404'}/>}/>
                    </Routes>
                </Container>
            </div>
        );
    })


export default App


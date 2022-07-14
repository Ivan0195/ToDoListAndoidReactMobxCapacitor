import {makeAutoObservable} from "mobx";
import AppStatus from "./appStatus";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {authAPI} from "../api/todolists-api";

export type authStateType = {
    isLoggedIn: boolean
}

export type loginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
}

export const Auth = makeAutoObservable(
    {
        authState: {isLoggedIn: false} as authStateType,

        logIn(data: loginParamsType) {
            AppStatus.setAppStatus('loading')
            authAPI.singIn(data)
                .then(res => {
                    if (res.data.resultCode === 0) {
                        this.authState.isLoggedIn = true
                        AppStatus.setAppStatus('succeeded')
                    } else {
                        handleServerAppError(res.data)
                    }
                })
                .catch((err) => {
                    AppStatus.setAppStatus('succeeded')
                    handleServerNetworkError(err.data)
                })
        },

        logOut() {
            AppStatus.setAppStatus('loading')
            authAPI.singOut()
                .then(res => {
                    if (res.data.resultCode === 0) {
                        this.authState.isLoggedIn = false
                        AppStatus.setAppStatus('succeeded')
                    } else {
                        handleServerAppError(res.data)
                    }
                })
                .catch((err) => {
                    AppStatus.setAppStatus('succeeded')
                    handleServerNetworkError(err.data)
                })
        },

        initializeApp() {
            AppStatus.setAppStatus('loading')
            authAPI.me().then(res => {
                if (res.data.resultCode === 0) {
                    this.authState.isLoggedIn=true;
                    AppStatus.setAppStatus('succeeded')
                } else {
                    handleServerAppError(res.data)
                }
            })
                .catch((err) => {
                    AppStatus.setAppStatus('succeeded')
                    handleServerNetworkError(err.data)
                })
                .finally(() =>  AppStatus.setAppIsInitialized(true))
        }
    }
)


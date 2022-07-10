import {makeAutoObservable} from "mobx";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppStatusType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

class AppStatus {
    appStatus = {
        status: 'idle',
        error: null,
        isInitialized: true
    } as AppStatusType

    constructor() {
        makeAutoObservable(this)
    }

    setAppError(error: string | null){
        this.appStatus.error = error
    }

    setAppStatus(status: RequestStatusType){
        this.appStatus.status = status
    }

    setAppIsInitialized(isInitialized: boolean){
        this.appStatus.isInitialized = isInitialized
    }
}

export default new AppStatus()
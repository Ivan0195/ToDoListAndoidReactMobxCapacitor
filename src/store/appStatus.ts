import {makeAutoObservable} from "mobx";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppStatusType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

export const AppStatus = makeAutoObservable(
    {
        appStatus: {
            status: 'idle',
            error: null,
            isInitialized: true
        } as AppStatusType,

        setAppError(error: string | null){
            this.appStatus.error = error
        },

        setAppStatus(status: RequestStatusType){
            this.appStatus.status = status
        },

        setAppIsInitialized(isInitialized: boolean){
            this.appStatus.isInitialized = isInitialized
        }
    }
)

export default AppStatus
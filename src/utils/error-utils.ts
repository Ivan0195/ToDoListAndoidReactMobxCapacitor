import {ResponseType} from '../api/todolists-api'
import AppStatus from "../store/appStatus";

export const handleServerAppError = <D>(data: ResponseType<D>) => {
    if (data.messages.length) {
       AppStatus.setAppError(data.messages[0])
    } else {
        AppStatus.setAppError('Some error occurred')
    }
    AppStatus.setAppStatus('failed')
}

export const handleServerNetworkError = (error: { message: string }) => {
    AppStatus.setAppError(error.message ? error.message : 'Some error occurred')
    AppStatus.setAppStatus('failed')
}

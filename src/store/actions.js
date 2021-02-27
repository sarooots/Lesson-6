import request from "../helpers/request";
import * as act from "./actTypes"

export function getTasks() {
    return (dispatch) =>{
        dispatch({type: act.PENDING})
        request("http://localhost:3001/task")
            .then((res)=>{
                dispatch({type: act.GET_TASKS, tasks: res})
            })
            .catch((error) => {
                dispatch({type: act.ERROR, errorMessage: error.message})
            })
    }
}

export function getTask(taskId) {
    return (dispatch) =>{
        dispatch({type: act.PENDING})
        request(`http://localhost:3001/task/${taskId}`,)
            .then((res)=>{
                dispatch({type: act.GET_TASK, task: res})
            })
            .catch((error) => {
                dispatch({type: act.ERROR, errorMessage: error.message})
            })
    }
}

export function deleteTask(taskId) {
    return (dispatch) => {
        dispatch({type: act.PENDING})
        request(`http://localhost:3001/task/${taskId}`, "DELETE")
            .then(()=>{
                dispatch({type: act.DELETE_TASK, taskId})
            })
            .catch((error) => {
                dispatch({type: act.ERROR, errorMessage: error.message})
            })
    }
}

export function deleteTasks(selectedTasks) {
    return (dispatch) =>{
        dispatch({type: act.PENDING})
        request(`http://localhost:3001/task/`,"PATCH", {tasks: Array.from(selectedTasks)})
            .then(()=>{
                dispatch({type: act.DELETE_TASKS, selectedTasks})
            })
            .catch((error) => {
                dispatch({type: act.ERROR, errorMessage: error.message})
            })
    }
}

export function addTask(task) {
    return (dispatch) => {
        dispatch({type: act.PENDING})
        request("http://localhost:3001/task", "POST", task)
            .then((res)=>{
                dispatch({type: "ADD_TASK", task: res})
            })
            .catch((error) => {
                dispatch({type: act.ERROR, errorMessage: error.message})
            })
    }
}

export function editTask(data, from) {
    return (dispatch)=>{
        dispatch({type: act.PENDING})
        request(`http://localhost:3001/task/${data._id}`, "PUT", data)
            .then((editedTask)=>{
                dispatch({type: act.EDIT_TASK, editedTask, from })
            })
            .catch((error) => {
                dispatch({type: act.ERROR, errorMessage: error.message})
            })
    }
}
import React, {Component} from 'react'
import Header from './Header/Header'
import classes from './ToDo.module.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCheck, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons'
import {Container, Col, Row, Button, Card, ButtonGroup} from 'react-bootstrap'
import idGenerator from "../../helpers/idGenerator"
import moment from "moment"
import NewTask from "./NewTask"


class ToDo extends Component {
    state = {
        tasks: [],
        selectedTasks: new Set(),
    }
    selectTask = taskId => {
        const selectedTasks = new Set(this.state.selectedTasks)
        if (selectedTasks.has(taskId)) {
            selectedTasks.delete(taskId)
        } else {
            selectedTasks.add(taskId)
        }
        this.setState({selectedTasks})
    }
    removeTask = taskId => {
        const {tasks} = this.state
        this.setState({tasks: tasks.filter((task)=> taskId !== task._id)})
    }
    removeSelected = () => {
        const {selectedTasks, tasks} = this.state
        const newTask = tasks.filter((task)=>{
            if (selectedTasks.has(task._id)) {
                return false
            } else {
                return true
            }
        })
        this.setState({
            tasks: newTask,
            selectedTasks: new Set()
        })
    }
    selectAllTasks = () => {
        const {tasks, selectedTasks} = this.state
        if (selectedTasks.size < tasks.length) {
            tasks.map((task)=>{
                return selectedTasks.add(task._id)
            })
        } else {
            selectedTasks.clear()
        }
        this.setState({selectedTasks: selectedTasks})
    }
    deselect = () => {
        const {selectedTasks} = this.state
        selectedTasks.clear()
        this.setState({selectedTasks: selectedTasks})

    }
    addTask = task => {
        const {tasks} = this.state
        task._id = idGenerator()
        if (task.name.trim() !==  '') {
            const newTask = task
            this.setState({tasks: [...tasks, newTask]})
        }
    }

    editTask = (newList) => {
        this.setState({tasks: newList})
    }

    render() {
        const {tasks, selectedTasks} = this.state
        const selectTask = this.selectTask
        const removeTask = this.removeTask
        const editTask = this.editTask
        return (
            <>
                {/*Here goes logo, 'new task' 'select/deselect' and 'delete' buttons*/}
                <Header
                    addTask={this.addTask}
                    tasks={this.state.tasks}
                    status={this.state.status}
                    selectedTasks={selectedTasks}
                    removeSelected={this.removeSelected}
                    selectAllTasks={this.selectAllTasks}
                    deselect={this.deselect}

                />
                <Container  fluid className={classes.toDoList}>
                <Row className={classes.tasks}>
                    {
                        tasks.map((task,index)=>{
                            return (
                                <Col key={task._id}
                                     lg={3}
                                     md={4}
                                     sm={6}
                                     xs={12}
                                >
                                    <Card className={`${classes.task} ${selectedTasks.has(task._id)? classes.selected: ''}`}>
                                        <label  className={classes.select}>
                                            <input type="checkbox"
                                                   className={`${classes.select} rounded-0`}
                                                   onChange={()=> selectTask(task._id)}
                                                   checked={selectedTasks.has(task._id)}
                                            />
                                            <span className={classes.checkmark}></span>
                                            <div className={classes.fillWidth}></div>

                                        </label>
                                        <Card.Body className={classes.cBody}>
                                            <Card.Title className={classes.title}>{task.name}</Card.Title>
                                            <Card.Subtitle className={`mb-2 text-muted ${classes.deadline}`}>{`deadline: ${moment(task.deadline).format("MMM Do YY")}`}</Card.Subtitle>
                                            <Card.Text className={`${classes.desc} ${task.desc ===''?classes.emptyDesc:''}`}>{task.desc === '' ? 'this task has no description': task.desc}</Card.Text>
                                            <ButtonGroup size="sm" className={classes.actions}>
                                                <NewTask
                                                    buttonName={<FontAwesomeIcon icon={faEdit} />}
                                                    mode='edit'
                                                    selectedTasks={selectedTasks}
                                                    editTask={editTask}
                                                    variant='primary'
                                                />
                                                <Button
                                                    disabled={!!selectedTasks.size}
                                                    variant='success'
                                                    className={`${classes.removeTask} ${classes.action}`}
                                                > <FontAwesomeIcon icon={faCheck} />
                                                </Button>
                                                <Button
                                                    disabled={!!selectedTasks.size}
                                                    variant='danger'
                                                    className={`${classes.removeTask} ${classes.action}`}
                                                    onClick={()=> removeTask(task._id)}
                                                > <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </ButtonGroup>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Container>
            </>
        )
    }

}
export default ToDo
import React, {Component} from "react"
import Actions from "./Actions"
import classes from "./ToDo.module.sass"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons"
import {Container, Col, Row, Button, Card, ButtonGroup} from "react-bootstrap"
import {formatDate, stringTrimmer} from "../../../helpers/utils"
import Editor from "../../Editor/Editor"
import {Link} from "react-router-dom"
import {connect} from "react-redux";
import {getTasks, deleteTask} from "../../../store/actions"
import {history} from "../../../helpers/history"


class ToDo extends Component {
    state = {
        selectedTasks: new Set(),
        show: false,
        editTask: null,
        mode: "new"
    }

    componentDidMount() {
        this.props.getTasks(history.location.search)
    }
    componentDidUpdate(prevpProps) {
        if (!prevpProps.addTaskSuccess && this.props.addTaskSuccess) {
            this.setState({show: false})
        }
        if (!prevpProps.deleteTaskSuccess && this.props.deleteTaskSuccess) {
            this.setState({selectedTasks: new Set()})
        }
        if (!prevpProps.editTaskSuccess && this.props.editTaskSuccess) {
            this.setState({editTask: null})
        }
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

    selectAllTasks = () => {
        const {tasks} = this.props
        const selectedTasks = new Set(this.state.selectedTasks)
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
        const selectedTasks = new Set(this.state.selectedTasks)
        selectedTasks.clear()
        this.setState({selectedTasks: selectedTasks})
    }


    toggleShow = () => this.setState({show: !this.state.show})

    handleEdit = editTask => this.setState({ editTask,  show: !this.state.show})

    changeMode = newMode => this.setState({ mode: newMode})

    render() {
        const {selectedTasks, editTask, show, mode} = this.state
        const {tasks, deleteTask} = this.props
        return (
            <>
                {/*Here goes logo, "new task" "select/deselect" and "delete" buttons*/}
                <Container  fluid className={classes.toDoList}>
                    <Actions
                        tasks={this.props.tasks}
                        selectedTasks={selectedTasks}
                        selectAllTasks={this.selectAllTasks}
                        deselect={this.deselect}
                        toggleShow={this.toggleShow}
                        changeMode={this.changeMode}/>

                    <Row>
                        {
                            tasks.map((task)=>{
                                return (
                                    <Col key={task._id}
                                         lg={3}
                                         md={4}
                                         sm={6}
                                         xs={12}>
                                        <Card className={`${classes.task} ${selectedTasks.has(task._id)? classes.selected: ""}`}>
                                            <label  className={classes.select}>
                                                <input type="checkbox"
                                                       className={`${classes.select} rounded-0`}
                                                       onChange={()=> this.selectTask(task._id)}
                                                       checked={selectedTasks.has(task._id)}/>
                                                <span className={classes.checkmark}/>
                                                <div className={classes.fillWidth}/>

                                            </label>
                                            <Card.Body className={classes.cBody}>
                                                <Link to={`/task/${task._id}`}>
                                                    <Card.Title className={classes.title}>{task.title}</Card.Title>
                                                </Link>
                                                <Card.Subtitle className={`mb-2 text-muted ${classes.date}`}>{`date: ${formatDate(task.date)}`}</Card.Subtitle>
                                                <Card.Text className={`${classes.desc} ${task.description ===""?classes.emptyDesc:""}`}>
                                                    {task.description === "" ? "this task has no description": stringTrimmer(task.description, 55)}
                                                </Card.Text>
                                                <ButtonGroup size="sm" className={classes.actions}>
                                                    <Button variant="success"
                                                            onClick={() => {
                                                                this.handleEdit(task)
                                                                this.changeMode("edit")
                                                            }}
                                                            className="rounded-0 text-nowrap"
                                                            disabled={!!selectedTasks.size}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                    <Button
                                                        disabled={!!selectedTasks.size}
                                                        variant="danger"
                                                        onClick={()=> deleteTask(task._id)}>
                                                        <FontAwesomeIcon icon={faTrash} />
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
                {
                    mode === "edit" && show &&
                    <Editor
                        mode={mode}
                        show={show}
                        toggleShow={this.toggleShow}
                        task={editTask}/>
                }
                {
                    mode === "new" && show &&
                    <Editor
                        mode={mode}
                        show={show}
                        toggleShow={this.toggleShow}/>
                }
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        tasks: state.tasks,
        addTaskSuccess: state.addTaskSuccess,
        deleteTaskSuccess: state.deleteTaskSuccess,
    }
}
const mapDispatchToProps =  {
    getTasks,
    deleteTask
}
export default connect(mapStateToProps, mapDispatchToProps)(ToDo)
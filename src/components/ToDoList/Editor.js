import React, {Component} from 'react'
import {Button, Col, Form, Modal} from 'react-bootstrap'
import PropTypes from "prop-types"
import moment from "moment";
import idGenerator from "../../helpers/idGenerator"
// import classes from './Editor.sass'

class Editor extends Component {
    constructor(props) {
        super(props);
        const {mode} = this.props
        if (mode === 'edit') {
            const {task, id} = props
            this.state = {...task}
        } else {
            this.state = {
                name: '',
                desc: '',
                deadline: new Date().getTime() + 1440 * 60 * 1000,
                _id: idGenerator(),
            }
        }

    }
    static propTypes = {
        addTask: PropTypes.func,
        task: PropTypes.object,
        selectedTasks: PropTypes.object.isRequired,
        editTask: PropTypes.func,
    }


    changeTaskProperty = (event, property ) => {
        new Date(event.target.value).getTime()
        const  value = property === 'deadline'? new Date(event.target.value).getTime(): event.target.value
        this.setState({[property]: value})
    }

    acceptButton = () => {
        const newTask = {...this.state}
        delete newTask.show
        const {addTask, mode, editTask, toggleShowNew, toggleShowEdit} = this.props
        if (mode === 'new') {
            addTask(newTask)
            this.setState({name: '', desc: ''})
            toggleShowNew.call()
        }
        if (mode === 'edit') {
            const editedTask = {...this.state}
            delete editedTask.show
            editTask(editedTask)
            toggleShowEdit.call()
        }
    }

    render() {
        const {selectedTasks, mode, button, showNew, showEdit, toggleShowNew, toggleShowEdit} = this.props
        return (
            <>
                {button}
                <Modal
                    show={mode==='new'?showNew:showEdit}
                    onHide={mode==='new'?toggleShowNew:toggleShowEdit}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton >
                        <Modal.Title>{mode==='new'? 'New task': 'Edit task'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(event)=> event.preventDefault()}>
                            <Form.Row >
                                <Form.Group as={Col} controlId='taskName'>
                                    <Form.Label>Task Name</Form.Label>
                                    <Form.Control type="text"
                                                  placeholder="Add new task"
                                                  value={this.state.name}
                                                  onChange={(event) => {this.changeTaskProperty(event, 'name')}}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId='deadline'>
                                    <Form.Label>Deadline</Form.Label>
                                    <Form.Control type="datetime-local"
                                                  placeholder="Write task description"
                                                  format='timestamp'
                                                  min={moment(this.state.deadline).format('YYYY-MM-DDThh:mm')}
                                                  value={moment(this.state.deadline).format('YYYY-MM-DDThh:mm')}
                                                  onChange={(event) => {this.changeTaskProperty(event, 'deadline')}}
                                                  disabled={!!selectedTasks.size}
                                    />
                                </Form.Group>

                            </Form.Row>
                            <Form.Row >
                                <Form.Group as={Col} controlId='taskDesc'>
                                    <Form.Control as="textarea"
                                                  placeholder="Write task description"
                                                  value={this.state.desc}
                                                  onChange={(event) => {this.changeTaskProperty(event, 'desc')}}
                                                  disabled={!!selectedTasks.size}
                                    />
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={mode ==='new'?"primary":'success'}
                                onClick={this.acceptButton}
                                disabled={!!selectedTasks.size}
                        >
                            {mode ==='new'?"add task":'save changes'}
                        </Button>
                        <Button variant="danger"
                                onClick={mode ==='new'?toggleShowNew:toggleShowEdit}
                        >Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default Editor
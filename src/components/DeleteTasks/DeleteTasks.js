import React, {Component} from "react"
import {Button, Modal} from "react-bootstrap"
import PropTypes from "prop-types"
import {deleteTasks} from "../../store/actions";
import {connect} from "react-redux";

class DeleteTasks extends Component {
    static propTypes = {
        selectedTasks: PropTypes.object.isRequired,
    }

    state = {
        show: false
    }

    render() {
        const {show} = this.state
        const handleClose = () => this.setState({show: false})
        const handleShow = () => this.setState({show: true})
        const {selectedTasks, deleteTasks, className} = this.props
        return (
            <>
                <Button variant="outline-danger"
                        className={className}
                        disabled={!selectedTasks.size}
                        onClick={()=> {if(selectedTasks.size === 1) {
                            handleClose()
                            deleteTasks(selectedTasks)
                            } else {
                            handleShow()
                        }}}>
                    delete
                </Button>
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Selected</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you really want to delete selected {selectedTasks.size} task{selectedTasks.size>1?"s":""} ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => {
                            handleClose()
                            deleteTasks(selectedTasks)}}>
                            Delete {selectedTasks.size} task{selectedTasks.size>1?"s":""}
                        </Button>
                        <Button variant="secondary"
                                onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

const mapDispatchToProps =  {
    deleteTasks
}
export default connect(null, mapDispatchToProps)(DeleteTasks)

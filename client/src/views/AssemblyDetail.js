import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, navigate } from '@reach/router';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

// Styling
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default (props) => {
    const [assembly, setAssembly] = useState([]);
    const [going, setGoing] = useState([]);
    const [cantgo, setCantgo] = useState([]);
    const [undecided, setUndecided] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState('');
    const [secretCodeInput, setSecretCodeInput] = useState('');


    // Initial Load: get assembly info given ID
    useEffect(()=>{
        axios.get(`http://localhost:8000/api/assembly/${props.id}`)
            .then(res => {
                if (res.data !== null){
                    setAssembly(res.data);
                    setLoaded(true);
                    let goingList = res.data.team.filter(teammate => teammate.status === "Going").sort((teammateOne, teammateTwo) => (teammateOne.name > teammateTwo.name) ? 1 : -1);
                    setGoing(goingList);
                    let cantgoList = res.data.team.filter(teammate => teammate.status === "Can't Go").sort((teammateOne, teammateTwo) => (teammateOne.name > teammateTwo.name) ? 1 : -1)
                    setCantgo(cantgoList);
                    let undecidedList = res.data.team.filter(teammate => teammate.status === "Undecided").sort((teammateOne, teammateTwo) => (teammateOne.name > teammateTwo.name) ? 1 : -1);
                    setUndecided(undecidedList);
                }
                else{
                    setError(`Error: Event with ID ${props.id} was not found.`);
                    setLoaded(true);
                }
            })
            .catch(console.log);
    },[props])

     // Listener for secret code input
    const onSecretCodeChange = event => {
        setSecretCodeInput(event.target.value.toUpperCase());
    }

    // Confirms deleting assembly, calling deleteAssembly if 'Yes' clicked
    const confirmPopup = (event,assembly) => {
        confirmAlert({
            title: 'Warning',
            message: `Are you sure you want to delete "${assembly.name}"? This cannot be undone.`,
            buttons: [
                {label: 'Yes',onClick: () => deleteAssembly(assembly._id)},
                {label: 'No'}
            ]
        });
    }
    // Given ID, delete and jump back home
    const deleteAssembly = (assemblyID) => {   
        axios.delete('http://localhost:8000/api/assembly/delete/' + assemblyID)
            .then(navigate("/"))
            .catch(console.log)
    }

    return (
    <>
    {loaded && error === ""? 
    <>
    {/* Name */}
    <Row className="px-3">
        <Col xs={3}><h2>Event Name:</h2></Col>
        <Col><h5>{assembly.name}</h5></Col>
    </Row>
    
    {/* Event Code */}
    <Row className="px-3">
        <Col xs={3}><h2>Event Code:</h2></Col>
        <Col><h5>{assembly.eventCode}</h5></Col>
    </Row>
    
    {/* Description */}
    <Row className="px-3">
        <Col xs={3}><h2>Description:</h2></Col>
        <Col><h5>{assembly.description !== "" ? assembly.description : "None"}</h5></Col>
    </Row>
    
    {/* Date */}
    <Row className="px-3">
        <Col xs={3}><h2>Date: </h2></Col>
        <Col><h5>{assembly.start}</h5></Col>
    </Row>
    
    {/* Start Time */}
    <Row className="px-3">
        <Col xs={3}><h2>Start Time: </h2></Col>
        <Col><h5>{assembly.start}</h5></Col>
    </Row>
    
    {/* End Time */}    
    <Row className="px-3">
        <Col xs={3}><h2>End Time: </h2></Col>
        <Col><h5>{assembly.end}</h5></Col>
    </Row>
    
    {/* Location */}
    <Row className="px-3">
        <Col xs={3}><h2>Location: </h2></Col>
        <Col>
            <h5>{assembly.address.street}</h5>
            <h5>{`${assembly.address.city} ${assembly.address.state} ${assembly.address.zip}`}</h5>
        </Col>
    </Row>
    
    {/* Going */}
    <Row className="px-3">
        <Col xs={3}><h2>Going:</h2></Col>
        <Col>
            <Table className="w-75p" hover size="sm">
                <thead>
                    <tr className="c-g">
                        <th className="w-25p">Name</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                {going.map((teammate, idx)=>{
                return (
                    <tr className="c-lg" key={idx}>
                        <td>{teammate.name}</td>
                        <td>{teammate.note}</td>
                    </tr>
                )
                })}
                </tbody>
            </Table>
    </Col>
    </Row>
    
    {/* Can't Go */}
    <Row className="px-3">
        <Col xs={3}><h2>Can't Go:</h2></Col>
        <Col>
            <Table className="w-75p" hover size="sm">
                <thead>
                    <tr className="c-g">
                        <th className="w-25p">Name</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                {cantgo.map((teammate, idx)=>{
                    return (
                        <tr className="c-lr" key={idx}>
                        <td>{teammate.name}</td>
                        <td>{teammate.note}</td>
                    </tr>
                )
                })}
                </tbody>
            </Table>
    </Col>
    </Row>
    
    {/* Undecided */}
    <Row className="px-3">
        <Col xs={3}><h2>Undecided:</h2></Col>
        <Col>
            <Table className="w-75p" hover size="sm">
                <thead>
                    <tr className="c-g">
                        <th className="w-25p">Name</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                {undecided.map((teammate, idx)=>{
                    return (
                        <tr className="c-y" key={idx}>
                        <td>{teammate.name}</td>
                        <td>{teammate.note}</td>
                    </tr>
                )
                })}
                </tbody>
            </Table>
    </Col>
    </Row>

    {/* Edit/Delete Section */}
    <Row className="px-3" >
        <Col
            ><h5>To edit info or delete event, first enter SECRET CODE:</h5>
            <Form.Control className="w-25p" type="text" placeholder="ex: SECRETCODE" onChange={onSecretCodeChange}></Form.Control>
        </Col>
    </Row>
    <Row className="px-3" >
        <Col>
            <Button disabled={secretCodeInput === assembly.secretCode ? false : true} variant="warning" onClick={event=>navigate(`/assemblies/${props.id}/edit`)}>Edit Event</Button>
            <Button disabled={secretCodeInput === assembly.secretCode ? false : true} variant="danger" onClick={event => confirmPopup(event,assembly)}>Delete Event</Button>
        </Col>
    </Row>
    </>
    : loaded && error !== ""
    ? <Row className="px-3"><Col><h2>{`Error: Event with ID ${props.id} was not found.`}</h2><h2>Please try again, or make it yourself <span><Link to="/new">here</Link></span>!</h2></Col></Row>
    : <Row className="px-3"><Col><h2>Loading...</h2></Col></Row>
    }
    

    <h3 className="production">TODOS:</h3>
    <h3>styling</h3>
    <h3>way to edit teammate status within table</h3>
    <h3>delete button, reference team_manager for react-confirm-alert </h3>
    </>
)};
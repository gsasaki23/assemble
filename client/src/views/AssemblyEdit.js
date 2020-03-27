import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, navigate } from '@reach/router';

// Styling
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


export default (props) => {
    const [assembly, setAssembly] = useState([]);
    const [inputAssembly, setInputAssembly] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [loadError, setLoadError] = useState('');
    // felt cute might delete later
    const [going, setGoing] = useState([]);
    const [cantgo, setCantgo] = useState([]);
    const [undecided, setUndecided] = useState([]);
    
    const [errors, setErrors] = useState([]);
    
    useEffect(()=>{
        axios.get(`http://localhost:8000/api/assembly/${props.id}`)
            .then(res => {
                if (res.data !== null){
                    setAssembly(res.data);
                    setInputAssembly(res.data);
                    setLoaded(true);
                    let goingList = res.data.team.filter(teammate => teammate.status === "Going").sort((teammateOne, teammateTwo) => (teammateOne.name > teammateTwo.name) ? 1 : -1);
                    setGoing(goingList);
                    let cantgoList = res.data.team.filter(teammate => teammate.status === "Can't Go").sort((teammateOne, teammateTwo) => (teammateOne.name > teammateTwo.name) ? 1 : -1)
                    setCantgo(cantgoList);
                    let undecidedList = res.data.team.filter(teammate => teammate.status === "Undecided").sort((teammateOne, teammateTwo) => (teammateOne.name > teammateTwo.name) ? 1 : -1);
                    setUndecided(undecidedList);
                }
                else{
                    setLoadError(`Error: Event with ID ${props.id} was not found.`);
                    setLoaded(true);
                }
            })
            .catch(console.log);
    },[props])

    const onSubmitHandler = e => {
        e.preventDefault();
        axios.put(`http://localhost:8000/api/assembly/update/${props.id}`, inputAssembly)
            .then(res => {
                navigate(`/assemblies/${props.id}`)
            })
            .catch(err=>{
                if (err.response.data.errors){
                    console.log(err.response.data.errors);
                    setErrors(err.response.data.errors)
                }
                // check for dupes?
            })
    }

    return (
    <>
    {loaded && loadError === ""? 
    <>
    {/* Name */}
    <Row className="px-3">
        <Col xs={3}><h2>Event Name:</h2></Col>
        <Col>
            <Form.Control className="w-50p d-ilb" type="text" defaultValue={assembly.name} onChange={event => {
            setInputAssembly({...inputAssembly,"name":event.target.value});
            }}></Form.Control>
            {errors.name !== undefined ? (<span className="serverValError">{errors.name.message}</span>):("")}
        </Col>
    </Row>
    
    {/* Event Code */}
    <Row className="px-3">
        <Col xs={3}><h2>Event Code:</h2></Col>
        <Col><h5>{assembly.eventCode}</h5></Col>
    </Row>

    {/* Description */}
    <Row className="px-3">
        <Col xs={3}><h2>Description:</h2></Col>
        <Col>
            <Form.Control className="w-50p d-ilb" type="text" defaultValue={assembly.description} onChange={event => {
            setInputAssembly({...inputAssembly,"description":event.target.value});
            }}></Form.Control>
            {errors.description !== undefined ? (<span className="serverValError">{errors.description.message}</span>):("")}
        </Col>
    </Row>
    
    {/* Date */}
    <Row className="px-3">
        <Col xs={3}><h2>Date: </h2></Col>
        <Col>
            <Form.Control className="w-50p d-ilb" type="date" defaultValue={assembly.date} onChange={event => {
            setInputAssembly({...inputAssembly,"date":event.target.value});
            }}></Form.Control>
            <p className="d-ilb">Previously: {assembly.date}</p>
            {errors.date !== undefined ? (<span className="serverValError">{errors.date.message}</span>):("")}
        </Col>
    </Row>
    
    {/* Start Time */}
    <Row className="px-3">
        <Col xs={3}><h2>Start Time: </h2></Col>
        <Col>
            <Form.Control className="w-50p d-ilb" type="date" value={assembly.start} onChange={event => {
            setInputAssembly({...inputAssembly,"start":event.target.value});
            }}></Form.Control>
            <p className="d-ilb">Previously: {assembly.start}</p>
            {errors.start !== undefined ? (<span className="serverValError">{errors.start.message}</span>):("")}
        </Col>
    </Row>
    
    {/* End Time */}    
    <Row className="px-3">
        <Col xs={3}><h2>End Time: </h2></Col>
        <Col>
            <Form.Control className="w-50p d-ilb" type="date" onChange={event => {
            setInputAssembly({...inputAssembly,"end":event.target.value});
            }}></Form.Control>
            <p className="d-ilb">Previously: {assembly.end}</p>
            {errors.end !== undefined ? (<span className="serverValError">{errors.end.message}</span>):("")}
        </Col>
    </Row>
    
    {/* Location */}
    <Row className="px-3">
        <Col xs={3}><h2>Location: </h2></Col>
        <Col>
            {/* Name */}
            <div>
                <Form.Control className="w-50p d-ilb" type="text" placeholder="ex: Sanctum Sanctorum" onChange={event => {setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"name":event.target.value}});}}></Form.Control>
                {errors["address.name"] !== undefined ? (<span className="serverValError">{errors["address.name"].message}</span>):("")}
            </div>
            {/* Street Line */}
            <div>
                <Form.Control className="w-50p d-ilb" type="text" defaultValue={assembly.address.street} onChange={event => {
                    setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"street":event.target.value}});
                }}></Form.Control>
                {errors["address.street"] !== undefined ? (<span className="serverValError">{errors["address.street"].message}</span>):("")}
            </div>
            {/* City, State, Zip */}
            <div>
                <Form.Control className="w-15p d-ilb" type="text" defaultValue={assembly.address.city} onChange={event => {
                setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"city":event.target.value}});
                }}></Form.Control>
                <Form.Control className="w-15p d-ilb" type="text" defaultValue={assembly.address.state} onChange={event => {
                setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"state":event.target.value}});
                }}></Form.Control>
                <Form.Control className="w-15p d-ilb" type="text" defaultValue={assembly.address.zip} onChange={event => {
                setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"zip":event.target.value}});
                }}></Form.Control>
                {errors["address.city"] !== undefined ? (<span className="serverValError">{errors["address.city"].message}</span>):("")}
                {errors["address.state"] !== undefined ? (<span className="serverValError">{errors["address.state"].message}</span>):("")}
                {errors["address.zip"] !== undefined ? (<span className="serverValError">{errors["address.zip"].message}</span>):("")}
            </div>
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

    {/* Submit Button */}
    <Row className="px-3" >
        <Button variant="success" onClick={onSubmitHandler}>Save Changes</Button>
    </Row>
    </>
    : loaded && loadError !== ""
    ? <Row className="px-3"><Col><h2>{`Error: Event with ID ${props.id} was not found.`}</h2><h2>Please try again, or make it yourself <span><Link to="/new">here</Link></span>!</h2></Col></Row>
    : <Row className="px-3"><Col><h2>Loading...</h2></Col></Row>
    }
    

    <h3 className="production">TODOS:</h3>
    <h3>styling</h3>
    <h3>getting the date to show by default</h3>
    </>
)};
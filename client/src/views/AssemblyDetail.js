import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, navigate } from '@reach/router';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import moment from 'moment';

// Styling
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { FaClock, FaCalendarWeek, FaMapMarkedAlt, FaInfoCircle } from "react-icons/fa";

export default (props) => {
    // Main Assembly from DB
    const [assembly, setAssembly] = useState([]);
    // Lists of teammate objects
    const [going, setGoing] = useState([]);
    const [cantgo, setCantgo] = useState([]);
    const [undecided, setUndecided] = useState([]);
    // Str after being formatter with moment
    const [dateStr, setDateStr] = useState("");
    const [timeStr, setTimeStr] = useState("");
    // Helpers to render loading or error msg
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState('');
    // Keep track of inputs
    const [secretCodeInput, setSecretCodeInput] = useState('');
    const [inputTeammate, setInputTeammate] = useState({});
    const [teammateErrors, setTeammateErrors] = useState({});

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

                    setDateStr(moment(res.data.date + " " + res.data.start).format("ddd, MMMM Do, YYYY"))
                    setTimeStr(
                        moment(res.data.date + " " + res.data.start).format("h:mm a") 
                        + " ~ " + 
                        moment(res.data.date + " " + res.data.end).format("h:mm a")
                    )
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
    // Listener for name input
    const onNameChange = event => {
        setInputTeammate({...inputTeammate,"name":event.target.value});
        // input len checks
        if (event.target.value.length === 0){
            setTeammateErrors({...teammateErrors, "nameZero":"Name is required.","nameLen":""})
        }
        else if (event.target.value.length < 2){
            setTeammateErrors({...teammateErrors, "nameZero":"", "nameLen":"Name must be at least 2 characters."})
        }
        else {
            setTeammateErrors({...teammateErrors, "nameZero":"", "nameLen":""})
        }
        // uniqueness checks
        let unique = true;
        for (const teammate of assembly.team){
            if (event.target.value === teammate.name){
                setTeammateErrors({...teammateErrors, "nameUnique":"This name is already marked."})
                unique = false;
            }
        }
        if (unique){
            setTeammateErrors({...teammateErrors, "nameUnique":""})
        }
    }
    // Listener for email input
    // TODO: client-side email validation
    const onEmailChange = event => {
        setInputTeammate({...inputTeammate,"email":event.target.value});
    }
    // On Teammate submit
    const onSubmitHandler = (e,str) => {
        e.preventDefault();
        
        axios.put(`http://localhost:8000/api/assembly/update/${assembly._id}/addTeammate/`, {
            ...inputTeammate, "status":str
        })
            .then(res => {
                navigate(`/assemblies/${res.data._id}`)
            })
            .catch(err=>{
                console.log(err.response.data);
                
                if (err.response.data){
                    setTeammateErrors({...teammateErrors, "server":"Please check your inputs and try again. \nName must be at least 2 characters, and Email must be in the correct format."})
                }
            })
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
    {loaded && error === ""
    ? <Row className="background"><Col>
        {/* Name and Codes */}
        <Row className="subHeader">
            <Col>
                {/* Name */}
                <h1 className="px-4">{assembly.name}</h1>
            </Col>
            <Col className="ta-r">
                {/* Code */}
                <h5>{`Event Code:`}</h5>
                <h4>{`[${assembly.eventCode}]`}</h4>
            </Col>
        </Row>

        {/* Location, Date, Time, Description*/}
        <Row className="desc">
            <Col>
                {/* Location */}
                <Row className="px-3">
                    <Col>
                        <div className="d-ilb va-t">
                            <FaMapMarkedAlt className="icon"/>
                        </div>
                        <div className="d-ilb">
                            {assembly.address.name ? <h4 className="d-b ml-3">{assembly.address.name}</h4> : ""}
                            <h5 className="d-b ml-3">{assembly.address.street}</h5>
                            <h5 className="d-b ml-3">{`${assembly.address.city}, ${assembly.address.state} ${assembly.address.zip}`}</h5>
                            <a className="d-b ml-3" href={`https://www.google.com/maps/search/420+69th+St+New+York,+NY+12345/`} target="_blank" rel="noopener noreferrer">Google Maps, BUILD THIS LATER!!!!</a>
                        </div>
                    </Col>
                </Row>
                {/* Date */}
                <Row className="px-3">
                    <Col>
                        <FaCalendarWeek className="icon"/>
                        <h5 className="d-ilb ml-3">{dateStr}</h5>
                    </Col>
                </Row>
                {/* Time */}
                <Row className="px-3">
                    <Col>
                        <FaClock className="icon"/>
                        <h5 className="d-ilb ml-3">{timeStr}</h5>
                    </Col>
                </Row>
                {/* Description */}
                <Row className="px-3">
                    <Col>
                        <FaInfoCircle className="icon"/>
                        <h4 className="d-ilb ml-3">{assembly.description !== "" ? assembly.description : "None"}</h4>
                    </Col>
                </Row>
            </Col>
        </Row>
        
        {/* Teammates Section */}
        <Row className = "teammates">
            <Col>
                <h3>Mark your attendance!</h3>
                <div>
                    <h5>Your Name:</h5>
                    <input className="w-25p my-1" type="text" placeholder="ex: Thor" onChange={onNameChange}></input>
                </div>
                <div>
                    <h5>Email:</h5>
                    <input className="w-25p my-1" type="email" placeholder="ex: thor.odinson@gmail.com" onChange={onEmailChange}></input>
                </div>
                {/* Pseudo-submit buttons */}
                <div>
                    <h5>Status:</h5>
                    <Button className="w-15p d-ilb" variant="success" disabled={teammateErrors.nameZero || teammateErrors.nameLen || teammateErrors.nameUnique ? true : false} onClick={event=>onSubmitHandler(event,"Going")}>Going</Button>
                    <Button className="w-15p mx-2 d-ilb" variant="danger" disabled={teammateErrors.nameZero || teammateErrors.nameLen || teammateErrors.nameUnique ? true : false} onClick={event=>onSubmitHandler(event,"Can't Go")}>Can't Go</Button>
                </div>
                <div>
                    {teammateErrors.server ? <h5 className="serverValError">{teammateErrors.server}</h5> :""}
                    {teammateErrors.nameZero ? <h5 className="serverValError">{teammateErrors.nameZero}</h5> :""}
                    {teammateErrors.nameLen ? <h5 className="serverValError">{teammateErrors.nameLen}</h5> :""}
                    {teammateErrors.nameUnique ? <h5 className="serverValError">{teammateErrors.nameUnique}</h5> :""}
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

        {/* Edit/Delete Section */}
        <Row className = "editDelete">
            <Col>
                <h5>Enter SECRET CODE to edit info or delete event:</h5>
                <input className="w-50p" type="text" placeholder="ex: SECRETCODE" onChange={onSecretCodeChange}></input>
                <div>
                    <Button className="w-25p" disabled={secretCodeInput === assembly.secretCode ? false : true} variant="warning" onClick={event=>navigate(`/assemblies/${props.id}/edit`)}>Edit Event</Button>
                    <Button className="w-25p" disabled={secretCodeInput === assembly.secretCode ? false : true} variant="danger" onClick={event => confirmPopup(event,assembly)}>Delete Event</Button>
                </div>
            </Col>
        </Row>

        <h3 className="production">(Production) Secret Code: {assembly.secretCode}</h3>

    </Col></Row>

    : loaded && error !== ""
    ? <Row className="px-3"><Col><h2>{`Error: Event with ID ${props.id} was not found.`}</h2><h2>Please try again, or make it yourself <span><Link to="/new">here</Link></span>!</h2></Col></Row>
    : <Row className="px-3"><Col><h2>Loading...</h2></Col></Row>
    }
    </>
)};
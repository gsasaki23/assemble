import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { navigate } from '@reach/router';
import randomWords from 'random-words';

// Styling
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// make name, secretcode, and eventcode unique

export default () => {
    // All Names in DB
    const [dbnames, setDBnames] = useState([]);
    // All EventCodes in DB
    const [dbeventcodes, setDBeventcodes] = useState([]);

    // The Assembly being built out of inputs
    const [inputAssembly, setInputAssembly] = useState({});
    // Server-side validation errors
    const [errors, setErrors] = useState([]);
    // Client-side validation errors
    const [clientErrors, setClientErrors] = useState({});
    
    // Initial: fetch all 3 lists to be used for client-side validations
    useEffect(()=>{
        axios.get('http://localhost:8000/api/assembly/')
            .then(res => {                
                let db_names = [];
                let db_eventCodes = [];
                res.data.forEach((assembly)=>{
                    db_names.push(assembly.name);
                    db_eventCodes.push(assembly.eventCode);
                });
                setDBnames(db_names);
                setDBeventcodes(db_eventCodes);
            })
            .catch(console.log);
    },[]);
    
    // On Submit
    const onClickHandler = e => {
        e.preventDefault();

        // Create the would-be secret code with random words
        let randomTwo = randomWords({exactly: 2, minLength: 3, maxLength: 6, formatter: (word)=> word.toUpperCase()});
        let str = randomTwo[0] + randomTwo[1];
        setInputAssembly({...inputAssembly,"secretCode":str});
        
        // In the absturdly small change of non-unique, try infinitely until unique?
        // make & use dbsecretcodes state, similar to dbeventcodes

        console.log(JSON.stringify(inputAssembly));
        
        axios.post(`http://localhost:8000/api/assembly/new`, inputAssembly)
            .then(res => {
                navigate(`/assemblies/${res.data._id}`)
            })
            .catch(err=>{
                console.log(err.response);
                if (err.response.data.errors){
                    console.log(err.response.data.errors);
                    setErrors(err.response.data.errors)
                }
            })
    }

    // Client-side validation for uniqueness
    const onNameChange = event => {
        let found = false;
        dbnames.forEach((name)=>{
            if(name === event.target.value){
                setClientErrors({...clientErrors,"name":"Name is already in use."});
                found = true;
            }
        })
        if(!found){
            setClientErrors({...clientErrors,"name":""});
        }
        setInputAssembly({...inputAssembly,"name":event.target.value});
    };
    // Client-side validation for uniqueness
    const onEventCodeChange = event => {
        let found = false;
        dbeventcodes.forEach((eventCode)=>{
            if(eventCode === event.target.value.toUpperCase()){
                setClientErrors({...clientErrors,"eventCode":"eventCode is already in use."});
                found = true;
            }
        })
        if(!found){
            setClientErrors({...clientErrors,"eventCode":""});
        }
        setInputAssembly({...inputAssembly,"eventCode":event.target.value.toUpperCase()});
    };

    return (
    <div className="background">
    {/* Page Title */}
    <Row className="editHeading mx-auto"><Col>
        <h1>New Event</h1>
    </Col></Row>

    {/* Name and EventCode */}
    <Row className="editTop"><Col>
        {/* Name */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Event Name:</h2></Col>
            <Col>
                <input autoFocus className="w-50p d-ilb" type="text" placeholder="ex: Alien Landing" onChange={event => {
                setInputAssembly({...inputAssembly,"name":event.target.value});
                }}></input>
                {errors.name !== undefined ? (<span className="serverValError">{errors.name.message}</span>):("")}
            </Col>
        </Row>
        {/* Event Code */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Event Code:</h2></Col>
            <Col>
                <input className="w-50p d-ilb" type="text" placeholder="ex: SQUIDWARD" onChange={onEventCodeChange}></input>
                {errors.name !== undefined ? (<span className="serverValError">{errors.eventCode.message}</span>):("")}
                {clientErrors.eventCode !== undefined ? (<span className="clientValError">{clientErrors.eventCode}</span>):("")}
            </Col>
        </Row>
    </Col></Row>

    {/* Everything else */}
    <Row className="editMain mx-auto"><Col>
        {/* Location */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Location: </h2></Col>
            <Col>
                {/* Name */}
                <div>
                    <input className="w-50p d-ilb" type="text" placeholder="ex: Sanctum Sanctorum" onChange={event => {setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"name":event.target.value}});}}></input>
                    {errors["address.name"] !== undefined ? (<span className="serverValError">{errors["address.name"].message}</span>):("")}
                </div>
                {/* Street Line */}
                <div>
                    <input className="w-50p d-ilb" type="text" placeholder="ex: 420 69th St" onChange={event => {
                        setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"street":event.target.value}});
                    }}></input>
                    {errors["address.street"] !== undefined ? (<span className="serverValError">{errors["address.street"].message}</span>):("")}
                </div>
                {/* City, State, Zip */}
                <div>
                    <input className="w-15p d-ilb" type="text" placeholder="ex: New York" onChange={event => {
                    setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"city":event.target.value}});
                    }}></input>
                    <input className="w-15p d-ilb" type="text" placeholder="ex: NY" onChange={event => {
                    setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"state":event.target.value}});
                    }}></input>
                    <input className="w-15p d-ilb" type="text" placeholder="ex: 12345" onChange={event => {
                    setInputAssembly({...inputAssembly,"address":{...inputAssembly.address,"zip":event.target.value}});
                    }}></input>
                    {errors["address.city"] !== undefined ? (<span className="serverValError">{errors["address.city"].message}</span>):("")}
                    {errors["address.state"] !== undefined ? (<span className="serverValError">{errors["address.state"].message}</span>):("")}
                    {errors["address.zip"] !== undefined ? (<span className="serverValError">{errors["address.zip"].message}</span>):("")}
                </div>
            </Col>
        </Row>
        {/* Date */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Date: </h2></Col>
            <Col>
                <input className="w-50p d-ilb" type="date" defaultValue="2020-01-01" onChange={event => {
                setInputAssembly({...inputAssembly,"date":event.target.value});
                }}></input>
                {errors.date !== undefined ? (<span className="serverValError">{errors.date.message}</span>):("")}
            </Col>
        </Row>
        {/* Start Time */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Start Time: </h2></Col>
            <Col>
                <input className="w-50p d-ilb" type="time" defaultValue="13:00"  onChange={event => {
                setInputAssembly({...inputAssembly,"start":event.target.value});
                }}></input>
                {errors.start !== undefined ? (<span className="serverValError">{errors.start.message}</span>):("")}
            </Col>
        </Row>
        {/* End Time */}    
        <Row className="editSubSection">
            <Col xs={3}><h2>End Time: </h2></Col>
            <Col>
                <input className="w-50p d-ilb" type="time" defaultValue="14:00" onChange={event => {
                setInputAssembly({...inputAssembly,"end":event.target.value});
                }}></input>
                {errors.end !== undefined ? (<span className="serverValError">{errors.end.message}</span>):("")}
            </Col>
        </Row>
        {/* Description */}
        <Row className="editSubSection">
            <Col xs={3}><h2>Description:</h2></Col>
            <Col>
                <textarea className="w-50p d-ilb" type="text" placeholder="ex: eArtH iS CloSEd tODaY" onChange={event => {
                setInputAssembly({...inputAssembly,"description":event.target.value});
                }}></textarea>
                {errors.description !== undefined ? (<span className="serverValError">{errors.description.message}</span>):("")}
            </Col>
        </Row>
    </Col></Row>
    
    {/* ~~~~~~~~~~~~~~~~~~Teammate List Here ~~~~~~~~~~~~~~~~~ */}

    {/* Submit Button */}
    <Row className="mx-auto">
        <Button className="mx-auto editSaveButton" variant="success" onClick={onClickHandler}>Create Event</Button>
    </Row>
    </div>
)};
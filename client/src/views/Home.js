import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { navigate } from '@reach/router';

// Styling
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default () => {
    const [assemblies, setAssemblies] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [eventCode, setEventCode] = useState('');
    const [error, setError] = useState('');
    // All Names in DB
    const [dbnames, setDBnames] = useState([]);
    
    // Listener for form input
    const onEventCodeChange = event => {
        setEventCode(event.target.value);
        // add char length validations as needed here
    }

    // Get all assemblies
    useEffect(()=>{
        axios.get('http://localhost:8000/api/assembly/')
            .then(res => {
                setAssemblies(res.data);
                setLoaded(true);
                
                // TODO Design decision: keep or nah
                let db_names = [];
                res.data.forEach((assembly)=>{
                    db_names.push(assembly.name);
                });
                setDBnames(db_names);
            })
            .catch(console.log);
    },[]);

    const onSubmitHandler = e => {
        e.preventDefault();
        for (let assembly in assemblies){                    
            if(assemblies[assembly].eventCode === eventCode.toUpperCase()){
                navigate(`/assemblies/${assemblies[assembly]._id}`);
            }
        }
        setError("No matches found. Please try another code, or start an event youself!");
    }

    return (
    <>
    <Row className="px-3"><Col><h2>Welcome!</h2></Col></Row>
    {loaded 
    ? <><Row className="px-3">
        <Col>
            <h4>To jump with an EVENT CODE, enter here:</h4>
            <Form onSubmit={onSubmitHandler}>
                <Form.Control className="w-50p" type="text" placeholder="ex: EVENTCODE" onChange={onEventCodeChange}></Form.Control>
                <Button variant="primary" type="submit">Submit</Button>
                {error !== "" ? <span className="d-b">{error}</span>:("")}
            </Form>
        </Col>
        <Col>
            <h4>Or get started with a new event to assemble your team:</h4>
            <Button variant="success" onClick={event=>navigate("/new")}>Let's go!</Button>
        </Col>
    </Row>
    <Row>
        <Col className="production">
            <h4>PRODUCTION - event names and codes:</h4>
            {assemblies.map((assembly,idx)=>{
                return (<p key={idx}>{`Name: ${assembly.name}, EventCode: ${assembly.eventCode}, SecretCode: ${assembly.secretCode}`}</p>)
            })}
        </Col>
    </Row>
    </> 
    : <Row className="px-3"><Col><h2>Loading...</h2></Col></Row>}
    

    <h3 className="production">TODOS:</h3>
    <h3>styling</h3>
    <h3>client-side validation</h3>
    <h3>optimizing search (make a new eventCode-searching route in server?)</h3>
    </>
)};
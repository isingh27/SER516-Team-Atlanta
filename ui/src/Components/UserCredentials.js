import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner, Toast } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TaigaService from '../Services/taiga-service';

const UserCredentials = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('');
    
    const navigation = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        if (!email || !password) {
            setMessage('Please enter your email and password');
            setVariant('danger');
            setShow(true);
            setLoading(false);
            return;
        }
        TaigaService.taigaAuthenticate(email, password).then((response) => {
            console.log(response.data);
            if(response.data.status === 'success' && !response.data.token){
                setMessage('Invalid Credentials');
                setVariant('danger');
                setShow(true);
                setLoading(false);
                return;
            }
            if (response.data.status === 'success') {
                console.log('Authenticated');
                setMessage('Taiga Authentication Success!');
                setVariant('success');
                setShow(true);
                setLoading(false);
                localStorage.setItem('taigaToken', response.data.token);
                navigation('/project-slug');                
            }
        }).catch((error) => {
            console.log(error);
            setMessage('Taiga Authentication Failed!');
            setVariant('danger');
            setShow(true);
            setLoading(false);

        });
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <h2 className="mb-3">Enter your Taiga Username and Password</h2>
                    <Toast className='mb-5' onClose={() => setShow(false)} show={show} delay={3000} autohide bg={variant} style={{marginRight:"auto",marginLeft:"auto"}}>
                        <Toast.Body>{message}</Toast.Body>
                    </Toast>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3 align-items-center">
                            <Col sm={3} className="text-left">
                                <Form.Label className="small">Email address</Form.Label>
                            </Col>
                            <Col sm={9}>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col sm={3} className="text-left">
                                <Form.Label className="small">Password</Form.Label>
                            </Col>
                            <Col sm={9}>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Col>
                        </Row>

                        <Button variant="primary" type="submit">
                            {loading && <Spinner animation="border" role="status" />}
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
          
        </Container>
    );
};

export default UserCredentials;

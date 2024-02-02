import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const UserCredentials = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Handle form submission logic
        console.log('Email:', email, 'Password:', password);
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <h2 className="mb-5">Enter your Taiga Username and Password</h2>
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
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default UserCredentials;

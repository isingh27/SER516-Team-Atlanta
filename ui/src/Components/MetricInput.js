import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const MetricInput = () => {
    const [projectSlug, setProjectSlug] = useState('');
    const projectOptions = ["Parameter 1", "Parameter 2", "Parameter 3"];

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Handle form submission logic
        console.log('Project Slug:', projectSlug);
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <h2 className="mb-5">Select Metric Parameter</h2>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3 align-items-center">
                            <Col sm={3} className="text-left">
                                <Form.Label className="small">Metric Parameter</Form.Label>
                            </Col>
                            <Col sm={9}>
                                <Form.Select
                                    value={projectSlug}
                                    onChange={(e) => setProjectSlug(e.target.value)}
                                >
                                    <option value="" disabled hidden>Select Metric Parameter</option>
                                    {projectOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Select>
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

export default MetricInput;

import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const ProjectSlugInput = () => {
    const [projectSlug, setProjectSlug] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Handle form submission logic
        console.log('Project Slug:', projectSlug);
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <h2 className="mb-5">Enter Project Slug</h2>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3 align-items-center">
                            <Col sm={3} className="text-left">
                                <Form.Label className="small">Project Slug</Form.Label>
                            </Col>
                            <Col sm={9}>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter project slug" 
                                    value={projectSlug} 
                                    onChange={(e) => setProjectSlug(e.target.value)}
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

export default ProjectSlugInput;

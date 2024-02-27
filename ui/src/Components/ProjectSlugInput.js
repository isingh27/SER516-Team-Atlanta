import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Spinner, Toast } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

import TaigaService from '../Services/taiga-service';

const ProjectSlugInput = () => {
    const [projectSlug, setProjectSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('');
    const [projects, setProjects] = useState([]);
    const [projectLoading, setProjectLoading] = useState(false);

    const navigation = useNavigate();

    useEffect(() => {
        setProjectLoading(true);
        TaigaService.taigaUserProjects(localStorage.getItem('taigaToken')).then((response) => {
            console.log(response.data);
            setProjectLoading(false);
            if(response.data.status === 'success'){
                console.log('User Projects:', response.data);
                // localStorage.setItem('projects',JSON.stringify(response.data.data))
                response.data.data.map((project) => {
                    projects.push({label: project.slug, value: project.id});
                }
                );
            }
            else{
                console.log('User Projects Retrieval Failed');
            }
        }).catch((error) => {
            setProjectLoading(false);
            console.log(error);
        });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!projectSlug) {
            setMessage('Please enter the project slug');
            setVariant('danger');
            setShow(true);
            setLoading(false);
            return;
        }
        setLoading(true);
        TaigaService.taigaProjectDetails(localStorage.getItem('taigaToken'), projectSlug).then((response) => {
            console.log(response.data);
            if(response.data.status === 'success'){
                setLoading(false);
                setShow(true);
                setVariant('success');
                console.log('Project Details:', response.data);
                setMessage(`Project Details for ${response.data.data.name} Retrieved Successfully`);
                //TODO: Store the project details in local storage & redirect the user to the project details page
                localStorage.setItem('projectId',JSON.stringify(response.data.data.id))
                localStorage.setItem('projectName',JSON.stringify(response.data.data.name))
                navigation('/dashboard')
            }
            else{
                setLoading(false);
                setShow(true);
                setVariant('danger');
                setMessage('Project Details Retrieval Failed');
            }
        }).catch((error) => {
            console.log(error);
            setLoading(false);
            setVariant('danger');
            setMessage('Project Details Retrieval Failed');
            setShow(true);
        });
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <h2 className="mb-5">Enter Project Slug</h2>
                    <Toast className='mb-5' onClose={() => setShow(false)} show={show} delay={4000} autohide bg={variant} style={{marginRight:"auto",marginLeft:"auto"}}>
                        <Toast.Body>{message}</Toast.Body>
                    </Toast>
                    {!projectLoading ? <Form onSubmit={handleSubmit}>
                        <Row className="mb-3 align-items-center">
                            <Col sm={3} className="text-left">
                                <Form.Label className="small">Project Slug</Form.Label>
                            </Col>
                            <Col sm={9}>
                                {/* <Form.Control 
                                    type="text" 
                                    placeholder="Enter project slug" 
                                    value={projectSlug} 
                                    onChange={(e) => setProjectSlug(e.target.value)}
                                /> */}
                                <CreatableSelect placeholder="Enter project slug or Select" isClearable options={projects} onChange={(e) => setProjectSlug(e.label)}/>
                            </Col>
                        </Row>

                        <Button size='lg' className='mt-3' variant="primary" type="submit">
                           {loading && <Spinner animation="border" role="status" />} Submit
                        </Button>
                    </Form> : <Spinner animation="border" role="status" />}
                </Col>
            </Row>
        </Container>
    );
};

export default ProjectSlugInput;

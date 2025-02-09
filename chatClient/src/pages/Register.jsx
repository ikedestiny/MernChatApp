import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap"
import { Link } from 'react-router-dom'
import { userStore } from "../state/userStore";

const Register = () => {
    const { name, password, email, setName, setEmail, setPassword, error, clearError, register } = userStore()
    return (
        <Form>
            <Row style={{
                height: "100vh",
                justifyContent: "center",
                paddingTop: "20%"
            }}>
                <Col xs={6}>
                    <Stack gap={3}>
                        <h2>Register</h2>

                        <Form.Control type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Form.Control type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Form.Control type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Button onClick={() => { register() }} >Submit</Button>
                        <p>Already registered?      <Link to="/login">Login</Link></p>
                        {error && (
                            <Alert variant="danger" onClose={clearError} dismissible>
                                <p>{error}</p>
                            </Alert>
                        )}


                    </Stack>
                </Col>
            </Row>
        </Form>
    );
}

export default Register;
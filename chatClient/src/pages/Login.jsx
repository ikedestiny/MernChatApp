import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap"
import { userStore } from "../state/userStore";

const Login = () => {
    const { password, email, setEmail, setPassword, error, login, clearError } = userStore()

    return (
        <Form>
            <Row style={{
                height: "100vh",
                justifyContent: "center",
                paddingTop: "20%"
            }}>
                <Col xs={6}>
                    <Stack gap={3}>
                        <h2>Login</h2>
                        <Form.Control type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Form.Control type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Button onClick={() => { login() }} >Submit</Button>
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

export default Login;
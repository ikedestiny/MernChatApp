import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from 'react-router-dom'
import { userStore } from "../state/userStore";
import Notification from "./chat/Notification";

const NavBar = () => {
    const { LoggedInUsername, logout } = userStore()
    return (
        <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
            <Container>
                <h2>
                    <Link to="/" className="link-light text-decoration-none">
                        ChatApp
                    </Link>
                </h2>
                {LoggedInUsername && <span className="text-warning">Logged in as {LoggedInUsername}</span>}
                <Nav>
                    <Stack direction="horizontal" gap={3}>

                        <Notification />

                        {LoggedInUsername ? <button style={{ background: "none", color: "white", border: "none" }} onClick={logout}>logout</button> : <Link to="/login" className="link-light text-decoration-none">
                            Login
                        </Link>}
                        {!LoggedInUsername &&
                            <Link to="/register" className="link-light text-decoration-none">
                                register
                            </Link>}
                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar; 
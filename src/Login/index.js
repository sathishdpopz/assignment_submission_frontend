import { useState } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import jwt_decode from "jwt-decode";

const Login = () => {
  const [state, setState] = useState({
    username: "",
    password: "",
  });
  const jwt = localStorage.getItem("token")
  const [roles, setRoles] = useState(getRolesFromJwt(jwt));

  function getRolesFromJwt() {
    if (jwt) {
      const decodedJwt = jwt_decode(jwt);
      return decodedJwt.authorities;
    } else {
      return [];
    }
  }

  function handleChange(e) {
    const copy = { ...state };
    copy[e.target.name] = e.target.value;
    setState(copy);
  }

  async function handleSubmit() {
    const res = await fetch(`api/auth/signin`, {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const json = await res.json();
      localStorage.setItem("token", json.token);
      roles.find((role) => role === "ROLE_ADMIN") ? (
        window.location.href = "/admin"
      ) : (
        window.location.href = "/dashboard"
      )   
    } else {
      alert("Bad credentials");
    }
  }
  return (
    <div>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md="8" lg="6">
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className="fs-4">username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                size="lg"
                placeholder="username"
                value={state.username}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8" lg="6">
            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="fs-4">password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                size="lg"
                placeholder="password"
                value={state.password}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col
            lg="6"
            md="8"
            className="mt-2 d-flex flex-column gap-5 flex-md-row justify-content-md-between"
          >
            <Button onClick={handleSubmit}>Submit</Button>
            <Button variant="secondary">Exit</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;

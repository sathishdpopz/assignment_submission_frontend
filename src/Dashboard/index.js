import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ajax from "../Services/fetchService";
import StatusBadge from "../StatusBadge";

function Dashboard() {
  let navigate = useNavigate()
  const [assignments, setAssignments] = useState(null);
  const jwt = localStorage.getItem("token");

  useEffect(() => {
    ajax("api/assignments", "GET", jwt).then((responseData) => {
      setAssignments(responseData);
    });
  }, [jwt]);

  function createAssignemnet() {
    ajax(`api/assignments`, "POST", jwt).then((assignment) => {
      window.location.href = `/assignments/${assignment.id}`
    });
  }

  return (
    <div style={{ margin: "2em" }}>
      <Row>
        <Col>
          <div
            className="d-flex justify-content-end"
            style={{ cursor: "pointer" }}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </div>
        </Col>
      </Row>
      <div className="mb-5">
        <Button size="lg" onClick={() => createAssignemnet()}>
          Submit New Assignement
        </Button>
      </div>
      {assignments ? (
        <div
          className="d-grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fit, 16rem" }}
        >
          {assignments.map((assignment) => (
            <Card
              key={assignment.id}
              style={{ width: "18rem", height: "18rem" }}
            >
              <Card.Body className="d-flex flex-column justify-content-around">
                <Card.Title>Assignment #{assignment.number}</Card.Title>
                <div className="d-flex align-items-start mt-1">
                  <StatusBadge text={assignment.status} />
                </div>
                <Card.Text className="mt-3">
                  <p style={{ cursor: "pointer" }}>
                    <strong>GitHup URL:</strong>{" "}
                    <a href={assignment.githubUrl}>{assignment.githubUrl}</a>
                  </p>
                  <p>
                    <strong>Branch:</strong> {assignment.branch}
                  </p>
                </Card.Text>
                <Button
                  variant="dark"
                  onClick={() => {
                    window.location.href = `/assignments/${assignment.id}`
                  }}
                >
                  Edit
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Dashboard;

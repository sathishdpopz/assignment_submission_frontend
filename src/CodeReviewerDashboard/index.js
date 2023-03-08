import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import ajax from "../Services/fetchService";
import jwt_decode from "jwt-decode";
import StatusBadge from "../StatusBadge";
import { useNavigate } from "react-router-dom";

function CodeReviewerDashboard() {
  let navigate = useNavigate()
  const [assignments, setAssignments] = useState(null);
  const jwt = localStorage.getItem("token");

  function editReview(assignment) {
    window.location.href = `/assignments/${assignment.id}`
  }

  function claimAssignment(assignment) {
    const decodedJwt = jwt_decode(jwt);
    const user = {
      username: decodedJwt.sub,
      authorities: decodedJwt.authorities,
    };

    assignment.codeReviewer = user;
    assignment.status = "In Review";
    ajax(`api/assignments/${assignment.id}`, "PUT", jwt, assignment).then(
      (updatedAssignment) => {
        const assignmentsCopy = [...assignments];
        const i = assignmentsCopy.findIndex((a) => a.id === assignment.id);
        assignmentsCopy[i] = updatedAssignment;
        setAssignments(assignmentsCopy);
      }
    );
  }

  useEffect(() => {
    ajax("api/assignments", "GET", jwt).then((responseData) => {
      setAssignments(responseData);
    });
  }, [jwt]);

  return (
    <Container>
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
      <Row>
        <Col>
          <h1>Code Reviewer Dashboard</h1>
        </Col>
      </Row>

      {/* In Review */}

      <div className="assignment-wrapper In-Review">
        <div className="assignment-wrapper-title h3 px-2">In Review</div>
        {assignments &&
        assignments.filter((assignment) => assignment.status === "In Review")
          .length > 0 ? (
          <div
            className="d-grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fit, 16rem" }}
          >
            {assignments
              .filter((assignment) => assignment.status === "In Review")
              .map((assignment) => (
                <Card
                  key={assignment.id}
                  style={{ width: "18rem", height: "19rem" }}
                >
                  <Card.Body className="d-flex flex-column justify-content-around">
                    <Card.Title>Assignment #{assignment.number}</Card.Title>
                    <div className="d-flex align-items-start mt-1">
                      <StatusBadge text={assignment.status} />
                    </div>
                    <Card.Text className="mt-2">
                      <p className="font-sm">
                        <strong>GitHup URL:</strong> {assignment.githubUrl}
                      </p>
                      <p>
                        <strong>Branch:</strong> {assignment.branch}
                      </p>
                    </Card.Text>
                    <Button
                      variant="dark"
                      onClick={() => {
                        editReview(assignment);
                      }}
                    >
                      Edit
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </div>
        ) : (
          <div>No Assignment Found...</div>
        )}
      </div>
      {/* Submitted */}

      <div className="assignment-wrapper Submitted">
        <div className="assignment-wrapper-title h3 px-2">Awaiting Review</div>
        {assignments &&
        assignments.filter((assignment) => assignment.status === "Submitted" || assignment.status === "Resubmitted")
          .length > 0 ? (
          <div
            className="d-grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fit, 16rem" }}
          >
            {assignments
              .filter((assignment) => assignment.status === "Submitted" || assignment.status === "Resubmitted")
              .sort((a,b) => {
                if(a.status === "Resubmitted"){
                  return -1;
                }else{
                  return 1;
                }
              } )
              .map((assignment) => (
                <Card
                  key={assignment.id}
                  style={{ width: "18rem", height: "19rem" }}
                >
                  <Card.Body className="d-flex flex-column justify-content-around">
                    <Card.Title>Assignment #{assignment.number}</Card.Title>
                    <div className="d-flex align-items-start mt-1">
                      <StatusBadge text={assignment.status} />
                    </div>
                    <Card.Text className="mt-2">
                      <p className="font-sm">
                        <strong>GitHup URL:</strong> {assignment.githubUrl}
                      </p>
                      <p>
                        <strong>Branch:</strong> {assignment.branch}
                      </p>
                    </Card.Text>
                    <Button
                      variant="dark"
                      onClick={() => {
                        claimAssignment(assignment);
                      }}
                    >
                      Claim
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </div>
        ) : (
          <div>No Assignment Found...</div>
        )}
      </div>
      <div className="assignment-wrapper needs-update">
        <div className="assignment-wrapper-title h3 px-2">Needs update</div>
        {assignments &&
        assignments.filter((assignment) => assignment.status === "Needs Update")
          .length > 0 ? (
          <div
            className="d-grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fit, 16rem" }}
          >
            {assignments
              .filter((assignment) => assignment.status === "Needs Update")
              .map((assignment) => (
                <Card
                  key={assignment.id}
                  style={{ width: "18rem", height: "19rem" }}
                >
                  <Card.Body className="d-flex flex-column justify-content-around">
                    <Card.Title>Assignment #{assignment.number}</Card.Title>
                    <div className="d-flex align-items-start mt-1">
                      <StatusBadge text={assignment.status} />
                    </div>
                    <Card.Text className="mt-2">
                      <p className="font-sm">
                        <strong>GitHup URL:</strong> {assignment.githubUrl}
                      </p>
                      <p>
                        <strong>Branch:</strong> {assignment.branch}
                      </p>
                    </Card.Text>
                    <Button
                      variant="dark"
                      onClick={() => 
                        window.location.href = `/assignments/${assignment.id}`
                      }
                    >
                      View
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </div>
        ) : (
          <div>No Assignment Found...</div>
        )}
      </div>
    </Container>
  );
}

export default CodeReviewerDashboard;

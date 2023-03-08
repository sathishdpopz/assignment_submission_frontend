import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ajax from "../Services/fetchService";
import StatusBadge from "../StatusBadge";
import { useNavigate } from "react-router-dom";
import CommentContainer from "../CommentContainer";

const CodeReviewerAssignmentView = () => {
  let navigate = useNavigate();
  const assignmentId = window.location.href.split("/assignments/")[1];
  const jwt = localStorage.getItem("token");
  const [assignment, setAssignment] = useState({
    githubUrl: "",
    branch: "",
    number: null,
    status: null,
  });
  const [assignmentEnums, setAssignmentEnums] = useState([]);
  const [assignmentStatuses, setAssignmentStatuses] = useState([]);

  //Useing UseRef
  const prevAssignmentValue = useRef(assignment);

  function updateAssignments(prop, value) {
    const copy = { ...assignment };
    copy[prop] = value;
    setAssignment(copy);
  }

  function handleSubmit(status) {
    if (status && assignment.status !== status) {
      updateAssignments("status", status);
    } else {
      persist();
    }
  }

  function persist() {
    ajax(`/api/assignments/${assignmentId}`, "PUT", jwt, assignment).then(
      (assignmentDatas) => {
        setAssignment(assignmentDatas);
      }
    );
  }

  useEffect(() => {
    if (prevAssignmentValue.current.status !== assignment.status) {
      persist();
    }
    prevAssignmentValue.current = assignment;
  }, [assignment]);

  useEffect(() => {
    ajax(`/api/assignments/${assignmentId}`, "GET", jwt).then(
      (responseData) => {
        let assignmentData = responseData.assignment;
        if (assignmentData.branch === null) assignmentData.branch = "";
        if (assignmentData.githubUrl === null) assignmentData.githubUrl = "";
        setAssignment(assignmentData);
        setAssignmentEnums(responseData.assignmentEnum);
        setAssignmentStatuses(responseData.statusEnum);
      }
    );
  }, [jwt]);

  return (
    <Container className="mt-5">
      <Row className=" mb-2 d-flex align-item-center">
        <Col>
          {assignment.number ? <h1>Assignment {assignment.number}</h1> : <> </>}
        </Col>
        <Col>
          <StatusBadge text={assignment.status} />
        </Col>
      </Row>
      {assignment ? (
        <>
          <Form.Group as={Row} className="my-4" controlId="githubUrl">
            <Form.Label column sm="3" md="2">
              GitHub URL:
            </Form.Label>
            <Col sm="8" md="10" lg="6">
              <Form.Control
                type="url"
                placeholder="https://github.com/something"
                value={assignment.githubUrl}
                readOnly
                onChange={(e) => updateAssignments("githubUrl", e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-4" controlId="branch">
            <Form.Label column sm="3" md="2">
              Branch:
            </Form.Label>
            <Col sm="8" md="10" lg="6">
              <Form.Control
                type="text"
                readOnly
                placeholder="example_branch_name"
                value={assignment.branch}
                onChange={(e) => updateAssignments("branch", e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-4" controlId="branch">
            <Form.Label column sm="3" md="2">
              Code Review URL:
            </Form.Label>
            <Col sm="8" md="10" lg="6">
              <Form.Control
                type="text"
                placeholder="https://screencast-o-matic.com/something"
                value={assignment.codeReviewVideoUrl}
                onChange={(e) =>
                  updateAssignments("codeReviewVideoUrl", e.target.value)
                }
              />
            </Col>
          </Form.Group>

          <div className="d-flex gap-5">
            {assignment.status === "Completed" ? (
              <Button
                size="lg"
                onClick={() => handleSubmit(assignmentStatuses[2].status)}
              >
                Re-Claim
              </Button>
            ) : (
              <Button
                size="lg"
                variant="success"
                onClick={() => handleSubmit(assignmentStatuses[4].status)}
              >
                Complete Review
              </Button>
            )}

            {assignment.status === "Needs Update" ? (
              <Button
                size="lg"
                variant="warning"
                onClick={() => handleSubmit(assignmentStatuses[2].status)}
              >
                Re-Claim
              </Button>
            ) : (
              <Button
                size="lg"
                variant="danger"
                onClick={() => handleSubmit(assignmentStatuses[3].status)}
              >
                Reject
              </Button>
            )}
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              lg="6"
            >
              Back
            </Button>
          </div>
          <CommentContainer assignmentId={assignmentId} />
        </>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default CodeReviewerAssignmentView;

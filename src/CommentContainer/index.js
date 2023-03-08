import React, { useEffect, useState } from "react";
import ajax from "../Services/fetchService";
import Comment from "../Comment";
import dayjs from "dayjs";
import { Button } from "react-bootstrap";
import { useInterval } from "../Util/useInterval";

const CommentContainer = (props) => {
  const { assignmentId } = props;
  const jwt = localStorage.getItem("token");
  const emptyComment = {
    text: "",
    assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
    user: jwt,
    createdDate: null,
  };

  const [comment, setComment] = useState(emptyComment);
  const [comments, setComments] = useState([]);

  function handleDeleteComment(commentId) {
    ajax(`/api/comments/${commentId}`, "DELETE", jwt).then((msg) => {
      const commentsCopy = [...comments];
      const i = commentsCopy.findIndex((comment) => comment.id === commentId);
      commentsCopy.splice(i, 1);
      setComments(commentsCopy)
    });
  }

  useInterval(() => {
    updateCommentTimeDisplay();
  }, 1000 * 5);

  function updateCommentTimeDisplay() {
    const commentsCopy = [...comments];
    commentsCopy.forEach(
      (comment) => (comment.createdDate = dayjs(comment.createdDate))
    );
    setComments(commentsCopy);
  }

  function handleEditComment(commentId) {
    const i = comments.findIndex((comment) => comment.id === commentId);
    const commentCopy = {
      id: comments[i].id,
      text: comments[i].text,
      assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
      user: jwt,
      createdDate: comments[i].createdDate
    };
    setComment(commentCopy);
  }

  function updateComment(value) {
    const commentCopy = { ...comment };
    commentCopy.text = value;
    setComment(commentCopy);
  }

  function submitComment() {
    if (comment.id) {
      ajax(`/api/comments/${comment.id}`, "PUT", jwt, comment).then(
        (commentsData) => {
          const commmentsCopy = [...comments];
          const i = comments.findIndex(
            (comment) => comment.id === commentsData.id
          );
          commmentsCopy[i] = commentsData;
          setComments(commmentsCopy);
          setComment(emptyComment);
        }
      );
    } else {
      ajax("/api/comments", "POST", jwt, comment).then((commentsData) => {
        const commentsCopy = [...comments];
        commentsCopy.push(commentsData);

        setComments(commentsCopy);
        setComment(emptyComment);
      });
    }
  }

  useEffect(() => {
    ajax(`/api/comments?assignmentId=${assignmentId}`, "GET", jwt, null).then(
      (commentsData) => {
        setComments(commentsData);
      }
    );
  }, []);

  return (
    <>
      <div className="mt-5">
        <textarea
          style={{ width: "100%", borderRadius: "0.35em" }}
          onChange={(e) => updateComment(e.target.value)}
          value={comment.text}
        />
        <Button onClick={() => submitComment()}>Post Comment</Button>
      </div>
      <div className="mt-5">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            createdDate={comment.createdDate}
            createdBy={comment.createdBy}
            text={comment.text}
            id={comment.id}
            emitDeleteComment={handleDeleteComment}
            emitEditComment={handleEditComment}
          />
        ))}
      </div>
    </>
  );
};

export default CommentContainer;

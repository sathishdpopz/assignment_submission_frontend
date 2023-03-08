import dayjs from "dayjs";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";

const Comment = (props) => {
  const jwt = localStorage.getItem("token");
  const decodedJwt = jwt_decode(jwt);
  const {
    id,
    emitEditComment,
    createdDate,
    createdBy,
    text,
    emitDeleteComment,
  } = props;

  const [commentRelativeTime, setCommentRealtiveTime] = useState("");

  useEffect(() => {
    updateCommentRelativeTime();
  }, [createdDate]);

  function updateCommentRelativeTime() {
    if (createdDate) {
      dayjs.extend(relativeTime);
      setCommentRealtiveTime(dayjs(createdDate).fromNow());
    }
  }

  return (
    <>
      <div className="comment-bubble">
        <div className="d-flex gap-5" style={{ fontWeight: "bolder" }}>
          <div>{`${createdBy.name}`}</div>
          {decodedJwt.sub === createdBy.username ? (
            <>
              <div
                onClick={() => emitEditComment(id)}
                style={{ cursor: "pointer", color: "blue" }}
              >
                edit
              </div>
              <div
                onClick={() => emitDeleteComment(id)}
                style={{ cursor: "pointer", color: "red" }}
              >
                delete
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="mt-1">{text}</div>
      </div>
      <div
        style={{ marginTop: "-1.25em", marginLeft: "1.4em", fontSize: "12px" }}
      >
        {commentRelativeTime ? `posted ${commentRelativeTime}` : ""}
      </div>
    </>
  );
};

export default Comment;

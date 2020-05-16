import React from "react";

import { makeStyles } from "@material-ui/styles";

import ChatBubble from "./ChatBubble";

const useMessageStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: (props) => (props && props.left ? "row" : "row-reverse"),
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "10px",
    position: "relative",
  },
  dateContainer: {
    width: "100%",
    position: "relative",
    marginBottom: "60px",
  },
  dateBox: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px",
    backgroundColor: "#eee",
    fontWeight: 300,
    borderRadius: "10px",
  },
}));

const Message = ({
  children,
  left,
  right,
  name,
  time,
  color,
  textColor,
  avatar,
  date,
}) => {
  const isLeft = left || !right;
  const classes = useMessageStyles({ left: isLeft });

  return (
    <React.Fragment>
      {!date ? null : (
        <div
          className={classes.dateContainer}
          style={{ float: isLeft ? "left" : "right" }}
        >
          <div className={classes.dateBox}>{date.toDateString()}</div>
        </div>
      )}
      <div className={classes.root}>
        {/* {avatar} Not Needed */}
        <ChatBubble
          left={left}
          right={right}
          name={name}
          time={time}
          color={color}
          textColor={textColor}
        >
          {children}
        </ChatBubble>
      </div>
    </React.Fragment>
  );
};

export default Message;

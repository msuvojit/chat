import React from "react";

import { makeStyles } from "@material-ui/styles";

const useChatBubbleStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: (props) =>
            !(props && props.color)
                ? "white"
                : props.color === "primary" || props.color === "secondary"
                ? theme.palette[props.color][100]
                : props.color,
        color: (props) => (props && props.textColor ? props.textColor : "black"),
        maxWidth: "70%",
        padding: "15px",
        borderRadius: "15px",
        borderBottomLeftRadius: (props) => (props && props.left ? 0 : null),
        borderBottomRightRadius: (props) => (props && !props.left ? 0 : null),
    },
    info: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "7px",
    },
    title: {
        fontWeight: 500,
        marginRight: "50px",
        fontSize: "17px",
        color: (props) => (props && props.textColor ? props.textColor : "black"),
    },
    sub: {
        fontWeight: 300,
        fontSize: "14px",
        color: (props) => (props && props.textColor ? props.textColor : "black"),
    },
}));

const ChatBubble = ({ children, time, name, left, right, color, textColor }) => {
    const isLeft = left || !right;
    const classes = useChatBubbleStyles({ color: color, left: isLeft, textColor: textColor });

    return (
        <div className={classes.root}>
            <div className={classes.info}>
                <span className={classes.title}>{name}</span>
                <span className={classes.sub}>{time}</span>
            </div>
            {children}
        </div>
    );
};

export default ChatBubble;
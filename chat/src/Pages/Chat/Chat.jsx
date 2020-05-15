import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/styles";
import {
    Card,
    Paper,
    CardContent,
    TextField,
    Button,
    IconButton,
    FilledInput,
    InputAdornment,
    FormControl,
} from "@material-ui/core";

import MessageIcon from "@material-ui/icons/Message";
import AttachIcon from "@material-ui/icons/AttachFile";
import CameraIcon from "@material-ui/icons/CameraAlt";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import BackIcon from "@material-ui/icons/ArrowBack";
import SmileIcon from "@material-ui/icons/Mood";

import EmojiPicker from "emoji-picker-react";
import { useRef } from "react";


const useAvatarStyles = makeStyles((theme) => ({
    root: {
        width: (props) => (props.size ? props.size : "50px"),
        height: (props) => (props.size ? props.size : "50px"),
        margin: `calc(1/5 * ${(props) => (props.size ? props.size : "50px")})`,
        backgroundColor: "#ddd",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        borderRadius: "50%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        fontSize: `calc(4/5 * ${(props) => (props.size ? props.size : "50px")})`,
    },
}));

const Avatar = ({ avatar, size }) => {
    const classes = useAvatarStyles({ size: size });
    if (avatar.type === "text")
        return (
            <div className={classes.root} style={{ backgroundColor: avatar.color, color: avatar.textColor }}>
                {avatar.text}
            </div>
        );
    return <div className={classes.root} style={{ backgroundImage: `url(${avatar.img ? avatar.img : avatar})` }} />;
};

const useFileDisplayStyles = makeStyles((theme) => ({
    root: {
        border: "1px black solid",
        borderColor: (props) => (props && props.textColor ? props.textColor : "black"),
        borderRadius: "10px",
        padding: "15px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    icon: {
        color: (props) => (props && props.textColor && props.textColor !== "black" ? props.textColor : "#555"),
    },
    name: {
        color: (props) => (props && props.textColor && props.textColor !== "black" ? props.textColor : "#555"),
        marginRight: "10px",
    },
}));

const FileDisplay = ({ file, textColor }) => {
    if (typeof file !== "object") file = { name: file };

    const classes = useFileDisplayStyles({ textColor: textColor });
    return (
        <Button variant="outlined" className={classes.root}>
            <span className={classes.name}>{file.name}</span>
            <DownloadIcon className={classes.icon} />
        </Button>
    );
};

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
        marginBottom: "60px"
    },
    dateBox: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "12px",
        backgroundColor: "#eee",
        fontWeight: 300,
        borderRadius: "10px"
    }
}));

const Message = ({ children, left, right, name, time, color, textColor, avatar, date }) => {
    const isLeft = left || !right;
    const classes = useMessageStyles({ left: isLeft });

    return (
        <React.Fragment>
            { !date?null:
                <div className={ classes.dateContainer }>
                    <div className={ classes.dateBox }>{date.toDateString()}</div>
                </div>
            }
            <div className={classes.root}>
                {/* {avatar} */}
                <ChatBubble left={left} right={right} name={name} time={time} color={color} textColor={textColor}>
                    {children}
                </ChatBubble>
            </div>
        </React.Fragment>
    );
};

const avatar_dr = <Avatar size="32px" avatar={{ type: "text", text: "M", color: "purple", textColor: "white" }} />;
const avatar_andy = <Avatar size="32px" avatar={{ type: "text", text: "A", color: "#ddd", textColor: "black" }} />;

const mock_messages = [
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time: new Date(new Date().setDate(new Date().getDate()-2)),
        message:
            "Hello, Andy. I have your report ready for you. We have found that all the tests are negative. You're all good to go!",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time: new Date(new Date().setDate(new Date().getDate()-2)),
        type: "file",
        file: "report-andy-carnigie-final.pdf",
    },
    {
        self: false,
        avatar: avatar_andy,
        by: "Andy",
        time:  new Date(new Date().setDate(new Date().getDate()-2)),
        message: "Thank you so much, doc!",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time:  new Date(new Date().setDate(new Date().getDate()-2)),
        message: "Let's have a follow up on the coming monday?",
        type: "text",
    },
    {
        self: false,
        avatar: avatar_andy,
        by: "Andy",
        time:  new Date(new Date().setDate(new Date().getDate()-1)),
        message: "Sure thing. meet you then.",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time:  new Date(new Date().setDate(new Date().getDate()-1)),
        message:
            "Hello, Andy. I have your report ready for you. We have found that all the tests are negative. You're all good to go!",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time:  new Date(),
        type: "file",
        file: "report-andy-carnigie-final.pdf",
    },
    {
        self: false,
        avatar: avatar_andy,
        by: "Andy",
        time:  new Date(),
        message: "Thank you so much, doc!",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time:  new Date(),
        message: "Let's have a follow up on the coming monday?",
        type: "text",
    },
    {
        self: false,
        avatar: avatar_andy,
        by: "Andy",
        time:  new Date(),
        message: "Sure thing. meet you then.",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time: new Date(),
        message:
            "Hello, Andy. I have your report ready for you. We have found that all the tests are negative. You're all good to go!",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time: new Date(),
        type: "file",
        file: "report-andy-carnigie-final.pdf",
    },
    {
        self: false,
        avatar: avatar_andy,
        by: "Andy",
        time:  new Date(),
        message: "Thank you so much, doc!",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time:  new Date(),
        message: "Let's have a follow up on the coming monday?",
        type: "text",
    },
    {
        self: false,
        avatar: avatar_andy,
        by: "Andy",
        time:  new Date(),
        message: "Sure thing. meet you then.",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time:  new Date(),
        message:
            "Hello, Andy. I have your report ready for you. We have found that all the tests are negative. You're all good to go!",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time:  new Date(),
        type: "file",
        file: "report-andy-carnigie-final.pdf",
    },
    {
        self: false,
        avatar: avatar_andy,
        by: "Andy",
        time:  new Date(),
        message: "Thank you so much, doc!",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time:  new Date(),
        message: "Let's have a follow up on the coming monday?",
        type: "text",
    },
    {
        self: false,
        avatar: avatar_andy,
        by: "Andy",
        time:  new Date(),
        message: "Sure thing. meet you then.",
        type: "text",
    },
];

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary[50],
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    outerCard: {
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: "#eee",
    },
    cardActions: {
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    sendButton: {
        paddingTop: "auto",
        paddingBottom: "auto",
        margin: "10px",
        marginLeft: 0,
    },
    altButton: {
        paddingTop: "auto",
        paddingBottom: "auto",
        paddingLeft: "5px",
        paddingRight: "5px",
        margin: "10px",
        marginLeft: 0,
        minWidth: "0",
    },
    sendMessage: {
        "& .MuiFilledInput-input": {
            paddingTop: "10px",
        },
        margin: "10px",
    },
    messageCard: {
        backgroundColor: "#FCEBDC",
        overflowY: "auto",
        maxHeight: "80vh",
    },
    title: {
        fontSize: "16px",
        marginLeft: "5px",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        color: "#777",
        padding: "10px",
    },
    grow: {
        flexGrow: "1",
    },
    restart: {
        marginRight: "50px",
    },
    emojiContainer: {
        position: "relative",
        '& .emoji-picker-react':{
            position: "absolute",
            bottom: 0,
            right: 0

        }
    }
}));

export default function Chat() {
    const classes = useStyles();
    const [messages, setMessages] = useState(mock_messages);
    const addMessage = (_message) => setMessages((messages) => [...messages, _message]);
    const [message, setMessage] = useState("");
    const addToMessage = (emoji) => setMessage((message) => message + emoji);
    const [showEmoji, setShowEmoji] = useState(false);
    const emojiRef = useRef();
    const closeEmojiBox = (e)=>{
        if(!showEmoji) return;
        if(!emojiRef || !emojiRef.current || !emojiRef.current.contains(e.target)) setShowEmoji(false);
    }
    useEffect(
        ()=>{
            document.addEventListener("click", closeEmojiBox);
            return ()=>{
                document.removeEventListener("click", closeEmojiBox);
            }
        }, [showEmoji]
    )
    return (
        <div className={classes.root}>
            <Paper className={classes.outerCard}>
                <div className={classes.header}>
                    <IconButton onClick={() => {}}>
                        <BackIcon />
                    </IconButton>
                    {avatar_andy}
                    <span className={classes.title}>Andy</span>
                    <div className={classes.grow} />
                    <Button variant="contained" color="secondary" className={classes.restart}>
                    Restart Chat
                    </Button>
                    <IconButton>
                        <CloseIcon />
                    </IconButton>
                </div>
                <Card className={classes.messageCard}>
                    <CardContent>
                        {messages.map((message, i) => (
                            <Message
                                key={i}
                                date = {i>0?messages[i-1].time.toUTCString() === message.time.toUTCString()?null:message.time:message.time}
                                left={!message.self}
                                right={message.self}
                                name={message.by}
                                time={message.time.getHours()>12?(`${message.time.getHours()-12}:${message.time.getMinutes()} PM`):(`${message.time.getHours()}:${message.time.getMinutes()} AM`)}
                                avatar={message.avatar}
                                color={message.self ? "primary" : null}
                                textColor={"black"}
                            >
                                {message.type === "text" ? (
                                    message.message
                                ) : (
                                    <FileDisplay file={message.file} textColor={"black"} />
                                )}
                            </Message>
                        ))}
                    </CardContent>
                </Card>
                {showEmoji ? <div className={classes.emojiContainer}  ref={emojiRef}><EmojiPicker className={classes.emojiPicker} onEmojiClick={(e, emoji) => addToMessage(emoji.emoji)} /></div> : null}
                <form
                    className={classes.cardActions}
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (message.length === 0) return;
                        const date = new Date();
                        let hours = date.getHours();
                        const minutes = date.getMinutes();
                        let PM = false;
                        if (hours > 12) {
                            PM = true;
                            hours -= 12;
                        }
                        const time = `${hours}:${minutes} ${PM ? "PM" : "AM"}`;
                        addMessage({
                            by: "Dr McDonald",
                            self: true,
                            avatar: avatar_dr,
                            time: time,
                            type: "text",
                            message: message,
                        });
                        setMessage("");
                    }}
                >
                    {/* <TextField className={classes.sendMessage} value={message} onChange={({target: {value}})=>setMessage(value)} fullWidth variant="filled" placeholder="Message" /> */}
                    <FormControl fullWidth variant="filled">
                        <FilledInput
                            type="text"
                            className={classes.sendMessage}
                            value={message}
                            onChange={({ target: { value } }) => setMessage(value)}
                            placeholder="Message"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => {setShowEmoji(c=>!c)}}>
                                        <SmileIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <Button className={classes.altButton} color="primary" variant="outlined">
                        <AttachIcon />
                    </Button>
                    <Button className={classes.altButton} color="primary" variant="outlined">
                        <CameraIcon />
                    </Button>
                    <Button className={classes.sendButton} color="primary" variant="contained" type="submit">
                        Send
                    </Button>
                </form>
            </Paper>
        </div>
    );
}

import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/styles";
import {
    Card,
    Paper,
    CardContent,
    Button,
    IconButton,
    FilledInput,
    InputAdornment,
    FormControl,
} from "@material-ui/core";

import AttachIcon from "@material-ui/icons/AttachFile";
import CameraIcon from "@material-ui/icons/CameraAlt";
import CloseIcon from "@material-ui/icons/Close";
import BackIcon from "@material-ui/icons/ArrowBack";
import SmileIcon from "@material-ui/icons/Mood";

import EmojiPicker from "emoji-picker-react";
import { useRef } from "react";

import {mock_messages, avatar_andy, avatar_dr} from './mock_data';
import Message from './Message';
import FileDisplay from './FileDisplay';

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
})); // Defines Styles with MaterialUI Styling

export default function Chat() {
    const classes = useStyles(); // CSS Styling

    const [messages, setMessages] = useState(mock_messages); //Holds the state of the current set of displayed messages
    const addMessage = (_message) => setMessages((messages) => [...messages, _message]);

    const [message, setMessage] = useState(""); // Holds the state of the message currently being typed
    const addToMessage = (emoji) => setMessage((message) => message + emoji);

    // Handles Custom Emoji Functionality
    const [showEmoji, setShowEmoji] = useState(false); // Whether the emoji popup is shown
    const emojiRef = useRef(); // Ref to the emoji popup

    const closeEmojiBox = (e)=>{ // Close emoji box if click outside
        if(!showEmoji) return;
        if(!emojiRef || !emojiRef.current || !emojiRef.current.contains(e.target)) setShowEmoji(false);
    }

    useEffect( // Add and remove the emoji box close listener.
        ()=>{
            if(!showEmoji) return; // No need for listener if box isn't open.
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

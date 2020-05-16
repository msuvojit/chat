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
import axios from "axios";
import MessageIcon from "@material-ui/icons/Message";
import AttachIcon from "@material-ui/icons/AttachFile";
import CameraIcon from "@material-ui/icons/CameraAlt";
import CloseIcon from "@material-ui/icons/Close";
import BackIcon from "@material-ui/icons/ArrowBack";
import SmileIcon from "@material-ui/icons/Mood";
import DownloadIcon from "@material-ui/icons/CloudDownload";

import green from "@material-ui/core/colors/green";
import sec from "@material-ui/core/colors/blueGrey";
import firebase from "firebase";
import Moment from "react-moment";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";

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
      <div
        style={styles.root}
        style={{ backgroundColor: avatar.color, color: avatar.textColor }}
      >
        {avatar.text}
      </div>
    );
  return (
    <div
      style={styles.root}
      style={{ backgroundImage: `url(${avatar.img ? avatar.img : avatar})` }}
    />
  );
};

const useFileDisplayStyles = makeStyles((theme) => ({
  root: {
    border: "1px black solid",
    borderColor: (props) =>
      props && props.textColor ? props.textColor : "black",
    borderRadius: "10px",
    padding: "15px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  icon: {
    color: (props) =>
      props && props.textColor && props.textColor !== "black"
        ? props.textColor
        : "#555",
  },
  name: {
    color: (props) =>
      props && props.textColor && props.textColor !== "black"
        ? props.textColor
        : "#555",
    marginRight: "10px",
  },
}));

const FileDisplay = ({ file, textColor }) => {
  if (typeof file !== "object") file = { name: file };

  const classes = useFileDisplayStyles({ textColor: textColor });
  return (
    <Button variant="outlined" style={styles.root}>
      <span style={styles.name}>{file.name}</span>
      <DownloadIcon style={styles.icon} />
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

const ChatBubble = ({
  children,
  time,
  name,
  left,
  right,
  color,
  textColor,
}) => {
  const isLeft = left || !right;
  const classes = useChatBubbleStyles({
    color: color,
    left: isLeft,
    textColor: textColor,
  });

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
        <div style={styles.dateContainer}>
          <div style={styles.dateBox}>
            <Moment format="hh:mm">{moment(date, "hh:mm a")}</Moment>
          </div>
        </div>
      )}
      <div style={styles.root}>
        {/* {avatar} */}
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

const avatar_dr = (
  <Avatar
    size="32px"
    avatar={{ type: "text", text: "M", color: "purple", textColor: "white" }}
  />
);
const avatar_andy = (
  <Avatar
    size="32px"
    avatar={{ type: "text", text: "A", color: "#ddd", textColor: "black" }}
  />
);

const styles = {
  root: {
    backgroundColor: green,
    width: "98vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  messages: {
    minHeight: "60vh",
    maxHeight: "70vh",
    overflowY: "scroll",
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
    "& .emoji-picker-react": {
      position: "absolute",
      bottom: 0,
      right: 0,
    },
  },
};

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messages: [],
      showEmoji: false,
      uid: "",
      channel: "",
      token: "",
    };
  }
  // const [messages, setMessages] = useState([]);
  // const [message, setMessage] = useState("");
  // const addToMessage = (emoji) => setMessage((message) => message + emoji);
  // const [showEmoji, setShowEmoji] = useState(false);
  // const emojiRef = useRef();
  // const closeEmojiBox = (e) => {
  //   if (!showEmoji) return;
  //   if (!emojiRef || !emojiRef.current || !emojiRef.current.contains(e.target))
  //     setShowEmoji(false);
  // };
  // const [uid, setUid] = useState("");
  // const [channel, setChannel] = useState("");
  // const [token, setToken] = useState("");

  scrollToBottom = () => {
    var objDiv = document.getElementById("chatList");
    // if (objDiv)
    console.log({ objDiv });
    objDiv.scrollTop = objDiv.scrollHeight - objDiv.clientHeight;
  };

  loadMessages = () => {
    // Create the query to load the last 12 messages and listen for new ones.
    console.log("loadMessages", this.state.channel);
    var query = firebase
      .firestore()
      .collection("messages")
      .where("room", "==", this.state.channel)
      .orderBy("timestamp", "asc")
      .limit(40);
    var data = [];
    // Start listening to the query.
    query.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          //   deleteMessage(change.doc.id);
        } else {
          var message = change.doc.data();
          message.timestamp && data.push(message);
          console.log(message.timestamp && message.timestamp.toDate());
        }
      });

      this.setState({ messages: data }, () => this.scrollToBottom());
    });
  };

  getDetails = async () => {
    try {
      var token = this.props.match.params.token;
      console.log({ token });
      var result = await axios.post(
        "https://notification.opdlift.com/api/agora/meeting-details",
        { token }
      );

      this.setState(
        {
          uid: result.data.uid,
          channel: result.data.channel,
          token: result.data.token,
        },
        () => this.loadMessages()
      );
      console.log(result.data);
    } catch (err) {
      console.log("err", err.response);
    }
  };

  saveMessage = (messageText) => {
    this.setState({ message: "" });
    firebase
      .firestore()
      .collection("messages")
      .add({
        room: this.state.channel,
        sentBy: this.state.uid,
        text: messageText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .catch(function (error) {
        console.error("Error writing new message to database", error);
      });
  };

  // Saves the messaging device token to the datastore.
  saveMessagingDeviceToken = () => {
    firebase
      .messaging()
      .getToken()
      .then(function (currentToken) {
        if (currentToken) {
          console.log("Got FCM device token:", currentToken);
          // Saving the Device Token to the datastore.
          firebase
            .firestore()
            .collection("fcmTokens")
            .doc(currentToken)
            .set({ uid: firebase.auth().currentUser.uid });
        } else {
          // Need to request permissions to show notifications.
          this.requestNotificationsPermissions();
        }
      })
      .catch(function (error) {
        console.error("Unable to get messaging token.", error);
      });
  };

  // Requests permissions to show notifications.
  requestNotificationsPermissions = () => {
    console.log("Requesting notifications permission...");
    firebase
      .messaging()
      .requestPermission()
      .then(function () {
        // Notification permission granted.
        this.saveMessagingDeviceToken();
      })
      .catch(function (error) {
        console.error("Unable to get permission to notify.", error);
      });
  };

  componentDidMount() {
    this.getDetails();
    this.requestNotificationsPermissions();
  }

  render() {
    return (
      <div style={styles.root}>
        <Paper style={styles.outerCard}>
          <div style={styles.header}>
            <IconButton onClick={() => {}}>
              <BackIcon />
            </IconButton>
            {avatar_andy}
            <span style={styles.title}>Andy</span>
            <div style={styles.grow} />
            <Button
              variant="contained"
              color="secondary"
              style={styles.restart}
            >
              Restart Chat
            </Button>
            <IconButton>
              <CloseIcon />
            </IconButton>
          </div>
          <Card style={styles.messageCard}>
            <CardContent>
              <div id="chatList" style={styles.messages}>
                {this.state.messages.map((data, index) => (
                  <Message
                    key={index}
                    // date={data.timestamp.toDate()}
                    left={!data.sentBy === this.state.uid}
                    right={data.sentBy === this.state.uid}
                    // name={message.by}
                    // time={data.timestamp}
                    avatar={data.avatar}
                    color={data.sentBy === this.state.uid ? "primary" : null}
                    textColor={"black"}
                  >
                    {data.text ? (
                      data.text
                    ) : (
                      <FileDisplay file={data.file} textColor={"black"} />
                    )}
                  </Message>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* {this.state.showEmoji ? (
            <div style={styles.emojiContainer} ref={emojiRef}>
              <EmojiPicker
                style={styles.emojiPicker}
                onEmojiClick={(e, emoji) => addToMessage(emoji.emoji)}
              />
            </div>
          ) : null} */}
          <div
            style={styles.cardActions}
            // onSubmit={(e) => {
            //   e.preventDefault();
            //   loadMessages();
            //   if (message.length === 0) return;

            //   saveMessage(message);
            // }}
          >
            {/* <TextField style={styles.sendMessage} value={message} onChange={({target: {value}})=>setMessage(value)} fullWidth variant="filled" placeholder="Message" /> */}
            <FormControl fullWidth variant="filled">
              <FilledInput
                type="text"
                style={styles.sendMessage}
                value={this.state.message}
                onChange={({ target: { value } }) =>
                  this.setState({ message: value })
                }
                placeholder="Message"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        this.setState({ showEmoji: !this.state.showEmoji });
                      }}
                    >
                      <SmileIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button style={styles.altButton} color="primary" variant="outlined">
              <AttachIcon />
            </Button>
            <Button style={styles.altButton} color="primary" variant="outlined">
              <CameraIcon />
            </Button>
            <Button
              style={styles.sendButton}
              color="primary"
              variant="contained"
              type="submit"
              onClick={() => {
                if (this.state.message.length === 0) return;
                this.saveMessage(this.state.message);
              }}
            >
              Send
            </Button>
          </div>
        </Paper>
      </div>
    );
  }
}

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

import RestoreIcon from "@material-ui/icons/Restore";

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
        className={classes.root}
        style={{ backgroundColor: avatar.color, color: avatar.textColor }}
      >
        {avatar.text}
      </div>
    );
  return (
    <div
      className={classes.root}
      style={{ backgroundImage: `url(${avatar.img ? avatar.img : avatar})` }}
    />
  );
};

const useFileDisplayStyles = makeStyles((theme) => ({
  root: {
    border: "1px black solid",
    maxWidth: "100%",
    borderColor: (props) =>
      props && props.textColor ? props.textColor : "black",
    borderRadius: "5px",
    padding: "10px",
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
    marginRight: "0",
    height: "22px",
    // maxWidth: "80%",
    overflow: "hidden",
    wordBreak: "break-all",
    textOverflow: "ellipses",
  },
}));

const downloadFile = ({ filePath }) => {
  window.location.href = filePath;
};

const FileDisplay = ({ file, textColor }) => {
  if (typeof file !== "object") file = { name: file };

  const classes = useFileDisplayStyles({ textColor: textColor });
  return (
    <Button variant="outlined" className={classes.root}>
      {/* <div className={classes.name}>{file.name}</div> */}
      <div className={classes.name}>
        <a href={file.name} download target="_blank" rel="noopener noreferrer">
          <img src={"/assets/images/attach.svg"} alt="attachment" height="22" />
        </a>
        {/* <p>{file.name}</p> */}
      </div>
      {/* <DownloadIcon className={classes.icon} /> */}
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
    float: (props) => (props && props.left ? null : "right"),
    "overflow-wrap": "break-word",
    width: "fit-content",
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
    "overflow-wrap": "break-word",
  });

  return (
    <div className={classes.root}>
      {/* <div className={classes.info}>
        <div className={classes.title}>{name}</div>
        <div className={classes.sub}>{time}</div>
      </div> */}
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
  msgWrap: {
    width: "100%",
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
        <div className={classes.dateContainer}>
          <div className={classes.dateBox}>
            <Moment format="hh:mm">{moment(date, "hh:mm a")}</Moment>
          </div>
        </div>
      )}
      <div className={classes.root}>
        <div className={classes.msgWrap}>
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

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary[50],
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
  },
  "@media screen and (min-width: 738px)": {
    root: {
      alignItems: "center",
    },
  },
  outerCard: {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: "80vh",
    minWidth: "50vw",
    maxHeight: "100vh",
    backgroundColor: "#eee",
    display: "flex",
    flexDirection: "column",
  },
  cardActions: {
    flexShrink: "1",
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    color: "white",
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
    flexGrow: "1",
    minHeight: "80%",
    // maxHeight: "90vh",
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
    marginRight: "20px",
  },
  emojiContainer: {
    position: "relative",
    "& .emoji-picker-react": {
      position: "absolute",
      bottom: 0,
      right: 0,
    },
  },
})); // Defines Styles with MaterialUI Styling
var LOADING_IMAGE_URL = "https://www.google.com/images/spin-32.gif?a";

const ChatUI = ({
  uid,
  messages,
  showEmoji,
  message,
  setState,
  saveImageMessage,
  saveMessage,
  smallToken,
  meetingDetails
}) => {
  const styles = useStyles();

  let chatName = "";

  if (smallToken === meetingDetails.dSmallToken) {
    chatName = meetingDetails.patientName;
  } else if (smallToken === meetingDetails.pSmallToken) {
    chatName = meetingDetails.doctorName;
  }

  let firstCharChatName = chatName.charAt(0) && chatName.charAt(0).toUpperCase();

  console.log("-----------------");
  console.log({firstCharChatName});
  console.log("-----------------");

  return (
    <div className={styles.root}>
      <Paper className={styles.outerCard}>
        <div className={styles.header}>
          {/* <IconButton onClick={() => {}}>
            <BackIcon />
          </IconButton> */}
          {/* {avatar_andy} */}

          <Avatar
            size="32px"
            avatar={{
              type: "text",
              text: firstCharChatName,
              color: "#ddd",
              textColor: "black",
            }}
          />
          <div className={styles.title}>{chatName}</div>

          <div className={styles.grow} />
          <Button
            variant="contained"
            color="secondary"
            className={styles.restart}
          >
            <RestoreIcon />
          </Button>
          {/* <IconButton>
            <CloseIcon />
          </IconButton> */}
        </div>
        <Card className={styles.messageCard}>
          <CardContent>
            <div id="chatList" className={styles.messages}>
              {messages.map((data, index) => (
                <Message
                  key={index}
                  // date={data.timestamp.toDate()}
                  left={!data.sentBy === uid}
                  right={data.sentBy === uid}
                  // name={message.by}
                  // time={data.timestamp}
                  avatar={data.avatar}
                  color={data.sentBy === uid ? "primary" : null}
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
        {/* {showEmoji ? (
            <div className={styles.emojiContainer} ref={emojiRef}>
              <EmojiPicker
                className={styles.emojiPicker}
                onEmojiClick={(e, emoji) => addToMessage(emoji.emoji)}
              />
            </div>
          ) : null} */}
        <div
          className={styles.cardActions}
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   loadMessages();
          //   if (message.length === 0) return;

          //   saveMessage(message);
          // }}
        >
          {/* <TextField className={styles.sendMessage} value={message} onChange={({target: {value}})=>setMessage(value)} fullWidth variant="filled" placeholder="Message" /> */}
          <FormControl fullWidth variant="filled">
            <FilledInput
              type="text"
              className={styles.sendMessage}
              value={message}
              onChange={({ target: { value } }) => setState({ message: value })}
              placeholder="Message"
              // endAdornment={
              //   <InputAdornment position="end">
              //     <IconButton
              //       size="small"
              //       onClick={() => {
              //         setState({ showEmoji: !showEmoji });
              //       }}
              //     >
              //       <SmileIcon />
              //     </IconButton>
              //   </InputAdornment>
              // }
            />
          </FormControl>
          <Button
            className={styles.altButton}
            color="primary"
            variant="outlined"
            onClick={() => document.getElementById("file-upload").click()}
          >
            <AttachIcon />
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple={false}
            style={{ display: "none" }}
            onChange={(e) => saveImageMessage(e.target.files[0])}
          />
          {/* <Button className={styles.altButton} color="primary" variant="outlined">
              <CameraIcon />
            </Button> */}
          <Button
            className={styles.sendButton}
            color="primary"
            variant="contained"
            type="submit"
            onClick={() => {
              if (message.length === 0) return;
              saveMessage(message);
            }}
          >
            Send
          </Button>
        </div>
      </Paper>
    </div>
  );
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
      smallToken: "",
      meetingDetails: "",
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
          // console.log(message.timestamp && message.timestamp.toDate());
        }
      });

      console.log(data.length);
      this.setState({ messages: data }, () => this.scrollToBottom());
    });
  };

  getDetails = async () => {
    try {
      var token = this.props.match.params.token;
      // console.log({ token });
      var result = await axios.post(
        "https://notification.opdlift.com/api/agora/meeting-details",
        // "http://localhost:5001/api/agora/meeting-details",
        { token }
      );

      this.setState(
        {
          uid: result.data.uid,
          channel: result.data.channel,
          token: result.data.token,
          smallToken: result.data.smallToken,
          meetingDetails: result.data.meetingDetails,
        },
        () => this.loadMessages()
      );
      console.log(result.data);
    } catch (err) {
      console.log("err", err.response);
    }
  };

  saveImageMessage(file) {
    // 1 - We add a message with a loading icon that will get updated with the shared image.
    console.log(file);

    console.log("inside save image message");
    console.log(this.state);
    console.log("inside save image message");

    firebase
      .firestore()
      .collection("messages")
      .add({
        room: this.state.channel,
        sentBy: this.state.uid,
        file: LOADING_IMAGE_URL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((messageRef) => {
        // 2 - Upload the image to Cloud Storage.
        var filePath = "files/" + this.state.uid + "/" + file.name;

        return firebase
          .storage()
          .ref(filePath)
          .put(file)
          .then((fileSnapshot) => {
            // 3 - Generate a public URL for the file.
            return fileSnapshot.ref.getDownloadURL().then((url) => {
              // 4 - Update the chat message placeholder with the image's URL.
              return messageRef
                .update({
                  file: url,
                })
                .then(this.loadMessages());
            });
          });
      })
      .catch(function (error) {
        console.error(
          "There was an error uploading a file to Cloud Storage:",
          error
        );
      });
  }

  saveMessage = (messageText) => {
    this.setState({ message: "" });

    console.log("saveMessage");

    console.log({ messageText });

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
      <ChatUI
        uid={this.state.uid}
        messages={this.state.messages}
        smallToken={this.state.smallToken}
        meetingDetails={this.state.meetingDetails}
        showEmoji={this.state.showEmoji}
        message={this.state.message}
        setState={this.setState.bind(this)}
        saveImageMessage={this.saveImageMessage.bind(this)}
        saveMessage={this.saveMessage.bind(this)}
      />
    );
  }
}

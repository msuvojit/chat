import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
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
  Tooltip,
} from '@material-ui/core';
import axios from 'axios';
import MessageIcon from '@material-ui/icons/Message';
import AttachIcon from '@material-ui/icons/AttachFile';
import CameraIcon from '@material-ui/icons/CameraAlt';
import CloseIcon from '@material-ui/icons/Close';
import BackIcon from '@material-ui/icons/ArrowBack';
import SmileIcon from '@material-ui/icons/Mood';
import DownloadIcon from '@material-ui/icons/CloudDownload';

import green from '@material-ui/core/colors/green';
import sec from '@material-ui/core/colors/blueGrey';
// import firebase from "firebase";
import Moment from 'react-moment';
import moment from 'moment';
import EmojiPicker from 'emoji-picker-react';
import io from 'socket.io-client';

import RestoreIcon from '@material-ui/icons/Restore';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import htmlToImage from 'html-to-image';

const useAvatarStyles = makeStyles((theme) => ({
  root: {
    width: (props) => (props.size ? props.size : '50px'),
    height: (props) => (props.size ? props.size : '50px'),
    margin: `calc(1/5 * ${(props) => (props.size ? props.size : '50px')})`,
    backgroundColor: '#ddd',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: `calc(4/5 * ${(props) => (props.size ? props.size : '50px')})`,
  },
}));

const Avatar = ({ avatar, size }) => {
  const classes = useAvatarStyles({ size: size });
  if (avatar.type === 'text')
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
    border: '1px black solid',
    maxWidth: '100%',
    borderColor: (props) =>
      props && props.textColor ? props.textColor : 'black',
    borderRadius: '5px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icon: {
    color: (props) =>
      props && props.textColor && props.textColor !== 'black'
        ? props.textColor
        : '#555',
  },
  name: {
    color: (props) =>
      props && props.textColor && props.textColor !== 'black'
        ? props.textColor
        : '#555',
    marginRight: '0',
    height: '22px',
    // maxWidth: "80%",
    overflow: 'hidden',
    wordBreak: 'break-all',
    textOverflow: 'ellipses',
  },
}));

const downloadFile = ({ filePath }) => {
  window.location.href = filePath;
};

const FileDisplay = ({ file, textColor, name }) => {
  if (typeof file !== 'object') file = { file: file, name: name || file };

  const classes = useFileDisplayStyles({ textColor: textColor });
  const ns = file.name ? file.name.split('/') : '';
  let file_name = name
    ? name
    : ns.length > 0
    ? ns[ns.length - 1]
    : 'Uploading...';
  file_name =
    file_name.length > 33 ? file_name.substring(0, 30) + '...' : file_name;
  return (
    <Button
      variant="outlined"
      className={classes.root}
      component="a"
      href={file.file || ''}
      download
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={classes.name}>{file_name}</div>
      <DownloadIcon className={classes.icon} />
    </Button>
  );
};

// const FileDisplay = ({ file, textColor }) => {
//   if (typeof file !== "object") file = { name: file };

//   const classes = useFileDisplayStyles({ textColor: textColor });
//   return (
//     <Button variant="outlined" className={classes.root}>
//       {/* <div className={classes.name}>{file.name}</div> */}
//       <div className={classes.name}>
//         <a href={file.name} download target="_blank" rel="noopener noreferrer">
//           <img src={"/assets/images/attach.svg"} alt="attachment" height="22" />
//         </a>
//         {/* <p>{file.name}</p> */}
//       </div>
//       {/* <DownloadIcon className={classes.icon} /> */}
//     </Button>
//   );
// };

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

const useChatBubbleStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: (props) =>
      !(props && props.color)
        ? 'white'
        : props.color === 'primary' || props.color === 'secondary'
        ? theme.palette[props.color][100]
        : props.color,
    color: (props) => (props && props.textColor ? props.textColor : 'black'),
    maxWidth: '70%',
    padding: '15px',
    borderRadius: '15px',
    borderBottomLeftRadius: (props) => (props && props.left ? 0 : null),
    borderBottomRightRadius: (props) => (props && !props.left ? 0 : null),
    float: (props) => (props && props.left ? null : 'right'),
    'overflow-wrap': 'break-word',
    width: 'fit-content',
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: '7px',
  },
  title: {
    fontWeight: 500,
    marginRight: '50px',
    fontSize: '17px',
    color: (props) => (props && props.textColor ? props.textColor : 'black'),
  },
  sub: {
    fontWeight: 300,
    fontSize: '14px',
    color: (props) => (props && props.textColor ? props.textColor : 'black'),
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
    'overflow-wrap': 'break-word',
  });

  return (
    <div className={classes.root}>
      {children}
      {!time ? null : (
        <div className={classes.info}>
          {/* <div className={classes.title}>{name}</div> */}
          <div className={classes.sub}>{formatAMPM(time)}</div>
        </div>
      )}
    </div>
  );
};

const getDateStr = (date) => {
  const date_t = new Date(date);
  // console.log("DATE: ", date, date_t);
  return date_t.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  // const date_p = date.split('T')[0].split('-');
  // const day = date_p[2];
  // const month = date_p[1];
  // const year = date_p[0];
  // return `${day}/${month}/${year}`;
};

const useMessageStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: (props) => (props && props.left ? 'row' : 'row-reverse'),
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: '10px',
    position: 'relative',
  },
  dateContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: '60px',
  },
  dateBox: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px',
    backgroundColor: '#eee',
    fontWeight: 300,
    borderRadius: '10px',
  },
  msgWrap: {
    width: '100%',
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
            {date.toString()}
            {/* <Moment format="hh:mm">{moment(date, "hh:mm a")}</Moment> */}
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
    avatar={{ type: 'text', text: 'M', color: 'purple', textColor: 'white' }}
  />
);
const avatar_andy = (
  <Avatar
    size="32px"
    avatar={{ type: 'text', text: 'A', color: '#ddd', textColor: 'black' }}
  />
);

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary[50],
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  '@media screen and (min-width: 738px)': {
    root: {
      alignItems: 'center',
    },
  },
  outerCard: {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: '80vh',
    minWidth: '50vw',
    maxHeight: '100vh',
    backgroundColor: '#eee',
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
  },
  cardActions: {
    flexShrink: '1',
    display: 'flex',
    width: '100%',
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    color: 'white',
    paddingTop: 'auto',
    paddingBottom: 'auto',
    margin: '10px',
    marginLeft: 0,
  },
  altButton: {
    paddingTop: 'auto',
    paddingBottom: 'auto',
    paddingLeft: '5px',
    paddingRight: '5px',
    margin: '10px',
    marginLeft: 0,
    minWidth: '0',
  },
  sendMessage: {
    '& .MuiFilledInput-input': {
      paddingTop: '10px',
    },
    margin: '10px',
  },
  messageCard: {
    backgroundColor: '#FCEBDC',
    overflowY: 'auto',
    flexGrow: '1',
    minHeight: '75%',
    // maxHeight: "90vh",
  },
  title: {
    fontSize: '16px',
    marginLeft: '5px',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: '#777',
    padding: '10px',
    backgroundColor: '#eee',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    'z-index': 99999,
  },
  grow: {
    flexGrow: '1',
  },
  restart: {
    marginRight: '20px',
  },
  emojiContainer: {
    position: 'relative',
    '& .emoji-picker-react': {
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
  },
})); // Defines Styles with MaterialUI Styling
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

const ChatUI = ({
  uid,
  messages,
  showEmoji,
  message,
  setState,
  saveImageMessage,
  saveMessage,
  smallToken,
  meetingDetails,
}) => {
  const styles = useStyles();

  let chatName = '';

  if (smallToken === meetingDetails.dSmallToken) {
    chatName = meetingDetails.patientName;
  } else if (smallToken === meetingDetails.pSmallToken) {
    chatName = meetingDetails.doctorName;
  }

  let firstCharChatName =
    chatName.charAt(0) && chatName.charAt(0).toUpperCase();

  // console.log('-----------------');
  // console.log({ firstCharChatName });
  // console.log('-----------------');

  const [open, setOpen] = useState(false);
  const [symp, setSymp] = useState("");
  const [hist, setHist] = useState("");
  const [medi, setMedi] = useState("");
  const [test, setTest] = useState("");
  const [followUp, setFollowUp] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  
  const handleClickOpen = () => {
    setSymp("");
    setHist("");
    setMedi("");
    setTest("");
    setFollowUp("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const prevClose = () => {
    setSymp("");
    setHist("");
    setMedi("");
    setTest("");
    setFollowUp("");
    setPreviewOpen(false);
  };

  const preview = () => {
    setOpen(false);
    setPreviewOpen(true);
  }

  const sendRx= (e) => {
    e.preventDefault();
    console.log(symp);
    console.log(hist);
    console.log(medi);
    console.log(test);
    setSymp("");
    setHist("");
    setMedi("");
    setTest("");
    setFollowUp("");
    setPreviewOpen(false);
  };

  const handleEdit = () => {
    setPreviewOpen(false);
    setOpen(true);
  };

  const base64ToFile = (dataurl, filename) => {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}

// var file = dataURLtoFile('data:text/plain;base64,aGVsbG8gd29ybGQ=','hello.txt');
// console.log(file);

  const printdoc = () =>  {
    htmlToImage.toPng(document.getElementById('pres'))
  .then(function (dataUrl) {
    var link = document.createElement('a');
    link.download = 'prescription.png';
    link.href = dataUrl;
    link.click();
    // console.log(link.href);
    const fileUpload = base64ToFile(link.href, 'prescription.png');
    saveImageMessage(fileUpload);
  });
  
  setPreviewOpen(false);
  }

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
              type: 'text',
              text: firstCharChatName,
              color: '#ddd',
              textColor: 'black',
            }}
          />
          <div className={styles.title}>{chatName}</div>

          <div className={styles.grow} />

          {/* <Button
            variant="contained"
            color="secondary"
            className={styles.restart}
          >
            <RestoreIcon />
          </Button> */}

          {/* <IconButton>
            <CloseIcon />
          </IconButton> */}
        </div>
        <Card className={styles.messageCard}>
          <CardContent>
            <div
              id="chatList"
              className={styles.messages}
              style={{ paddingBottom: '50px', paddingTop: '50px' }}
            >
              {messages.map((data, index) => {
                const today = getDateStr(data.createdAt);
                const yday =
                  index > 0 && getDateStr(messages[index - 1].createdAt);
                // console.log('Today Raw', data.createdAt);
                // console.log(
                //   'Yday Raw',
                //   index > 0 && messages[index - 1].createdAt
                // );
                // console.log('Today', today);
                // console.log('YDay', yday);
                // console.log('Eq', today == yday);
                // console.log('Eq Eq', today === yday);
                return (
                  <Message
                    key={index}
                    // time={ new Date(data.createdAt) }
                    date={index > 0 && today === yday ? null : today}
                    left={!(data.sentBy === uid) && !data.sending}
                    right={data.sentBy === uid || data.sending}
                    name={data.name}
                    // time={data.timestamp}
                    avatar={data.avatar}
                    color={
                      data.sending
                        ? '#ffe3e3'
                        : data.sentBy === uid
                        ? 'primary'
                        : null
                    }
                    textColor={'black'}
                  >
                    {!data.file ? (
                      data.text
                    ) : (
                      <FileDisplay
                        name={data.text}
                        file={data.file}
                        textColor={'black'}
                      />
                    )}
                  </Message>
                );
              })}
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
          style={{ position: 'fixed', bottom: 0 }}
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
              onKeyDown={(e) => {
                console.log(e.key);
                if (e.key === 'Enter') {
                  if (message.length === 0) return;
                  saveMessage(message);
                }
              }}
              onChange={({ target: { value } }) => setState({ message: value })}
              placeholder="Type a message"
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
          <Tooltip title="Click To Open Rx">
            <Button
              className={styles.altButton}
              color="primary"
              variant="outlined"
              onClick={handleClickOpen}
            >
              Rx
            </Button>
          </Tooltip>
          <div>
            <Dialog open={open} onClose={handleClose} should>
              <DialogTitle id="form-dialog-title" style={{textAlign:'center'}}>Prescription</DialogTitle>
              <DialogContent dividers>
                <DialogContentText>
                  Please fill the details to make a prescription and send it directly in the chat as an attachment.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="symptoms"
                  label="Enter Symptoms"
                  type="text"
                  name="symptoms"
                  fullWidth
                  value={symp}
                  onChange={(e) => {setSymp(e.target.value)}}
                />
                <TextField
                  margin="dense"
                  id="Medical History"
                  label="Enter Medical History"
                  type="text"
                  fullWidth
                  value={hist}
                  onChange={(e) => {setHist(e.target.value)}}
                />
                <TextField
                  margin="dense"
                  id="medicine"
                  label="Enter Medicines"
                  type="text"
                  fullWidth
                  value={medi}
                  onChange={(e) => {setMedi(e.target.value)}}
                />
                <TextField
                  margin="dense"
                  id="lab"
                  label="Lab Tests (if any)"
                  type="text"
                  fullWidth
                  value={test}
                  onChange={(e) => {setTest(e.target.value)}}
                />
                <TextField
                  margin="dense"
                  id="followUp"
                  label="Follow Up Date"
                  type="text"
                  fullWidth
                  value={followUp}
                  onChange={(e) => {setFollowUp(e.target.value)}}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={preview} color="primary">
                  Preview 
                </Button>
              </DialogActions>
            </Dialog>
          </div>

          <div>
            <Dialog
              open={previewOpen}
              onClose={handleClose}
            ><div id="pres">
              <DialogTitle id="alert-dialog-title">Prescription</DialogTitle>
              <DialogContent dividers id="pres">
                <p>SYMPTOMS: {symp}</p><hr />
                <p>MEDICAL HISTORY: {hist}</p><hr />
                <p>MEDICINES: {medi}</p><hr />
                <p>LAB TESTS (if any): {test}</p><hr />
                <p>Follow Up Date: {followUp}</p><hr />
              </DialogContent>
              </div>
              <DialogActions>
              <Button onClick={prevClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleEdit} color="primary">
                  Edit
                </Button>
                <Button onClick={printdoc} color="primary" autoFocus>
                  Send
                </Button>
              </DialogActions>
            </Dialog>
         </div>

          <Tooltip title="Click To Upload">
            <Button
              className={styles.altButton}
              color="primary"
              variant="outlined"
              onClick={() => document.getElementById('file-upload').click()}
            >
              <AttachIcon />
            </Button>
          </Tooltip>
          <input
            id="file-upload"
            type="file"
            multiple={false}
            style={{ display: 'none' }}
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

// dev url
// const SOCKET_ENDPOINT = 'http://localhost:5001';
// const API_ENDPOINT = 'http://localhost:5001/api/chat';

const SOCKET_ENDPOINT = 'https://notification.opdlift.com';
const API_ENDPOINT = 'https://notification.opdlift.com/api/chat';

// initialize the socket instance
let socket;

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
      showEmoji: false,
      uid: '',
      channel: '',
      token: '',
      smallToken: '',
      meetingDetails: '',
    };
  }
  scrollToBottom = () => {
    document
      .getElementById('chatList')
      .scrollIntoView({ behavior: 'smooth', block: 'end' });
    // var objDiv = document.getElementsByClassName("MuiCardContent-root");
    // var objDiv = document.getElementById("chatList");
    // console.log({ objDiv });
    // objDiv.scrollTop = objDiv.scrollHeight;
    // objDiv.scrollTop = objDiv.scrollHeight - objDiv.clientHeight;
  };
  addMessage = (message) => {
    this.setState(
      (state) => {
        // if(message.file){
        //   const isSending = state.messages.filter(m => (m.sending && m.file && m.file.file === message.file.file) ).length != 0;
        //   const new_message = message.createdAt ? message : {...message, createdAt: new Date()};
        //   if(isSending) return { messages: state.messages.map(m => (m.sending && m.file && m.file.file === message.file.file) ? new_message : m ) }
        //   return { messages: [...state.messages, new_message]}
        // }
        const isSending =
          state.messages.filter((m) => m.sending && m.text === message.text)
            .length != 0;
        const new_message = message.createdAt
          ? message
          : { ...message, createdAt: new Date() };
        if (isSending)
          return {
            messages: state.messages.map((m) =>
              m.sending && m.text === message.text ? new_message : m
            ),
          };
        return { messages: [...state.messages, new_message] };
      },
      // { messages: [...this.state.messages, message.createdAt ? message : {...message, createdAt: new Date()}] },
      () => {
        // console.log('Added Message');
        this.scrollToBottom();
      }
    );
  };
  getDetails = async () => {
    try {
      var token = this.props.match.params.token;
      // console.log({ token });
      var result = await axios.post(
        'https://notification.opdlift.com/api/agora/meeting-details',
        // 'http://localhost:5001/api/agora/meeting-details',
        { token }
      );
      var { smallToken, meetingDetails } = result.data;
      var chatName;
      if (smallToken === meetingDetails.dSmallToken) {
        chatName = meetingDetails.patientName;
      } else if (smallToken === meetingDetails.pSmallToken) {
        chatName = meetingDetails.doctorName;
      }
      this.setState({ name: chatName });

      this.setState(
        {
          uid: result.data.uid,
          channel: result.data.channel,
          room: result.data.channel,
          token: result.data.token,
          smallToken: result.data.smallToken,
          meetingDetails: result.data.meetingDetails,
        },
        () => {
          socket = io(SOCKET_ENDPOINT);
          socket.emit(
            'join',
            {
              sentBy: this.state.uid,
              name: this.state.name,
              room: this.state.room,
            },
            (error) => {
              if (error) {
                console.error(error);
              }
            }
          );

          socket.on('message', (message) => {
            // console.log('Socket Message: ', message);
            this.addMessage(message);
            // this.setState(
            //   { messages: [...this.state.messages, message.createdAt ? message : {...message, createdAt: new Date()}] },
            //   () => {
            //     console.log("socket.on message");
            //     this.scrollToBottom();
            //   }
            // );
          });

          socket.on('roomData', ({ users }) => {
            this.setState({ users });
          });

          this.getMessages();
        }
      );
      // console.log(result.data);
    } catch (err) {
      console.log('err', err.response);
    }
  };

  uploadFile = async (file) => {
    try {
      var fileType = file.type;
      const fileName = `${file.name}`;
      var data = {
        fileName,
        fileType,
      };

      var config = {
        method: 'post',
        url: 'https://notification.opdlift.com/api/chat/sign-s3',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      var result = await axios(config);
      const { signedRequest, url } = result.data;
      console.log(signedRequest);

      var putConfig = {
        method: 'put',
        url: signedRequest,
        headers: {
          'Content-Type': fileType,
        },
        data: file,
      };

      result = await axios(putConfig);
      console.log(url);
      return url;
    } catch (err) {
      console.log(err.response);
    }
  };

  saveImageMessage = async (file) => {
    let formData = new FormData();
    formData.append('file', file);

    console.log({ file });

    this.setState({ isLoading: true });

    this.addMessage({
      text: null,
      createdAt: new Date(),
      sending: true,
      file: {
        file: 'Sending',
        text: 'Filename',
      },
    });

    try {
      var url = API_ENDPOINT + '/upload-file';

      // var res = await axios.post(url, formData, {
      //   headers: {
      //     'content-type': 'multipart/form-data',
      //   },
      // });

      var res = await this.uploadFile(file);

      console.log({ res });

      // console.log(res.data);

      socket.emit(
        'sendFile',
        this.state.channel,
        this.state.uid,
        this.state.meetingDetails.patientName,

        res,

        file.name,
        () => {
          this.setState({ message: '' });
        }
      );

      var data = {
        room: this.state.channel,
        sentBy: this.state.uid,
        name: this.state.name,
        file: res,
        text: file.name,
      };

      var saveFile = await axios.post(API_ENDPOINT + '/save-file', data);

      console.log(saveFile.data);

      this.getMessages();

      this.setState({ isLoading: false });
    } catch (err) {
      // console.log(err, err.response.data.errors);

      console.log(err);

      this.setState({ isLoading: false });
    }
  };

  getMessages = async () => {
    try {
      var result = await axios.get(API_ENDPOINT + `/${this.state.channel}`);
      this.setState({ messages: result.data }, () => this.scrollToBottom());
    } catch (err) {
      console.log(err.response);
    }
  };

  saveMessage = (messageText) => {
    this.setState({ message: '' });

    // console.log('saveMessage');

    // console.log({ messageText });

    if (this.state.message) {
      this.addMessage({
        text: this.state.message,
        createdAt: new Date(),
        sending: true,
        file: null,
      });
      socket.emit(
        'sendMessage',
        this.state.channel,
        this.state.uid,
        this.state.meetingDetails.patientName,
        this.state.message,
        () => {
          this.setState({ message: '' });
          this.scrollToBottom();
        }
      );
    }
    // firebase
    //   .firestore()
    //   .collection("messages")
    //   .add({
    //     room: this.state.channel,
    //     sentBy: this.state.uid,
    //     text: messageText,
    //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //   })
    //   .catch(function (error) {
    //     console.error("Error writing new message to database", error);
    //   });
  };

  componentDidMount() {
    this.getDetails();
  }

  render() {
    // console.log(this.state.messages);
    // console.log(this.state.messages);

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

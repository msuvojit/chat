import React from "react";

import { makeStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";
import DownloadIcon from "@material-ui/icons/CloudDownload";

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

export default FileDisplay;

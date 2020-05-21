import React from "react";

import { makeStyles } from "@material-ui/styles";

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

export default Avatar;

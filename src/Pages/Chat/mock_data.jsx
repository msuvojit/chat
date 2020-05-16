import React from "react";

import Avatar from "./Avatar";

export const avatar_dr = (
    <Avatar size="32px" avatar={{ type: "text", text: "M", color: "purple", textColor: "white" }} />
);
export const avatar_andy = (
    <Avatar size="32px" avatar={{ type: "text", text: "A", color: "#ddd", textColor: "black" }} />
);

export const mock_messages = [
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time: new Date(new Date().setDate(new Date().getDate() - 2)),
        message:
            "Hello, Andy. I have your report ready for you. We have found that all the tests are negative. You're all good to go!",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time: new Date(new Date().setDate(new Date().getDate() - 2)),
        type: "file",
        file: "report-andy-carnigie-final.pdf",
    },
    {
        self: false,
        avatar: avatar_andy,
        by: "Andy",
        time: new Date(new Date().setDate(new Date().getDate() - 2)),
        message: "Thank you so much, doc!",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time: new Date(new Date().setDate(new Date().getDate() - 2)),
        message: "Let's have a follow up on the coming monday?",
        type: "text",
    },
    {
        self: false,
        avatar: avatar_andy,
        by: "Andy",
        time: new Date(new Date().setDate(new Date().getDate() - 1)),
        message: "Sure thing. meet you then.",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time: new Date(new Date().setDate(new Date().getDate() - 1)),
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
        time: new Date(),
        message: "Thank you so much, doc!",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time: new Date(),
        message: "Let's have a follow up on the coming monday?",
        type: "text",
    },
    {
        self: false,
        avatar: avatar_andy,
        by: "Andy",
        time: new Date(),
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
        time: new Date(),
        message: "Thank you so much, doc!",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time: new Date(),
        message: "Let's have a follow up on the coming monday?",
        type: "text",
    },
    {
        self: false,
        avatar: avatar_andy,
        by: "Andy",
        time: new Date(),
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
        time: new Date(),
        message: "Thank you so much, doc!",
        type: "text",
    },
    {
        self: true,
        avatar: avatar_dr,
        by: "Dr McDonald",
        time: new Date(),
        message: "Let's have a follow up on the coming monday?",
        type: "text",
    },
    {
        self: false,
        avatar: avatar_andy,
        by: "Andy",
        time: new Date(),
        message: "Sure thing. meet you then.",
        type: "text",
    },
];

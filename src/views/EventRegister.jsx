import { useState, useEffect, useRef } from "react";
import { Route, useParams } from "react-router-dom";

import eventCoverImage from "../assets/events_cover.jpeg";

import { FaCalendarAlt } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { BsFillPersonFill } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";
import {
    AiFillClockCircle,
    AiOutlineLoading,
    AiOutlineCheck,
} from "react-icons/ai";

import { useAuth } from "../contexts/AuthContext";
import { useMisc } from "../contexts/MiscContext";
import { utcToLocalTimeStamp } from "../scripts/Misc";

import axios from "../scripts/axiosConfig";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CountdownTimer from "react-component-countdown-timer";
import "react-component-countdown-timer/lib/styles.css"


import "../styles/EventRegister.scss";

const env = import.meta.env;

export default function EventRegister() {
    const { USER_PRESENT, currentUser, signinwithpopup } = useAuth();
    const { readableError } = useMisc();

    const [eventID, setEventID] = useState();
    const [eventRegisterStatus, setEventRegisterStatus] =
        useState("not_registered");
    const [eventRegisteringInProgress, setEventRegisteringInProgress] =
        useState(false);
    const [noOfRegistered, setNoOfRegistered] = useState(0);
    const [eventStart, setEventStart] = useState(0);
    const [ countdownTime, setCountdownTime] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);

    const fullName = useRef();
    const regNo = useRef();
    const email = useRef();
    const dept = useRef();
    const num = useRef();

    const registerForEvent = () => {
        // if (USER_PRESENT())
        setEventRegisteringInProgress(true);

        console.log(USER_PRESENT());

        axios
            .post(
                "/register_for_event",
                { 
                    eventID: eventID, 
                    fullName: fullName.current.value,
                    regNo: regNo.current.value,
                    email: email.current.value,
                    dept: dept.current.value,
                    num: num.current.value
                },
                // { headers: { Authorization: currentUser.getIdToken() } }
            )
            .then((res) => {
                console.log(res);
                setModalOpen(false);
                setNoOfRegistered((noOfRegistered) => noOfRegistered + 1);
                setEventRegisteringInProgress(false);
                setEventRegisterStatus("registered");
                toast.success(
                    "You are registered for Algorithmist 2024 Round 3!"
                );
            })
            .catch((e) => {
                console.warn(e);
                setEventRegisteringInProgress(false);
                toast.error(e.response.data.message);
            });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setEventID(window.location.pathname.split("/")[2]);

        axios
            .post("/get_event_reg_count", {
                eventID: window.location.pathname.split("/")[2],
            })
            .then((res) => {
                console.log(res.data.count);
                setNoOfRegistered(res.data.count);
            });

        axios
            .post("/get_event_start_time", {
                eventID: window.location.pathname.split("/")[2],
            })
            .then((res) => {
                console.log("setting start time");
                console.log(utcToLocalTimeStamp(res.data.time));
                setEventStart(utcToLocalTimeStamp(res.data.time));
            });
        console.log(env.VITE_AUTHOR);
    }, []);
    
    useEffect(() => {
        if (modalOpen) {
            window.scrollTo(0,0)
            document.body.style.overflowY = "hidden";
        }
        else document.body.style.overflowY = "auto";
    }, [modalOpen])

    useEffect(() => {
        if (eventStart) {
            console.log(`Time difference is : ${  parseInt((eventStart - new Date().getTime()) / 1000)}`)
            setCountdownTime( parseInt((eventStart - new Date().getTime()) / 1000)  );
        }
    }, [eventStart])

    // useEffect(() => {
    //     setEventRegisteringInProgress(true);
    //     if (currentUser && currentUser !== "none") {
    //         currentUser.getIdToken().then((token) => {
    //             axios
    //                 .post(
    //                     "/get_event_reg_status",
    //                     { userID: currentUser.uid, eventID: eventID },
    //                     { headers: { Authorization: token } }
    //                 )
    //                 .then((res) => {
    //                     if (res.data.status == "Registered")
    //                         setEventRegisterStatus("registered");
    //                     else setEventRegisterStatus("not_registered");
    //                 })
    //                 .finally(() => setEventRegisteringInProgress(false));
    //         });
    //     }
    // }, [currentUser]);

    return (
        <>
            <div className="eventRegister">
                <div className="coverImage">
                    <img src={eventCoverImage} alt="event cover image" />
                </div>
                <div className="rest">
                    <div className="eventBox">
                        <div className="eventInfoWrapper">
                            <div className="eventInfo">
                                <div className="eventTitle">
                                    Algorithmist 2024 (Round 3)
                                </div>
                                {/* <div className="conductedBy">
                                    Brought to you by GeeksForGeeks KARE Student
                                    Chapter
                                </div> */}

                                <div className="whereWhenContainer">
                                    <div className="where">
                                        <span className="title">
                                            <IoLocationSharp /> Where{" "}
                                        </span>
                                        <div className="content">
                                            <div>8th block Seminar hall</div>
                                            <div>KARE</div>
                                        </div>
                                    </div>

                                    <div className="when">
                                        <span className="title">
                                            <AiFillClockCircle /> When{" "}
                                        </span>
                                        <div className="content">
                                            <div className="date">
                                                Monday, October 30, 2023
                                            </div>
                                            <div className="time">
                                                10:00AM - 12:00PM GMT+5:30
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="aboutEvent">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Libero temporibus eligendi
                                    sint, eum voluptates maiores rem, quod obcaecati
                                    atque delectus culpa. Debitis voluptatum iure
                                    explicabo in necessitatibus. Repellat, aliquid
                                    officia.
                                </div>

                                <div className="startsIn">
                                    <div className="title" >Contest Starts in: </div>
                                    {/* <div><span className="time">00</span> Days  <span className="time">00</span> Hours <span className="time">00</span> Minutes <span className="time">00</span> Seconds</div> */}
                                    <div className="time">
                                        {
                                            (countdownTime) ? <CountdownTimer count={countdownTime} border showTitle size={22} /> : <></>
                                        }
                                    </div>
                                </div>
                            </div>
                            
                        </div>

                        <div className="eventRegisterPanel">
                            <div className="row registerBtn">
                                {true ? (
                                    <button
                                        className={
                                            eventRegisterStatus === "registered"
                                                ? "registerDone"
                                                : ""
                                        }
                                        disabled={
                                            eventRegisterStatus === "registered" ||
                                            eventRegisteringInProgress === true
                                        }
                                        onClick={() => setModalOpen(true)}
                                    >
                                        {eventRegisteringInProgress ? (
                                            <AiOutlineLoading
                                                className="loadingIcon"
                                                size="15px"
                                            /> // if in progress, show loading btn
                                        ) : eventRegisterStatus === "not_registered" ? ( // else, if not registered show reg btn
                                            "Register!"
                                        ) : (
                                            // else, if registered show regd btn
                                            <>
                                                {" "}
                                                <AiOutlineCheck size="15px" />{" "}
                                                Registered
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            console.log("registering...")
                                            setModalOpen(true);
                                        } }
                                    >
                                        Click here to Register
                                    </button>
                                )}
                            </div>
                            <div className="row">
                                <div className="registerPanelItem">
                                    <div className="icon">
                                        <HiUserGroup />
                                    </div>
                                    <div className="info">
                                        <div className="heading">Registered</div>
                                        <div className="content">
                                            {noOfRegistered}/200
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="registerPanelItem">
                                    <div className="icon">
                                        <BsFillPersonFill />
                                    </div>
                                    <div className="info">
                                        <div className="heading">Team Size</div>
                                        <div className="content">Individual</div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="registerPanelItem">
                                    <div className="icon">
                                        <FaCalendarAlt />
                                    </div>
                                    <div className="info">
                                        <div className="heading">
                                            Registration Deadline
                                        </div>
                                        <div className="content">29th Oct 2023 - 5PM</div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="row">
                                <button>Register!</button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            <div className={(modalOpen) ? "modal open" : "modal"} onClick={ () => setModalOpen(false) }>
                <div className="box" onClick={ (e) => {
                    e.bubbles = false;
                    e.stopPropagation();
                } } >
                    <h2>Register for Algorithmist2024 Round 3</h2>
                    <form autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        console.log("ref..");
                        registerForEvent();
                    }}>
                        <div className="row">
                            <label for="name">Full Name *</label>
                            <input id="name" type="text" required autoComplete="off" ref={fullName} />
                        </div>
                        <div className="row">
                            <label for="email">Register No *</label>
                            <input id="email" type="number" required autoComplete="off" ref={regNo} />
                        </div>
                        <div className="row">
                            <label for="email">Email Address *</label>
                            <input id="email" type="email" required autoComplete="off" ref={email} />
                        </div>
                        <div className="row">
                            <label for="dept">Department *</label>
                            {/* <input id="dept" type="text" required autoComplete="off"/> */}
                            <select name="department" onChange={(e) => console.log(e.currentTarget.value)} ref={dept} >
                                <option value="cse">CSE</option>
                                <option value="it">IT</option>
                                <option value="ece">ECE</option>
                                <option value="eee">EEE</option>
                                <option value="biotech">Bio Technology</option>
                                <option value="foodtech">Food Technology</option>
                            </select>
                        </div>
                        <div className="row">
                            <label for="num">Contact Number *</label>
                            <input id="num" type="number" required autoComplete="off" ref={num} />
                        </div>
                        <div className="row">
                            <button>Register</button> 
                        </div>
                    </form>
                    
                </div>
            </div>
        </>
    );
}

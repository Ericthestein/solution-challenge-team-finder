import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";

import "./TeamFinder.css";
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import CircularProgress from "@material-ui/core/CircularProgress";

const TeamFinderForm = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [school, setSchool] = useState("");

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [schoolError, setSchoolError] = useState("");

    // Validation

    const validateName = (name) => {
        if (name.length === 0 || name.length > 500) {
            setNameError("Name cannot be blank");
            return false
        } else {
            setNameError("");
            return true;
        }
    }

    const validateEmail = (email) => {
        if (email.length === 0 || email.length > 500) {
            setEmailError("Email cannot be blank");
            return false
        } else if (!(email.includes("@"))) {
            setEmailError("Email not properly formatted");
            return false
        } else {
            setEmailError("");
            return true;
        }
    }

    const validateSchool = (school) => {
        if (school.length === 0 || school.length > 500) {
            setSchoolError("School cannot be blank");
            return false
        } else {
            setSchoolError("");
            return true;
        }
    }

    const validateAllFields = () => {
        if (!validateName(name) || !validateEmail(email) || !validateSchool(school)) {
            return false;
        }
        return true;
    }

    const onSubmitClicked = () => {
        if (!validateAllFields()) return;
        props.onSubmit({
            name: name,
            email: email,
            school: school
        });
    }

    // Input Handling

    const onNameUpdated = (newName) => {
        setName(newName);
        validateName(newName);
    };

    const onEmailUpdated = (newEmail) => {
        setEmail(newEmail);
        validateEmail(newEmail);
    };

    const onSchoolUpdated = (newSchool) => {
        setSchool(newSchool);
        validateSchool(newSchool);
    };

    return(
        <div className={"TeamFinderForm"}>
            <FormGroup className={"TeamFinderFormGroup"}>
                <FormControl>
                    <InputLabel>Full Name</InputLabel>
                    <Input
                        error={nameError !== ""}
                        required={true}
                        type={"text"}
                        autoComplete={"name"}
                        value={name}
                        onChange={(event) => {onNameUpdated(event.target.value)}}
                    />
                    {nameError !== "" &&
                        <FormHelperText error={true}>{nameError}</FormHelperText>
                    }
                </FormControl>
                <FormControl>
                    <InputLabel>Email</InputLabel>
                    <Input
                        error={emailError !== ""}
                        required={true}
                        type={"email"}
                        autoComplete={"email"}
                        value={email}
                        onChange={(event) => {onEmailUpdated(event.target.value)}}
                    />
                    {emailError !== "" &&
                        <FormHelperText error={true}>{emailError}</FormHelperText>
                    }
                </FormControl>
                <FormControl>
                    <InputLabel>University</InputLabel>
                    <Input
                        error={schoolError !== ""}
                        required={true}
                        type={"text"}
                        value={school}
                        onChange={(event) => {onSchoolUpdated(event.target.value)}}
                    />
                    <FormHelperText error={schoolError !== ""}>
                        {schoolError !== "" ? schoolError : "Please list the full name of your university, without abbreviations"}
                    </FormHelperText>
                </FormControl>

                <Button
                    variant="contained"
                    color={"primary"}
                    onClick={onSubmitClicked}
                    disabled={props.showLoading}
                >
                    {props.showLoading ? <CircularProgress />
                    : "Find Team!"}
                </Button>

            </FormGroup>
        </div>
    );
}

export default TeamFinderForm;
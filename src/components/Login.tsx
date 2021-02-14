import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';
import {PASSWORD_REQUIREMENT, url} from "../Constants";
import {useDispatch} from "react-redux";
import {newUserLoggedIn} from "../actions/actionCreator";
import Loader from './Loader';
const eyeOpen = <FontAwesomeIcon icon={faEye} />
const eyeClosed = <FontAwesomeIcon icon={faEyeSlash} />

interface UserObject {
    username: string,
    password: string
}

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [signinLoader, setSigninLoader] = useState(false);
    const [signupLoader, setSignUpLoader] = useState(false);
    const handleSignIn = (e: any) => {
        e.preventDefault();
        let error = singInValidate(username, password);
        if (error) {
            setError(error);
            return;
        }
        setSigninLoader(true);
        signin({username, password})
            .then(
                (userSavedDetails) => {
                    setSigninLoader(false);
                    const {userId, username} = userSavedDetails;
                    if (userSavedDetails.error) {
                        setError(userSavedDetails.error);
                    } else {
                        dispatch(newUserLoggedIn(userId, username));
                    }
                },
                (err) => {
                    setSigninLoader(false);
                    console.error(err);
                }
            )
    }
    const handleSignUp = (e: any) => {
        e.preventDefault();
        let error = singUpValidate(username, password);
        if(error) {
            setError(error);
            return;
        }
        setSignUpLoader(true);
        signup({username, password})
            .then(
                (userSavedDetails) => {
                    const {userId, username} = userSavedDetails;
                    setSignUpLoader(false);
                    if (userSavedDetails.error) {
                        setError(userSavedDetails.error);
                    } else {
                        dispatch(newUserLoggedIn(userId, username));
                    }
                },
                (err) => {
                    setSignUpLoader(false)
                    console.error(err);
                }
            )
    }
    return (
        <StyledFormWrapper>
            <StyledForm>
                <StyledError>{error}</StyledError>
                <StyledInputWrapper style={{width: '61%'}}>
                    <StyledInput type="text" name="userid" id="userid" placeholder="User Name"
                           autoComplete="username"
                           onChange={(e) => setUserName(e.target.value)}
                    />
                </StyledInputWrapper>
                <StyledInputWrapper>
                    <StyledInput type={passwordVisible ? "text" : "password"} name="password" id="password"
                                 placeholder="Password"
                                 autoComplete="current-password"
                                 onChange={(e) => setPassword(e.target.value)}
                    />
                    <div onClick={() => setPasswordVisible(!passwordVisible)}>
                        {passwordVisible ? eyeOpen : eyeClosed}
                    </div>
                </StyledInputWrapper>
                <StyledButtonWrapper>
                    {
                        signupLoader ? <Loader/> :
                            <StyledButton
                                onClick={(e) => handleSignUp(e)}
                            >
                                Sign Up
                            </StyledButton>
                    }
                    {
                        signinLoader ? <Loader/> :
                            <StyledButton
                                onClick={(e) => handleSignIn(e)}
                            >
                                Sign In
                            </StyledButton>
                    }
                </StyledButtonWrapper>
                <StyledInstructionsWrapper>
                    <StyledPasswordInstruction>{PASSWORD_REQUIREMENT}</StyledPasswordInstruction>
                </StyledInstructionsWrapper>
            </StyledForm>
        </StyledFormWrapper>
  )
}

const singUpValidate = (userName: string, password: string) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    let error = '';
    if (userName === '') error = "Username can't be empty!";
    else if (password === '') error = "Password can't be empty!";
    else if (!passwordRegex.test(password)) error = "Invalid Password!";
    return error;
}
const singInValidate = (userName: string, password: string) => {
    let error = '';
    if (userName === '') error = "Username can't be empty!";
    else if (password === '') error = "Password can't be empty!";
    return error;
}

async function signup(user: UserObject) {
    const res = await fetch(url.API_URL_SIGNUP, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    return await res.json();
}

async function signin(user: UserObject) {
    const res = await fetch(url.API_URL_SIGNIN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    return await res.json();
}

const StyledFormWrapper = styled.div`
  display: flex;
  align-items: center;
  height: calc(100vh - 56px);
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vh;
`;

const StyledInput = styled.input`
  border: none;
  outline: none;
  box-shadow: none;
  margin: 0;
  padding: 0;
`;

const StyledInputWrapper = styled.div`
  display: flex;
  margin: 10px 0;
  padding: 10px;
  border-radius: 10px;
  outline: none;
  border: 0.5px solid #ccc;
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 50%;
  margin: 20px 0 0 0;
`;

const StyledButton = styled.button`
  background-color:  #97afeb;
  outline: none;
  border: none;
  border-radius: 10px;
  padding: 10px;
`;

const StyledError = styled.p`
  color: red;
`;

const StyledInstructionsWrapper = styled.div`
  width: 70%;
  display: flex;
  margin: 10px 0;
  padding: 10px;
  border-radius: 10px;
  outline: none;
  text-align: justify;
`;

const StyledPasswordInstruction = styled.p`
  color: gray;
`;
export default Login;
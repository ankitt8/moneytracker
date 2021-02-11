import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';
import {url} from "../Constants";
import {useDispatch} from "react-redux";
import {newUserLoggedIn} from "../actions/actionCreator";
const eyeOpen = <FontAwesomeIcon icon={faEye} />
const eyeClosed = <FontAwesomeIcon icon={faEyeSlash} />

interface UserObject {
    username: string,
    password: string
}

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const [error, setError] = React.useState('');
    const [username, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const handleSignIn = (e: any) => {
        e.preventDefault();
        let error = validate(username, password);
        if(error){
            setError(error);
            return;
        };
        signin({username, password})
            .then(
                (userSavedDetails) => {
                    if(userSavedDetails.error) {
                        setError(userSavedDetails.error);
                    } else {
                        dispatch(newUserLoggedIn(userSavedDetails.userId));
                        // history.push('/');
                    }
                },
                (err) => {
                    console.error(err);
                }
            )
    }
    const handleSignUp = (e: any) => {
        e.preventDefault();
        let error = validate(username, password);
        if(error) {
            setError(error);
            return;
        }
        signup({username, password})
            .then(
                (userSavedDetails) => {
                    console.log(userSavedDetails);
                    if(userSavedDetails.error) {
                        setError(userSavedDetails.error);
                    } else {
                        dispatch(newUserLoggedIn(userSavedDetails.userId));
                        // history.push('/');
                    }
                },
                (err) => {
                    console.error(err);
                }
            )
    }
    return (
        <StyledFormWrapper>
            <StyledForm>
                <StyledError>{error}</StyledError>
                <StyledInputWrapper>
                    <StyledInput type="text" name="userid" id="userid" placeholder="User Name"
                           autoComplete="username"
                           onChange={(e) => setUserName(e.target.value)}
                    />
                </StyledInputWrapper>
                <StyledInputWrapper>
                    <StyledInput type={passwordVisible ? "text": "password"} name="password" id="password" placeholder="Password"
                         autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div onClick={() => setPasswordVisible(!passwordVisible)}>
                        {passwordVisible ? eyeOpen : eyeClosed}
                    </div>
                </StyledInputWrapper>
                <StyledButtonWrapper>
                    <StyledButton onClick={(e) => handleSignUp(e)}>Sign Up</StyledButton>
                    <StyledButton onClick={(e) => handleSignIn(e)}>Sign In</StyledButton>
                </StyledButtonWrapper>
            </StyledForm>
        </StyledFormWrapper>
  )
}

const validate = (userName: string, password: string) => {
    let error = '';
    if (userName === '') error = "Username can't be empty!";
        else if(password === '') error = "Password can't be empty!";
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
  width: 70%;
  border-radius: 10px;
  outline: none;
  border: 0.5px solid #ccc;
  box-shadow: none;
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

export default Login;
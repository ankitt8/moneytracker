import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { PASSWORD_REQUIREMENT, url } from 'Constants';
import { useDispatch } from 'react-redux';
import { newUserLoggedIn } from 'actions/actionCreator';
import Loader from 'components/Loader';

import styles from './styles.module.scss';

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
    signin({ username, password })
      .then(
        (userSavedDetails) => {
          setSigninLoader(false);
          const { userId, username } = userSavedDetails;
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
    if (error) {
      setError(error);
      return;
    }
    setSignUpLoader(true);
    signup({ username, password })
      .then(
        (userSavedDetails) => {
          const { userId, username } = userSavedDetails;
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
    <div className={styles.formWrapper}>

      <form className={styles.form}>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <div className={styles.inputWrapper}>
          <input type="text" name="userid" id="userid" placeholder="User Name"
            autoComplete="username"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className={styles.inputWrapper}>
          <input type={passwordVisible ? "text" : "password"} name="password" id="password"
            placeholder="Password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div onClick={() => setPasswordVisible(() => passwordVisible ? false : true)}>
            {passwordVisible ? eyeOpen : eyeClosed}
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          {
            signupLoader ? <Loader /> :
              <button
                onClick={(e) => handleSignUp(e)}
              >
                Sign Up
              </button>
          }
          {
            signinLoader ? <Loader /> :
              <button
                onClick={(e) => handleSignIn(e)}
              >
                Sign In
              </button>
          }
        </div>

        <div className={styles.passwordInstructionWrapper}>
          <p className={styles.passwordInstruction}>{PASSWORD_REQUIREMENT}</p>
        </div>

      </form>

    </div>
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

export default Login;
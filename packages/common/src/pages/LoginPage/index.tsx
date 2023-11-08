import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { PASSWORD_REQUIREMENT, url } from '@moneytracker/common/src/Constants';
import { useDispatch } from 'react-redux';
import { newUserLoggedIn } from '@moneytracker/common/src/actions/actionCreator';
import Loader from '@moneytracker/common/src/components/Loader';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';
import { setCookies } from '../../utility';

const eyeOpen = <FontAwesomeIcon icon={faEye} />;
const eyeClosed = <FontAwesomeIcon icon={faEyeSlash} />;

interface UserObject {
  username: string | undefined;
  password: string | undefined;
}

interface ILoginProps {
  callbackUrl?: string;
}
const Login = ({ callbackUrl }: ILoginProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [signInLoader, setSignInLoader] = useState(false);
  const [signUpLoader, setSignUpLoader] = useState(false);
  const handleSignIn = (e: any) => {
    e.preventDefault();
    const username = userNameRef?.current?.value;
    const password = passwordRef?.current?.value;
    const error = singInValidate(username, password);
    if (error) {
      setError(error);
      return;
    }
    setSignInLoader(true);
    signIn({ username, password }).then(
      (userSavedDetails) => {
        setSignInLoader(false);
        const { userId, username } = userSavedDetails;
        setCookies([
          { name: 'userId', value: userId },
          { name: 'username', value: username }
        ]);
        if (userSavedDetails.error) {
          setError(userSavedDetails.error);
        } else {
          dispatch(newUserLoggedIn(userId, username));
          router.replace(callbackUrl ?? '/');
        }
      },
      (err) => {
        setSignInLoader(false);
        console.error(err);
      }
    );
  };

  const handleSignUp = (e: any) => {
    e.preventDefault();
    const username = userNameRef?.current?.value;
    const password = passwordRef?.current?.value;
    const error = singUpValidate(username, password);
    if (error) {
      setError(error);
      return;
    }
    setSignUpLoader(true);
    signup({ username, password }).then(
      (userSavedDetails) => {
        const { userId, username } = userSavedDetails;
        setCookies([
          { name: 'userId', value: userId },
          { name: 'username', value: username }
        ]);
        setSignUpLoader(false);
        if (userSavedDetails.error) {
          setError(userSavedDetails.error);
        } else {
          dispatch(newUserLoggedIn(userId, username));
          router.push('/');
        }
      },
      (err) => {
        setSignUpLoader(false);
        console.error(err);
      }
    );
  };
  return (
    <div className={styles.formWrapper}>
      <form className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputWrapper}>
          <input
            className={styles.loginInput}
            type="text"
            name="userid"
            id="userid"
            placeholder="User Name"
            autoComplete="username"
            ref={userNameRef}
          />
        </div>

        <div className={styles.inputWrapper}>
          <input
            className={styles.loginInput}
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder="Password"
            autoComplete="current-password"
            ref={passwordRef}
          />
          <div
            onClick={() =>
              setPasswordVisible((passwordVisible) => !passwordVisible)
            }
          >
            {passwordVisible ? eyeOpen : eyeClosed}
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          {signUpLoader ? (
            <Loader />
          ) : (
            <button
              className={styles.loginPageButton}
              onClick={(e) => handleSignUp(e)}
            >
              Sign Up
            </button>
          )}
          {signInLoader ? (
            <Loader />
          ) : (
            <button
              className={styles.loginPageButton}
              onClick={(e) => handleSignIn(e)}
            >
              Sign In
            </button>
          )}
        </div>

        <div className={styles.passwordInstructionWrapper}>
          <p className={styles.passwordInstruction}>{PASSWORD_REQUIREMENT}</p>
        </div>
      </form>
    </div>
  );
};

const singUpValidate = (
  userName: string | undefined,
  password: string | undefined
) => {
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
  let error = '';
  if (checkEmptyField(userName)) error = "Username can't be empty!";
  else if (checkEmptyField(password)) error = "Password can't be empty!";
  else if (password && !passwordRegex.test(password))
    error = 'Invalid Password!';
  return error;
};
const singInValidate = (
  userName: string | undefined,
  password: string | undefined
) => {
  let error = '';
  if (checkEmptyField(userName)) error = "Username can't be empty!";
  else if (checkEmptyField(password)) error = "Password can't be empty!";
  return error;
};
function checkEmptyField(val: string | undefined) {
  return !val || val === '';
}

async function signup(user: UserObject) {
  const res = await fetch(url.API_URL_SIGNUP, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  return await res.json();
}

async function signIn(user: UserObject) {
  const res = await fetch(url.API_URL_SIGNIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  return await res.json();
}

export default Login;

import { createContext } from 'react';

interface IUserIdStateContext {
  userId: object
}

const UserIdStateContext = createContext<IUserIdStateContext| undefined>(undefined);

export default UserIdStateContext;
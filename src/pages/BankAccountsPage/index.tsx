import styles from './styles.module.scss';
import useAddData from 'customHooks/useAddData';
import {
  addBankAccountDB,
  getBankAccountsFromDB
} from '../../api-services/api.service';
import useFetchData from '../../customHooks/useFetchData';
import { GET_BANK_ACCOUNTS_FAILURE_MSG } from '../../Constants';
import { setUserBankAccountsAction } from '../../actions/actionCreator';
import { useSelector } from 'react-redux';
import { ReduxStore } from '../../reducers/interface';

interface IBankAccountsPage {
  userId: string;
}
const BankAccountsPage = ({ userId }: IBankAccountsPage) => {
  const bankAccounts = useSelector(
    (store: ReduxStore) => store.user.bankAccounts
  );
  console.log(bankAccounts);
  // for(const bankAccount of bankAccounts) {
  //   console.log(bankAccount);
  // }
  useFetchData(
    getBankAccountsFromDB,
    GET_BANK_ACCOUNTS_FAILURE_MSG,
    setUserBankAccountsAction
  );
  const addBankApiSuccessHandler = (res: any) => {
    console.log(res);
  };
  const addBankApiErrorHandler = (e: string) => {
    console.log(e);
  };
  const { addDataApiCall: addBankAccount, state } = useAddData(
    addBankApiSuccessHandler,
    addBankApiErrorHandler
  );

  const addBankFormSubmitHandler = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let bankName = '';
    for (const [key, value] of formData) {
      console.log({ key, value });
      if (key === 'bankName') {
        bankName = value;
      }
    }
    console.log(bankName);
    addBankAccount(() => addBankAccountDB(userId, { bankName }));
  };
  return (
    <>
      <div className={styles.bankAccounts}>BankAccounts</div>
      <form onSubmit={addBankFormSubmitHandler}>
        <input type={'text'} name={'bankName'} />
        <button>Add bank account</button>
      </form>
    </>
  );
};

export default BankAccountsPage;

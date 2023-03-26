import styles from './styles.module.scss';
import useAddData from 'customHooks/useAddData';
import {
  addBankAccountDB,
  deleteBankAccountDB,
  getBankAccountsFromDB
} from '../../api-services/api.service';
import useFetchData from '../../customHooks/useFetchData';
import { GET_BANK_ACCOUNTS_FAILURE_MSG } from '../../Constants';
import {
  addUserBankAccountAction,
  setUserBankAccountsAction
} from '../../actions/actionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStore } from '../../reducers/interface';

interface IBankAccountsPage {
  userId: string;
}
const BankAccountsPage = ({ userId }: IBankAccountsPage) => {
  const dispatch = useDispatch();
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
  const addBankApiSuccessHandler = (res: { bankAdded: string }) => {
    console.log(res);
    dispatch(addUserBankAccountAction(res.bankAdded));
  };
  const addBankApiErrorHandler = (e: string) => {
    console.log(e);
  };
  const { addDataApiCall: addBankAccount, state: addBankAccountApiState } =
    useAddData(addBankApiSuccessHandler, addBankApiErrorHandler);
  const deleteBankApiSuccessHandler = (res: { bankAccounts: string[] }) => {
    dispatch(setUserBankAccountsAction(res.bankAccounts));
  };
  // const deleteBankApiErrorHandler = () => {};
  const { addDataApiCall: deleteBankAccount, state } = useAddData(
    deleteBankApiSuccessHandler
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
    addBankAccount(() => addBankAccountDB(userId, { bankName }));
  };
  const deleteBankAccountHandler = (bankAccountToDelete: string) => {
    const oldBankAccounts = [...bankAccounts];
    let newBankAccounts: string[] = [];
    if (oldBankAccounts.length === 1) newBankAccounts = [];
    else {
      const bankAccountIndexToDelete = oldBankAccounts.findIndex(
        (bankAccount) => bankAccount === bankAccountToDelete
      );
      oldBankAccounts.splice(bankAccountIndexToDelete, 1);
      newBankAccounts = oldBankAccounts;
    }

    deleteBankAccount(() => deleteBankAccountDB(userId, newBankAccounts));
  };
  return (
    <div className={styles.bankAccountsPage}>
      <div>BankAccounts</div>
      <form onSubmit={addBankFormSubmitHandler}>
        <input type={'text'} name={'bankName'} />
        <button>Add bank account</button>
      </form>
      {bankAccounts &&
        bankAccounts.map((bankAccount) => (
          <div key={bankAccount} className={styles.bankRow}>
            <p>{bankAccount}</p>
            <button onClick={() => deleteBankAccountHandler(bankAccount)}>
              Delete
            </button>
          </div>
        ))}
    </div>
  );
};

export default BankAccountsPage;

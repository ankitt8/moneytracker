import styles from './styles.module.scss';
import useAddData from 'customHooks/useAddData';
import { addBankAccountDB } from '../../api-services/api.service';
const BankAccountsPage = () => {
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

  const addBankFormSubmitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let bankAccountName = '';
    for (const [key, value] of formData) {
      console.log({ key, value });
      if (key === '') {
        bankAccountName = value;
      }
    }
    addBankAccount(() =>
      addBankAccountDB('234', { name: bankAccountName, balance: 0 })
    );
  };
  return (
    <>
      <div className={styles.bankAccounts}>BankAccounts</div>
      <form onSubmit={addBankFormSubmitHandler}>
        <input type={'text'} name={'accountName'} />
        <button>Add bank account</button>
      </form>
    </>
  );
};

export default BankAccountsPage;

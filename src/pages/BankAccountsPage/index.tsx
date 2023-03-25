import styles from './styles.module.scss';

const BankAccountsPage = () => {
  const addBankFormSubmitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    for (const [key, value] of formData) {
      console.log({ key, value });
    }
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

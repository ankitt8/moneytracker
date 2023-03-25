import styles from './styles.module.scss';

const BankAccountsPage = () => {
  const handleAddBank = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    for (const [key, value] of formData) {
      console.log({ key, value });
    }
  };
  return (
    <>
      <div className={styles.bankAccounts}>BankAccounts</div>
      <form onSubmit={handleAddBank}>
        <input type={'text'} name={'accountName'} />
        <button>Add bank account</button>
      </form>
    </>
  );
};

export default BankAccountsPage;

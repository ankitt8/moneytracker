import styles from './styles.module.scss';

export default function Loader() {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderCircle}></div>
    </div>
  );
}

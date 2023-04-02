import { Link, useHistory } from 'react-router-dom';
import { cardList } from './constants';
import styles from './styles.module.scss';

function OthersPage() {
  const history = useHistory();
  const handleClick = (url: string) => {
    history.push(url);
  };
  return (
    <div className={styles.container}>
      {cardList.map(({ text, url }) => {
        return (
          <Link
            className={styles.card}
            key={text}
            to={{
              pathname: url
            }}
          >
            {text}
          </Link>
        );
      })}
      <button
        className={styles.card}
        onClick={() => {
          window.location.reload();
        }}
      >
        Reload
      </button>
    </div>
  );
}

export { OthersPage };

import { useRouter } from 'next/router';
import Link from 'next/link';
import { cardList } from './constants';
import styles from './styles.module.scss';

export default function OthersPage() {
  const router = useRouter();
  const handleClick = (url: string) => {
    router.push(url);
  };
  return (
    <div className={styles.container}>
      {cardList.map(({ text, url }) => {
        return (
          <Link className={styles.card} key={text} href={url}>
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

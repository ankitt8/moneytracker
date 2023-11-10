import { TransactionCategories } from '../components/AddTransactionModal/TransactionCategoryInput/interface';

function setCookies(cookies: { name: string; value: string }[]) {
  cookies.forEach(({ name, value }) => {
    document.cookie = `${name}=${value};`;
  });
}
function constructTodayDate(dateString?: Date): string {
  let todayDate = new Date();
  if (dateString) {
    todayDate = new Date(dateString);
  }
  const appendYear = (str: string) => str + todayDate.getFullYear().toString();
  const appendMonth = (str: string) => {
    const month = todayDate.getMonth();
    const result = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    return str + result;
  };
  const appendSeperator = (str: string) => str + '-';
  const appendDate = (str: string) => {
    const date = todayDate.getDate();
    const result = date < 10 ? `0${date}` : date.toString();
    return str + result;
  };
  const pipe =
    (...fns: ((str: string) => any)[]) =>
    (x: string) =>
      fns.reduce((currVal, currFunc) => currFunc(currVal), x);
  return pipe(
    appendYear,
    appendSeperator,
    appendMonth,
    appendSeperator,
    appendDate
  )('');
}
function constructStartDateOfYear() {
  return `${new Date().getFullYear()}-01-01`;
}
function removeDuplicateFromArray(arr: Array<any>) {
  return [...new Set(arr)];
}

function getFlattenedCategories(categories: TransactionCategories) {
  return Object.entries(categories).reduce((acc: string[], [, value]) => {
    return [...acc, ...value];
  }, []);
}
export {
  setCookies,
  constructTodayDate,
  constructStartDateOfYear,
  removeDuplicateFromArray,
  getFlattenedCategories
};

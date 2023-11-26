import { TransactionCategories } from '../components/AddTransactionModal/TransactionCategoryInput/interface';

function setCookies(
  cookies: { name: string; value: string; expiry: string }[]
) {
  cookies.forEach(({ name, value, expiry }) => {
    document.cookie = `${name}=${value}; expires=${expiry}`;
  });
}
const appendSeperator = (str: string) => str + '-';

const appendYear = (str: string, date = new Date()) =>
  str + date.getFullYear().toString();

const appendDay = (str: string, date = new Date()) => {
  const day = date.getDate();
  const result = day < 10 ? `0${day}` : day.toString();
  return str + result;
};

const appendMonth = (str: string, date = new Date()) => {
  const month = date.getMonth();
  const result = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
  return str + result;
};
function constructTodayDate(dateString?: Date): string {
  let todayDate = new Date();
  if (dateString) {
    todayDate = new Date(dateString);
  }
  const pipe =
    (...fns: ((str: string, date: Date) => any)[]) =>
    (x: string) =>
      fns.reduce((currVal, currFunc) => currFunc(currVal, todayDate), x);
  return pipe(
    appendYear,
    appendSeperator,
    appendMonth,
    appendSeperator,
    appendDay
  )('');
}
function constructStartDateOfYear() {
  return `${new Date().getFullYear()}-01-01`;
}

function constructStartDateOfMonth(dateString?: Date) {
  let todayDate = new Date();
  if (dateString) {
    todayDate = new Date(dateString);
  }
  const pipe =
    (...fns: ((str: string, date: Date) => any)[]) =>
    (x: string) =>
      fns.reduce((currVal, currFunc) => currFunc(currVal, todayDate), x);
  return pipe(
    appendYear,
    appendSeperator,
    appendMonth,
    appendSeperator,
    (result) => result + '01'
  )('');
}
function removeDuplicateFromArray(arr: Array<any>) {
  return [...new Set(arr)];
}

function getFlattenedCategories(categories: TransactionCategories) {
  return Object.entries(categories).reduce((acc: string[], [, value]) => {
    return [...acc, ...value];
  }, []);
}

function getFormattedAmount(amount: number) {
  return new Intl.NumberFormat('en-IN').format(amount);
}
export {
  setCookies,
  constructTodayDate,
  constructStartDateOfYear,
  constructStartDateOfMonth,
  removeDuplicateFromArray,
  getFlattenedCategories,
  getFormattedAmount
};

import History from '@moneytracker/common/src/pages/History';
import {GetServerSidePropsContext} from "next/types";
import {getCookieValue} from "@/utils/cookie";
import {COOKIE_NAMES, ROUTES} from '@moneytracker/common/src/Constants';
import {getServerSidePropsReturnObjUserNotLoggedIn} from "@/utils/utility";
interface IHistoryPageProps {
  userId: string;
}
export default function  Page({ userId }:IHistoryPageProps){
  return <History userId={userId}/>
}

export async function getServerSideProps({req, query}: GetServerSidePropsContext) {
  let userId= getCookieValue(req?.cookies, COOKIE_NAMES.userId);
  const queryParamUserId = query[COOKIE_NAMES.userId];
  if(!userId && queryParamUserId && typeof queryParamUserId === 'string') { userId =  JSON.parse(queryParamUserId) ;}
  if(!userId) {
    const temp = {
      userId, redirectUrl : ROUTES.LOGIN, currentUrl: ROUTES.HISTORY, query
    }
    return getServerSidePropsReturnObjUserNotLoggedIn(temp);
  }
  return {
    props: { userId }
  }
}

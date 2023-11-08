import {ParsedUrlQuery} from "querystring";

interface IParams {
    userId: string | null;
    redirectUrl : string;
    currentUrl: string | undefined;
    callbackUrl?: string;
    query?: ParsedUrlQuery;
}
const getServerSidePropsReturnObjUserNotLoggedIn = (params : IParams) => {
    let destination = params.redirectUrl;
    if(params.callbackUrl) {
        destination += `?callbackUrl=${params.callbackUrl}`
    }
    if(!params.callbackUrl && params.currentUrl) {
        destination += `?callbackUrl=${params.currentUrl}`
        if(params.query) {
            for(const [key, value] of Object.entries(params.query)) {
                destination += `?${key}=${value}`;
            }
        }
    }
    return { redirect: {
        destination: destination,
                permanent: false
            } };
}

export { getServerSidePropsReturnObjUserNotLoggedIn }

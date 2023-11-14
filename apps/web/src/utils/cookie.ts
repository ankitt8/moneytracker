import { NextApiRequestCookies } from 'next/dist/server/api-utils';

const getCookieValue = (
  cookies: NextApiRequestCookies,
  cookieName: string
): string | null => {
  if (!cookies) return null;
  return cookies[cookieName] ?? null;
};
export { getCookieValue };

function setCookies(cookies: { name: string; value: string }[]) {
  cookies.forEach(({ name, value }) => {
    document.cookie = `${name}=${value};`;
  });
}
export { setCookies };

export const saveAuth = (token: string, user: any) => {
  localStorage.setItem("boastlib_token", token);
  localStorage.setItem("boastlib_user", JSON.stringify(user));
};

export const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("boastlib_token") : null);

export const getUser = () => {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem("boastlib_user");
  return value ? JSON.parse(value) : null;
};

export const logout = () => {
  localStorage.removeItem("boastlib_token");
  localStorage.removeItem("boastlib_user");
  window.location.href = "/login";
};

export const isAuthenticated = () => !!getToken();

export const isAdmin = () => getUser()?.role === "admin";

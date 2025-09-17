export type TAuthUser = {
  id: string;
  name: string;
  mobile: string;
  userType: "USER" | "ADMIN"; // depends on your UserType enum
  password: string;
};


export type TAuthState = {
  user: null | TAuthUser;
  token: null | string;
};
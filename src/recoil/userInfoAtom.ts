import { atom } from "recoil";

export const userInfoAtom = atom({
  key: "UserInfoAtom",
  default: { id: "", given_name: "", family_name: "", email: "" },
});

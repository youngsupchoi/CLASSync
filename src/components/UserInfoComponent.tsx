import { Tooltip } from "flowbite-react";
import { HiSelector } from "react-icons/hi";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "../recoil/userInfoAtom";
export default function UserInfoComponent() {
  const userInfo = useRecoilValue(userInfoAtom);
  const { given_name, family_name, email } = userInfo;

  return (
    <div className="flex w-full items-center justify-between py-0">
      <div>
        <div className="flex w-48 items-center justify-between">
          <h6 className="text-base font-normal text-white dark:text-white">
            {given_name} {family_name}
          </h6>
          <Tooltip content="Thanks for being an early user. We won't forget you and will keep providing benefits.">
            <div className="w-18 ml-2 flex h-5 items-center justify-center rounded-lg bg-[#4833CA] px-4 text-xs font-medium text-white">
              Pioneer
            </div>
          </Tooltip>
        </div>
        <h6 className="pt-1 text-left text-xs font-light">{email}</h6>
      </div>
      <HiSelector className="size-5 text-[#A1A1AA]" />
    </div>
  );
}

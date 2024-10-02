const HomeFooter = () => {
  return (
    <div className="absolute bottom-4 flex w-[100%] items-center justify-center px-12">
      <div className="flex flex-col items-center space-y-2">
        <div>
          <h5 className="text- font-bold text-[#7360ec]">
            CALSSyncs{" "}
            <span className="text-xs font-light text-[#A1A1AA]">
              by Korea univ.
            </span>
          </h5>
        </div>
        <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
          <a
            href="https://harmonious-authority-301.notion.site/113bdc870baa80f1a13cef9005274786?pvs=4"
            className="text-xs font-normal text-[#A1A1AA] hover:underline dark:text-cyan-500"
          >
            서비스 이용약관
          </a>
          &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
          <a
            href="https://harmonious-authority-301.notion.site/113bdc870baa803a9b73cb9bde370937?pvs=4"
            className="text-xs font-normal text-[#A1A1AA] hover:underline dark:text-cyan-500"
          >
            개인정보 처리방침
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeFooter;

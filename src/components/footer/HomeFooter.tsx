const HomeFooter = () => {
  return (
    <div className="absolute bottom-4 flex w-[100%] items-center justify-center px-12">
      <div className="flex flex-col items-center space-y-2">
        <div>
          <h5 className="text- font-bold text-[#7360ec]">
            ChnoAI{" "}
            <span className="text-xs font-light text-[#A1A1AA]">
              by LiFoli Corp.
            </span>
          </h5>
        </div>
        <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
          <a
            href="https://harmonious-authority-301.notion.site/Terms-of-Service-46455da80715458fb98e060cb3b92181?pvs=4"
            className="text-xs font-normal text-[#A1A1AA] hover:underline dark:text-cyan-500"
          >
            Term of Service
          </a>
          &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
          <a
            href="https://harmonious-authority-301.notion.site/Privacy-Policy-f241cf2d76af4ff0976b937fed1b86ff?pvs=4"
            className="text-xs font-normal text-[#A1A1AA] hover:underline dark:text-cyan-500"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeFooter;

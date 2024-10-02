import { useEffect, useState } from "react";
import { NotionRenderer } from "react-notion-x";
import axios from "axios";
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

import { Code } from "react-notion-x/build/third-party/code";
import { Collection } from "react-notion-x/build/third-party/collection";
import { Equation } from "react-notion-x/build/third-party/equation";
import { Modal } from "react-notion-x/build/third-party/modal";
import { Pdf } from "react-notion-x/build/third-party/pdf";
import { NotionLoadingComponent } from "./NotionLoadingComponent";

const NotionSection = ({ pageId }: { pageId: string }) => {
  const [recordMap, setRecordMap] = useState(null);

  useEffect(() => {
    console.log("pageId", pageId);
    const fetchPageData = async () => {
      try {
        console.log(pageId);
        if (pageId !== "") {
          const response = await axios.get(`/technote/notion/${pageId}`);
          console.log(response.data);
          setRecordMap(response.data.notionPageData); // Adjusting to the actual data structure
        } else {
          setRecordMap(null);
        }
      } catch (error) {
        console.error("Failed to fetch page data:", error);
      }
    };

    fetchPageData();
  }, [pageId]);

  if (!recordMap) {
    return <NotionLoadingComponent />;
  }

  return (
    <div className="flex w-1/12 flex-1 flex-col">
      <NotionRenderer
        className="flex flex-1 pt-8"
        fullPage={true}
        disableHeader={true}
        recordMap={recordMap}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
        }}
        darkMode={false}
      />
    </div>
  );
};

export default NotionSection;

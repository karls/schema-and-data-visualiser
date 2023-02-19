import React from "react";
import TextEditor from "../text-editor/TextEditor";

type QueryEditorProps = {
  query: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

const QueryEditor = ({ query, onChange }: QueryEditorProps) => {
  return (
    <>
      <TextEditor
        initialText=" "
        setText={onChange}
        highlightWords={KEYWORDS}
      />
    </>
  );
};

const KEYWORDS: string[] = ["SELECT", "WHERE", "PREFIX", "ORDER BY", "LIMIT"];

export default QueryEditor;

import React from "react";
import CodeEditor from "../code-editor/CodeEditor";

type QueryEditorProps = {
  query: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

const QueryEditor = ({ query, onChange }: QueryEditorProps) => {
  return (
    <>
      <CodeEditor code={query} setCode={onChange} language="sparql" />
    </>
  );
};

export default QueryEditor;

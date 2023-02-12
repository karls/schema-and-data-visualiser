import React from "react";
import TextArea from "antd/es/input/TextArea";

const queryTemplate = `\
SELECT ?s ?p ?o
WHERE { ?s ?p ? o}        
`;

type QueryEditorProps = {
  query: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

const QueryEditor = ({ query, onChange }: QueryEditorProps) => {
  return (
    <>
      <TextArea
        rows={10}
        value={query}
        onChange={(event) => {
            onChange(event.target.value);
        }}
        allowClear
        placeholder={queryTemplate}
      />
    </>
  );
};

export default QueryEditor;

import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../stores/store";
import CodeEditor from "./CodeEditor";

type QueryEditorProps = {
  query: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

const Editor = ({ query, onChange }: QueryEditorProps) => {
  const settings = useStore().settingsStore;

  return (
    <>
      <CodeEditor
        code={query}
        setCode={onChange}
        language="sparql"
        completions={query.split(/[\s,]+/).map((token) => token.trim())}
        darkTheme={settings.darkMode}
      />
    </>
  );
};

export default observer(Editor);

import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../stores/store";
import CodeEditor from "../code-editor/CodeEditor";

type QueryEditorProps = {
  query: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

const Editor = ({ query, onChange }: QueryEditorProps) => {
  const settings  = useStore().settingsStore;
  return (
    <>
      <CodeEditor code={query} setCode={onChange} language="sparql" darkTheme={settings.getDarkMode()} />
    </>
  );
};

export default observer(Editor);
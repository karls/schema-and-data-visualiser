// import { UnControlled as CodeMirror } from "react-codemirror2";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/addon/edit/closebrackets";
import "codemirror/mode/sparql/sparql";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/anyword-hint";
import { StreamLanguage } from "@codemirror/language";
import { sparql } from "@codemirror/legacy-modes/mode/sparql";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";

function myCompletions(context: CompletionContext) {
  let word = context.matchBefore(/\w*/)!;
  if (word.from === word.to && !context.explicit) return null;
  return {
    from: word.from,
    options: [
      { label: "SELECT", type: "keyword" },
      { label: "WHERE", type: "leyword" },
      { label: "LIMIT", type: "keyword" },
    ],
  };
}

type CodeEditorProps = {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  language: string;
};

const CodeEditor = ({ code, setCode }: CodeEditorProps) => {
  return (
    <CodeMirror
      value={code}
      basicSetup={{
        autocompletion: true,
      }}
      height="200px"
      extensions={[
        StreamLanguage.define(sparql),
        autocompletion({ override: [myCompletions] }),
      ]}
      onChange={(value: string, viewUpdate: any) => {
        setCode(value);
      }}
    />
  );
};

export default CodeEditor;

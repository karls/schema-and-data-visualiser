import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  Editor,
  Transforms,
  Range,
  createEditor,
  Descendant,
  BaseEditor,
  BaseRange,
  Node,
} from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  useSelected,
  useFocused,
} from "slate-react";

import { Portal } from "./portal";
import { CustomElement, MentionElement } from "./custom-types";

const TextEditor = ({
  initialText,
  setText,
  highlightWords,
}: {
  initialText: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  highlightWords: string[];
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<Range | null>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: initialText }],
    },
  ]);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback(
    (
      props: JSX.IntrinsicAttributes & {
        attributes: any;
        children: any;
        leaf: any;
      }
    ) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(
    () => withMentions(withReact(withHistory(createEditor()))),
    []
  );

  const chars = highlightWords.filter((c) =>
    c.toLowerCase().startsWith(search.toLowerCase().trim())
  );
  //.slice(0, 10);

  const onKeyDown = useCallback(
    (event: { key: any; preventDefault: () => void }) => {
      if (target && chars.length > 0) {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case "ArrowUp":
            event.preventDefault();
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);
            editor.insertText(" ");
            insertMention(editor, chars[index]);
            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
      } else {
        switch (event.key) {
          case "Enter":
            event.preventDefault();
            console.log("here");
            editor.insertText("\n ");
            break;
        }
      }
    },
    [chars, editor, index, target]
  );

  useEffect(() => {
    if (target && chars.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el!.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el!.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [chars.length, editor, index, search, target]);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue: Descendant[]) => {
        setValue(newValue);
        setText(serialize(newValue));
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const wordBefore = Editor.before(editor, start, { unit: "word" });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);
          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          // const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
          // const beforeMatch = beforeText && beforeText.match(/(\s|^)(\w+$)/);
          const beforeMatch = beforeText && beforeText.match(/^\s(\w+$)/);
          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);

          if (beforeMatch && afterMatch) {
            setTarget(beforeRange);
            setSearch(beforeMatch[1]);
            setIndex(0);
            return;
          }
        }

        setTarget(null);
      }}
    >
      <Editable
        style={{ border: "1px solid black", padding: 5, borderRadius: 5 }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
        placeholder="Enter some text..."
      />
      {target && chars.length > 0 && (
        <Portal>
          <div
            ref={ref}
            style={{
              top: "-9999px",
              left: "-9999px",
              position: "absolute",
              zIndex: 1,
              padding: "3px",
              background: "white",
              borderRadius: "4px",
              boxShadow: "0 1px 5px rgba(0,0,0,.2)",
            }}
            data-cy="mentions-portal"
          >
            {chars.map((char, i) => (
              <div
                key={char}
                style={{
                  padding: "1px 3px",
                  borderRadius: "3px",
                  background: i === index ? "#B4D5FF" : "transparent",
                }}
              >
                {char}
              </div>
            ))}
          </div>
        </Portal>
      )}
    </Slate>
  );
};

const withMentions = (
  editor: BaseEditor &
    ReactEditor &
    HistoryEditor & {
      nodeToDecorations?:
        | Map<CustomElement, (BaseRange & { [key: string]: unknown })[]>
        | undefined;
    }
) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "mention" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "mention" ? true : isVoid(element);
  };

  editor.markableVoid = (element) => {
    return element.type === "mention" || markableVoid(element);
  };

  return editor;
};

const insertMention = (
  editor: BaseEditor &
    ReactEditor &
    HistoryEditor & {
      nodeToDecorations?:
        | Map<CustomElement, (BaseRange & { [key: string]: unknown })[]>
        | undefined;
    },
  character: string
) => {
  const mention: MentionElement = {
    type: "mention",
    character,
    children: [{ text: character }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

// Borrow Leaf renderer from the Rich Text example.
// In a real project you would get this via `withRichText(editor)` or similar.
const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const Element = (
  props: JSX.IntrinsicAttributes & {
    attributes: any;
    children: any;
    element: any;
  }
) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "mention":
      return <Mention {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Mention = ({ attributes, children, element }: any) => {
  const selected = useSelected();
  const focused = useFocused();
  const style: React.CSSProperties = {
    verticalAlign: "baseline",
    display: "inline-block",
    borderRadius: "4px",
    fontWeight: "bold",
    boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
  };
  // See if our empty text child has any styling marks applied and apply those
  if (element.children[0].bold) {
    style.fontWeight = "bold";
  }
  if (element.children[0].italic) {
    style.fontStyle = "italic";
  }
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(" ", "-")}`}
      style={style}
    >
      {children}
      {element.character}
    </span>
  );
};

function serialize(nodes: any[]) {
  return nodes.map((n) => Node.string(n)).join("\n");
}

export default TextEditor;

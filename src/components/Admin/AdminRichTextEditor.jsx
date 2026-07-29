import { useEffect, useRef, useState } from "react";
import {
  FiBold,
  FiCode,
  FiItalic,
  FiLink,
  FiList,
  FiMoreHorizontal,
  FiTrash2,
  FiType,
  FiUnderline,
} from "react-icons/fi";
import { MdFormatColorFill, MdFormatColorText, MdFormatQuote } from "react-icons/md";
import { RiStrikethrough } from "react-icons/ri";
import { TbListNumbers } from "react-icons/tb";

const FONT_SIZES = [
  { label: "Small", value: "2" },
  { label: "Normal", value: "3" },
  { label: "Large", value: "5" },
  { label: "Extra large", value: "6" },
];

const AdminRichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Enter blog description",
  ariaLabel = "Blog description",
}) => {
  const editorRef = useRef(null);
  const textColorRef = useRef(null);
  const highlightRef = useRef(null);
  const rootRef = useRef(null);
  const [showMore, setShowMore] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [activeFormats, setActiveFormats] = useState({});

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (editor.contains(document.activeElement)) return;

    const nextValue = value || "";
    if (editor.innerHTML !== nextValue) {
      editor.innerHTML = nextValue;
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setShowMore(false);
        setShowFontMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const emitChange = () => {
    onChange?.(editorRef.current?.innerHTML || "");
  };

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
    });
  };

  const normalizeBoldTags = () => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.querySelectorAll("b").forEach((element) => {
      const strong = document.createElement("strong");
      strong.innerHTML = element.innerHTML;
      element.replaceWith(strong);
    });

    editor.querySelectorAll('span[style*="font-weight"]').forEach((element) => {
      const weight = element.style.fontWeight;
      if (weight === "bold" || Number(weight) >= 600) {
        const strong = document.createElement("strong");
        strong.innerHTML = element.innerHTML;
        element.replaceWith(strong);
      }
    });
  };

  const runCommand = (command, commandValue = null) => {
    focusEditor();

    if (command === "bold") {
      document.execCommand("styleWithCSS", false, false);
      document.execCommand("bold", false, null);
      normalizeBoldTags();
    } else {
      document.execCommand(command, false, commandValue);
    }

    emitChange();
    updateActiveFormats();
  };

  const handleInput = () => {
    normalizeBoldTags();
    emitChange();
    updateActiveFormats();
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    emitChange();
    setActiveFormats({});
    focusEditor();
  };

  const handleAddLink = () => {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    runCommand("createLink", url);
  };

  const handleFontSize = (size) => {
    runCommand("fontSize", size);
    setShowFontMenu(false);
  };

  const handleColorPick = (command, color) => {
    if (!color) return;
    runCommand(command, color);
  };

  const preventToolbarFocusLoss = (event) => {
    event.preventDefault();
  };

  const toolbarButton = (label, icon, onClick, commandKey) => (
    <button
      key={label}
      type="button"
      className={`admin_rich_text_editor__btn${
        commandKey && activeFormats[commandKey] ? " is-active" : ""
      }`}
      onMouseDown={preventToolbarFocusLoss}
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={commandKey ? Boolean(activeFormats[commandKey]) : undefined}
    >
      {icon}
    </button>
  );

  return (
    <div className="admin_rich_text_editor" ref={rootRef}>
      <div className="admin_rich_text_editor__toolbar">
        <div className="admin_rich_text_editor__toolbar-group">
          {toolbarButton("Bold", <FiBold />, () => runCommand("bold"), "bold")}
          {toolbarButton(
            "Italic",
            <FiItalic />,
            () => runCommand("italic"),
            "italic",
          )}
          {toolbarButton(
            "Underline",
            <FiUnderline />,
            () => runCommand("underline"),
            "underline",
          )}
          {toolbarButton(
            "Strikethrough",
            <RiStrikethrough />,
            () => runCommand("strikeThrough"),
            "strikeThrough",
          )}
          {toolbarButton(
            "Bulleted list",
            <FiList />,
            () => runCommand("insertUnorderedList"),
          )}
          {toolbarButton(
            "Numbered list",
            <TbListNumbers />,
            () => runCommand("insertOrderedList"),
          )}

          <button
            type="button"
            className="admin_rich_text_editor__btn admin_rich_text_editor__btn--color"
            onMouseDown={preventToolbarFocusLoss}
            onClick={() => highlightRef.current?.click()}
            aria-label="Highlight color"
            title="Highlight color"
          >
            <MdFormatColorFill />
            <input
              ref={highlightRef}
              type="color"
              className="admin_rich_text_editor__color-input"
              defaultValue="#fff59d"
              onChange={(event) =>
                handleColorPick("hiliteColor", event.target.value)
              }
            />
          </button>

          <button
            type="button"
            className="admin_rich_text_editor__btn admin_rich_text_editor__btn--color"
            onMouseDown={preventToolbarFocusLoss}
            onClick={() => textColorRef.current?.click()}
            aria-label="Text color"
            title="Text color"
          >
            <MdFormatColorText />
            <input
              ref={textColorRef}
              type="color"
              className="admin_rich_text_editor__color-input"
              defaultValue="#0d1e32"
              onChange={(event) =>
                handleColorPick("foreColor", event.target.value)
              }
            />
          </button>

          <div className="admin_rich_text_editor__menu-wrap">
            <button
              type="button"
              className={`admin_rich_text_editor__btn${showFontMenu ? " is-active" : ""}`}
              onMouseDown={preventToolbarFocusLoss}
              onClick={() => {
                setShowFontMenu((prev) => !prev);
                setShowMore(false);
              }}
              aria-label="Font size"
              title="Font size"
            >
              <FiType />
            </button>
            {showFontMenu && (
              <div className="admin_rich_text_editor__menu">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    className="admin_rich_text_editor__menu-item"
                    onMouseDown={preventToolbarFocusLoss}
                    onClick={() => handleFontSize(size.value)}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {toolbarButton(
            "Blockquote",
            <MdFormatQuote />,
            () => runCommand("formatBlock", "blockquote"),
          )}
          {toolbarButton("Insert link", <FiLink />, handleAddLink)}
          {toolbarButton(
            "Code block",
            <FiCode />,
            () => runCommand("formatBlock", "pre"),
          )}

          <div className="admin_rich_text_editor__menu-wrap">
            <button
              type="button"
              className={`admin_rich_text_editor__btn${showMore ? " is-active" : ""}`}
              onMouseDown={preventToolbarFocusLoss}
              onClick={() => {
                setShowMore((prev) => !prev);
                setShowFontMenu(false);
              }}
              aria-label="More formatting options"
              title="More options"
            >
              <FiMoreHorizontal />
            </button>
            {showMore && (
              <div className="admin_rich_text_editor__menu">
                <button
                  type="button"
                  className="admin_rich_text_editor__menu-item"
                  onMouseDown={preventToolbarFocusLoss}
                  onClick={() => {
                    runCommand("formatBlock", "p");
                    setShowMore(false);
                  }}
                >
                  Normal text
                </button>
                <button
                  type="button"
                  className="admin_rich_text_editor__menu-item"
                  onMouseDown={preventToolbarFocusLoss}
                  onClick={() => {
                    runCommand("formatBlock", "h3");
                    setShowMore(false);
                  }}
                >
                  Heading
                </button>
                <button
                  type="button"
                  className="admin_rich_text_editor__menu-item"
                  onMouseDown={preventToolbarFocusLoss}
                  onClick={() => {
                    runCommand("insertHorizontalRule");
                    setShowMore(false);
                  }}
                >
                  Divider
                </button>
                <button
                  type="button"
                  className="admin_rich_text_editor__menu-item"
                  onMouseDown={preventToolbarFocusLoss}
                  onClick={() => {
                    runCommand("removeFormat");
                    setShowMore(false);
                  }}
                >
                  Clear formatting
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="admin_rich_text_editor__btn admin_rich_text_editor__btn--clear"
          onMouseDown={preventToolbarFocusLoss}
          onClick={handleClear}
          aria-label="Clear description"
          title="Clear"
        >
          <FiTrash2 />
        </button>
      </div>

      <div
        ref={editorRef}
        className="admin_rich_text_editor__content"
        contentEditable
        role="textbox"
        aria-label={ariaLabel}
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={handleInput}
        onMouseUp={updateActiveFormats}
        onKeyUp={updateActiveFormats}
        onFocus={updateActiveFormats}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default AdminRichTextEditor;

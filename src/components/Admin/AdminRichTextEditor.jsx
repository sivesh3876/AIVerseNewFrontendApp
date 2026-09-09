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
  const savedRangeRef = useRef(null);
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

  const isSelectionInsideEditor = (range) => {
    const editor = editorRef.current;
    if (!editor || !range) return false;
    const container = range.commonAncestorContainer;
    return container === editor || editor.contains(container);
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    if (!isSelectionInsideEditor(range)) return false;

    savedRangeRef.current = range.cloneRange();
    return true;
  };

  const restoreSelection = () => {
    const editor = editorRef.current;
    if (!editor) return false;

    editor.focus({ preventScroll: true });

    const savedRange = savedRangeRef.current;
    if (!savedRange || !isSelectionInsideEditor(savedRange)) {
      const selection = window.getSelection();
      if (!selection) return false;

      const fallbackRange = document.createRange();
      fallbackRange.selectNodeContents(editor);
      fallbackRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(fallbackRange);
      savedRangeRef.current = fallbackRange.cloneRange();
      return true;
    }

    const selection = window.getSelection();
    if (!selection) return false;

    selection.removeAllRanges();
    selection.addRange(savedRange.cloneRange());
    return true;
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

  const runCommand = (command, commandValue = null) => {
    restoreSelection();
    document.execCommand("styleWithCSS", false, false);
    document.execCommand(command, false, commandValue);

    emitChange();
    saveSelection();
    updateActiveFormats();
  };

  const handleInput = () => {
    emitChange();
    saveSelection();
    updateActiveFormats();
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    emitChange();
    setActiveFormats({});
    savedRangeRef.current = null;
    editorRef.current?.focus({ preventScroll: true });
  };

  const handleAddLink = () => {
    saveSelection();
    const url = window.prompt("Enter link URL");
    if (!url) return;

    const trimmedUrl = url.trim();
    if (!trimmedUrl || /^\s*javascript:/i.test(trimmedUrl)) return;

    const normalizedUrl = /^(https?:|mailto:|tel:|\/|#)/i.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`;
    runCommand("createLink", normalizedUrl);
  };

  const handleFontSize = (size) => {
    runCommand("fontSize", size);
    setShowFontMenu(false);
  };

  const handleColorPick = (command, color) => {
    if (!color) return;
    runCommand(command, color);
  };

  const preserveSelectionOnToolbarMouseDown = (event) => {
    saveSelection();
    event.preventDefault();
  };

  const toolbarButton = (label, icon, onClick, commandKey) => (
    <button
      key={label}
      type="button"
      className={`admin_rich_text_editor__btn${
        commandKey && activeFormats[commandKey] ? " is-active" : ""
      }`}
      onMouseDown={preserveSelectionOnToolbarMouseDown}
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
            onMouseDown={preserveSelectionOnToolbarMouseDown}
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
              onMouseDown={(event) => {
                saveSelection();
                event.stopPropagation();
              }}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) =>
                handleColorPick("hiliteColor", event.target.value)
              }
            />
          </button>

          <button
            type="button"
            className="admin_rich_text_editor__btn admin_rich_text_editor__btn--color"
            onMouseDown={preserveSelectionOnToolbarMouseDown}
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
              onMouseDown={(event) => {
                saveSelection();
                event.stopPropagation();
              }}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) =>
                handleColorPick("foreColor", event.target.value)
              }
            />
          </button>

          <div className="admin_rich_text_editor__menu-wrap">
            <button
              type="button"
              className={`admin_rich_text_editor__btn${showFontMenu ? " is-active" : ""}`}
              onMouseDown={preserveSelectionOnToolbarMouseDown}
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
                    onMouseDown={preserveSelectionOnToolbarMouseDown}
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
              onMouseDown={preserveSelectionOnToolbarMouseDown}
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
                  onMouseDown={preserveSelectionOnToolbarMouseDown}
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
                  onMouseDown={preserveSelectionOnToolbarMouseDown}
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
                  onMouseDown={preserveSelectionOnToolbarMouseDown}
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
                  onMouseDown={preserveSelectionOnToolbarMouseDown}
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
          onMouseDown={preserveSelectionOnToolbarMouseDown}
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
        onMouseUp={() => {
          saveSelection();
          updateActiveFormats();
        }}
        onKeyUp={() => {
          saveSelection();
          updateActiveFormats();
        }}
        onFocus={() => {
          saveSelection();
          updateActiveFormats();
        }}
        onBlur={saveSelection}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default AdminRichTextEditor;

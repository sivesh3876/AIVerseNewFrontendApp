(function () {
  var CHAT_ICON =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" ' +
    'stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<circle cx="8.5" cy="11.5" r="1" fill="currentColor"/>' +
    '<circle cx="12" cy="11.5" r="1" fill="currentColor"/>' +
    '<circle cx="15.5" cy="11.5" r="1" fill="currentColor"/></svg>';

  // Espire figure mark reimagined as a friendly robot (dynamic raised-arms pose).
  var AVATAR_SVG =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="32" cy="32" r="32" fill="#143d7e"/>' +
    '<line x1="32" y1="12" x2="32" y2="19" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>' +
    '<circle cx="32" cy="10" r="2.8" fill="#ef8722"/>' +
    '<rect x="21.5" y="18.5" width="21" height="15.5" rx="6.5" fill="#ffffff"/>' +
    '<circle cx="27.5" cy="26.5" r="2.5" fill="#ef8722"/>' +
    '<circle cx="36.5" cy="26.5" r="2.5" fill="#ef8722"/>' +
    '<path d="M22 39 L14 30" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round"/>' +
    '<path d="M42 39 L50 30" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round"/>' +
    '<rect x="24.5" y="36.5" width="15" height="13.5" rx="5.5" fill="#ffffff"/>' +
    '<path d="M28.5 50 L24.5 57" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round"/>' +
    '<path d="M35.5 50 L39.5 57" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round"/>' +
    '</svg>';

  var CLEAR_ICON =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M4 7h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
    '<path d="M9 7V4.8c0-.4.4-.8.8-.8h4.4c.4 0 .8.4.8.8V7" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M6.5 7l.8 12c0 .6.5 1 1.1 1h7.2c.6 0 1.1-.4 1.1-1l.8-12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M10 11v5.5M14 11v5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  var instanceCount = 0;

  function loadStylesheet(cssPath) {
    if (!cssPath) {
      return;
    }
    var already = document.querySelector('link[data-espire-chat="1"]');
    if (already) {
      return;
    }
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssPath;
    link.setAttribute("data-espire-chat", "1");
    document.head.appendChild(link);
  }

  function createElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (typeof text === "string") {
      element.textContent = text;
    }
    return element;
  }

  function ensureTrailingSlashFree(value) {
    return (value || "").replace(/\/+$/, "");
  }

  function isSafeHref(url) {
    if (typeof url !== "string" || !url) {
      return false;
    }
    return /^(https?:)?\/\//i.test(url) || url.charAt(0) === "/";
  }

  // Render inline **bold** safely as text + <strong> nodes (no innerHTML).
  function appendInline(parent, text) {
    var segments = String(text).split("**");
    segments.forEach(function (seg, i) {
      if (seg === "") {
        return;
      }
      if (i % 2 === 1) {
        var strong = document.createElement("strong");
        strong.textContent = seg;
        parent.appendChild(strong);
      } else {
        parent.appendChild(document.createTextNode(seg));
      }
    });
  }

  // Lightweight markdown: **bold**, "- / * / •" bullets, "1." numbered lists, paragraphs.
  function renderRichText(bubble, text) {
    var lines = String(text || "").split("\n");
    var list = null;
    var listTag = null;

    lines.forEach(function (rawLine) {
      var line = rawLine.replace(/\s+$/, "");
      var bulletMatch = line.match(/^\s*[-*•]\s+(.*)$/);
      var numberMatch = line.match(/^\s*\d+[.)]\s+(.*)$/);

      if (bulletMatch || numberMatch) {
        var wantTag = bulletMatch ? "ul" : "ol";
        if (!list || listTag !== wantTag) {
          list = document.createElement(wantTag);
          listTag = wantTag;
          bubble.appendChild(list);
        }
        var li = document.createElement("li");
        appendInline(li, (bulletMatch ? bulletMatch[1] : numberMatch[1]));
        list.appendChild(li);
        return;
      }

      list = null;
      listTag = null;
      if (line.trim() === "") {
        return;
      }
      var para = createElement("div", "espire-chat-para");
      appendInline(para, line);
      bubble.appendChild(para);
    });

    if (!bubble.childNodes.length) {
      bubble.textContent = text || "";
    }
  }

  function createSources(sources) {
    if (!Array.isArray(sources) || !sources.length) {
      return null;
    }

    // Compact citation row: "Sources" label + numbered pill chips (summary lives in the tooltip).
    var sourcesWrap = createElement("div", "espire-chat-sources");
    sourcesWrap.appendChild(createElement("span", "espire-chat-sources-label", "Sources"));
    sources.forEach(function (source, index) {
      var chip = createElement("a", "espire-chat-source-chip");
      chip.href = isSafeHref(source.url) ? source.url : "#";
      chip.target = "_blank";
      chip.rel = "noopener noreferrer";
      var label = source.title || "Source";
      chip.title = source.summary && source.summary !== label ? label + " — " + source.summary : label;

      chip.appendChild(createElement("span", "espire-chat-source-num", String(index + 1)));
      chip.appendChild(createElement("span", "espire-chat-source-text", label));
      sourcesWrap.appendChild(chip);
    });

    return sourcesWrap;
  }

  function buildAvatar() {
    var avatar = createElement("div", "espire-chat-avatar");
    avatar.setAttribute("aria-hidden", "true");
    return avatar;
  }

  function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) {
      hours = 12;
    }
    return hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + meridiem;
  }

  function renderMessage(messagesHost, role, text, sources) {
    var row = createElement("div", "espire-chat-message " + role);
    if (role === "assistant") {
      row.appendChild(buildAvatar());
    }

    var content = createElement("div", "espire-chat-content");
    var bubble = createElement("div", "espire-chat-bubble");
    if (role === "assistant") {
      renderRichText(bubble, text);
    } else {
      bubble.textContent = text;
    }
    content.appendChild(bubble);

    var sourceList = createSources(sources);
    if (sourceList) {
      content.appendChild(sourceList);
    }

    content.appendChild(createElement("div", "espire-chat-time", formatTime(new Date())));
    row.appendChild(content);

    messagesHost.appendChild(row);
    messagesHost.scrollTop = messagesHost.scrollHeight;
    return row;
  }

  function renderTyping(messagesHost) {
    var row = createElement("div", "espire-chat-message assistant");
    row.appendChild(buildAvatar());

    var content = createElement("div", "espire-chat-content");
    var bubble = createElement("div", "espire-chat-bubble");
    var typing = createElement("div", "espire-chat-typing");
    typing.appendChild(document.createTextNode("Thinking"));

    var dots = createElement("span", "espire-chat-dots");
    dots.appendChild(createElement("span"));
    dots.appendChild(createElement("span"));
    dots.appendChild(createElement("span"));

    typing.appendChild(dots);
    bubble.appendChild(typing);
    content.appendChild(bubble);
    row.appendChild(content);
    messagesHost.appendChild(row);
    messagesHost.scrollTop = messagesHost.scrollHeight;
    return row;
  }

  function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 140) + "px";
  }

  function normalizeApiUrl(apiUrl) {
    var cleanBase = ensureTrailingSlashFree(apiUrl);
    if (cleanBase.endsWith("/api/chat")) {
      return cleanBase;
    }
    return cleanBase + "/api/chat";
  }

  function EspireChatWidget(config) {
    this.config = Object.assign(
      {
        apiUrl: "",
        mountTarget: document.body,
        cssPath: "espire-chat-widget.css",
        launcherLabel: "Ask AI Verse",
        panelTitle: "Ask AI Verse",
        panelSubtitle: "Grounded answers from Espire AI Verse.",
        welcomeMessage:
          "Hi, I can help you explore Espire AI Verse — our enterprise AI solutions, capabilities, success stories, and industry expertise. Ask me anything.",
        suggestedQuestions: [
          "What AI solutions does Espire offer?",
          "Tell me about Espire's agentic AI capabilities.",
          "How does Espire help with customer communication management?",
          "Show me a success story.",
        ],
        placeholder: "Ask about Espire AI Verse...",
        emptyMessage: "Please enter a question first.",
        errorMessage:
          "I ran into a problem reaching the chatbot service. Please try again in a moment.",
      },
      config || {}
    );

    if (!this.config.apiUrl) {
      throw new Error("EspireChatWidget requires config.apiUrl");
    }

    this.apiUrl = normalizeApiUrl(this.config.apiUrl);
    this.isOpen = false;
    this.isBusy = false;
    this.uid = "espire-chat-" + ++instanceCount;
    this.root = null;
    this.panel = null;
    this.messages = null;
    this.textarea = null;
    this.sendButton = null;
    this.launcher = null;
    this.suggestions = null;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handlePanelKeyDown = this.handlePanelKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  EspireChatWidget.prototype.mount = function () {
    loadStylesheet(this.config.cssPath);

    var panelId = this.uid + "-panel";
    var titleId = this.uid + "-title";

    var root = createElement("div", "espire-chat-root");

    var panel = createElement("section", "espire-chat-panel");
    panel.id = panelId;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-labelledby", titleId);
    panel.setAttribute("aria-modal", "false");
    panel.addEventListener("keydown", this.handlePanelKeyDown);

    var header = createElement("div", "espire-chat-header");
    var headerAvatar = createElement("div", "espire-chat-header-avatar");
    headerAvatar.setAttribute("aria-hidden", "true");
    headerAvatar.appendChild(createElement("span", "espire-chat-presence"));
    var headerCopy = createElement("div", "espire-chat-header-copy");
    var heading = createElement("h2", "", this.config.panelTitle);
    heading.id = titleId;
    headerCopy.appendChild(heading);
    headerCopy.appendChild(createElement("p", "", this.config.panelSubtitle));

    var clearButton = createElement("button", "espire-chat-clear");
    clearButton.type = "button";
    clearButton.setAttribute("aria-label", "Clear chat");
    clearButton.setAttribute("title", "Clear chat");
    clearButton.innerHTML = CLEAR_ICON;
    clearButton.addEventListener("click", this.clearChat.bind(this));

    var closeButton = createElement("button", "espire-chat-close", "×");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close chat");
    closeButton.addEventListener("click", this.close.bind(this));

    header.appendChild(headerAvatar);
    header.appendChild(headerCopy);
    header.appendChild(clearButton);
    header.appendChild(closeButton);

    var messages = createElement("div", "espire-chat-messages");
    messages.setAttribute("role", "log");
    messages.setAttribute("aria-live", "polite");
    messages.setAttribute("aria-atomic", "false");

    var welcome = renderMessage(messages, "assistant", this.config.welcomeMessage);
    this.appendSuggestions(welcome);

    var form = createElement("form", "espire-chat-form");
    var inputWrap = createElement("div", "espire-chat-input-wrap");
    var textarea = createElement("textarea", "espire-chat-textarea");
    textarea.placeholder = this.config.placeholder;
    textarea.rows = 1;
    textarea.setAttribute("aria-label", this.config.placeholder);
    textarea.addEventListener("input", function () {
      autoResize(textarea);
    });
    textarea.addEventListener("keydown", this.handleKeyDown);

    var sendButton = createElement("button", "espire-chat-send", "Send");
    sendButton.type = "submit";

    inputWrap.appendChild(textarea);
    inputWrap.appendChild(sendButton);

    var hint = createElement(
      "div",
      "espire-chat-hint",
      "Answers are generated from website content and may occasionally ask you to refine your question."
    );

    form.appendChild(inputWrap);
    form.appendChild(hint);
    form.addEventListener("submit", this.handleSubmit);

    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(form);

    var launcher = createElement("button", "espire-chat-launcher");
    launcher.type = "button";
    launcher.setAttribute("aria-haspopup", "dialog");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-controls", panelId);
    var icon = createElement("span", "espire-chat-launcher-icon");
    icon.innerHTML = CHAT_ICON;
    launcher.appendChild(icon);
    launcher.appendChild(createElement("span", "", this.config.launcherLabel));
    launcher.addEventListener("click", this.toggle.bind(this));

    root.appendChild(panel);
    root.appendChild(launcher);
    this.config.mountTarget.appendChild(root);

    this.root = root;
    this.panel = panel;
    this.messages = messages;
    this.textarea = textarea;
    this.sendButton = sendButton;
    this.launcher = launcher;
  };

  EspireChatWidget.prototype.appendSuggestions = function (welcomeMessage) {
    var questions = this.config.suggestedQuestions;
    if (!Array.isArray(questions) || !questions.length) {
      return;
    }

    var self = this;
    var wrap = createElement("div", "espire-chat-suggestions");
    questions.forEach(function (question) {
      var chip = createElement("button", "espire-chat-chip", question);
      chip.type = "button";
      chip.addEventListener("click", function () {
        self.dismissSuggestions();
        renderMessage(self.messages, "user", question);
        self.sendMessage(question);
      });
      wrap.appendChild(chip);
    });

    var host = welcomeMessage.querySelector(".espire-chat-content") || welcomeMessage;
    var timeEl = host.querySelector(".espire-chat-time");
    if (timeEl) {
      host.insertBefore(wrap, timeEl);
    } else {
      host.appendChild(wrap);
    }
    this.suggestions = wrap;
  };

  EspireChatWidget.prototype.dismissSuggestions = function () {
    if (this.suggestions && this.suggestions.parentNode) {
      this.suggestions.parentNode.removeChild(this.suggestions);
      this.suggestions = null;
    }
  };

  EspireChatWidget.prototype.toggle = function () {
    if (this.isOpen) {
      this.close();
      return;
    }
    this.open();
  };

  EspireChatWidget.prototype.open = function () {
    this.isOpen = true;
    this.panel.classList.add("is-open");
    this.launcher.setAttribute("aria-expanded", "true");
    this.textarea.focus();
  };

  EspireChatWidget.prototype.close = function () {
    this.isOpen = false;
    this.panel.classList.remove("is-open");
    this.launcher.setAttribute("aria-expanded", "false");
    this.launcher.focus();
  };

  EspireChatWidget.prototype.clearChat = function () {
    if (this.isBusy) {
      return;
    }
    this.messages.innerHTML = "";
    this.suggestions = null;
    var welcome = renderMessage(this.messages, "assistant", this.config.welcomeMessage);
    this.appendSuggestions(welcome);
    if (this.isOpen) {
      this.textarea.focus();
    }
  };

  EspireChatWidget.prototype.handlePanelKeyDown = function (event) {
    if (event.key === "Escape") {
      event.preventDefault();
      this.close();
    }
  };

  EspireChatWidget.prototype.handleKeyDown = function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.handleSubmit(event);
    }
  };

  EspireChatWidget.prototype.handleSubmit = function (event) {
    event.preventDefault();
    if (this.isBusy) {
      return;
    }

    var message = this.textarea.value.trim();
    if (!message) {
      renderMessage(this.messages, "assistant", this.config.emptyMessage);
      return;
    }

    this.dismissSuggestions();
    this.textarea.value = "";
    autoResize(this.textarea);
    renderMessage(this.messages, "user", message);
    this.sendMessage(message);
  };

  EspireChatWidget.prototype.setBusy = function (isBusy) {
    this.isBusy = isBusy;
    this.sendButton.disabled = isBusy;
    this.sendButton.textContent = isBusy ? "Sending..." : "Send";
  };

  EspireChatWidget.prototype.sendMessage = async function (message) {
    this.setBusy(true);
    var typingMessage = renderTyping(this.messages);

    try {
      var response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });

      var payload = null;
      try {
        payload = await response.json();
      } catch (parseError) {
        payload = null;
      }
      typingMessage.remove();

      if (!response.ok) {
        renderMessage(
          this.messages,
          "assistant",
          (payload && payload.error) || this.config.errorMessage
        );
        return;
      }

      renderMessage(
        this.messages,
        "assistant",
        (payload && payload.answer) || this.config.errorMessage,
        (payload && payload.sources) || []
      );
    } catch (error) {
      typingMessage.remove();
      renderMessage(this.messages, "assistant", this.config.errorMessage);
    } finally {
      this.setBusy(false);
      if (this.isOpen) {
        this.textarea.focus();
      }
    }
  };

  window.EspireChatWidget = {
    init: function (config) {
      var widget = new EspireChatWidget(config);
      widget.mount();
      return widget;
    },
  };
})();

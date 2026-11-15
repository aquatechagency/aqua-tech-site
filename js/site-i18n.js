(function () {
  const STORAGE_KEY = "aqua_lang";

  /* HP20: the Arabic page is the HTML as served, so nothing is translated on
     load for it and the ~80KB dictionary is not even downloaded. It is fetched
     (js/site-i18n-dict.js, address in <meta name="aqua-i18n-dict">) only when
     English is stored or chosen, and once, after which both directions work. */
  let D = null;
  let dictPromise = null;

  function loadDictionary() {
    if (!D && window.AQUA_I18N_DICT) D = window.AQUA_I18N_DICT;
    if (D) return Promise.resolve(D);
    if (dictPromise) return dictPromise;

    dictPromise = new Promise(function (resolve, reject) {
      const meta = document.querySelector('meta[name="aqua-i18n-dict"]');
      /* A stored English choice starts this download from <head> (id below). */
      let script = document.getElementById("aqua-i18n-dict");
      const reuse = Boolean(script);

      if (!script) {
        script = document.createElement("script");
        script.id = "aqua-i18n-dict";
        script.src = meta ? meta.content : "./js/site-i18n-dict.js";
        script.async = true;
      }
      script.onload = function () {
        D = window.AQUA_I18N_DICT;
        D ? resolve(D) : reject(new Error("i18n dictionary missing"));
      };
      script.onerror = function () {
        dictPromise = null;
        reject(new Error("i18n dictionary failed to load"));
      };
      if (!reuse) document.head.appendChild(script);
    });

    return dictPromise;
  }

  function translateDataI18n(lang) {
    const dict = D.DATA_I18N[lang] || D.DATA_I18N.ar;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key && dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key && dict[key]) {
        el.setAttribute("placeholder", dict[key]);
      }
    });
  }
  function getMap(lang) {
    return lang === "en" ? D.AR_TO_EN : D.EN_TO_AR;
  }

  function shouldSkipTextNode(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    return Boolean(parent.closest("script, style, noscript, svg, code, pre"));
  }

  /* Longest phrase first, so a long phrase is replaced before any shorter
     phrase it contains. Sorted once per map, not once per text node. */
  const sortedEntries = new WeakMap();

  function getSortedEntries(map) {
    let entries = sortedEntries.get(map);
    if (!entries) {
      entries = Object.entries(map)
        .filter(([from]) => from)
        .sort((a, b) => b[0].length - a[0].length);
      sortedEntries.set(map, entries);
    }
    return entries;
  }

  function replaceInlineKnownPhrases(text, map) {
    let output = text;
    const entries = getSortedEntries(map);

    for (let i = 0; i < entries.length; i++) {
      if (output.includes(entries[i][0])) {
        output = output.split(entries[i][0]).join(entries[i][1]);
      }
    }

    return output;
  }

  function replaceTextNode(node, map) {
    const original = node.nodeValue;
    const trimmed = original.trim();
    if (!trimmed) return;

    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";

    if (map[trimmed]) {
      node.nodeValue = leading + map[trimmed] + trailing;
      return;
    }

    const replaced = replaceInlineKnownPhrases(trimmed, map);
    if (replaced !== trimmed) {
      node.nodeValue = leading + replaced + trailing;
    }
  }

  /* A text node can only change if it contains one of the map's phrases. Nearly
     every node holds only the target language already (Arabic text under the
     Arabic map), so one regex test rules it out before the per-phrase loop.
     The pattern is the script the phrases are written in, plus any phrase
     that has none of it, so a node it rejects can never contain a phrase. */
  const nodeFilters = new WeakMap();

  function getNodeFilter(map) {
    let cached = nodeFilters.get(map);
    if (!cached) {
      const keys = Object.keys(map).filter(Boolean);
      const arabic = /[؀-ۿ]/;
      const script =
        keys.filter((key) => arabic.test(key)).length > keys.length / 2
          ? arabic
          : /[A-Za-z]/;
      const loose = keys
        .filter((key) => !script.test(key))
        .map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      cached = new RegExp(
        script.source + (loose.length ? "|" + loose.join("|") : ""),
      );
      nodeFilters.set(map, cached);
    }
    return cached;
  }

  function translateTextNodes(lang) {
    const map = getMap(lang);
    const mayChange = getNodeFilter(map);
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!mayChange.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;

          return shouldSkipTextNode(node)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT;
        },
      },
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => replaceTextNode(node, map));
  }

  function translateAttributes(lang) {
    const map = getMap(lang);

    document.querySelectorAll("[placeholder]").forEach((el) => {
      const value = el.getAttribute("placeholder");
      if (value && map[value]) el.setAttribute("placeholder", map[value]);
    });

    document.querySelectorAll("[aria-label]").forEach((el) => {
      const value = el.getAttribute("aria-label");
      if (value && map[value]) el.setAttribute("aria-label", map[value]);
    });

    document.querySelectorAll("[title]").forEach((el) => {
      const value = el.getAttribute("title");
      if (value && map[value]) el.setAttribute("title", map[value]);
    });
  }

  function updateAquaMeta(lang) {
    document.title =
      lang === "en"
        ? "Aqua.Tech | Growth • Software • AI"
        : "Aqua.Tech | Growth • Software • AI";

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        "content",
        lang === "en"
          ? "Aqua.Tech builds professional landing pages, websites, systems, and automation for real business growth."
          : "Aqua.Tech تبني صفحات تسويقية ومواقع وأنظمة وأتمتة تساعد الشركات ورواد الأعمال على النمو.",
      );
    }
  }

  function updateToggle(lang) {
    const btn = document.getElementById("langToggle");
    if (!btn) return;

    /* The accessible name starts with the visible label (WCAG 2.5.3), and
       lang matches the language the button switches to. */
    btn.textContent = lang === "en" ? "AR" : "EN";
    btn.setAttribute("lang", lang === "en" ? "ar" : "en");
    btn.setAttribute(
      "aria-label",
      lang === "en" ? "AR – التبديل للعربية" : "EN – Switch to English",
    );
    btn.setAttribute(
      "title",
      lang === "en" ? "التبديل للعربية" : "Switch to English",
    );
  }

  let wantedLang = null;

  function finishLanguage(nextLang) {
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === "en" ? "ltr" : "rtl";
    updateAquaMeta(nextLang);
    updateToggle(nextLang);

    localStorage.setItem(STORAGE_KEY, nextLang);
  }

  function applyAquaLanguage(lang) {
    const nextLang = lang === "en" ? "en" : "ar";
    wantedLang = nextLang;

    /* HP20: Arabic is the HTML as served. Until English has been shown there
       is nothing to translate, so no dictionary and no DOM walk. */
    if (nextLang === "ar" && !D && !window.AQUA_I18N_DICT) {
      finishLanguage(nextLang);
      return Promise.resolve();
    }

    return loadDictionary()
      .then(function () {
        /* A newer request (a quick second click) supersedes this one. */
        if (wantedLang !== nextLang) return;

        document.documentElement.lang = nextLang;
        document.documentElement.dir = nextLang === "en" ? "ltr" : "rtl";

        translateTextNodes(nextLang);
        translateDataI18n(nextLang);
        translateAttributes(nextLang);
        finishLanguage(nextLang);
      })
      .catch(function () {
        /* Dictionary unreachable: stay on the current language, untouched. */
        wantedLang = null;
      });
  }

  function initLanguageToggle() {
    const btn = document.getElementById("langToggle");
    const savedLang = localStorage.getItem(STORAGE_KEY) || "ar";

    applyAquaLanguage(savedLang);

    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = "true";
      btn.addEventListener("click", () => {
        const current = localStorage.getItem(STORAGE_KEY) || "ar";
        applyAquaLanguage(current === "ar" ? "en" : "ar");
      });
    }
  }

  window.applyAquaLanguage = applyAquaLanguage;

  /* Loaded as a plain script at the end of <body>, everything it translates is
     already parsed, so it runs now instead of waiting for DOMContentLoaded
     (which comes after every later script has run). */
  const script = document.currentScript;
  const parsedAhead = Boolean(script && !script.defer && !script.async);

  if (document.readyState === "loading" && !parsedAhead) {
    document.addEventListener("DOMContentLoaded", initLanguageToggle);
  } else {
    initLanguageToggle();
  }
})();

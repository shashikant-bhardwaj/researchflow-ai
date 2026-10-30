"""
Streamlit UI for the multi-agent research system.

Place this file next to pipeline.py and agents.py, then run:
    streamlit run src/multi_agent_system/app.py

pipeline.py is NOT modified. The UI calls run_research_pipeline(topic) and
reads its printed "step N -" lines to show live progress.
"""

import io
import re
import sys
import time
from contextlib import redirect_stdout
from datetime import datetime
from urllib.parse import urlparse

import streamlit as st

try:
    from dotenv import load_dotenv

    load_dotenv()
except Exception:
    pass

from pipeline import run_research_pipeline

# ------------------------------------------------------------------ setup
st.set_page_config(
    page_title="Multi-Agent Research System",
    page_icon="🔎",
    layout="wide",
    initial_sidebar_state="expanded",
)

STAGES = [
    ("Search", "Finds recent, reliable sources on your topic"),
    ("Read", "Scrapes the most relevant page for depth"),
    ("Write", "Drafts the report from everything gathered"),
    ("Review", "A critic checks the report and gives feedback"),
]

EXAMPLES = [
    "Impact of quantum computing on cryptography",
    "State of solid-state batteries in 2026",
    "How retrieval-augmented generation works",
    "Future of nuclear fusion energy",
]

CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

:root {
    --ink: #14213d;
    --muted: #5b6b7f;
    --line: #dde3ea;
    --paper: #f3f6f9;
    --card: #ffffff;
    --accent: #2a4bd7;
    --accent-soft: #e8edfd;
    --done: #1f8a5b;
    --done-soft: #e6f4ec;
}

html, body, [class*="css"], .stApp {
    font-family: 'IBM Plex Sans', system-ui, sans-serif;
    color: var(--ink);
}
.stApp { background: var(--paper); }
#MainMenu, footer { visibility: hidden; }
.block-container { padding-top: 2.2rem; max-width: 1150px; }

h1, h2, h3 {
    font-family: 'Newsreader', Georgia, serif !important;
    font-weight: 600 !important;
    letter-spacing: -0.01em;
    color: var(--ink);
}

/* hero */
.hero h1 { font-size: 2.7rem; line-height: 1.1; margin: 0 0 .4rem 0; padding: 0; }
.hero p { color: var(--muted); font-size: 1.05rem; max-width: 40rem; margin: 0 0 1.4rem 0; }

/* input card */
div[data-testid="stForm"] {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 1.2rem 1.4rem;
    box-shadow: 0 1px 2px rgba(20, 33, 61, .04);
}
.stTextInput input {
    font-size: 1.05rem;
    padding: .7rem .9rem;
    border-radius: 10px;
}
.stButton > button, .stFormSubmitButton > button, .stDownloadButton > button {
    border-radius: 10px;
    font-weight: 500;
    border: 1px solid var(--line);
}
.stFormSubmitButton > button[kind="primary"],
.stButton > button[kind="primary"] {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
}

/* pipeline tracker */
.stages { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: .4rem 0 1rem 0; }
@media (max-width: 800px) { .stages { grid-template-columns: 1fr; } }
.stage {
    background: var(--card);
    border: 1px solid var(--line);
    border-top: 3px solid var(--line);
    border-radius: 10px;
    padding: .9rem 1rem;
}
.stage.active { border-top-color: var(--accent); background: var(--accent-soft); }
.stage.done { border-top-color: var(--done); }
.stage .head { display: flex; align-items: center; gap: .5rem; font-weight: 600; }
.stage .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--line); flex: none; }
.stage.active .dot { background: var(--accent); animation: pulse 1.2s ease-in-out infinite; }
.stage.done .dot { background: var(--done); }
.stage .desc { color: var(--muted); font-size: .86rem; margin-top: .35rem; }
.stage .time { color: var(--muted); font-size: .8rem; margin-top: .5rem; }
.stage.done .time { color: var(--done); }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
@media (prefers-reduced-motion: reduce) { .stage.active .dot { animation: none; } }

/* sources */
.source {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: .65rem .9rem;
    margin-bottom: .5rem;
}
.source a { color: var(--accent); text-decoration: none; font-weight: 500; }
.source a:hover { text-decoration: underline; }
.source .domain { color: var(--muted); font-size: .82rem; }

/* metrics + tabs */
div[data-testid="stMetric"] {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: .7rem 1rem;
}
.stTabs [data-baseweb="tab-list"] { gap: 6px; }
.stTabs [data-baseweb="tab"] { font-weight: 500; }
section[data-testid="stSidebar"] { background: #eaeff5; border-right: 1px solid var(--line); }
</style>
"""
st.markdown(CSS, unsafe_allow_html=True)


# ------------------------------------------------------------------ helpers
class StreamTee(io.TextIOBase):
    """Forwards pipeline prints to the real terminal (so terminal output still
    works), keeps a copy for the UI log, and detects 'step N -' lines."""

    def __init__(self, on_step, on_line):
        self.on_step = on_step
        self.on_line = on_line
        self.terminal = sys.__stdout__
        self.buffer = ""
        self.lines = []

    def write(self, text):
        if self.terminal:
            self.terminal.write(text)
        self.buffer += text
        while "\n" in self.buffer:
            line, self.buffer = self.buffer.split("\n", 1)
            self.lines.append(line)
            match = re.match(r"\s*step\s+(\d)\s*-", line, re.IGNORECASE)
            if match:
                self.on_step(int(match.group(1)))
            self.on_line(line)
        return len(text)

    def flush(self):
        if self.terminal:
            self.terminal.flush()


def to_text(value) -> str:
    """Agent outputs are usually strings, but can be lists of content blocks."""
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        parts = []
        for item in value:
            if isinstance(item, dict):
                parts.append(str(item.get("text", "")))
            else:
                parts.append(str(item))
        return "\n".join(p for p in parts if p)
    return str(value)


def fmt_seconds(s: float) -> str:
    s = int(s)
    return f"{s // 60}m {s % 60:02d}s" if s >= 60 else f"{s}s"


def tracker_html(current: int, starts: dict, finished_at=None) -> str:
    """current: 1-4 for running step, 5 when everything is done."""
    cards = []
    for i, (name, desc) in enumerate(STAGES, start=1):
        if i < current:
            state = "done"
            end = starts.get(i + 1, finished_at)
            took = fmt_seconds(end - starts[i]) if end and i in starts else "done"
            status = f"Done in {took}"
        elif i == current:
            state, status = "active", "Working..."
        else:
            state, status = "", "Waiting"
        cards.append(
            f'<div class="stage {state}"><div class="head"><span class="dot"></span>{name}</div>'
            f'<div class="desc">{desc}</div><div class="time">{status}</div></div>'
        )
    return f'<div class="stages">{"".join(cards)}</div>'


def extract_sources(text: str):
    urls = re.findall(r"https?://[^\s\)\]\}>\"'<]+", text)
    seen, out = set(), []
    for u in urls:
        u = u.rstrip(".,;:!?*")
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def find_score(feedback: str):
    m = re.search(r"(\d+(?:\.\d+)?)\s*/\s*10", feedback)
    return f"{m.group(1)}/10" if m else None


def show_sources(search_text: str):
    urls = extract_sources(search_text)
    if not urls:
        st.info("No links were found in the search results.")
        return
    for u in urls:
        domain = urlparse(u).netloc.replace("www.", "")
        st.markdown(
            f'<div class="source"><a href="{u}" target="_blank" rel="noopener">{domain}</a>'
            f'<div class="domain">{u[:110]}{"..." if len(u) > 110 else ""}</div></div>',
            unsafe_allow_html=True,
        )


def set_topic(t: str):
    st.session_state["topic_input"] = t


def load_run(idx: int):
    st.session_state["active"] = idx


# ------------------------------------------------------------------ state
st.session_state.setdefault("history", [])
st.session_state.setdefault("active", None)
st.session_state.setdefault("topic_input", "")

# ------------------------------------------------------------------ sidebar
with st.sidebar:
    st.markdown("### 🔎 Research System")
    st.caption("Four agents, one report.")
    st.markdown(
        "**1. Search** the web  \n"
        "**2. Read** the best source  \n"
        "**3. Write** the report  \n"
        "**4. Review** it with a critic"
    )
    st.divider()
    st.markdown("**Past runs**")
    history = st.session_state["history"]
    if not history:
        st.caption("Runs from this session will appear here.")
    for idx in reversed(range(len(history))):
        h = history[idx]
        label = h["topic"] if len(h["topic"]) <= 34 else h["topic"][:33] + "…"
        st.button(
            f"{label}",
            key=f"hist_{idx}",
            help=f"{h['time']} · {fmt_seconds(h['seconds'])}",
            on_click=load_run,
            args=(idx,),
            use_container_width=True,
        )
    if history:
        if st.button("Clear history", use_container_width=True):
            st.session_state["history"] = []
            st.session_state["active"] = None
            st.rerun()

# ------------------------------------------------------------------ hero + input
st.markdown(
    '<div class="hero"><h1>Multi-Agent Research System</h1>'
    "<p>Enter a topic. Four agents search the web, read the best source, "
    "write a report and review it for you.</p></div>",
    unsafe_allow_html=True,
)

with st.form("research_form", border=False):
    st.text_input(
        "Research topic",
        key="topic_input",
        placeholder="e.g. Impact of quantum computing on cryptography",
    )
    submitted = st.form_submit_button("Run research", type="primary")

st.caption("Try an example:")
chip_cols = st.columns(len(EXAMPLES))
for col, ex in zip(chip_cols, EXAMPLES):
    col.button(ex, key=f"ex_{ex}", on_click=set_topic, args=(ex,), use_container_width=True)

# ------------------------------------------------------------------ run
if submitted:
    topic = st.session_state["topic_input"].strip()
    if not topic:
        st.warning("Enter a research topic to get started.")
    else:
        st.divider()
        st.subheader(f"Researching: {topic}")
        tracker_box = st.empty()
        log_box = st.empty()

        starts = {1: time.time()}
        t0 = starts[1]
        tracker_box.markdown(tracker_html(1, starts), unsafe_allow_html=True)

        recent = []

        def on_step(n: int):
            starts[n] = time.time()
            tracker_box.markdown(tracker_html(n, starts), unsafe_allow_html=True)

        def on_line(line: str):
            if line.strip():
                recent.append(line[:160])
                del recent[:-10]
                log_box.code("\n".join(recent), language="text")

        tee = StreamTee(on_step, on_line)
        try:
            with redirect_stdout(tee):
                result = run_research_pipeline(topic)
            finished = time.time()
            tracker_box.markdown(
                tracker_html(5, starts, finished_at=finished), unsafe_allow_html=True
            )
            log_box.empty()
            st.session_state["history"].append(
                {
                    "topic": topic,
                    "result": result,
                    "seconds": finished - t0,
                    "time": datetime.now().strftime("%H:%M"),
                    "log": "\n".join(tee.lines),
                }
            )
            st.session_state["active"] = len(st.session_state["history"]) - 1
            st.toast("Research complete", icon="✅")
        except Exception as e:
            log_box.empty()
            st.error(
                "The pipeline stopped before finishing. Check your API keys in the "
                "`.env` file and your internet connection, then try again."
            )
            st.exception(e)
            if tee.lines:
                with st.expander("Terminal output before the error"):
                    st.code("\n".join(tee.lines[-60:]), language="text")

# ------------------------------------------------------------------ results
active = st.session_state.get("active")
history = st.session_state["history"]
if active is not None and 0 <= active < len(history):
    run = history[active]
    result = run["result"]
    report = to_text(result.get("report"))
    feedback = to_text(result.get("feedback"))
    search_text = to_text(result.get("search_result"))
    scraped = to_text(result.get("scraped_content"))

    st.divider()
    st.subheader(run["topic"])

    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Total time", fmt_seconds(run["seconds"]))
    m2.metric("Report length", f"{len(report.split()):,} words")
    m3.metric("Sources found", len(extract_sources(search_text)))
    m4.metric("Critic score", find_score(feedback) or "n/a")

    tab_report, tab_review, tab_sources, tab_raw = st.tabs(
        ["Report", "Critic feedback", "Sources", "Raw data"]
    )

    with tab_report:
        st.markdown(report)
        d1, d2, _ = st.columns([1, 1, 3])
        slug = re.sub(r"[^a-z0-9]+", "_", run["topic"].lower()).strip("_")[:40] or "report"
        d1.download_button(
            "Download report (.md)",
            data=report,
            file_name=f"{slug}.md",
            mime="text/markdown",
            use_container_width=True,
        )
        d2.download_button(
            "Download full run (.md)",
            data=(
                f"# {run['topic']}\n\n{report}\n\n---\n\n## Critic feedback\n\n{feedback}\n"
            ),
            file_name=f"{slug}_full.md",
            mime="text/markdown",
            use_container_width=True,
        )

    with tab_review:
        st.markdown(feedback or "_No feedback returned._")

    with tab_sources:
        show_sources(search_text)

    with tab_raw:
        with st.expander("Search results", expanded=False):
            st.markdown(search_text)
        with st.expander("Scraped content", expanded=False):
            st.markdown(scraped)
        if run.get("log"):
            with st.expander("Terminal log", expanded=False):
                st.code(run["log"], language="text")
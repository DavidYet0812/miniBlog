import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ SoftBlogApp: 部落格應用，包含首頁 / 文章列表 / 文章閱讀 / 新增 / 編輯 / 刪除
// 資料儲存在 localStorage，不需後端即可體驗 CRUD 功能

// ------ 小工具 ------
const STORAGE_KEY = "softblog.posts";
const nowISO = () => new Date().toISOString();
const niceDate = (iso) => new Date(iso).toLocaleString();
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const soft = {
  bg: "bg-gradient-to-br from-rose-50 via-sky-50 to-emerald-50",
  card: "bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl",
  chip: "text-xs px-2 py-0.5 rounded-full bg-slate-100",
  btn: "inline-flex items-center gap-2 rounded-xl px-4 py-2 shadow-sm",
  iconBtn: "inline-flex items-center justify-center rounded-xl p-2",
  input:
    "w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200",
  textarea:
    "w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 h-40 outline-none focus:ring-2 focus:ring-sky-200",
};

// ------ Demo 資料 ------
const demoPosts = [
  {
    id: uid(),
    title: "歡迎來到 SoftBlog",
    excerpt: "這是一個以柔和配色與圓角設計為主的輕量部落格範例。",
    content:
      "在這裡你可以新增、編輯、刪除文章。資料儲存在瀏覽器的 localStorage，免伺服器即可體驗 CRUD。\n\n小提示：點選右上角的『新增文章』開始撰寫！",
    createdAt: nowISO(),
    updatedAt: nowISO(),
    tags: ["公告", "入門"],
  },
];

// ------ 資料層：localStorage CRUD ------
function usePosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setPosts(parsed);
      } catch {
        setPosts(demoPosts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demoPosts));
      }
    } else {
      setPosts(demoPosts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoPosts));
    }
  }, []);

  const persist = (next) => {
    setPosts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const createPost = ({ title, excerpt, content, tags = [] }) => {
    const p = { id: uid(), title, excerpt, content, createdAt: nowISO(), updatedAt: nowISO(), tags };
    const next = [p, ...posts];
    persist(next);
    return p.id;
  };

  const updatePost = (id, patch) => {
    const next = posts.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: nowISO() } : p));
    persist(next);
  };

  const deletePost = (id) => {
    const next = posts.filter((p) => p.id !== id);
    persist(next);
  };

  return { posts, createPost, updatePost, deletePost };
}

// ------ UI：標頭 ------
function Topbar({ onNavigate, onNew }) {
  return (
    <div className="sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className={`${soft.card} flex items-center justify-between px-4 py-3`}>
          <button onClick={() => onNavigate({ page: "home" })} className="text-xl font-bold tracking-tight text-slate-800">
            SoftBlog
          </button>
          <div className="flex items-center gap-2">
            <button className={`${soft.btn} bg-white hover:bg-slate-50`} onClick={() => onNavigate({ page: "list" })}>
              所有文章
            </button>
            <button className={`${soft.btn} bg-sky-600 text-white hover:bg-sky-700`} onClick={onNew}>
              新增文章
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------ UI：卡片 ------
function PostCard({ post, onOpen, onEdit, onDelete }) {
  return (
    <motion.div layout className={`${soft.card} p-4`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-800">{post.title}</h3>
          <p className="mt-1 line-clamp-2 text-slate-600">{post.excerpt}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-slate-500">
            {post.tags?.map((t) => (
              <span key={t} className={soft.chip}>{t}</span>
            ))}
            <span className="text-xs">更新：{niceDate(post.updatedAt)}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button className={`${soft.iconBtn} bg-white hover:bg-slate-50`} onClick={() => onOpen(post.id)}>📖</button>
          <button className={`${soft.iconBtn} bg-white hover:bg-slate-50`} onClick={() => onEdit(post.id)}>✏️</button>
          <button className={`${soft.iconBtn} bg-white hover:bg-rose-50`} onClick={() => onDelete(post.id)}>🗑️</button>
        </div>
      </div>
    </motion.div>
  );
}

// ------ UI：文章閱讀頁 ------
function PostView({ post, onBack, onEdit }) {
  if (!post) return null;
  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className={`${soft.card} p-6`}>
        <h1 className="text-2xl font-bold text-slate-800">{post.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-slate-500">
          {post.tags?.map((t) => (
            <span key={t} className={soft.chip}>{t}</span>
          ))}
          <span className="text-xs">建立：{niceDate(post.createdAt)}</span>
          <span className="text-xs">更新：{niceDate(post.updatedAt)}</span>
        </div>
        <div className="prose prose-slate mt-6 max-w-none">
          {post.content.split("\n\n").map((para, i) => (
            <p key={i} className="leading-8 text-slate-700">{para}</p>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          <button className={`${soft.btn} bg-white hover:bg-slate-50`} onClick={onBack}>返回</button>
          <button className={`${soft.btn} bg-sky-600 text-white hover:bg-sky-700`} onClick={() => onEdit(post.id)}>編輯</button>
        </div>
      </div>
    </div>
  );
}

// ------ UI：文章表單 ------
function PostForm({ initial, onCancel, onSubmit }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));

  const canSave = title.trim() && content.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    onSubmit({ title: title.trim(), excerpt: excerpt.trim(), content: content.trim(), tags });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-4">
      <div className={`${soft.card} p-6`}>
        <h2 className="text-xl font-semibold text-slate-800">{initial ? "編輯文章" : "新增文章"}</h2>
        <div className="mt-4 grid gap-4">
          <input className={soft.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="輸入標題" />
          <input className={soft.input} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="輸入摘要" />
          <textarea className={soft.textarea} value={content} onChange={(e) => setContent(e.target.value)} placeholder="輸入內容" />
          <input className={soft.input} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="標籤（逗號分隔）" />
        </div>
        <div className="mt-4 flex gap-2">
          <button type="button" className={`${soft.btn} bg-white hover:bg-slate-50`} onClick={onCancel}>取消</button>
          <button disabled={!canSave} className={`${soft.btn} ${canSave ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-slate-200 text-slate-500"}`}>儲存</button>
        </div>
      </div>
    </form>
  );
}

// ------ 主組件 ------
export default function SoftBlogApp() {
  const { posts, createPost, updatePost, deletePost } = usePosts();

  const [route, setRoute] = useState({ page: "home" });
  const [activeId, setActiveId] = useState(null);
  const activePost = useMemo(() => posts.find((p) => p.id === activeId), [posts, activeId]);

  const navigate = (r) => setRoute(r);
  const openPost = (id) => { setActiveId(id); setRoute({ page: "view" }); };
  const editPost = (id) => { setActiveId(id); setRoute({ page: "edit" }); };
  const confirmDelete = (id) => {
    const p = posts.find((x) => x.id === id);
    if (p && window.confirm(`確定刪除「${p.title}」？`)) {
      deletePost(id);
      setRoute({ page: "list" });
    }
  };

  return (
    <div className={`min-h-screen ${soft.bg}`}>
      <Topbar onNavigate={navigate} onNew={() => navigate({ page: "new" })} />

      <AnimatePresence mode="wait">
        {route.page === "home" && (
          <motion.section key="home" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mx-auto max-w-6xl px-4 py-8">
            <div className={`${soft.card} p-8`}>
              <h1 className="text-3xl font-bold text-slate-800">用柔和風格寫下每一天</h1>
              <p className="mt-3 text-slate-600">SoftBlog 提供文章的新增、編輯、刪除與閱讀體驗。</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.slice(0, 3).map((p) => (
                  <PostCard key={p.id} post={p} onOpen={openPost} onEdit={editPost} onDelete={confirmDelete} />
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {route.page === "list" && (
          <motion.section key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mx-auto max-w-6xl px-4 py-8">
            <div className={`${soft.card} p-6`}>
              <h2 className="text-xl font-semibold text-slate-800">所有文章</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {posts.map((p) => (
                  <PostCard key={p.id} post={p} onOpen={openPost} onEdit={editPost} onDelete={confirmDelete} />
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {route.page === "view" && (
          <motion.section key="view" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mx-auto max-w-6xl px-4 py-8">
            <PostView post={activePost} onBack={() => navigate({ page: "list" })} onEdit={editPost} />
          </motion.section>
        )}

        {route.page === "new" && (
          <motion.section key="new" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mx-auto max-w-6xl px-4 py-8">
            <PostForm onCancel={() => navigate({ page: "list" })} onSubmit={(data) => { const id = createPost(data); setActiveId(id); navigate({ page: "view" }); }} />
          </motion.section>
        )}

        {route.page === "edit" && activePost && (
          <motion.section key="edit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mx-auto max-w-6xl px-4 py-8">
            <PostForm initial={activePost} onCancel={() => navigate({ page: "view" })} onSubmit={(data) => { updatePost(activePost.id, data); navigate({ page: "view" }); }} />
          </motion.section>
        )}
      </AnimatePresence>

      <div className="h-12" />
    </div>
  );
}

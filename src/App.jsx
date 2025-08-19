import React from "react";
import SoftBlogApp from "./SoftBlogApp";


// App.jsx 是專案的主要入口，這裡只需要載入 SoftBlogApp
// SoftBlogApp.jsx 內含完整的部落格功能（首頁、文章頁、CRUD）


export default function App() {
return (
<div className="min-h-screen font-sans">
<SoftBlogApp />
</div>
);
}
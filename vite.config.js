// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
base: '/miniBlog/',
plugins: [react()],
root: ".", // ← 預設就是當前資料夾，可省略
build: {
outDir: "dist",
},
});
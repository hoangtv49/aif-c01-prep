import { serve } from "bun";
import fs from "fs";
import path from "path";

const PORT = process.env.PORT || 3000;
const BASE_DIR = path.resolve("aif-c01-study-guide");

const server = serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    let filePath = path.join(BASE_DIR, url.pathname === "/" ? "index.html" : url.pathname);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(BASE_DIR, "index.html");
    }

    const ext = path.extname(filePath);
    const contentType = {
      ".html": "text/html; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8"
    }[ext] || "text/plain";

    return new Response(fs.readFileSync(filePath), {
      headers: { "Content-Type": contentType }
    });
  }
});

console.log(`AIF-C01 Interactive Study App is running at: http://localhost:${server.port}`);

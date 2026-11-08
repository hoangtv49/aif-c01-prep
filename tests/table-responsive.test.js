import { expect, test } from "bun:test";
import fs from "fs";

test("Markdown tables in theoryHtml are wrapped in .table-container for horizontal scroll responsiveness", () => {
  const data = JSON.parse(fs.readFileSync("aif-c01-study-guide/data.json", "utf8"));
  
  for (const domain of data.domains) {
    if (domain.theoryHtml.includes("<table")) {
      // Must be wrapped in .table-container
      expect(domain.theoryHtml).toContain('<div class="table-container">');
      
      // Every <table> must follow immediately or be inside .table-container
      const tableCount = (domain.theoryHtml.match(/<table/g) || []).length;
      const containerCount = (domain.theoryHtml.match(/<div class="table-container">/g) || []).length;
      expect(containerCount).toBeGreaterThanOrEqual(tableCount);
    }
  }
});

test("CSS rules ensure theory tables have responsive scrolling and do NOT use display: block on table element", () => {
  const html = fs.readFileSync("index.html", "utf8");

  // .theory-content .table-container must have overflow-x: auto
  expect(html).toMatch(/\.theory-content\s+\.table-container\s*\{[^}]*overflow-x:\s*auto/);

  // .theory-content table must have min-width (at least 600px) so columns do not collapse on mobile
  expect(html).toMatch(/\.theory-content\s+table\s*\{[^}]*min-width:\s*6\d0px/);

  // table must NOT be display: block
  expect(html).not.toMatch(/\.theory-content\s+table\s*\{[^}]*display:\s*block/);
});

test("Specific comparison tables (like JumpStart vs Bedrock) have clean readable column spacing", () => {
  const data = JSON.parse(fs.readFileSync("aif-c01-study-guide/data.json", "utf8"));
  const d3 = data.domains.find(d => d.domainId === 3);
  
  expect(d3.theoryHtml).toContain("Amazon Bedrock (Ưu tiên thi)");
  expect(d3.theoryHtml).toContain("Amazon SageMaker JumpStart");
  
  // Must be inside a table-container
  expect(d3.theoryHtml).toMatch(/<div class="table-container">\s*<table[\s\S]*?Amazon SageMaker JumpStart/);
});

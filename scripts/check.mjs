import assert from 'node:assert/strict';
import {readFile,access,readdir} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {course,chapters,labs,glossary} from '../data/course.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
assert.equal(course.hours,36);
assert.equal(chapters.length,10);
assert.equal(labs.length,4);
assert.ok(glossary.length>=24);
const ids=new Set(chapters.map(chapter=>chapter.id));
assert.equal(ids.size,chapters.length,'章节标识必须唯一');
for (const stage of ['foundation','methods','advanced','application']) assert.ok(chapters.some(chapter=>chapter.stage===stage),`缺少学习阶段 ${stage}`);
for(const [index,chapter] of chapters.entries()){
  assert.equal(chapter.number,index+1);
  for(const field of ['title','summary','managementQuestion','enTitle'])assert.ok(chapter[field]?.trim(),`${chapter.id} 缺少 ${field}`);
  assert.ok(chapter.objectives.length>=3);
  assert.ok(chapter.concepts.length>=4);
  assert.ok(chapter.sections.length>=3);
  assert.ok(chapter.exercise.tasks.length>=3);
  assert.ok(chapter.exercise.deliverables.length>=2);
  for(const quiz of chapter.quiz){
    assert.equal(quiz.options.length,4);
    assert.ok(Number.isInteger(quiz.answer)&&quiz.answer>=0&&quiz.answer<quiz.options.length);
    assert.ok(quiz.explanation.trim());
  }
  await access(resolve(root,chapter.notebook));
}
for(const lab of labs){
  assert.ok(ids.has(lab.afterChapter),`实验 ${lab.number} 的章节链接无效`);
  await access(resolve(root,lab.notebook||`resources/notebooks/lab-${lab.number}.ipynb`));
}
for(const item of glossary)assert.ok(ids.has(item.chapter),`术语 ${item.term} 的章节链接无效`);
const html=await readFile(resolve(root,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
  const path=match[1];
  assert.ok(!/^https?:|^\/\//.test(path),`站点不应依赖外部资源：${path}`);
  await access(resolve(root,path));
}
const app=await readFile(resolve(root,'app.js'),'utf8');
for(const id of ['course-nav','progress-label','progress-fill','main-content','breadcrumbs','toast','sidebar','sidebar-overlay','mobile-menu','search-dialog','open-search','close-search','course-search','search-results','reset-progress'])assert.ok(html.includes(`id="${id}"`),`缺少页面元素 ${id}`);
const css=await readFile(resolve(root,'styles.css'),'utf8');
assert.match(css,/\[hidden\]\s*\{\s*display:\s*none\s*!important/);
assert.match(css,/prefers-reduced-motion/);
assert.match(app,/quiz\.explanation/);
assert.doesNotMatch(app,/\bfetch\(|XMLHttpRequest|sendBeacon\(|https?:\/\//,'应用不应发起外部请求');
await access(resolve(root,'resources/练习资源包.zip'));

let notebookCount=0;
for(const name of await readdir(resolve(root,'resources/notebooks'))){
  if(!name.endsWith('.ipynb'))continue;
  const notebook=JSON.parse(await readFile(resolve(root,'resources/notebooks',name),'utf8'));
  assert.equal(notebook.nbformat,4);
  assert.ok(notebook.cells.length>=5);
  for(const cell of notebook.cells){
    if(cell.cell_type==='code'){
      assert.equal(cell.execution_count,null,`${name} 带有执行记录`);
      assert.deepEqual(cell.outputs,[],`${name} 带有执行输出`);
    }
  }
  notebookCount++;
}
assert.ok(notebookCount>=14);

const forbidden=[/\/Users\//,/10\.2\.70\.200/,/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,/(?<!\d)1[3-9]\d{9}(?!\d)/];
const allowedTextExtensions=/\.(html|css|js|mjs|json|md|txt|csv|ipynb)$/;
async function audit(folder){
  for(const entry of await readdir(folder,{withFileTypes:true})){
    if(entry.name.startsWith('.git'))continue;
    const path=resolve(folder,entry.name);
    if(entry.isDirectory()){await audit(path);continue;}
    // This audit contains its own patterns and is not a public page.
    if(path===fileURLToPath(import.meta.url)||!allowedTextExtensions.test(path))continue;
    const text=await readFile(path,'utf8');
    for(const pattern of forbidden)assert.ok(!pattern.test(text),`请人工检查疑似内部信息：${relative(root,path)}`);
  }
}
await audit(root);
console.log(`检查通过：${chapters.length}章、${labs.length}次实验、${glossary.length}个知识点、${notebookCount}个无输出Notebook；内部资源链接与隐私规则通过。`);

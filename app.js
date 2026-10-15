const { course, chapters, labs, glossary } = window.COURSE_DATA;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const chapterMap = new Map(chapters.map(chapter => [chapter.id, chapter]));
const stages = [
  {id:'foundation', number:'01', title:'理解与准备', description:'从问题出发，获得可靠数据'},
  {id:'methods', number:'02', title:'基本方法', description:'建立 Python 绘图与比较能力'},
  {id:'advanced', number:'03', title:'多维探索', description:'理解结构、分布与关系'},
  {id:'application', number:'04', title:'综合表达', description:'将分析组织成可交互的作品'}
];
const storageKey = 'dv-course-learning-v1';
function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return new Set(Array.isArray(saved.completed) ? saved.completed.filter(id => chapterMap.has(id)) : []);
  } catch { return new Set(); }
}
let completed = readProgress();
let activeRoute = '';
let hasRendered = false;
const mobileViewport = matchMedia('(max-width: 860px)');
let toastTimeout;

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { element.hidden = true; }, 2800);
}
function saveProgress() {
  try { localStorage.setItem(storageKey, JSON.stringify({completed:[...completed]})); return true; }
  catch { return false; }
}
const chapterLink = chapter => `#/chapter/${chapter.id}`;
const list = items => `<ul>${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
const arrow = '<span aria-hidden="true">↗</span>';

function renderNavigation() {
  const route = location.hash || '#/overview';
  $('#course-nav').innerHTML = `
    <a class="nav-item ${route === '#/overview' ? 'is-active' : ''}" href="#/overview"><span class="nav-icon" aria-hidden="true">⌂</span><span>课程首页</span></a>
    <div class="nav-label">章节学习</div>
    <div class="chapter-nav">${chapters.map(chapter => `<a class="nav-item ${route === chapterLink(chapter) ? 'is-active' : ''} ${completed.has(chapter.id) ? 'is-complete' : ''}" href="${chapterLink(chapter)}" ${route === chapterLink(chapter) ? 'aria-current="page"' : ''}><span class="nav-number">${String(chapter.number).padStart(2,'0')}</span><span>${esc(chapter.title)}</span><span class="nav-progress" aria-label="${completed.has(chapter.id) ? '已完成' : '未完成'}">${completed.has(chapter.id) ? '✓' : ''}</span></a>`).join('')}</div>
    <div class="nav-label">实践与查阅</div>
    <a class="nav-item ${route === '#/practice' ? 'is-active' : ''}" href="#/practice"><span class="nav-icon" aria-hidden="true">◈</span><span>实验与练习</span></a>
    <a class="nav-item ${route === '#/glossary' ? 'is-active' : ''}" href="#/glossary"><span class="nav-icon" aria-hidden="true">Aa</span><span>知识点速查</span></a>`;
  $('#progress-label').textContent = `${completed.size} / ${chapters.length}`;
  $('#progress-fill').style.width = `${completed.size / chapters.length * 100}%`;
}

function heroIllustration() {
  return `<svg viewBox="0 0 430 270" role="img" aria-labelledby="hero-chart-title"><title id="hero-chart-title">数据经过比较与解释，形成有依据的判断</title><rect x="18" y="20" width="394" height="226" rx="12" fill="#fff" stroke="#dedfd9"/><text x="42" y="51" fill="#66726c" font-size="11" letter-spacing="1.5">OBSERVE · COMPARE · EXPLAIN</text><path d="M44 204h342M44 159h342M44 114h342M44 69h342" stroke="#eceee9"/><rect x="65" y="143" width="33" height="61" rx="3" fill="#cad7d1"/><rect x="123" y="111" width="33" height="93" rx="3" fill="#8aa79c"/><rect x="181" y="128" width="33" height="76" rx="3" fill="#4e7a6e"/><rect x="239" y="86" width="33" height="118" rx="3" fill="#1a4846"/><rect x="297" y="62" width="33" height="142" rx="3" fill="#ed7257"/><path d="m81 127 58-30 59 18 58-48 58-23" fill="none" stroke="#c99551" stroke-width="2" stroke-dasharray="4 4"/><circle cx="314" cy="44" r="5" fill="#c99551"/><rect x="249" y="220" width="142" height="32" rx="16" fill="#1a4846"/><text x="320" y="241" fill="#fff" font-size="12" text-anchor="middle">图表之后，继续追问 →</text><text x="83" y="222" font-size="10" fill="#909990" text-anchor="middle">A</text><text x="141" y="222" font-size="10" fill="#909990" text-anchor="middle">B</text><text x="199" y="222" font-size="10" fill="#909990" text-anchor="middle">C</text></svg>`;
}

function chapterRow(chapter) {
  return `<a class="chapter-row" href="${chapterLink(chapter)}"><span class="chapter-row-number">${String(chapter.number).padStart(2,'0')}</span><span class="chapter-row-copy"><strong>${esc(chapter.title)}</strong><span>${esc(chapter.summary)}</span></span><span class="chapter-row-meta">${completed.has(chapter.id) ? '<span class="pill pill-soft">已学习 ✓</span>' : '<span class="muted">阅读与练习</span>'}<span aria-hidden="true">→</span></span></a>`;
}

function renderOverview() {
  const next = chapters.find(chapter => !completed.has(chapter.id)) || chapters[0];
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow">DATA VISUALIZATION · COURSE NOTES</p><h1>看懂数据，<br>讲清问题<span class="title-dot">。</span></h1><p>${esc(course.description)}</p><div class="hero-actions"><a class="btn btn-primary" href="${chapterLink(next)}">${completed.size ? '继续学习' : '开始学习'} <span aria-hidden="true">→</span></a><a class="btn btn-ghost" href="#/practice">浏览实验与练习</a></div><div class="hero-stats"><div class="stat"><strong>${chapters.length}</strong><span>学习章节</span></div><div class="stat"><strong>${labs.length}</strong><span>综合实验</span></div><div class="stat"><strong>${course.hours}</strong><span>课程学时</span></div></div></div><div class="hero-art">${heroIllustration()}<p>先有问题，再选图表。让每一次表达都有依据。</p></div></section>
    <section aria-labelledby="roadmap-title"><div class="section-head"><div><p class="eyebrow">LEARNING PATH</p><h2 class="section-title" id="roadmap-title">这门课，怎样学</h2></div><p class="section-subtitle">从数据准备到可视化表达，循序推进</p></div><div class="roadmap">${stages.map(stage => { const items = chapters.filter(chapter => chapter.stage === stage.id); return `<a class="stage" href="${chapterLink(items[0] || chapters[0])}"><span class="stage-label">${stage.number}<span aria-hidden="true">↗</span></span><h3>${stage.title}</h3><p>${stage.description}</p><div class="stage-chapters">${items.map(chapter => `${String(chapter.number).padStart(2,'0')} ${esc(chapter.title)}`).join('<br>')}</div></a>`; }).join('')}</div></section>
    <section aria-labelledby="chapters-title"><div class="section-head"><div><p class="eyebrow">CHAPTERS</p><h2 class="section-title" id="chapters-title">打开一章，解决一个问题</h2></div><span class="muted">简介 · 知识点 · 练习 · 自测</span></div><div class="chapter-list">${chapters.map(chapterRow).join('')}</div></section>
    <section class="next-step"><div><p class="eyebrow">LEARN BY DOING</p><h2>把知识，放进一次完整的分析</h2><p>四次实验连接数据采集、比较分析、结构表达与仪表盘制作。先运行，再解释，最后检查结论。</p></div><a class="btn btn-primary" href="#/practice">前往实验与练习 ${arrow}</a></section>`;
}

function renderQuiz(chapter) {
  return `<section class="article-section" id="quiz"><div class="section-head"><div><p class="eyebrow">QUICK CHECK</p><h2>学完之后，检查一下</h2></div><span class="pill">${chapter.quiz.length} 道概念题</span></div><form class="quiz" id="quiz-form" data-chapter="${chapter.id}">${chapter.quiz.map((quiz,index) => `<fieldset class="quiz-question"><legend><span>${index+1}.</span> ${esc(quiz.question)}</legend><div class="quiz-options">${quiz.options.map((option,optionIndex) => `<label class="quiz-option"><input type="radio" name="question-${index}" value="${optionIndex}"><span class="option-letter">${String.fromCharCode(65+optionIndex)}</span><span>${esc(option)}</span></label>`).join('')}</div><div class="quiz-explanation" data-explanation="${index}" hidden></div></fieldset>`).join('')}<div class="quiz-actions"><button type="submit" class="btn btn-primary">检查答案</button><span class="quiz-result" role="status" id="quiz-result"></span></div></form></section>`;
}

function renderChapter(chapter) {
  const previous = chapters[chapter.number-2];
  const next = chapters[chapter.number];
  const exercise = chapter.exercise;
  return `<div class="page-heading"><p class="eyebrow">CHAPTER ${String(chapter.number).padStart(2,'0')} <span class="eyebrow-divider">/</span> ${esc(chapter.enTitle)}</p><div class="chapter-title-row"><h1>${esc(chapter.title)}</h1><button class="btn btn-ghost btn-small" type="button" data-complete="${chapter.id}" aria-pressed="${completed.has(chapter.id)}">${completed.has(chapter.id) ? '已完成学习 ✓' : '标记为已学习'}</button></div><p class="chapter-lead">${esc(chapter.summary)}</p></div>
    <div class="content-grid"><article class="article-main"><section class="question-panel"><p class="eyebrow">从一个问题开始</p><h2>${esc(chapter.managementQuestion)}</h2><p>阅读时留意：需要哪些数据，图表展示了什么，又有哪些信息仍然不足。</p></section>
    <section class="article-section" id="objectives"><h2>本章学什么</h2><ol class="learning-objectives">${chapter.objectives.map((objective,index) => `<li><span>${String(index+1).padStart(2,'0')}</span>${esc(objective)}</li>`).join('')}</ol></section>
    <section class="article-section" id="concepts"><h2>建立知识框架</h2><dl class="concept-grid">${chapter.concepts.map(concept => `<div class="concept-item"><dt>${esc(concept.term)}</dt><dd>${esc(concept.definition)}</dd></div>`).join('')}</dl></section>
    <section class="article-section" id="notes"><h2>理解与应用</h2>${chapter.sections.map((section,index) => `<div class="reading-section"><h3><span>${String(index+1).padStart(2,'0')}</span> ${esc(section.title)}</h3><p>${esc(section.body)}</p></div>`).join('')}</section>
    <section class="exercise-panel" id="exercise"><p class="eyebrow">YOUR TURN</p><h2>${esc(exercise.title)}</h2><p>${esc(exercise.scenario)}</p><h3>动手任务</h3><ol class="task-list">${exercise.tasks.map(task => `<li>${esc(task)}</li>`).join('')}</ol><h3>完成后，你应当有</h3>${list(exercise.deliverables)}<details class="details"><summary>需要一点提示？</summary>${list(exercise.hints)}</details><details class="details"><summary>再多走一步</summary><p>${esc(exercise.extension)}</p></details><a class="btn btn-primary" href="${esc(chapter.notebook)}" download>下载本章 Notebook ↓</a><p class="hint">建议先下载<a href="resources/练习资源包.zip" download>完整练习资源包</a>，保留 notebooks 与 datasets 的相对位置，再运行代码。</p></section>
    <section class="article-section ai-note"><h2>借助 AI，但保留自己的判断</h2><p>先用自己的话描述问题和字段，再请 AI 解释代码或比较图表方案。运行后核对样本数、汇总值和坐标轴，最后独立写出结论及局限。请使用教学模拟数据，不向外部工具提交个人或未授权资料。</p></section>
    ${renderQuiz(chapter)}<nav class="chapter-pagination" aria-label="相邻章节">${previous ? `<a href="${chapterLink(previous)}"><span>上一章</span><strong>← ${esc(previous.title)}</strong></a>` : '<a href="#/overview"><span>学习路线</span><strong>← 返回课程首页</strong></a>'}${next ? `<a href="${chapterLink(next)}"><span>下一章</span><strong>${esc(next.title)} →</strong></a>` : '<a href="#/practice"><span>继续实践</span><strong>实验与练习 →</strong></a>'}</nav></article>
    <aside class="article-aside"><div class="sticky-aside"><p class="eyebrow">本章目录</p><nav class="toc" aria-label="本章目录"><button data-scroll="objectives">本章学什么</button><button data-scroll="concepts">建立知识框架</button><button data-scroll="notes">理解与应用</button><button data-scroll="exercise">动手练习</button><button data-scroll="quiz">概念自测</button></nav><div class="aside-resource"><span class="resource-icon" aria-hidden="true">↧</span><h3>边读边练</h3><p>用 Notebook 把想法变成可运行的分析。</p><a class="resource-link" href="${esc(chapter.notebook)}" download>本章练习文件 ${arrow}</a><a class="resource-link" href="resources/练习资源包.zip" download>完整资源包 ${arrow}</a></div></div></aside></div>`;
}

const demoData = [
  {channel:'搜索广告',revenue:240,refund:20,cost:120,spend:80},
  {channel:'短视频',revenue:220,refund:30,cost:110,spend:100},
  {channel:'邮件',revenue:150,refund:8,cost:70,spend:35},
  {channel:'社群',revenue:120,refund:5,cost:55,spend:25}
].map(row => ({...row,contribution:row.revenue-row.refund-row.cost-row.spend}));

function renderPractice() {
  return `<div class="page-heading"><p class="eyebrow">PRACTICE & EXPERIMENTS</p><h1>在实践中，连接知识</h1><p>章节里的小练习帮助理解方法，四次实验练习完整过程。所有下载数据均为教学模拟。</p><a class="btn btn-primary" href="resources/练习资源包.zip" download>下载完整练习资源包 ↓</a></div>
    <section class="demo-panel" aria-labelledby="demo-heading"><div class="section-head"><div><p class="eyebrow">A SMALL EXPERIMENT</p><h2 id="demo-heading">换一个指标，结论会怎样？</h2></div><span class="pill pill-soft">交互演示</span></div><p>市场负责人准备安排下一轮活动。如果只看销售收入，你会优先选择谁？切换指标，再比较一次。</p><div class="demo-controls"><div class="segmented" role="group" aria-label="选择图表指标"><button type="button" class="is-active" data-metric="revenue" aria-pressed="true">销售收入</button><button type="button" data-metric="contribution" aria-pressed="false">活动贡献</button></div><label class="sort-control"><input type="checkbox" id="demo-sort"> 按指标排序</label></div><div class="chart-frame" id="demo-chart"></div><p class="chart-caption" id="demo-caption"></p><details class="details"><summary>查看数据与指标口径</summary><p>单位：千元。活动贡献 = 销售收入 − 退款 − 商品成本 − 活动投入。这是本演示的简化口径，不等同于完整企业利润，也不能据此推断追加投入的因果效果。</p><div class="table-scroll"><table class="data-table"><caption>教学模拟活动数据</caption><thead><tr><th scope="col">渠道</th><th scope="col">收入</th><th scope="col">退款</th><th scope="col">商品成本</th><th scope="col">活动投入</th><th scope="col">贡献</th></tr></thead><tbody>${demoData.map(row => `<tr><th scope="row">${row.channel}</th><td>${row.revenue}</td><td>${row.refund}</td><td>${row.cost}</td><td>${row.spend}</td><td>${row.contribution}</td></tr>`).join('')}</tbody></table></div></details></section>
    <section aria-labelledby="labs-heading"><div class="section-head"><div><p class="eyebrow">FOUR LABS</p><h2 id="labs-heading">四次实验，一步步深入</h2></div></div><div class="lab-list">${labs.map(lab => `<section class="lab"><div class="lab-header"><span class="lab-number">LAB ${String(lab.number).padStart(2,'0')}</span><div><h3>${esc(lab.title)}</h3><p>${esc(lab.summary)}</p></div></div><div class="lab-body"><div><h4>实验任务</h4>${list(lab.tasks)}</div><div><h4>提交与核验</h4>${list(lab.deliverables)}<a class="resource-link" href="${esc(lab.notebook || `resources/notebooks/lab-${lab.number}.ipynb`)}" download>下载实验 Notebook ↓</a><a class="resource-link" href="${chapterLink(chapterMap.get(lab.afterChapter) || chapters[0])}">回看相关章节 ${arrow}</a></div></div></section>`).join('')}</div></section>
    <section class="article-section"><h2>使用练习资源</h2><ol class="learning-objectives"><li><span>01</span>下载并解压完整资源包，保留 notebooks 和 datasets 两个目录。</li><li><span>02</span>在本地 Jupyter 或教学环境打开 Notebook，先读字段与任务，再运行起始代码。</li><li><span>03</span>完成 TODO，保存自己的图表与解释。先检查结果，再讨论管理含义。</li></ol><p class="hint">网站内的测验不上传答案，学习进度只保存在当前浏览器。Python代码在您的教学环境运行。</p></section>`;
}

function drawDemo(metric = 'revenue') {
  const target = $('#demo-chart');
  if (!target) return;
  const sorted = $('#demo-sort').checked;
  const data = [...demoData].sort((a,b) => sorted ? b[metric]-a[metric] : 0);
  const min = metric === 'contribution' ? -30 : 0;
  const max = metric === 'contribution' ? 50 : 300;
  const ticks = metric === 'contribution' ? [-20,0,20,40] : [0,100,200,300];
  const y = value => 245 - (value-min)/(max-min)*205;
  const zero = y(0);
  const label = metric === 'revenue' ? '销售收入' : '活动贡献';
  target.innerHTML = `<svg viewBox="0 0 700 300" role="img" aria-labelledby="demo-title demo-desc"><title id="demo-title">各渠道${label}比较</title><desc id="demo-desc">${data.map(row => `${row.channel}${row[metric]}千元`).join('，')}。数据为教学模拟。</desc><text x="56" y="20" fill="#69756f" font-size="12">${label} / 千元</text>${ticks.map(tick => `<line x1="58" y1="${y(tick)}" x2="664" y2="${y(tick)}" stroke="${tick===0 ? '#a4afa6' : '#e4e8e1'}" ${tick===0 ? '' : 'stroke-dasharray="3 4"'}/><text x="44" y="${y(tick)+4}" text-anchor="end" fill="#69756f" font-size="12">${tick}</text>`).join('')}${data.map((row,index) => { const value=row[metric]; const top=Math.min(y(value),zero); return `<g><rect x="${98+index*144}" y="${top}" width="65" height="${Math.max(Math.abs(y(value)-zero),1)}" rx="3" fill="${value<0 ? '#ed7257' : index===0 ? '#1a4846' : '#7e9e93'}"><title>${row.channel}：${value}千元</title></rect><text x="${130.5+index*144}" y="${value>=0 ? top-10 : y(value)+18}" text-anchor="middle" fill="#263d35" font-size="14" font-weight="600">${value}</text><text x="${130.5+index*144}" y="279" text-anchor="middle" fill="#52625a" font-size="13">${row.channel}</text></g>`; }).join('')}</svg>`;
  $('#demo-caption').textContent = metric === 'revenue' ? '搜索广告的销售收入最高。收入规模能说明表现的一部分，但还没有考虑成本与退款。' : '在这个简化口径下，邮件与社群的贡献更高，短视频为负。下一步仍应检查样本规模、客群差异和其他成本。';
}

function glossaryItems(query = '') {
  const key = query.trim().toLowerCase();
  const items = glossary.filter(item => `${item.term} ${item.definition}`.toLowerCase().includes(key));
  return items.length ? items.map(item => `<div class="glossary-item"><h2>${esc(item.term)}</h2><p>${esc(item.definition)}</p>${chapterMap.has(item.chapter) ? `<a href="${chapterLink(chapterMap.get(item.chapter))}">前往 ${esc(chapterMap.get(item.chapter).title)} →</a>` : ''}</div>`).join('') : '<p class="empty-state">没有找到这个知识点，可以换一个关键词试试。</p>';
}
function renderGlossary() {
  return `<div class="page-heading"><p class="eyebrow">QUICK REFERENCE</p><h1>知识点速查</h1><p>把容易混淆的概念放在一起，找到解释，也找到它所在的章节。</p></div><label class="sr-only" for="glossary-filter">筛选知识点</label><input class="filter-input" id="glossary-filter" type="search" placeholder="输入图表、方法或概念名称…"><p class="muted" id="glossary-count">共 ${glossary.length} 个知识点</p><div class="glossary-grid" id="glossary-items">${glossaryItems()}</div>`;
}
function renderAbout() {
  return `<div class="page-heading"><p class="eyebrow">ABOUT THIS COURSE SITE</p><h1>把网站当作一份学习地图</h1><p>这里连接知识、练习与实验，帮助您安排学习，也帮助您回看容易混淆的概念。</p></div><div class="about-content"><section class="article-section"><h2>内容与使用方式</h2><p>网站依据数据可视化课程的实际讲授主题整理，覆盖数据获取与清洗、Python绘图、类别与数值表达、层次与分布、时序多维网络、词云与Dash。正文为便于复习编写的学习摘要，配套练习是可以继续完善的起始任务。</p><p>建议按章节顺序学习，也可以搜索知识点后直接跳转。章节中的“标记为已学习”仅用于自己的学习安排，不代表课程考核成绩。</p></section><section class="article-section"><h2>练习与数据</h2><p>下载资源中的数据均为教学模拟，用于理解字段、练习方法和检查图表，不能作为真实企业、个人或市场的证据。练习包不包含学生作业、成绩、教师私人联系方式或原始课程附件。</p><p>单独下载Notebook时，须同时准备对应数据。建议使用完整资源包，按说明保留目录结构，在Python教学环境中运行。具体练习要求以课堂安排为准。</p><a class="btn btn-primary" href="resources/练习资源包.zip" download>下载完整练习资源包 ↓</a></section><section class="article-section"><h2>AI辅助学习</h2><p>可以借助AI理解代码、比较图表方案或查找表达中的问题。请说明数据字段和分析目标，逐项核对生成内容，不把AI给出的解释直接当作数据结论。最终应能独立说明图表选择、计算口径和建议依据。</p></section><section class="article-section"><h2>学习进度与隐私</h2><p>本站无需注册，未接入服务端学习数据库或第三方统计脚本。学习进度只保存在当前浏览器，换设备或清理浏览器数据后不会同步。您可以通过左侧的“重置学习进度”清除这些本地记录。</p></section></div>`;
}

function setMobileNav(open, {restoreFocus=true} = {}) {
  open = open && mobileViewport.matches;
  const wasOpen = $('#sidebar').classList.contains('is-open');
  $('#sidebar').classList.toggle('is-open',open);
  $('#sidebar-overlay').hidden = !open;
  $('#mobile-menu').setAttribute('aria-expanded',String(open));
  $('#sidebar').inert = mobileViewport.matches && !open;
  if (mobileViewport.matches) $('#sidebar').setAttribute('aria-hidden',String(!open));
  else $('#sidebar').removeAttribute('aria-hidden');
  $('.main-shell').inert = open;
  document.body.classList.toggle('nav-open',open);
  if (open) $('#course-nav a')?.focus();
  else if (wasOpen && restoreFocus && mobileViewport.matches) $('#mobile-menu').focus();
}
function renderRoute() {
  const route = location.hash || '#/overview';
  activeRoute = route;
  let content;
  let title;
  const chapter = route.startsWith('#/chapter/') ? chapterMap.get(route.split('/')[2]) : null;
  if (chapter) { content=renderChapter(chapter); title=chapter.title; }
  else if (route === '#/practice') { content=renderPractice(); title='实验与练习'; }
  else if (route === '#/glossary') { content=renderGlossary(); title='知识点速查'; }
  else if (route === '#/about') { content=renderAbout(); title='使用说明'; }
  else if (route === '#/overview' || route === '') { content=renderOverview(); title='课程首页'; }
  else { content='<div class="empty-state"><h1>这一页还没有内容</h1><p>从学习路线重新选择一个章节。</p><a class="btn btn-primary" href="#/overview">返回课程首页</a></div>'; title='页面未找到'; }
  $('#main-content').innerHTML = content;
  $('#breadcrumbs').innerHTML = chapter ? `<a href="#/overview">课程首页</a><span aria-hidden="true">/</span><span>${esc(title)}</span>` : esc(title);
  document.title = `${title} · 数据可视化`;
  renderNavigation();
  setMobileNav(false,{restoreFocus:false});
  window.scrollTo({top:0,behavior:'instant'});
  if (route === '#/practice') drawDemo();
  if (hasRendered) $('#main-content').focus({preventScroll:true});
  hasRendered = true;
}

function evaluateQuiz(form) {
  const chapter = chapterMap.get(form.dataset.chapter);
  const answers = chapter.quiz.map((quiz,index) => form.querySelector(`input[name="question-${index}"]:checked`));
  if (answers.some(answer => !answer)) { $('#quiz-result').textContent='请先完成所有题目，再检查答案。'; return; }
  let correct=0;
  chapter.quiz.forEach((quiz,index) => {
    const selected=Number(answers[index].value);
    const ok=selected===quiz.answer;
    if (ok) correct++;
    const question=$$('.quiz-question',form)[index];
    $$('.quiz-option',question).forEach((option,optionIndex) => {
      option.classList.toggle('is-correct',optionIndex===quiz.answer);
      option.classList.toggle('is-wrong',optionIndex===selected&&!ok);
    });
    const explanation=$(`[data-explanation="${index}"]`,form);
    explanation.hidden=false;
    explanation.textContent=`${ok ? '判断正确。' : `正确选项为 ${String.fromCharCode(65+quiz.answer)}。`}${quiz.explanation}`;
  });
  $('#quiz-result').textContent=`答对 ${correct} / ${chapter.quiz.length} 题。${correct===chapter.quiz.length ? '继续把判断用到练习里。' : '结合解释，再想一遍。'}`;
}

function searchCourse(query) {
  const key=query.trim().toLowerCase();
  const target=$('#search-results');
  if (!key) { target.innerHTML='<p class="empty-state">搜索章节、图表名称或知识点，例如“箱线图”。</p>'; return; }
  const matches=chapters.map(chapter => {
    const concept=chapter.concepts.find(item=>`${item.term} ${item.definition}`.toLowerCase().includes(key));
    const fields=[chapter.title,chapter.enTitle,chapter.summary,chapter.managementQuestion,chapter.exercise.title,chapter.exercise.scenario,...chapter.exercise.tasks,...chapter.exercise.deliverables,...chapter.exercise.hints,chapter.exercise.extension,...chapter.objectives,...chapter.sections.map(section=>`${section.title} ${section.body}`)];
    const match=!!concept||fields.some(field=>String(field).toLowerCase().includes(key));
    return {chapter,concept,match};
  }).filter(result=>result.match);
  target.innerHTML=matches.length ? `<p class="search-count">找到 ${matches.length} 个相关章节</p>${matches.map(({chapter,concept})=>`<a class="search-result" href="${chapterLink(chapter)}"><span class="nav-number">${String(chapter.number).padStart(2,'0')}</span><span><strong>${esc(concept ? `${concept.term} · ${chapter.title}` : chapter.title)}</strong><span>${esc(concept?.definition || chapter.summary)}</span></span><span aria-hidden="true">→</span></a>`).join('')}` : '<p class="empty-state">暂时没有匹配的内容。可以试试更短的关键词，或到“知识点速查”浏览。</p>';
}
function openSearch() {
  if ($('#search-dialog').open) return;
  setMobileNav(false,{restoreFocus:false});
  $('#search-dialog').showModal();
  $('#course-search').value='';
  searchCourse('');
  $('#course-search').focus();
}

document.addEventListener('click',event=>{
  if (event.target.closest('.skip-link')) {
    event.preventDefault();
    $('#main-content').focus({preventScroll:true});
    $('#main-content').scrollIntoView({block:'start'});
    return;
  }
  const completeButton=event.target.closest('[data-complete]');
  if (completeButton) {
    const id=completeButton.dataset.complete;
    if (completed.has(id)) completed.delete(id); else completed.add(id);
    const saved = saveProgress();
    renderNavigation();
    completeButton.setAttribute('aria-pressed',String(completed.has(id)));
    completeButton.textContent=completed.has(id) ? '已完成学习 ✓' : '标记为已学习';
    toast(saved ? (completed.has(id) ? '已记录本章学习进度。' : '已取消本章完成标记。') : '当前浏览器无法保存进度，本次学习仍可正常进行。');
  }
  const scrollButton=event.target.closest('[data-scroll]');
  if (scrollButton) document.getElementById(scrollButton.dataset.scroll)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  const metricButton=event.target.closest('[data-metric]');
  if (metricButton) {
    $$('[data-metric]').forEach(button=>{button.classList.toggle('is-active',button===metricButton);button.setAttribute('aria-pressed',String(button===metricButton));});
    drawDemo(metricButton.dataset.metric);
  }
  if (event.target.closest('#search-results a')) $('#search-dialog').close();
  if (event.target.closest('#course-nav a')) setMobileNav(false);
});
document.addEventListener('submit',event=>{if(event.target.id==='quiz-form'){event.preventDefault();evaluateQuiz(event.target);}});
document.addEventListener('input',event=>{
  if(event.target.id==='course-search') searchCourse(event.target.value);
  if(event.target.id==='glossary-filter') {
    $('#glossary-items').innerHTML=glossaryItems(event.target.value);
    const count=$$('.glossary-item').length;
    $('#glossary-count').textContent=event.target.value.trim()?`找到 ${count} 个知识点`:`共 ${glossary.length} 个知识点`;
  }
});
document.addEventListener('change',event=>{
  if(event.target.id==='demo-sort')drawDemo($('[data-metric].is-active')?.dataset.metric || 'revenue');
  if(event.target.closest('#quiz-form')&&event.target.type==='radio'){
    const question=event.target.closest('.quiz-question');
    $$('.quiz-option',question).forEach(option=>option.classList.remove('is-correct','is-wrong'));
    $('.quiz-explanation',question).hidden=true;
    if($('#quiz-result').textContent)$('#quiz-result').textContent='答案已调整，请重新检查。';
  }
});
$('#open-search').addEventListener('click',openSearch);
$('#close-search').addEventListener('click',()=>$('#search-dialog').close());
$('#search-dialog').addEventListener('click',event=>{if(event.target===$('#search-dialog')){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close();}});
$('#mobile-menu').addEventListener('click',()=>setMobileNav(!$('#sidebar').classList.contains('is-open')));
$('#sidebar-overlay').addEventListener('click',()=>setMobileNav(false));
document.addEventListener('keydown',event=>{
  if(event.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){event.preventDefault();openSearch();}
  if(event.key==='Escape')setMobileNav(false);
  if(event.key==='Tab'&&mobileViewport.matches&&$('#sidebar').classList.contains('is-open')){
    const targets=$$('a[href],button:not([disabled])',$('#sidebar'));
    const first=targets[0],last=targets.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
mobileViewport.addEventListener('change',()=>setMobileNav(false,{restoreFocus:false}));
let resetArmed=false;
$('#reset-progress').addEventListener('click',()=>{
  if (!resetArmed) {resetArmed=true;$('#reset-progress').textContent='再次点击，确认重置';setTimeout(()=>{resetArmed=false;$('#reset-progress').textContent='重置学习进度';},4000);return;}
  completed.clear();const saved=saveProgress();resetArmed=false;$('#reset-progress').textContent='重置学习进度';renderRoute();toast(saved?'已清除当前浏览器的学习进度。':'本次进度已重置，浏览器未允许更新本地存储。');
});
window.addEventListener('hashchange',renderRoute);
renderRoute();

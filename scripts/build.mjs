import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import * as data from '../data/course.js';

const output = fileURLToPath(new URL('../data/course-data.js', import.meta.url));
const content = JSON.stringify({course:data.course,chapters:data.chapters,labs:data.labs,glossary:data.glossary}).replace(/</g,'\\u003c');
await writeFile(output, `// Generated from course.js. Run node scripts/build.mjs after content edits.\nwindow.COURSE_DATA = ${content};\n`);
console.log(`课程数据已生成：${data.chapters.length}章，${data.labs.length}次实验。`);

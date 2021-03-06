const { KindleConverter } = require('./src/kindle-converter');
const fs = require('fs');

const myArgs = process.argv.slice(2);
if (myArgs === undefined || myArgs.length === 0) console.log('using default test html');

const bookFileLocation = myArgs[0] ? myArgs[0]
  : './tests/test-kindle.html';

const bookHTML = fs.readFileSync(bookFileLocation, 'utf8');

const converter = new KindleConverter(bookHTML);



// console.log("test chinese note headng",
//   converter.parseNoteHeading("标注(黄色) - One: If You Want to Understand the Country, Visit McDonald’s > 第 38 页·位置 313")
// )

// console.log("test short chinese note heading",
//   converter.parseNoteHeading("笔记 - 位置 25")
// );

// console.log("test english note heading",
//   converter.parseNoteHeading("Highlight (pink) - Page 17 · Location 284")
// );

// console.log("test full english note heading",
//   converter.parseNoteHeading("Highlight (yellow) - One: If You Want to Understand the Country, Visit McDonald’s > Page 37 · Location 310")
// );
let bookInfo = converter.getBookInfo();
console.log(bookInfo);

console.log("test note parsing");
let bookNotes = converter.getBookNotes();
fs.writeFileSync(
  './tests/test-results.json',
  JSON.stringify({ bookInfo, bookNotes}, null, 2),
  'utf8'
);


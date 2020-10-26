const cheerio = require('cheerio');

class kindleConverter {
  
  highlightRegex = /highlight/i;
  noteRegex = /note/i;
  highlightColorRegex = /highlight_(?<color>\w+)/

  constructor(kindleHTML) {
    this.kindleHTML = kindleHTML;
    this.$ = cheerio.load(this.kindleHTML);
  }

  getBookInfo() {
    const titleElement = this.$('.bookTitle');
    const title = titleElement.text().trim();

    const authorElement = this.$('.authors');
    const authors = authorElement
      .text()
      .split(';')
      .map(author => {
        let name = author.trim();

        // regex to detect if name is in reversed order
        // i.e. lastName, firstName
        const reversedRegex = /(?<lastName>.+), (?<firstName>.+)/;
        const reversedMatch = name.match(reversedRegex);
        if (reversedMatch) {
          const groups = reversedMatch.groups;
          name = `${groups.firstName} ${groups.lastName}`;
        }
        
        return name;
      });
    
    return {
      title,
      authors
    }
  }

  getBookNotes() {
    const allNoteHeadingElements = $("div[class$='Heading']");
    let section = '';
    let allNotes = [];

    for (let i = 0; i < allNoteHeadingElements.length; i++) {
      let noteHeadingElement = allNoteHeadingElements.eq(i);

      let noteHeading = this.parseNoteHeading(
        noteHeadingElement.text().trim()
      );

      // if kindle notes have section headings, include them in all note headings
      let noteClass = noteHeadingElement.attr('class');
      if (noteClass === 'sectionHeading') section = noteClass;
      if (section) noteHeading.location.section = section;

      // check if highlight, then get color
      let highlightColor = null;
      if (noteHeading.noteType === 'highlight') {
        let highlightClass = noteHeadingElement.find("span[class^='highlight_']").attr('class');
        let highlightColorMatch = highlightClass.match(this.highlightColorRegex);
        highlightColor = highlightColorMatch.groups.color;
      }

      // get note text
      let noteText = noteHeadingElement.next('.noteText').text().trim();

      // assemble note object
      let note = {
        noteType: noteHeading.noteType,
        location: noteHeading.location,
        text: noteText
      };
      if (highlightColor) note.highlightColor = highlightColor;

      // check if noteType is note. if previous noteType is highlight, assume that note
      // is child note of highlight. if previous noteType is note, assume orphan note
      // with current kindle export format, no way to indepedently determine whether
      // noteType note is orphan or child
      let prevNote = allNotes.slice(-1)[0];
      if (!prevNote && prevNote.noteType === 'higlight') {
        prevParsedNote.note = note;
        continue;
      }

      allNotes.push(note);
    }
  }

  parseNoteHeading(heading) {
    // a fiendish regex to match kindle html heading line
    // test examples that work:
    // 笔记 - 位置 25
    // 标注(黄色) - 位置 23
    // Highlight (yellow) - One: If You Want to Understand the Country, Visit McDonald’s > Page 37 · Location 310
    // Highlight (pink) - Page 17 · Location 284
    // 标注(黄色) - One: If You Want to Understand the Country, Visit McDonald’s > 第 38 页·位置 313
    const headingRegex = /(?<noteType>.+) -( (?<chapter>.+) >)?( (?<page>.+)·)?([^0-9]*(?<location>[0-9]+))$/
    const headingMatch = heading.match(headingRegex);
    if (!headingMatch) throw new Error ("Not valid kindle note - metadata does not match");

    let { noteType, chapter, page, location } = headingMatch.groups;
    
    noteType = this.parseNoteType(noteType);
    if (isNaN(location)) throw new Error ('Not valid kindle note - invalid location');
    const kindleLocation = parseInt(location, 10);

    let parsedHeading = {
      noteType,
      location: {
        kindleLocation
      }
    };
    
    if (chapter) parsedHeading.location.chapter = chapter.trim();
    if (page) parsedHeading.location.page = page.trim();
    
    return parsedHeading;
  }

  parseNoteType(noteType) {
    let tempNoteType = noteType;
    tempNoteType = this.translateNoteType(tempNoteType);
    if (this.highlightRegex.test(tempNoteType)) return 'highlight';
    if (this.noteRegex.test(tempNoteType)) return 'note';
    throw new Error('Not valid kindle note - invalid note type');
  }

  translateNoteType(noteType) {
    let translated = noteType
      .replace(/标注/, "highlight")
      .replace(/笔记/, "note");
    console.log(translated);
    return translated;
  }
}

module.exports.kindleConverter = kindleConverter;
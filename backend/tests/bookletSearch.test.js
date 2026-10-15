const assert = require("node:assert/strict");
const test = require("node:test");
const { searchBooklets } = require("../services/bookletSearch");
const { formatBookletAnswer } = require("../services/formatBookletAnswer");

const programs = [
  {
    question: "What courses are listed in BCA Semester 1?",
    source: "BCA / BCA (Hons) Semester 1 Academic Booklet",
  },
  {
    question: "What courses are listed in BSc IT Semester 1?",
    source: "BSc IT / BSc IT (Hons) Semester 1 Academic Booklet",
  },
  {
    question: "What courses are listed in IMCA Semester 1?",
    source: "IMCA Semester 1 Academic Booklet",
  },
  {
    question: "What courses are listed in PG Semester 2?",
    source: "PG Semester 2 Academic Booklet",
  },
];

test("retrieves relevant passages only from the requested booklet", async () => {
  for (const program of programs) {
    const excerpts = await searchBooklets(program.question);

    assert.ok(excerpts.length > 0, `No results for: ${program.question}`);
    assert.ok(excerpts.every((excerpt) => excerpt.title.includes(program.source)));
    assert.ok(excerpts.every((excerpt) => !/page\s*\d+/i.test(excerpt.title)));
    assert.ok(excerpts.every((excerpt) => !/\b\d{8,}\b/.test(excerpt.text)));
  }
});

test("does not retrieve booklet passages for unrelated questions", async () => {
  assert.deepEqual(await searchBooklets("Give me a chicken recipe"), []);
});

test("removes page references and unnecessary introductory wording", () => {
  const answer = formatBookletAnswer(
    "Based on the provided excerpts from the **IMCA Semester 1 Academic Booklet**, the following courses are listed:\n\n**From the Time Table (Page 21):** Communication Skills (Page 82)."
  );

  assert.equal(answer, "From the Time Table: Communication Skills.");
  assert.doesNotMatch(answer, /page\s*\d+/i);
  assert.doesNotMatch(answer, /based on|provided excerpts/i);
});

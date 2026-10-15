const fs = require("fs/promises");
const path = require("path");
const pdfParse = require("pdf-parse");

const DOCUMENTS = [
  {
    file: "Academic_Booklet_Sem_1_IMCA_2026_27 (1).pdf",
    title: "IMCA Semester 1 Academic Booklet (2026–27)",
  },
  {
    file: "Academic_Booklet_Sem_1_BSc_IT__BSc_IT__Hons__2026_27 (1).pdf",
    title: "BSc IT / BSc IT (Hons) Semester 1 Academic Booklet (2026–27)",
  },
  {
    file: "Academic_Booklet_Sem_1_BCA__BCA__Hons__2026 (5).pdf",
    title: "BCA / BCA (Hons) Semester 1 Academic Booklet (2026–27)",
  },
  {
    file: "Academic Booklet for PG Sem-2 Students 2025-26 EVEN.pdf",
    title: "PG Semester 2 Academic Booklet (2025–26)",
  },
];

const STOP_WORDS = new Set([
  "about", "after", "also", "and", "are", "can", "could", "does", "for",
  "from", "give", "have", "help", "how", "into", "information", "is", "it",
  "its", "me", "my", "please", "provide", "tell", "that", "the", "their",
  "them", "there", "these", "this", "those", "what", "when", "where", "which",
  "who", "why", "with", "would", "you", "your", "academic", "bca", "bsc",
  "bscit", "cover", "covers", "imca", "it", "listed", "mca", "msc", "pg",
  "sem", "semester", "year", "in", "on", "of", "to", "by", "as", "be",
  "do", "did", "has", "had", "not", "or", "at", "an", "a",
]);

const WORDS_PER_CHUNK = 180;
const WORDS_OVERLAP = 35;
let indexPromise;

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9]{2,}/g) || []).map((term) => {
    if (term.endsWith("ies") && term.length > 4) return `${term.slice(0, -3)}y`;
    if (term.endsWith("s") && term.length > 3) return term.slice(0, -1);
    return term;
  });
}

function createChunks(document, page, text) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const chunks = [];

  for (let start = 0; start < words.length; start += WORDS_PER_CHUNK - WORDS_OVERLAP) {
    const chunkWords = words.slice(start, start + WORDS_PER_CHUNK);
    if (chunkWords.length === 0) break;

    chunks.push({
      title: document.title,
      document: document.file,
      page,
      position: start,
      text: chunkWords.join(" "),
      terms: tokenize(chunkWords.join(" ")),
    });
  }

  return chunks;
}

async function buildIndex() {
  const dataDirectory = path.resolve(__dirname, "..", "..", "data");
  const chunks = [];

  for (const document of DOCUMENTS) {
    const filePath = path.join(dataDirectory, document.file);
    let pageNumber = 0;
    const pdf = await pdfParse(await fs.readFile(filePath), {
      pagerender: async (pageData) => {
        pageNumber += 1;
        const content = await pageData.getTextContent();
        const text = content.items
          .filter((item) => typeof item.str === "string")
          .map((item) => `${item.str}${item.hasEOL ? "\n" : " "}`)
          .join("");
        return `\u0000PAGE_${pageNumber}\u0000${text}`;
      },
    });
    const pages = [
      ...pdf.text.matchAll(/\u0000PAGE_(\d+)\u0000([\s\S]*?)(?=\u0000PAGE_\d+\u0000|$)/g),
    ];

    if (pages.length === 0) {
      throw new Error(`No searchable text was extracted from ${document.file}`);
    }

    for (const [, page, text] of pages) {
      if (/\b\d{8,}\b/.test(text)) continue;
      chunks.push(...createChunks(document, page, text));
    }
  }

  const documentFrequency = new Map();
  for (const chunk of chunks) {
    for (const term of new Set(chunk.terms)) {
      documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1);
    }
  }

  return { chunks, documentFrequency };
}

function getIndex() {
  if (!indexPromise) {
    indexPromise = buildIndex();
  }
  return indexPromise;
}

async function searchBooklets(question) {
  const { chunks, documentFrequency } = await getIndex();
  const normalizedQuestion = question.toLowerCase();
  const documentFilter = normalizedQuestion.match(/\b(imca|bca|bsc\s*it|bscit|mca|msc\s*it|pg|postgraduate)\b/);
  let targetDocument;

  if (documentFilter) {
    const program = documentFilter[1].replace(/\s+/g, "");
    if (program === "imca") targetDocument = DOCUMENTS[0].file;
    else if (program === "bca") targetDocument = DOCUMENTS[2].file;
    else if (program === "bscit") targetDocument = DOCUMENTS[1].file;
    else targetDocument = DOCUMENTS[3].file;
  }

  const queryTerms = [
    ...new Set(tokenize(question).filter((term) => !STOP_WORDS.has(term))),
  ];

  if (queryTerms.length === 0) return [];

  const minimumMatches = queryTerms.length > 3 ? 2 : 1;
  const matches = [];

  for (const chunk of chunks) {
    if (targetDocument && chunk.document !== targetDocument) continue;

    const frequencies = new Map();
    for (const term of chunk.terms) {
      frequencies.set(term, (frequencies.get(term) || 0) + 1);
    }

    let score = 0;
    let matchedTerms = 0;
    for (const term of queryTerms) {
      const frequency = frequencies.get(term) || 0;
      if (frequency === 0) continue;

      matchedTerms += 1;
      const frequencyAcrossChunks = documentFrequency.get(term) || 0;
      const inverseFrequency = Math.log(
        1 + (chunks.length - frequencyAcrossChunks + 0.5) /
          (frequencyAcrossChunks + 0.5)
      );
      score += inverseFrequency *
        (frequency * 2.2 / (frequency + 1.2 * (0.25 + 0.75 * chunk.terms.length / WORDS_PER_CHUNK)));
    }

    if (matchedTerms >= minimumMatches && score >= 0.45) {
      matches.push({ ...chunk, score });
    }
  }

  matches.sort((a, b) => b.score - a.score);

  const selected = [];
  const selectedPositions = new Map();
  for (const match of matches) {
    const positions = selectedPositions.get(match.document) || [];
    const maximumPerDocument = targetDocument ? 5 : 2;
    if (positions.length >= maximumPerDocument || positions.some((position) =>
      position.page === match.page &&
      Math.abs(position.position - match.position) < WORDS_PER_CHUNK
    )) {
      continue;
    }

    selected.push(match);
    selectedPositions.set(match.document, [
      ...positions,
      { page: match.page, position: match.position },
    ]);
    if (selected.length === 5) break;
  }

  return selected;
}

module.exports = { searchBooklets };

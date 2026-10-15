function formatBookletAnswer(answer) {
  return answer
    .replace(/^\s*(?:based on|according to)\b[^:\n]*:\s*/i, "")
    .replace(/\s*\(?\bpages?\s*#?\s*\d+(?:\s*[-–,]\s*\d+)*\)?/gi, "")
    .replace(/\*\*/g, "")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[ \t]*#{1,6}[ \t]*/gm, "")
    .replace(/[ \t]+:/g, ":")
    .replace(/:\s*:/g, ":")
    .replace(/\s+([.,;!?])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, "\n\n")
    .trim();
}

module.exports = { formatBookletAnswer };

/**
 * Decodes a camel case string by adding spaces between words and capitalizing the first letter of each word.
 *
 * @param input - The camel case string to decode.
 * @returns The decoded string.
 */
export function decodeCamelCase(input?: string): string {
  if (!input || typeof input !== "string") return "";

  input = input.replace(/_+/g, " ").trim();
  return (
    input
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // space before last upper in a sequence followed by lower
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3")
      .toLowerCase()
      // uppercase the first character
      .replace(/^./, (str) => str.toUpperCase())
  );
}

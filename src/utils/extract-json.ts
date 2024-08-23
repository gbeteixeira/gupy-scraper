import type { AIMessage } from "@langchain/core/messages";

/**
 * Custom extractor
 *
 * Extracts JSON content from a string where
 * JSON is embedded between ```json and ``` tags.
 */
export const extractJson = <T>(output: AIMessage): Array<T> => {
  const text = output.content as string;
  // Define the regular expression pattern to match JSON blocks
  const pattern = /```json(.*?)```/gs;

  // Find all non-overlapping matches of the pattern in the string
  const matches = text.match(pattern);

  // Process each match, attempting to parse it as JSON
  try {
    return (
      matches?.map((match) => {
        // Remove the markdown code block syntax to isolate the JSON string
        const jsonStr = match.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonStr);
      }) ?? []
    );
  } catch (error) {
    throw new Error(`Failed to parse: ${output}`);
  }
}
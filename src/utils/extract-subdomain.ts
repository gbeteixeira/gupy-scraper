
/**
 * extractSubdomain - Extracts the subdomain from a given URL string.
 */
export default function extractSubdomain(url: string) {
  // Uses the URL object to separate the URL into parts
  const domain = new URL(url).hostname;

  // Splits the domain into parts using the dot as a delimiter
  const parts = domain.split('.');

  // Returns the subdomain (or the second part of the domain if applicable)
  return parts[0];
}
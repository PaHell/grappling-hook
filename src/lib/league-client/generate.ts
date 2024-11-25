import dataset from "./dataset";

const LeagueClientUrlEnumName = "LeagueClientUrls";

// Convert a part of a URI to PascalCase
const partToPascalCase = (uri: string) =>
      uri
            .split('-')
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join('');

// Check if a part of the URL is processable
const isProcessable = (part: string) => {
      const illegalCharRegex = /[^a-zA-Z0-9-_]/;
      return part && !illegalCharRegex.test(part) && isNaN(Number(part));
};

// Sanitize a URL part by removing illegal characters
const sanitizePart = (part: string) => part.replace(/[^a-zA-Z0-9-_]/g, '');

// Detect if a URL segment is an ID and replace it with a wildcard
const replaceIdsWithWildcard = (uri: string) =>
      uri
            .split('/')
            .map((part) => {
                  // ID detection logic (e.g., numeric or UUID-like patterns)
                  const isNumeric = /^[0-9]+$/.test(part);
                  const isHex = /^[a-fA-F0-9]+$/.test(part.split("_")?.[1] ?? part);
                  const isUUID = /^[a-fA-F0-9-]{36}$/.test(part); // Basic UUID check
                  const endsWithNetworkId = part.endsWith('eu1.pvp.net');
                  return isNumeric || isHex || isUUID || endsWithNetworkId ? ':id' : part;
            })
            .join('/');

export function generate() {
      // Flatten the dataset into a single enum structure
      const urls = dataset.map((item: { uri: string }) => item.uri).filter(Boolean);

      // Use a Set to track unique enum entries
      const uniqueEntries = new Set<string>();

      const enumEntries = urls
            .map((uri) => {
                  // Replace IDs with wildcards in the URL
                  const uriWithWildcards = replaceIdsWithWildcard(uri);

                  // Filter out non-processable parts of the URL
                  const processableUri = uriWithWildcards
                        .split('/')
                        .filter(isProcessable)
                        .map(sanitizePart) // Sanitize valid parts
                        .join('/');

                  // Generate a unique enum key
                  const enumKey = processableUri
                        ? partToPascalCase(processableUri.replace(/\//g, '_').substring(1))
                        : null;

                  // Add to the Set if both key and value are valid and unique
                  if (enumKey && !uniqueEntries.has(enumKey)) {
                        uniqueEntries.add(enumKey);
                        return `    ${enumKey} = "${uriWithWildcards}"`;
                  }

                  return null;
            })
            .filter(Boolean) // Remove null entries
            .join(',\n');

      // Generate the final enum
      const enumContent = `export enum ${LeagueClientUrlEnumName} {\n${enumEntries}\n}`;

      console.log(enumContent);
}

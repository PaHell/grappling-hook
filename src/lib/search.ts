export default function searchByKeys<T>(searchTerm: string, items: T[], keys: (keyof T)[]): T[] {
      const search = searchTerm.toLowerCase();
      return items
            .reduce<[number, T][]>((acc, curr) => {
                  const score = keys.reduce<number>((currentScore, key, index) => {
                        const value = curr[key]?.toString()?.toLowerCase() ?? '';
                        if (value.includes(search)) {
                              currentScore += index * 0.5 + 1;
                        }
                        return currentScore;
                  }, 0);
                  acc.push([score, curr]);
                  return acc;
            }, [])
            .filter(([score]) => score > 0)
            .sort((a, b) => b[0] - a[0])
            .map(([, item]) => item);
}
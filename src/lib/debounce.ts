// from: https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940
// great fight there
export default function <F extends (...args: any[]) => any>(func: F, waitFor: number) {
      let timeout: NodeJS.Timeout | null = null;
      return (...args: Parameters<F>): Promise<ReturnType<F>> =>
            new Promise(resolve => {
                  if (timeout) {
                        clearTimeout(timeout);
                  }
                  timeout = setTimeout(() => resolve(func(...args)), waitFor);
            });
}
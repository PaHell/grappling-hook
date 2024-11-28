export function errorToString(error: unknown) {
      console.error(error);
      switch (typeof error) {
            case 'string':
                  return error;
            case 'object':
                  if (error instanceof Error) {
                        return error.message;
                  }
                  return JSON.stringify(error);
            default:
                  return String(error);
      }
}
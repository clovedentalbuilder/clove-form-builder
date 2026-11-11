export class JsonUtils {

  public static resolvePattern(json: Object, pattern: string) {
    return this.resolve(json, pattern);
  }

  public static resolveJsonPath(json:Object, jsonPath: string){
    return this.resolveToken(json, jsonPath);
  }

  public static resolve(json: Object, pattern: string) {
    if (!json || !pattern) {
      return '';
    }
    try {
      let tokens = pattern.split(' ');
      let resolveTokens: string[] = [];
      for (const token of tokens) {
        const resolvedToken = this.resolveToken(json, token);
        resolveTokens.push(
          typeof resolvedToken === 'object' ? JSON.stringify(resolvedToken) : String(resolvedToken)
        );
      }
      return resolveTokens.join(' ');
    } catch (error) {
      console.error('Error resolving path:', error);
      return '';
    }
  }

  private static resolveToken(json: any, token: string): any {
    const resolvedValue = this.resolveObjectPath(json, token);
    return resolvedValue !== undefined ? resolvedValue : token;
  }

  private static resolveObjectPath(dataObject: any, path: string): any {
    if (!path.startsWith('$')) return path;

    const pathParts = this.parsePath(path.slice(1)); // Remove the `$` at the start
    return pathParts.reduce((currentObject, key) => {
      if (currentObject === null || currentObject === undefined) {
        return undefined; // Return undefined if the path does not exist
      }
      return currentObject[key];
    }, dataObject);
  }

  private static parsePath(path: string): Array<string | number> {
    // Use a regular expression to match property names and array indices
    const regex = /(\w+|\[\d+\]|["'][^"']*["'])/g;
    return path.match(regex)?.map((part) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return Number(part.slice(1, -1)); // Convert to number if it's an array index
      }
      // Remove quotes around property names
      return part.replace(/^['"]|['"]$/g, '');
    }) || [];
  }
}

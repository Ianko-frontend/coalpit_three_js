export const getData  =  async (): Promise<string> => {
    try {
        const response: Response = await fetch('/models/test.xml');
        const buffer: ArrayBuffer = await response.arrayBuffer();
        return new TextDecoder("windows-1251").decode(buffer);
    } catch (error) {
        console.error('Error loading XML:', error);
        return '';
    }
}
export default function isUrl(string: string, { lenient = false } = {}) {
    if (typeof string !== 'string') {
        throw new TypeError('Expected a string');
    }

    string = string.trim();
    if (string.includes(' ')) {
        return false;
    }

    try {
        new URL(string);
        return true;
    } catch {
        if (lenient) {
            return isUrl(`https://${string}`);
        }

        return false;
    }
}

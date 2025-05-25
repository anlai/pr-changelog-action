function sanitize_line(line) {
    line = line.trim();

    if (line.startsWith('#')) {
        return `## ${line.replaceAll('#', '').trim()}`;
    }

    if (line.startsWith('-')) {
        return `- ${line.substring(1).trim()}`;
    }

    return `- ${line.trim()}`;
}

function correct_existing(lines) {
    const results = [];

    lines = lines.filter(line => line.trim() !== '');
    for(let i = 0; i < lines.length; i++) {
        let sanitized = sanitize_line(lines[i]);

        if (sanitized.startsWith('#')) {
            results.push('');
            results.push(sanitized);
        }
        else {
            results.push(sanitized);
        }
    }

    return results;
}

function parse_changelog(lines) {
    let pending = [];
    if (lines.length > 0) {
        do {
            var element = lines.shift();

            if (!element) {
                lines.unshift('');
                break;
            }

            pending.push(element);
        } while(lines.length > 0);
    }

    return { pending, existing: lines };
}

module.exports = { 
    sanitize_line, 
    correct_existing,
    parse_changelog
};
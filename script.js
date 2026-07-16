const SCRIPT_KEY = [
    'toggle', 'scheme', 'theme', 'title', 'hide title',
    'previous chapters', 'next chapters', 'edit script'
];

const SCRIPT_TYPE = {
    'radio': 'Radio',
    'moment': 'Moment',
    'text message': 'Text Message',
    'reset': 'Reset'
};

const PHONE_TYPE = {
    'voice': 'Voice',
    'video': 'Video',
    'text message': 'Text Message'
};

const EMOJI_LIST = [
    "Adorable", "Angry", "Announcer", "Asleep", "Awkward", "Bawling", "Bomb", "Bored",
    "Cake", "Celebrating", "Cheers", "Chuckling", "Claps", "Cocky", "Coffee", "Cursing",
    "Daydreaming", "Disdain", "Dizzy", "Dog Head", "Doubtful", "Epic", "Feeling Wronged",
    "Fist Bump", "Flowers", "Flowers for You", "Genius", "Gift", "Going Crazy", "Grumpy",
    "Hands Up", "Handshake", "Heart‑broken", "Hearteyes", "Hearts", "Huggie", "Hush",
    "It's Locked", "Kneeling", "Knocking", "Laughing", "LMAO", "Miserable", "Music",
    "Mwah!", "OK", "On the Verge of Tears", "Patting the Head", "Pig Head", "Pills",
    "Playful", "Pouting", "Provocative", "Red Packet", "ROFL", "Sad", "Seduction",
    "See Ya", "Shrugs", "Shut Up", "Shy", "Smiling", "Smirking", "Spectating", "Strive",
    "Surprised", "Sweating", "Tearful", "Thankful", "The Moon", "The Sun", "Thumbs Up",
    "Victory", "Waves", "Whistling", "Wicked", "Wide Grin", "Wilting"
];

const ANIMATED_PREFIXES = [
    "Galaxy Kid",
    "Happy Snowman",
    "Artsy Birb",
    "Grumpy Crow",
    "Sunny Apple"
];

const ANIMATED_EMOJI_LIST = {
    "Galaxy Kid": [
        "!", "?", "...", "A Bummer", "Dizzy", "Flower Launch", "G'nite", "Got It",
        "Happy", "Heart", "Hewwo", "I Don't Care", "Lemme See", "Not Sleepy",
        "Okay Now", "Pat Pat", "Plop", "Pretend", "Recharging", "See Ya", "Stare",
        "Sweats", "Thanks", "U Got This", "Wow"
    ],
    "Happy Snowman": [
        "?", "...", "Alert", "Analyze", "Angy", "Awake?", "Busy", "Frosty Flowers",
        "Glasses", "Grumpy", "Hmph", "I Don't Care", "Indifferent", "Later", "No",
        "Nope", "Not Listening", "Observe", "Okay", "Overtime", "Sigh", "Tea",
        "Time for Meds", "Yea", "You Angsty"
    ],
    "Artsy Birb": [
        "!!!", "???", "Angry", "Bloom Tint", "Boring", "Busy", "Bye", "Comfort Me",
        "Cutee", "Dummy", "Genius", "Go Away", "Heartbroken", "Heya", "Huggie",
        "I Don't Care", "I'm Babey", "Knock Knock", "Love Ya", "Morning", "Peep",
        "Popcorns", "Proud", "Tearing", "Thinking"
    ],
    "Grumpy Crow": [
        "!", "?", "Amazing", "Angy", "Annoyed", "Boring", "Comfy", "Coming", "Cuddle",
        "Don't Wanna", "Feather Bloom", "For You", "Gimme Everything", "Good Night",
        "Graceful", "Happy", "Indifferent", "No", "Not Looking", "Pondering", "Proud",
        "Speechless", "Sure", "That It?", "U Doing What Now"
    ],
    "Sunny Apple": [
        "!!", "??", "Angy", "Bye", "Dizzy", "Flower Greeting", "Funny", "G'nite",
        "Happy", "Heartbroken", "Hmm", "Huggie", "Hurt", "Morning", "Never Mind",
        "No", "No No No", "Okay", "On What Basis", "Pat Pat", "Spill It", "Tired",
        "U Got This", "Watcha Doing", "Yay"
    ]
};

const INTERACTION_TYPE_LIST = [
    "Tap", "Tap Multi", "Tap Multi Timed",
    "Arrow", "Arrow Timed", "Arrow Curve", "Arrow Curve Timed",
    "Camera", "Talk", "Talk Timed", "Voice",
    "Touch", "Trace", "Rotate",
    "Swipe", "Swipe Timed", "Breathe",
    "Hold", "Timed"
];

const ANIMATED_EMOJI = new RegExp(`^<(${ANIMATED_PREFIXES.join('|')}):\\s*([^>]+)>$`, 'i');

const DIALOGUE_COVRD = /^([^-]+?)\s*-\s*([^-]+?)\s*(?:\(([^)]+)\))?\s*:\s*(.*)$/;
const DIALOGUE_EXPR  = /^([^(]+?)\s*\(([^)]+)\)\s*:\s*(.*)$/;
const DIALOGUE       = /^([^:]+?):\s*(.*)$/;

const SCRIPT_NOBLOCK = /^\s*<Script>\s*$/i;
const SCRIPT_START = /^\s*<Script\b/i;
const SCRIPT_END = /\s*>\s*$/;

const CHOICE = /^\s*\?\?\?\s*$/;
const CHOICE_OPTION = /^\?\s*/;

const PHONE_START = /^\s*@\s*(voice|video|text\s+message)\s*(?:-\s*(.+?))?\s*$/i;
const PHONE_END = /^\s*@@\s*$/;

const HEADING = /^##\s+(.+?)(?:\s*<\s*([^|]+?)\s*>)?$/i;
const INTERACTION = /^!!\s+([A-Za-z\s]+)(?:\s*-\s*([^<]*?))?(?:\s*<([^>]+)>)?$/;
const QUOTE = /^\^\s*(.+?)(?:\s*<\s*(.+?)\s*>)?$/;
const NARRATION = /^>\s*(.+)$/;
const NARRATION_LARGE = /^\s*>>\s+/;
const BREAK = /^\s*---\s*$/;
const CONTEXT = /^\s*<Context(?:\s+([^>]+))?>\s*(.*)$/i;
const TYPE = new RegExp(`^\\s*<type\\/(${Object.keys(SCRIPT_TYPE).join('|')})>\\s*$`, 'i');

function normalizeKey(key) {
    return key.trim().toLowerCase();
}

function isAllowedKey(key) {
    return SCRIPT_KEY.includes(normalizeKey(key));
}

function isValidAnimatedEmoji(prefix, suffix) {
    const prefixNorm = prefix.trim();
    const suffixNorm = suffix.trim();
    if (!ANIMATED_PREFIXES.includes(prefixNorm)) return false;
    const suffixes = ANIMATED_EMOJI_LIST[prefixNorm] || [];
    return suffixes.some(s => s.toLowerCase() === suffixNorm.toLowerCase());
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function processScriptParam(key, value) {
    const normalizedKey = normalizeKey(key);
    let result = { value: value, valid: true };

    if (normalizedKey === 'toggle') {
        const lowerVal = value.trim().toLowerCase();
        if (lowerVal === 'yes') {
            result.value = 'true';
        } else if (lowerVal === 'no') {
            result.value = 'false';
        } else if (lowerVal === 'collapsed') {
            result.value = 'Collapsed';
        } else {
            result.valid = false;
        }
    } else if (normalizedKey === 'hide title') {
        const lowerVal = value.trim().toLowerCase();
        if (lowerVal === 'yes') {
            result.value = 'true';
        } else if (lowerVal === 'no') {
            result.value = 'false';
        } else {
            result.valid = false;
        }
    }
    return result;
}

function formatDialogue(character, dialogue, extras = {}) {
    const parts = ['{{Script/dialogue', character, dialogue];
    if (extras.expression) parts.push(`Expression=${extras.expression}`);
    if (extras.characterOverride) parts.push(`Character Override=${extras.characterOverride}`);
    return parts.join('|') + '}}';
}

function convertLine(line, isFailedScriptLine) {
    if (isFailedScriptLine) return { out: line, converted: false, blank: false };
    if (line.trim() === '') return { out: '', converted: false, blank: true };

    const interactionMatch = line.match(INTERACTION);
    if (interactionMatch) {
        const type = interactionMatch[1].trim();
        if (!INTERACTION_TYPE_LIST.some(t => t.toLowerCase() === type.toLowerCase())) {
            return { out: line, converted: false };
        }
        let text = interactionMatch[2] ? interactionMatch[2].trim() : '';
        const opts = interactionMatch[3] ? interactionMatch[3].trim() : null;
        let rotate = null;
        let flip = false;

        if (opts) {
            const parts = opts.split('//').map(s => s.trim());
            if (parts.length === 2) {
                const num = parseFloat(parts[0]);
                if (Number.isInteger(num) && num >= 1 && num <= 360) {
                    rotate = num;
                } else {
                    return { out: line, converted: false };
                }
                if (parts[1].toLowerCase() === 'flip') {
                    flip = true;
                } else {
                    return { out: line, converted: false };
                }
            } else if (parts.length === 1) {
                const val = parts[0].toLowerCase();
                if (val === 'flip') {
                    flip = true;
                } else {
                    const num = parseFloat(val);
                    if (Number.isInteger(num) && num >= 1 && num <= 360) {
                        rotate = num;
                    } else {
                        return { out: line, converted: false };
                    }
                }
            } else {
                return { out: line, converted: false };
            }
        }

        let out = `{{Script/interaction|${type}`;
        if (text) out += `|${text}`;
        if (rotate !== null) out += `|Rotate=${rotate}`;
        if (flip) out += `|Flip=true`;
        out += '}}';
        return { out: out, converted: true };
    }

    const quoteMatch = line.match(QUOTE);
    if (quoteMatch) {
        const text = quoteMatch[1].trim();
        const sources = quoteMatch[2] ? quoteMatch[2].trim() : null;
        let out = '{{Script/quote|' + text;
        if (sources) {
            out += '|' + sources;
        }
        out += '}}';
        return { out: out, converted: true };
    }

    const narrationMatch = line.match(NARRATION);
    if (narrationMatch) {
        const text = narrationMatch[1].trim();
        return { out: `{{Script/narration|${text}}}`, converted: true };
    }

    const breakMatch = line.match(BREAK);
    if (breakMatch) {
        return { out: '{{Script/break}}', converted: true };
    }

    const contextMatch = line.match(CONTEXT);
    if (contextMatch) {
        const type = contextMatch[1] ? contextMatch[1].trim() : null;
        const text = contextMatch[2].trim();
        if (type) {
            return { out: `{{Script/context|Type=${type}|${text}}}`, converted: true };
        } else {
            return { out: `{{Script/context|${text}}}`, converted: true };
        }
    }

    const headingMatch = line.match(HEADING);
    if (headingMatch) {
        const text = headingMatch[1].trim();
        const subtitle = headingMatch[2] ? headingMatch[2].trim() : null;
        let out = '{{Script/heading|' + text;
        if (subtitle) {
            out += '|Subtitle=' + subtitle;
        }
        out += '}}';
        return { out: out, converted: true };
    }

    const typeMatch = line.match(TYPE);
    if (typeMatch) {
        const raw = typeMatch[1].toLowerCase();
        const type = SCRIPT_TYPE[raw];
        return { out: `{{Script/type|${type}}}`, converted: true };
    }

    let m = line.match(DIALOGUE_COVRD);
    if (m) {
        const character = m[1].trim();
        const override = m[2].trim();
        const expression = m[3] ? m[3].trim() : null;
        let dialogue = m[4].trim();

        const animatedMatch = dialogue.match(ANIMATED_EMOJI);
        if (animatedMatch) {
            const prefix = animatedMatch[1];
            const suffix = animatedMatch[2].trim();
            if (!isValidAnimatedEmoji(prefix, suffix)) {
                return { out: line, converted: false };
            }
            const fullTag = `${prefix}: ${suffix}`;
            return { out: `{{Script/animated emoji|${character}|${fullTag}}}`, converted: true };
        }

        let hasInvalidEmoji = false;
        dialogue = dialogue.replace(/<([^:>]+)>/g, function(match, emojiName) {
            if (EMOJI_LIST.includes(emojiName)) {
                return `{{Emoji|${emojiName}}}`;
            } else {
                hasInvalidEmoji = true;
                return match;
            }
        });
        if (hasInvalidEmoji) {
            return { out: line, converted: false };
        }

        const out = formatDialogue(character, dialogue, { expression, characterOverride: override });
        return { out: out, converted: true };
    }

    m = line.match(DIALOGUE_EXPR);
    if (m) {
        const character = m[1].trim();
        const expression = m[2].trim();
        let dialogue = m[3].trim();

        const animatedMatch = dialogue.match(ANIMATED_EMOJI);
        if (animatedMatch) {
            const prefix = animatedMatch[1];
            const suffix = animatedMatch[2].trim();
            if (!isValidAnimatedEmoji(prefix, suffix)) {
                return { out: line, converted: false };
            }
            const fullTag = `${prefix}: ${suffix}`;
            return { out: `{{Script/animated emoji|${character}|${fullTag}}}`, converted: true };
        }

        let hasInvalidEmoji = false;
        dialogue = dialogue.replace(/<([^:>]+)>/g, function(match, emojiName) {
            if (EMOJI_LIST.includes(emojiName)) {
                return `{{Emoji|${emojiName}}}`;
            } else {
                hasInvalidEmoji = true;
                return match;
            }
        });
        if (hasInvalidEmoji) {
            return { out: line, converted: false };
        }

        const out = formatDialogue(character, dialogue, { expression });
        return { out: out, converted: true };
    }

    m = line.match(DIALOGUE);
    if (m) {
        const character = m[1].trim();
        let dialogue = m[2].trim();

        const animatedMatch = dialogue.match(ANIMATED_EMOJI);
        if (animatedMatch) {
            const prefix = animatedMatch[1];
            const suffix = animatedMatch[2].trim();
            if (!isValidAnimatedEmoji(prefix, suffix)) {
                return { out: line, converted: false };
            }
            const fullTag = `${prefix}: ${suffix}`;
            return { out: `{{Script/animated emoji|${character}|${fullTag}}}`, converted: true };
        }

        let hasInvalidEmoji = false;
        dialogue = dialogue.replace(/<([^:>]+)>/g, function(match, emojiName) {
            if (EMOJI_LIST.includes(emojiName)) {
                return `{{Emoji|${emojiName}}}`;
            } else {
                hasInvalidEmoji = true;
                return match;
            }
        });
        if (hasInvalidEmoji) {
            return { out: line, converted: false };
        }

        const out = formatDialogue(character, dialogue, {});
        return { out: out, converted: true };
    }

    return { out: line, converted: false };
}

function convert() {
    const raw = document.getElementById('input').value;
    const lines = raw.split('\n');
    const outDiv = document.getElementById('output');

    const isScriptBlockLine = new Array(lines.length).fill(false);
    const isFailedScriptLine = new Array(lines.length).fill(false);
    const isChoiceBlockLine = new Array(lines.length).fill(false);
    const isPhoneBlockLine = new Array(lines.length).fill(false);

    const choiceOutputs = [];
    const phoneOutputs = [];

    let scriptParams = null;
    let hasScriptBlock = false;

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];

        if (SCRIPT_NOBLOCK.test(line)) {
            hasScriptBlock = true;
            isScriptBlockLine[i] = true;
            i++;
            continue;
        }

        if (SCRIPT_START.test(line) && !SCRIPT_NOBLOCK.test(line)) {
            let blockLines = [line];
            let blockStartIdx = i;
            let j = i + 1;
            let foundEnd = false;
            while (j < lines.length) {
                blockLines.push(lines[j]);
                if (SCRIPT_END.test(lines[j])) {
                    foundEnd = true;
                    break;
                }
                j++;
            }
            if (foundEnd) {
                let valid = true;
                const params = {};
                for (let k = 1; k < blockLines.length - 1; k++) {
                    const paramLine = blockLines[k].trim();
                    if (paramLine === '') continue;
                    const colonIndex = paramLine.indexOf(':');
                    if (colonIndex !== -1) {
                        let key = paramLine.substring(0, colonIndex).trim();
                        let value = paramLine.substring(colonIndex + 1).trim();
                        if (!isAllowedKey(key)) {
                            valid = false;
                            break;
                        }
                        const processed = processScriptParam(key, value);
                        if (!processed.valid) {
                            valid = false;
                            break;
                        }
                        params[key] = processed.value;
                    } else {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    let lastLine = blockLines[blockLines.length - 1].trim();
                    let lastContent = lastLine.replace(SCRIPT_END, '').trim();
                    if (lastContent !== '') {
                        const colonIndex = lastContent.indexOf(':');
                        if (colonIndex !== -1) {
                            let key = lastContent.substring(0, colonIndex).trim();
                            let value = lastContent.substring(colonIndex + 1).trim();
                            if (!isAllowedKey(key)) {
                                valid = false;
                            }
                            if (valid) {
                                const processed = processScriptParam(key, value);
                                if (!processed.valid) {
                                    valid = false;
                                } else {
                                    params[key] = processed.value;
                                }
                            }
                        } else {
                            valid = false;
                        }
                    }
                }
                if (valid) {
                    for (let idx = blockStartIdx; idx <= j; idx++) {
                        isScriptBlockLine[idx] = true;
                    }
                    scriptParams = params;
                    hasScriptBlock = true;
                    i = j + 1;
                    continue;
                } else {
                    for (let idx = blockStartIdx; idx <= j; idx++) {
                        isFailedScriptLine[idx] = true;
                    }
                    i = j + 1;
                    continue;
                }
            } else {
                i++;
            }
        }
        i++;
    }

    i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (CHOICE.test(line) && !isScriptBlockLine[i] && !isFailedScriptLine[i]) {
            const startIdx = i;
            let j = i + 1;
            let foundEnd = false;
            while (j < lines.length) {
                if (CHOICE.test(lines[j]) && !isScriptBlockLine[j] && !isFailedScriptLine[j]) {
                    foundEnd = true;
                    break;
                }
                j++;
            }
            if (foundEnd) {
                const blockLines = lines.slice(startIdx + 1, j);
                const tabs = [];
                let currentTitle = null;
                let currentContent = [];
                for (let k = 0; k < blockLines.length; k++) {
                    const bline = blockLines[k];
                    const trimmed = bline.trim();
                    if (CHOICE_OPTION.test(trimmed)) {
                        if (currentTitle !== null) {
                            tabs.push({ title: currentTitle, content: currentContent.join('\n') });
                        }
                        currentTitle = trimmed.replace(CHOICE_OPTION, '').trim();
                        currentContent = [];
                    } else {
                        if (currentTitle !== null) {
                            currentContent.push(bline);
                        }
                    }
                }
                if (currentTitle !== null) {
                    tabs.push({ title: currentTitle, content: currentContent.join('\n') });
                }

                let outputLines = ['<tabber>'];
                for (const tab of tabs) {
                    outputLines.push(`|-|${tab.title} =`);
                    if (tab.content) {
                        const contentLines = tab.content.split('\n');
                        for (const cline of contentLines) {
                            if (cline.trim() === '') {
                                outputLines.push('');
                                continue;
                            }
                            const result = convertLine(cline, false);
                            if (result.converted && !result.blank) {
                                outputLines.push(result.out);
                            } else {
                                outputLines.push(cline);
                            }
                        }
                    }
                }
                outputLines.push('</tabber>');

                for (let idx = startIdx; idx <= j; idx++) {
                    isChoiceBlockLine[idx] = true;
                }
                choiceOutputs.push({ startIdx, endIdx: j, outputLines });
                i = j + 1;
                continue;
            }
        }
        i++;
    }

    i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const phoneMatch = line.match(PHONE_START);
        if (phoneMatch && !isScriptBlockLine[i] && !isFailedScriptLine[i] && !isChoiceBlockLine[i]) {
            const typeRaw = phoneMatch[1].toLowerCase();
            const type = PHONE_TYPE[typeRaw];
            let name = phoneMatch[2] ? phoneMatch[2].trim() : '';
            if (name === '') name = null;

            const startIdx = i;
            let j = i + 1;
            let foundEnd = false;
            while (j < lines.length) {
                if (PHONE_END.test(lines[j]) && !isScriptBlockLine[j] && !isFailedScriptLine[j] && !isChoiceBlockLine[j]) {
                    foundEnd = true;
                    break;
                }
                j++;
            }
            if (foundEnd) {
                const blockLines = lines.slice(startIdx + 1, j);
                const convertedContent = [];
                for (const cline of blockLines) {
                    if (cline.trim() === '') {
                        convertedContent.push('');
                        continue;
                    }
                    const result = convertLine(cline, false);
                    if (result.converted && !result.blank) {
                        convertedContent.push(result.out);
                    } else {
                        convertedContent.push(cline);
                    }
                }
                const dialogueContent = convertedContent.join('\n');

                let phoneOut = `{{Script/phone|${type}`;
                if (name) {
                    phoneOut += `|${name}`;
                }
                if (dialogueContent) {
                    phoneOut += `| Dialogue =\n${dialogueContent}\n}}`;
                } else {
                    phoneOut += `| Dialogue =}}`;
                }

                for (let idx = startIdx; idx <= j; idx++) {
                    isPhoneBlockLine[idx] = true;
                }
                phoneOutputs.push({ startIdx, endIdx: j, outputLines: [phoneOut] });
                i = j + 1;
                continue;
            }
        }
        i++;
    }

    const processedLines = [];
    let idx = 0;
    while (idx < lines.length) {
        if (isPhoneBlockLine[idx]) {
            const phone = phoneOutputs.find(p => idx >= p.startIdx && idx <= p.endIdx);
            if (phone) {
                for (const outLine of phone.outputLines) {
                    processedLines.push({
                        line: outLine,
                        converted: true,
                        blank: false,
                        isScript: false,
                        isFailed: false
                    });
                }
                idx = phone.endIdx + 1;
                continue;
            }
        }

        if (isChoiceBlockLine[idx]) {
            const choice = choiceOutputs.find(c => idx >= c.startIdx && idx <= c.endIdx);
            if (choice) {
                for (const outLine of choice.outputLines) {
                    processedLines.push({
                        line: outLine,
                        converted: true,
                        blank: false,
                        isScript: false,
                        isFailed: false
                    });
                }
                idx = choice.endIdx + 1;
                continue;
            }
        }

        if (NARRATION_LARGE.test(lines[idx]) && !isScriptBlockLine[idx] && !isFailedScriptLine[idx] && !isChoiceBlockLine[idx] && !isPhoneBlockLine[idx]) {
            const texts = [];
            while (idx < lines.length && NARRATION_LARGE.test(lines[idx]) && !isScriptBlockLine[idx] && !isFailedScriptLine[idx] && !isChoiceBlockLine[idx] && !isPhoneBlockLine[idx]) {
                const match = lines[idx].match(NARRATION_LARGE);
                if (match) {
                    texts.push(lines[idx].replace(NARRATION_LARGE, '').trim());
                }
                idx++;
            }
            if (texts.length > 0) {
                processedLines.push({
                    line: `{{Script/narration large|${texts.join(';;')}}}`,
                    converted: true,
                    blank: false,
                    isScript: false,
                    isFailed: false
                });
            }
            continue;
        }

        if (isScriptBlockLine[idx]) {
            processedLines.push({
                line: lines[idx],
                converted: true,
                blank: false,
                isScript: true,
                isFailed: false
            });
        } else if (isFailedScriptLine[idx]) {
            processedLines.push({
                line: lines[idx],
                converted: false,
                blank: false,
                isScript: false,
                isFailed: true
            });
        } else {
            const result = convertLine(lines[idx], false);
            processedLines.push({
                line: result.out,
                converted: result.converted,
                blank: result.blank,
                isScript: false,
                isFailed: false
            });
        }
        idx++;
    }

    function updateBackdrop() {
        const backdrop = document.getElementById('input-backdrop');
        backdrop.innerHTML = lines.map((line, idx) => {
            const escaped = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            if (isScriptBlockLine[idx] || isChoiceBlockLine[idx] || isPhoneBlockLine[idx]) {
                return escaped + '\n';
            } else if (isFailedScriptLine[idx]) {
                return `<span class="bad">${escaped}</span>\n`;
            } else {
                if (NARRATION_LARGE.test(line)) {
                    return escaped + '\n';
                }
                const result = convertLine(line, false);
                if (!result.converted && !result.blank) {
                    return `<span class="bad">${escaped}</span>\n`;
                } else {
                    return escaped + '\n';
                }
            }
        }).join('');
    }
    updateBackdrop();

    if (!raw) {
        outDiv.innerHTML = '<span class="placeholder">Formatted output will appear here…</span>';
        document.getElementById('status').className = 'status';
        return;
    }

    let convertedCount = 0, skipped = 0;
    const skippedLines = [], outLines = [];

    for (const p of processedLines) {
        if (p.isScript || p.isFailed) {
            if (p.isScript) convertedCount++;
            if (p.isFailed) {
                skipped++;
                skippedLines.push(p.line);
            }
            continue;
        }
        if (p.blank) continue;
        outLines.push(p.line);
        if (p.converted) convertedCount++;
        else { skipped++; skippedLines.push(p.line); }
    }

    if (hasScriptBlock) {
        let startTag = '{{Script/start}}';
        if (scriptParams && Object.keys(scriptParams).length > 0) {
            const paramParts = [];
            for (const [key, value] of Object.entries(scriptParams)) {
                paramParts.push(`${key}=${value}`);
            }
            startTag = `{{Script/start|${paramParts.join('|')}}}`;
        }
        outLines.unshift(startTag);
        outLines.push('{{Script/end}}');
    }

    outDiv.innerHTML = outLines.map((line) => {
        const escaped = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        return `<span class="line">${escaped || '&#8203;'}</span>`;
    }).join('');

    const status = document.getElementById('status');
    if (skipped === 0) {
        status.className = 'status show ok';
        status.innerHTML = `${convertedCount} line${convertedCount !== 1 ? 's' : ''} converted successfully.`;
    } else {
        status.className = 'status show warning';
        const preview = skippedLines.slice(0,5).map(l => `  ${escapeHtml(l.slice(0,60))}${l.length>60?'…':''}`).join('<br>');
        status.innerHTML = `${convertedCount} line${convertedCount !== 1 ? 's' : ''} converted successfully &mdash; ${skipped} line${skipped!==1?'s':''} had no recognisable format and were left unchanged:<div class="skipped-list">${preview}</div>`;
    }
}

function copyOutput() {
    const lines = [...document.getElementById('output').querySelectorAll('.line')].map(el => el.textContent === '​' ? '' : el.textContent);
    if (!lines.length) return;
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
        const btn = document.getElementById('copy-btn');
        btn.textContent = 'Copied!';
        btn.classList.add('success');
        setTimeout(() => { btn.textContent = 'Copy all'; btn.classList.remove('success'); }, 1800);
    });
}

function clearInput() {
    document.getElementById('input').value = '';
    document.getElementById('output').innerHTML = '<span class="placeholder">Formatted output will appear here…</span>';
    document.getElementById('status').className = 'status';
    convert();
}

const inputEl = document.getElementById('input');
inputEl.addEventListener('input', convert);
inputEl.addEventListener('scroll', () => {
    const backdrop = document.getElementById('input-backdrop');
    if (backdrop) backdrop.scrollTop = inputEl.scrollTop;
});
convert();
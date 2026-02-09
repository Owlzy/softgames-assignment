import {Container, Sprite, Text, CanvasTextMetrics} from "pixi.js";

export class RichText extends Container {
    constructor(style, emoji, maxWidth = 500) {
        super();
        this.style = style;
        this.emoji = emoji;
        this.maxWidth = maxWidth;
    }

    setText(s) {
        this.removeChildren();

        const tokens = this.tokenize(s);
        const fontSize = this.style.fontSize ?? 24;
        const lineHeight = this.style.lineHeight ?? Math.ceil(fontSize * 1.2);

        let x = 0;
        let y = 0;

        const newLine = () => {
            x = 0;
            y += lineHeight;
        };

        for (const t of tokens) {
            if (t.type === "text") {
                // wrap by words
                const parts = t.value.split(/(\s+)/); // keep spaces
                for (const part of parts) {
                    if (!part) continue;

                    // handle explicit newlines
                    if (part.includes("\n")) {
                        const segs = part.split("\n");
                        for (let si = 0; si < segs.length; si++) {
                            if (segs[si]) this.addTextChunk(segs[si], fontSize, lineHeight, () => x, (v) => x = v, () => y, newLine);
                            if (si < segs.length - 1) newLine();
                        }
                        continue;
                    }

                    this.addTextChunk(part, fontSize, lineHeight, () => x, (v) => x = v, () => y, newLine);
                }
            } else {
                const tex = this.emoji[t.key];
                if (!tex) {
                    // fallback as text if emoji missing
                    this.addTextChunk(`{${t.key}}`, fontSize, lineHeight, () => x, (v) => x = v, () => y, newLine);
                    continue;
                }

                const spr = new Sprite(tex);
                spr.anchor.set(0, 1); // bottom-left baseline
                const targetH = fontSize;
                const s = targetH / tex.height;
                spr.scale.set(s);

                const w = tex.width * s;
                if (x + w > this.maxWidth) newLine();

                spr.position.set(x, y + lineHeight);
                this.addChild(spr);
                x += w;
            }
        }
    }

    addTextChunk(
        text,
        fontSize,
        lineHeight,
        getX,
        setX,
        getY,
        newLine
    ) {
        const m = CanvasTextMetrics.measureText(text, this.style);
        const w = m.width;
        let x = getX();

        if (x + w > this.maxWidth && text.trim().length > 0) newLine();

        x = getX();
        const txt = new Text({text, style: this.style});
        txt.position.set(x, getY() + (lineHeight - fontSize));
        this.addChild(txt);
        setX(x + w);
    }

    tokenize(s) {
        const out = [];
        const re = /\{([a-zA-Z0-9_:-]+)}/g;
        let last = 0;
        let m;

        while ((m = re.exec(s))) {
            const before = s.slice(last, m.index);
            if (before) out.push({type: "text", value: before});
            const key = m[1].trim().toLowerCase();
            if (this.emoji[key]) {
                out.push({ type: "emoji", key }); // dont add non existent emojis
            }
            last = m.index + m[0].length;
        }

        const tail = s.slice(last);
        if (tail) out.push({type: "text", value: tail});

        return out;
    }
}

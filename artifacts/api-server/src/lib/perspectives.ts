import { ai, Type } from "@workspace/integrations-gemini-ai";
import { batchProcess } from "@workspace/integrations-gemini-ai/batch";
import type { PerspectiveMode } from "@workspace/api-zod";
import { z } from "zod";

export const DEFAULT_MODE: PerspectiveMode = "wissenschaft";

export interface Perspective {
  id: string;
  category: string;
  title: string;
  color: string;
  summary: string;
  intro: string;
  analysis: string;
  comprehensive: string;
}

interface PerspectiveSlot {
  id: string;
  category: string;
  color: string;
  focus: string;
}

// The octagon UI has 8 fixed positions, each tied to a fixed color (the color
// keys must match CARD_BG / STRIP_CLR maps in the frontend). The CATEGORY names
// and focus areas are self-identified per topic by the model at runtime; these
// colors/ids are assigned to the identified categories in order.
const SLOT_COLORS = [
  "#10b981",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#64748b",
] as const;

const PERSPECTIVE_COUNT = SLOT_COLORS.length;

// Fallback categories used only if runtime category identification fails, so the
// app still returns a full octagon of perspectives. There is one generic set per
// mode so the user's chosen lens still shapes the categories even on the degraded
// path (not just the happy path).
const WISSENSCHAFT_FALLBACK: { category: string; focus: string }[] = [
  {
    category: "PSYCHOLOGISCHE PERSPEKTIVE",
    focus:
      "individuelle Emotionen, Ängste, Hoffnungen, Identität, mentale Auswirkungen und Resilienz",
  },
  {
    category: "ÖKOLOGISCHE PERSPEKTIVE",
    focus:
      "Umwelt, Ressourcenverbrauch, Nachhaltigkeit, Klima und planetare Grenzen",
  },
  {
    category: "KAUSALE PERSPEKTIVE",
    focus:
      "Ursachen und Wirkungen, strukturelle Auslöser, Kettenreaktionen und Feedback-Schleifen",
  },
  {
    category: "ETHISCHE PERSPEKTIVE",
    focus:
      "Moral, Gerechtigkeit, Würde, Verteilungsfragen und Verantwortung gegenüber künftigen Generationen",
  },
  {
    category: "KULTURELLE PERSPEKTIVE",
    focus:
      "Werte, Traditionen, Kunst, Identität, Vielfalt und kulturelle Narrative",
  },
  {
    category: "SOZIALE PERSPEKTIVE",
    focus:
      "gesellschaftlicher Zusammenhalt, Bildung, Institutionen, Teilhabe und soziale Mobilität",
  },
  {
    category: "ÖKONOMISCHE PERSPEKTIVE",
    focus:
      "Wertschöpfung, Märkte, Arbeit, Beschäftigung, Wohlstand und dessen Verteilung",
  },
  {
    category: "POLITISCHE PERSPEKTIVE",
    focus:
      "Macht, Steuerung, Gesetze, Staaten, Parteien, Legitimation und internationale Ordnung",
  },
];

const STAKEHOLDER_FALLBACK: { category: string; focus: string }[] = [
  {
    category: "BETROFFENE BÜRGER",
    focus:
      "Menschen, die das Thema unmittelbar im Alltag erleben, mit ihren Sorgen, Interessen und Erfahrungen",
  },
  {
    category: "UNTERNEHMER & BESCHÄFTIGTE",
    focus:
      "Menschen in Betrieben und Branchen mit ihren wirtschaftlichen Chancen, Risiken und Interessen",
  },
  {
    category: "POLITISCHE ENTSCHEIDUNGSTRÄGER",
    focus:
      "Regierungen, Parlamente und Parteien, die Regeln setzen und Verantwortung tragen",
  },
  {
    category: "VERWALTUNG & BEHÖRDEN",
    focus:
      "ausführende Institutionen, die Vorgaben umsetzen, kontrollieren und administrieren",
  },
  {
    category: "ZIVILGESELLSCHAFT & NGOs",
    focus:
      "Verbände, Initiativen und Interessengruppen, die Anliegen organisieren und vertreten",
  },
  {
    category: "FORSCHER & EXPERTEN",
    focus:
      "Fachleute und Wissenschaftler, die Wissen, Daten und Bewertungen beisteuern",
  },
  {
    category: "MEDIEN & ÖFFENTLICHKEIT",
    focus:
      "Journalismus und öffentliche Debatte, die Aufmerksamkeit, Deutung und Meinung prägen",
  },
  {
    category: "KÜNFTIGE GENERATIONEN",
    focus:
      "noch nicht beteiligte Betroffene, deren Lebensbedingungen langfristig mitbestimmt werden",
  },
];

const POLITISCHE_DEBATTE_FALLBACK: { category: string; focus: string }[] = [
  {
    category: "BEFÜRWORTENDE POSITION",
    focus:
      "Argumente und Akteure, die für Wandel, Ausbau oder Eingriff in diesem Thema eintreten",
  },
  {
    category: "KRITISCHE POSITION",
    focus:
      "Argumente und Akteure, die das Vorhaben ablehnen, bremsen oder vor Risiken warnen",
  },
  {
    category: "WIRTSCHAFTSLIBERALE POSITION",
    focus:
      "Markt, Wettbewerb, Eigenverantwortung und möglichst geringe staatliche Eingriffe",
  },
  {
    category: "SOZIALE GERECHTIGKEIT",
    focus:
      "faire Lastenverteilung, Schutz der Schwächeren und Folgen für untere Einkommen",
  },
  {
    category: "ÖKOLOGISCHE POSITION",
    focus:
      "Umwelt-, Klima- und Nachhaltigkeitsziele als Maßstab der politischen Bewertung",
  },
  {
    category: "SICHERHEIT & ORDNUNG",
    focus:
      "Stabilität, Schutz, Kontrolle und die Wahrung von Regeln und öffentlicher Ordnung",
  },
  {
    category: "INDIVIDUELLE FREIHEIT",
    focus:
      "Selbstbestimmung, Grundrechte und Abwehr staatlicher Bevormundung des Einzelnen",
  },
  {
    category: "PRAGMATISCHE MITTE",
    focus:
      "Kompromiss, Abwägung und schrittweise, umsetzbare Lösungen zwischen den Lagern",
  },
];

const FALLBACK_BY_MODE: Record<
  PerspectiveMode,
  { category: string; focus: string }[]
> = {
  wissenschaft: WISSENSCHAFT_FALLBACK,
  stakeholder: STAKEHOLDER_FALLBACK,
  politische_debatte: POLITISCHE_DEBATTE_FALLBACK,
};

const MODEL = "gemini-2.5-flash";

const PERSPECTIVE_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    intro: { type: Type.STRING },
    analysis: { type: Type.STRING },
    comprehensive: { type: Type.STRING },
  },
  required: ["title", "summary", "intro", "analysis", "comprehensive"],
  propertyOrdering: ["title", "summary", "intro", "analysis", "comprehensive"],
};

const GENERATION_CONFIG = {
  responseMimeType: "application/json",
  responseSchema: PERSPECTIVE_RESPONSE_SCHEMA,
  maxOutputTokens: 8192,
  temperature: 0.85,
  thinkingConfig: { thinkingBudget: 0 },
} as const;

const CATEGORIES_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    categories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          focus: { type: Type.STRING },
        },
        required: ["category", "focus"],
        propertyOrdering: ["category", "focus"],
      },
    },
  },
  required: ["categories"],
};

const onePerspectiveSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  intro: z.string().min(1),
  analysis: z.string().min(1),
  comprehensive: z.string().min(1),
});

const objectSchema = z.object({
  object: z.string().min(1),
});

const categoriesSchema = z.object({
  categories: z
    .array(
      z.object({
        category: z.string().min(1),
        focus: z.string().min(1),
      }),
    )
    .min(1),
});

// Models sometimes emit raw control characters (literal newlines, tabs) inside
// JSON string values, which is invalid JSON. Escape them so JSON.parse succeeds.
function escapeControlCharsInStrings(input: string): string {
  let out = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const code = input.charCodeAt(i);

    if (escaped) {
      out += ch;
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      out += ch;
      escaped = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      out += ch;
      continue;
    }

    if (inString && code < 0x20) {
      if (ch === "\n") out += "\\n";
      else if (ch === "\r") out += "\\r";
      else if (ch === "\t") out += "\\t";
      else out += "\\u" + code.toString(16).padStart(4, "0");
      continue;
    }

    out += ch;
  }

  return out;
}

function tryParse(text: string): unknown | undefined {
  try {
    return JSON.parse(text);
  } catch {
    try {
      return JSON.parse(escapeControlCharsInStrings(text));
    } catch {
      return undefined;
    }
  }
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const direct = tryParse(trimmed);
  if (direct !== undefined) return direct;

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    const sliced = tryParse(trimmed.slice(start, end + 1));
    if (sliced !== undefined) return sliced;
  }

  throw new Error("KI-Antwort konnte nicht als JSON gelesen werden.");
}

function buildPerspectivePrompt(topic: string, slot: PerspectiveSlot): string {
  return `Du bist Knowbuddy, eine KI für Perspektivenvielfalt. Betrachte das folgende Thema ausschließlich aus der ${slot.category} (Fokus: ${slot.focus}).

Thema: "${topic}"

Antworte ausschließlich auf Deutsch, anspruchsvoll, sachlich und differenziert. Gib ein JSON-Objekt mit GENAU diesen Feldern zurück:
- "title": kurzer, prägnanter Titel dieser Perspektive (2-5 Wörter).
- "summary": 1-2 Sätze, die den Kern dieser Perspektive auf das Thema zusammenfassen.
- "intro": ein einleitender Absatz (2-3 Sätze).
- "analysis": eine strukturierte Analyse mit GENAU drei Unterabschnitten. Jeder Unterabschnitt beginnt mit einer fettgedruckten Überschrift im Format **Überschrift**, gefolgt von einem Zeilenumbruch und einem erklärenden Absatz. Trenne die Unterabschnitte durch eine Leerzeile (\\n\\n).
- "comprehensive": ein ausführlicher, tiefgehender Text aus 4-5 Absätzen, getrennt durch \\n\\n.

Gib NUR das JSON-Objekt zurück, ohne weitere Erklärungen.`;
}

// Each mode shapes WHICH eight categories the model identifies for a topic: the
// scientific/liberal-arts lens, the involved-stakeholders lens, or the
// political-debate-positions lens. `lens` describes what to identify, `style`
// describes how to name each "category".
const MODE_INSTRUCTIONS: Record<
  PerspectiveMode,
  { lens: string; style: string }
> = {
  wissenschaft: {
    lens: `Bestimme die ${PERSPECTIVE_COUNT} RELEVANTESTEN und aussagekräftigsten wissenschaftlichen Betrachtungsweisen aus einem möglichst VIELFÄLTIGEN Spektrum wissenschaftlicher Disziplinen UND der Geistes-, Kultur- und Sozialwissenschaften (z. B. Natur- und Ingenieurwissenschaften, Medizin, Ökonomie, Recht, Soziologie, Psychologie, Philosophie, Geschichte, Kunst- und Kulturwissenschaft), aus denen sich das Thema tiefgehend analysieren lässt.`,
    style: `kurzer Name der Disziplin bzw. Perspektive in GROSSBUCHSTABEN, im Stil "… PERSPEKTIVE" oder als Disziplinname (2-4 Wörter), z. B. "ÖKONOMISCHE PERSPEKTIVE" oder "NEUROWISSENSCHAFTLICHE PERSPEKTIVE".`,
  },
  stakeholder: {
    lens: `Bestimme die ${PERSPECTIVE_COUNT} wichtigsten GRUPPEN VON MENSCHEN (Akteure, Interessengruppen und Betroffene), die mit dem Thema zu tun haben oder davon betroffen sind. WICHTIG: Jede Perspektive MUSS eine konkrete Gruppe von Menschen sein – also Personen, Berufsgruppen, Betroffene oder organisierte Interessengruppen mit eigener Sichtweise. Wähle NIEMALS abstrakte Konzepte, Themenfelder, Disziplinen, Technologien, Prozesse, Orte oder Institutionen als bloße Sache. Nenne immer die Menschen dahinter (z. B. nicht "FORSCHUNG", sondern "FORSCHER & WISSENSCHAFTLER"; nicht "WIRTSCHAFT", sondern "UNTERNEHMER & BESCHÄFTIGTE").`,
    style: `kurzer Name einer GRUPPE VON MENSCHEN in GROSSBUCHSTABEN (2-4 Wörter), immer Personen/Akteure bezeichnend, z. B. "BETROFFENE BÜRGER", "UNTERNEHMER & BESCHÄFTIGTE", "POLITISCHE ENTSCHEIDUNGSTRÄGER", "BETROFFENE FAMILIEN".`,
  },
  politische_debatte: {
    lens: `Bestimme die ${PERSPECTIVE_COUNT} zentralen POSITIONEN, Lager und Konfliktlinien, die die politische Debatte rund um das Thema ausmachen. Jede Perspektive steht für ein konstitutives Element der Debatte – eine vertretene Position, ein Argumentationslager oder eine zentrale Streitfrage.`,
    style: `kurzer, prägnanter Name der Position bzw. Konfliktlinie in GROSSBUCHSTABEN (2-5 Wörter), z. B. "BEFÜRWORTER DES AUSBAUS", "WIRTSCHAFTSLIBERALE POSITION", "ÖKOLOGISCH-LINKE POSITION".`,
  },
};

function buildCategoriesPrompt(topic: string, mode: PerspectiveMode): string {
  const { lens, style } = MODE_INSTRUCTIONS[mode];
  return `Du bist Knowbuddy, eine KI für Perspektivenvielfalt. ${lens}

Thema: "${topic}"

Wähle die Perspektiven SPEZIFISCH passend zum Thema aus. Sie sollen sich deutlich voneinander unterscheiden, möglichst wenig überschneiden und zusammen ein breites, ausgewogenes Spektrum abdecken. Vermeide generische Perspektiven, wenn es treffendere, themennahe gibt.

Antworte ausschließlich auf Deutsch. Gib ein JSON-Objekt mit dem Schlüssel "categories" zurück: ein Array mit GENAU ${PERSPECTIVE_COUNT} Objekten. Jedes Objekt hat:
- "category": ${style}
- "focus": ein kurzer Satz, der den inhaltlichen Fokus dieser Perspektive auf das Thema beschreibt.

Gib NUR das JSON-Objekt zurück, ohne weitere Erklärungen.`;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry any transient failure (parse, schema, network) for a single slot, so one
// flaky call does not reject the whole Promise.all batch.
async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseDelayMs = 600,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) {
        await sleep(baseDelayMs * (attempt + 1));
      }
    }
  }
  throw lastError;
}

async function generateOnePerspective(
  topic: string,
  slot: PerspectiveSlot,
): Promise<Perspective> {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: buildPerspectivePrompt(topic, slot) }],
        },
      ],
      config: GENERATION_CONFIG,
    });

    const text = response.text;
    if (!text) {
      throw new Error("Die KI hat keine Antwort geliefert.");
    }

    const parsed = onePerspectiveSchema.parse(extractJson(text));

    return {
      id: slot.id,
      category: slot.category,
      color: slot.color,
      title: parsed.title,
      summary: parsed.summary,
      intro: parsed.intro,
      analysis: parsed.analysis,
      comprehensive: parsed.comprehensive,
    };
  });
}

// Ask the model to self-identify the most relevant categories for this topic.
// Returns at least one category; never throws — falls back to a static set so
// the octagon always renders.
async function identifyCategories(
  topic: string,
  mode: PerspectiveMode,
): Promise<{ category: string; focus: string }[]> {
  try {
    // Fewer attempts than perspective generation: if category identification is
    // degraded, fall back to the static set quickly rather than delaying the
    // whole request.
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [
          {
            role: "user",
            parts: [{ text: buildCategoriesPrompt(topic, mode) }],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: CATEGORIES_RESPONSE_SCHEMA,
          maxOutputTokens: 2048,
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 0 },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Die KI hat keine Antwort geliefert.");
      }

      return categoriesSchema.parse(extractJson(text)).categories;
    }, 2);
  } catch {
    return FALLBACK_BY_MODE[mode];
  }
}

// Normalize a category name for duplicate detection: lowercase, strip diacritics
// and collapse whitespace so "ÖKOLOGISCHE  PERSPEKTIVE" == "okologische perspektive".
function normalizeCategory(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Map identified categories onto the fixed octagon slots (ids + colors). Always
// returns exactly PERSPECTIVE_COUNT DISTINCT slots: trims/drops empties, removes
// duplicate categories, and backfills any shortfall with unused fallback
// categories so the octagon shows 8 clearly differentiated perspectives.
function assembleSlots(
  categories: { category: string; focus: string }[],
  mode: PerspectiveMode,
): PerspectiveSlot[] {
  const unique: { category: string; focus: string }[] = [];
  const seen = new Set<string>();

  const add = (cat: { category: string; focus: string }) => {
    const category = cat.category.trim();
    const focus = cat.focus.trim();
    if (!category || !focus) return;
    const key = normalizeCategory(category);
    if (seen.has(key)) return;
    seen.add(key);
    unique.push({ category, focus });
  };

  categories.forEach(add);

  // Backfill from the mode-appropriate fallback set (skipping any already
  // present) until we have enough distinct categories to fill every slot.
  for (const cat of FALLBACK_BY_MODE[mode]) {
    if (unique.length >= PERSPECTIVE_COUNT) break;
    add(cat);
  }

  return unique.slice(0, PERSPECTIVE_COUNT).map((cat, i) => ({
    id: `p${i + 1}`,
    category: cat.category,
    color: SLOT_COLORS[i],
    focus: cat.focus,
  }));
}

async function generatePerspectives(
  topic: string,
  mode: PerspectiveMode,
): Promise<Perspective[]> {
  const categories = await identifyCategories(topic, mode);
  const slots = assembleSlots(categories, mode);
  return batchProcess(
    slots,
    (slot) => generateOnePerspective(topic, slot),
    { concurrency: 8, retries: 2 },
  );
}

export async function generatePerspectivesFromTopic(
  topic: string,
  mode: PerspectiveMode = DEFAULT_MODE,
): Promise<{ topic: string; perspectives: Perspective[] }> {
  const perspectives = await generatePerspectives(topic, mode);
  return { topic, perspectives };
}

async function identifyObjectFromImage(
  imageBase64: string,
  mimeType: string,
): Promise<string> {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: imageBase64, mimeType } },
            {
              text: `Identifiziere das wichtigste Objekt, Motiv oder Konzept auf diesem Foto. Benenne es mit einem kurzen, treffenden deutschen Begriff (1-3 Wörter). Gib ein JSON-Objekt mit dem Schlüssel "object" zurück, z. B. {"object": "Fahrrad"}.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { object: { type: Type.STRING } },
          required: ["object"],
        },
        maxOutputTokens: 512,
        temperature: 0.4,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Die KI hat keine Antwort geliefert.");
    }

    return objectSchema.parse(extractJson(text)).object;
  });
}

export async function generatePerspectivesFromImage(
  imageBase64: string,
  mimeType: string,
  mode: PerspectiveMode = DEFAULT_MODE,
): Promise<{ topic: string; perspectives: Perspective[] }> {
  const topic = await identifyObjectFromImage(imageBase64, mimeType);
  const perspectives = await generatePerspectives(topic, mode);
  return { topic, perspectives };
}

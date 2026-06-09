import { Router, type IRouter } from "express";
import {
  GeneratePerspectivesFromTextBody,
  GeneratePerspectivesFromImageBody,
} from "@workspace/api-zod";
import {
  generatePerspectivesFromTopic,
  generatePerspectivesFromImage,
} from "../lib/perspectives";

const router: IRouter = Router();

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

router.post("/perspectives/text", async (req, res) => {
  const parsed = GeneratePerspectivesFromTextBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bitte gib einen gültigen Begriff ein." });
    return;
  }

  try {
    const result = await generatePerspectivesFromTopic(
      parsed.data.topic,
      parsed.data.mode,
    );
    res.json(result);
  } catch (err) {
    console.error("Perspektiven (Text) fehlgeschlagen:", err);
    res.status(502).json({
      error:
        "Die Perspektiven konnten nicht erstellt werden. Bitte versuche es erneut.",
    });
  }
});

router.post("/perspectives/image", async (req, res) => {
  const parsed = GeneratePerspectivesFromImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Das Bild konnte nicht verarbeitet werden." });
    return;
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(parsed.data.mimeType)) {
    res.status(400).json({
      error: "Dieses Bildformat wird nicht unterstützt.",
    });
    return;
  }

  try {
    const result = await generatePerspectivesFromImage(
      parsed.data.image,
      parsed.data.mimeType,
      parsed.data.mode,
    );
    res.json(result);
  } catch (err) {
    console.error("Perspektiven (Bild) fehlgeschlagen:", err);
    res.status(502).json({
      error:
        "Das Foto konnte nicht analysiert werden. Bitte versuche es erneut.",
    });
  }
});

export default router;

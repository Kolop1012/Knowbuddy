import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true, limit: "12mb" }));

app.use("/api", router);

// Centralised error handler: ensures the client always receives JSON and that
// errors from the body parser (e.g. oversized payloads, malformed JSON) or any
// route never bubble up uncaught.
app.use(
  (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    const status =
      typeof err === "object" && err !== null && "status" in err
        ? Number((err as { status?: number }).status)
        : 500;

    if (status === 413) {
      console.error("Anfrage zu groß:", err);
      res
        .status(413)
        .json({ error: "Das Bild ist zu groß. Bitte verwende ein kleineres Foto." });
      return;
    }

    if (status === 400) {
      console.error("Ungültige Anfrage:", err);
      res
        .status(400)
        .json({ error: "Die Anfrage konnte nicht verarbeitet werden." });
      return;
    }

    console.error("Unerwarteter Serverfehler:", err);
    res
      .status(500)
      .json({ error: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut." });
  },
);

export default app;

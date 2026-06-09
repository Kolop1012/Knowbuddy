export interface PerspectiveData {
  id: string;
  category: string;
  title: string;
  color: string;
  summary: string;
  intro: string;
  analysis: string;
  comprehensive: string;
}

export const generateMockData = (topic: string): PerspectiveData[] => {
  const t = topic || "Migration";
  
  return [
    {
      id: "p1",
      category: "PSYCHOLOGISCHE PERSPEKTIVE",
      title: "Erfahrungen und Gefühle",
      color: "#10b981",
      summary: `Betrachtet ${t} aus der Sicht individueller Emotionen. Ängste, Hoffnungen und Identitätsverlust spielen hier eine zentrale Rolle.`,
      intro: `Die psychologische Dimension von ${t} befasst sich tiefgreifend mit den emotionalen und mentalen Auswirkungen auf Individuen. Es geht nicht um Zahlen, sondern um das Erleben.`,
      analysis: `**Die Rolle der Angst**\nBei der Betrachtung von ${t} wird oft deutlich, dass Unsicherheit eine treibende Kraft ist. Menschen fürchten den Verlust von Bekanntem oder Sorgen sich um ihre Zukunft.\n\n**Identität und Zugehörigkeit**\nEin weiterer zentraler Aspekt ist die Frage, wer wir sind. ${t} fordert oft unser Selbstverständnis heraus und verlangt emotionale Anpassungsleistung.\n\n**Resilienz**\nGleichzeitig zeigt sich in Krisen enorme psychische Widerstandsfähigkeit. Individuen entwickeln neue Bewältigungsstrategien im Angesicht von Veränderungen.`,
      comprehensive: `Die psychologische Betrachtung von ${t} ist hochkomplex. Sie beginnt beim Individuum und seinen ureigensten Erfahrungen.\n\nWenn wir über Emotionen sprechen, müssen wir die neurologischen und psychologischen Reaktionen auf tiefgreifende gesellschaftliche Umbrüche verstehen. Der menschliche Verstand sucht nach Kohärenz.\n\nIn vielen Studien zeigt sich, dass der gefühlte Kontrollverlust weitaus belastender ist als die eigentliche materielle Veränderung. Bei ${t} ist dies besonders ausgeprägt.\n\nTherapeutische Ansätze betonen die Wichtigkeit von Narrativen. Wie wir uns die Geschichte von ${t} erzählen, bestimmt maßgeblich unsere emotionale Reaktion darauf.\n\nSchlussendlich erfordert ein konstruktiver Umgang mit ${t} ein hohes Maß an emotionaler Intelligenz, sowohl vom Einzelnen als auch vom kollektiven Bewusstsein einer Gesellschaft.`
    },
    {
      id: "p2",
      category: "ÖKOLOGISCHE PERSPEKTIVE",
      title: "Umwelt und Ressourcen",
      color: "#14b8a6",
      summary: `Untersucht die Auswirkungen von ${t} auf unsere natürlichen Lebensgrundlagen, Ressourcenverbrauch und Nachhaltigkeit.`,
      intro: `Jedes gesellschaftliche Phänomen, auch ${t}, hat einen ökologischen Fußabdruck. Diese Perspektive fragt nach der Belastbarkeit unseres Planeten.`,
      analysis: `**Ressourcenverbrauch**\n${t} beeinflusst direkt und indirekt, wie wir Energie, Wasser und Land nutzen. Veränderungen in diesem Bereich haben oft unbedachte ökologische Folgen.\n\n**Klimatische Wechselwirkungen**\nEs besteht eine starke Rückkopplungsschleife. Die Umwelt reagiert auf ${t}, und diese Reaktionen zwingen uns wiederum zu neuem Handeln.\n\n**Nachhaltigkeitsziele**\nDie zentrale Frage ist: Wie lässt sich ${t} mit dem zwingenden Erhalt unserer planetaren Grenzen in Einklang bringen?`,
      comprehensive: `Ökologisch betrachtet ist die Erde ein geschlossenes System. Die Analyse von ${t} erfordert daher ein systemisches Verständnis von Stoffkreisläufen.\n\nHistorisch gesehen haben wir die externen Umweltkosten oft ignoriert. Bei ${t} rückt diese Ignoranz nun zunehmend in den Fokus wissenschaftlicher Debatten.\n\nDie Belastung von Biodiversität und Ökosystemen ist nicht nur ein ethisches Problem, sondern bedroht unsere eigene Existenzgrundlage massiv.\n\nLösungsansätze erfordern radikales Umdenken. Kreislaufwirtschaft, Suffizienz und technologische Innovationen müssen Hand in Hand gehen.\n\nLetztlich zwingt uns ${t} dazu, das Verhältnis zwischen Mensch und Natur fundamental neu zu verhandeln und von einer ausbeuterischen zu einer regenerativen Praxis zu finden.`
    },
    {
      id: "p3",
      category: "KAUSALE PERSPEKTIVE",
      title: "Ursachen und Wirkungen",
      color: "#3b82f6",
      summary: `Analysiert die tieferliegenden Auslöser und die komplexen, oft zeitverzögerten Folgen von ${t} im globalen Kontext.`,
      intro: `Nichts passiert im luftleeren Raum. Die kausale Perspektive zerlegt ${t} in komplexe Ursache-Wirkungs-Ketten und historische Pfadabhängigkeiten.`,
      analysis: `**Strukturelle Auslöser**\nWas brachte den Stein ins Rollen? Oft sind es historische Entwicklungen und asymmetrische Machtverhältnisse, die den Boden für ${t} bereiteten.\n\n**Kettenreaktionen**\nEine direkte Folge löst oft sekundäre und tertiäre Effekte aus, die schwer vorhersehbar sind. Komplexitätstheorie ist hier das Mittel der Wahl.\n\n**Feedback-Loops**\nWir beobachten häufig sich selbst verstärkende Systeme, bei denen die Folgen von ${t} wieder zu dessen neuen Ursachen werden.`,
      comprehensive: `Die Suche nach Linearität ist in komplexen Systemen oft zum Scheitern verurteilt. Wenn wir ${t} kausal analysieren wollen, müssen wir vernetzt denken.\n\nHistoriker und Systemanalytiker betonen, dass gegenwärtige Phänomene meist das Resultat von Entscheidungen sind, die Jahrzehnte zurückliegen.\n\nZudem gibt es das Problem der "Unsichtbaren Gorillas" – Faktoren, die so massiv sind, dass wir sie in unserer alltäglichen Analyse übersehen.\n\nDie Prognosefähigkeit bezüglich ${t} ist stark limitiert. Szenarioplanung ersetzt zunehmend klassische Vorhersagemodelle.\n\nUm Interventionen effektiv zu gestalten, müssen wir Hebelpunkte im System finden, statt nur an den Symptomen herumzudoktern.`
    },
    {
      id: "p4",
      category: "ETHISCHE PERSPEKTIVE",
      title: "Gerechtigkeit und Würde",
      color: "#8b5cf6",
      summary: `Stellt moralische Fragen ins Zentrum. Wer trägt die Lasten von ${t}, und was gebietet die menschliche Würde?`,
      intro: `Jenseits von Machbarkeit und Nützlichkeit stellt sich bei ${t} immer die Frage nach dem "Richtigen". Ethik verlangt nach normativer Begründung.`,
      analysis: `**Verteilungsgerechtigkeit**\nWer profitiert, wer verliert? Bei ${t} sind Chancen und Risiken fast nie gleichmäßig in der Gesellschaft verteilt.\n\n**Menschenrechte als Kompass**\nDer unantastbare Wert des Individuums bildet die rote Linie, die bei keiner gesellschaftlichen Entwicklung überschritten werden darf.\n\n**Intergenerationelle Ethik**\nWelche Verantwortung tragen wir gegenüber jenen, die noch nicht geboren sind? ${t} wirft drängende Fragen der Zukunftsgerechtigkeit auf.`,
      comprehensive: `Die Philosophie bietet uns verschiedene Linsen – von Kant bis zum Utilitarismus –, um ${t} moralisch zu bewerten.\n\nEin zentrales Problem der Moderne ist die globale Verflechtung. Handlungen hier haben ethische Konsequenzen am anderen Ende der Welt.\n\nDer Diskurs um ${t} offenbart oft fundamentale Wertekonflikte in pluralistischen Gesellschaften, die sich nicht mathematisch lösen lassen.\n\nWir müssen aushalten, dass es oft keine "reine" Lösung gibt, sondern moralische Dilemmata, die schmerzhafte Kompromisse erfordern.\n\nLetztendlich misst sich der moralische Reifegrad einer Gesellschaft daran, wie sie in Zeiten von ${t} mit ihren schwächsten Mitgliedern umgeht.`
    },
    {
      id: "p5",
      category: "KULTURELLE PERSPEKTIVE",
      title: "Identität und Vielfalt",
      color: "#f97316",
      summary: `Betrachtet, wie ${t} unsere Werte, Traditionen, Kunst und das alltägliche Zusammenleben verändert oder bedroht.`,
      intro: `Kultur ist das unsichtbare Gewebe der Gesellschaft. ${t} wirkt stark auf unsere Narrative, Sprache und Rituale ein.`,
      analysis: `**Werte im Wandel**\nAlte Überzeugungen treffen auf neue Realitäten. ${t} zwingt oft zur Re-Evaluierung dessen, was als "normal" gilt.\n\n**Kulturelle Vermischung**\nEinflüsse prallen aufeinander. Dies kann zu fruchtbarer Synthese (Synkretismus) oder zu harten Abwehrreaktionen führen.\n\n**Die Macht der Symbole**\nSprache und Bilder sind Schlachtfelder. Die Art, wie wir über ${t} sprechen, verrät unsere tieferen kulturellen Paradigmen.`,
      comprehensive: `Kultur ist kein statisches Museumsinventar, sondern ein dynamischer Aushandlungsprozess. ${t} ist ein massiver Katalysator für diesen Prozess.\n\nDie Angst vor Entfremdung und Heimatverlust ist real und darf nicht bloß als Rückständigkeit abgetan werden.\n\nGleichzeitig zeigt die Geschichte, dass Kulturen, die sich gegen Einflüsse wie ${t} komplett abschotten, langfristig erstarren.\n\nKunst, Literatur und Popkultur sind Seismographen. Sie spiegeln wider, wie das kollektive Unterbewusstsein ${t} verarbeitet.\n\nEine resiliente Kultur beweist sich nicht durch Unveränderlichkeit, sondern durch ihre Fähigkeit, Neues produktiv und sinnstiftend zu integrieren.`
    },
    {
      id: "p6",
      category: "SOZIALE PERSPEKTIVE",
      title: "Integration und Teilhabe",
      color: "#f59e0b",
      summary: `Fokussiert sich auf den gesellschaftlichen Zusammenhalt. Wie wirkt sich ${t} auf Bildung, Institutionen und Gemeinschaften aus?`,
      intro: `Der soziale Kitt hält uns zusammen. Diese Dimension untersucht, ob ${t} zur Spaltung oder zur Solidarisierung von Gruppen führt.`,
      analysis: `**Bildungschancen**\nDer Zugang zu Wissen und Qualifikation ist entscheidend. ${t} kann bestehende Bildungsklüfte extrem verschärfen.\n\n**Soziale Mobilität**\nIst der Aufstieg noch möglich? Wir beobachten, wie ${t} die Durchlässigkeit der Gesellschaftsschichten beeinflusst.\n\n**Institutionelles Vertrauen**\nWenn Bürger glauben, dass Institutionen mit ${t} überfordert sind, erodiert das Fundament der Demokratie.`,
      comprehensive: `Gesellschaftliche Kohäsion ist ein zerbrechliches Gut. Im Kontext von ${t} sehen wir oft eine Fragmentierung in sogenannte "Blasen" oder "Echokammern".\n\nDas Konzept der Solidarität wird einem Stresstest unterzogen. Wer gehört noch zum "Wir", das Unterstützung verdient?\n\nLokale Gemeinschaften – Vereine, Nachbarschaften – sind die erste Verteidigungslinie gegen soziale Desintegration, geraten aber durch ${t} unter Druck.\n\nStaatliche Daseinsvorsorge muss neu justiert werden, um den durch ${t} entstehenden neuen Vulnerabilitäten gerecht zu werden.\n\nErfolgreiche Teilhabe erfordert mehr als formale Rechte; sie braucht echte Zugänge zu gesellschaftlichen Räumen und Diskursen.`
    },
    {
      id: "p7",
      category: "ÖKONOMISCHE PERSPEKTIVE",
      title: "Arbeit und Wohlstand",
      color: "#eab308",
      summary: `Bewertet ${t} anhand von Wertschöpfung, Märkten, Beschäftigung und der Verteilung von materiellem Reichtum.`,
      intro: `Der Markt ist ein mächtiger Treiber. Die ökonomische Linse analysiert ${t} als Frage von Angebot, Nachfrage, Kosten und Innovation.`,
      analysis: `**Strukturwandel der Arbeit**\nArbeitsmärkte transformieren sich radikal. ${t} lässt alte Branchen sterben und neue, oft unregulierte Sektoren entstehen.\n\n**Wettbewerbsfähigkeit**\nAuf globaler Ebene wird ${t} oft primär als Frage der Standortpolitik und der technologischen Führerschaft diskutiert.\n\n**Wohlstandsverteilung**\nDas Bruttoinlandsprodukt allein sagt wenig aus. Die entscheidende Frage ist, wie sich die monetären Effekte von ${t} auf den Gini-Koeffizienten auswirken.`,
      comprehensive: `Die Ökonomie betrachtet ${t} oft kühl durch die Linse der Effizienz. Doch Preise spiegeln selten die wahre Realität wider.\n\nMakroökonomische Schocks durch ${t} erfordern neue geld- und fiskalpolitische Instrumente. Das alte Paradigma greift oft nicht mehr.\n\nInnovationszyklen verkürzen sich. Kapital fließt dorthin, wo im Umgang mit ${t} die höchsten Renditen erwartet werden.\n\nEs droht eine Spaltung in hochqualifizierte Gewinner und jene, deren Arbeitskraft durch ${t} entwertet wird.\n\nDie Debatte um ein bedingungsloses Grundeinkommen oder neue Steuerkonzepte gewinnt im Lichte dieser ökonomischen Verwerfungen enorm an Relevanz.`
    },
    {
      id: "p8",
      category: "POLITISCHE PERSPEKTIVE",
      title: "Macht und Gesetz",
      color: "#64748b",
      summary: `Fragt nach Steuerung und Legitimation. Wie reagieren Staaten, Parteien und das Völkerrecht auf die Herausforderung von ${t}?`,
      intro: `Politik ist die Kunst des Möglichen. Hier geht es darum, wie Gesellschaften kollektiv bindende Entscheidungen bezüglich ${t} treffen.`,
      analysis: `**Handlungsfähigkeit des Staates**\nRegierungen stehen unter Druck, Handlungsstärke zu simulieren, auch wenn ${t} nationale Grenzen längst überschritten hat.\n\n**Polarisierung im Diskurs**\nDas Thema eignet sich hervorragend zur Mobilisierung. Parteien nutzen ${t}, um Identitätspolitik zu betreiben und Ränder zu radikalisieren.\n\n**Internationale Ordnung**\nWir beobachten die Erosion multilateraler Institutionen. Globale Antworten auf ${t} scheitern oft an nationalen Egoismen.`,
      comprehensive: `Die Verfasstheit der liberalen Demokratie wird durch komplexe Metakrisen wie ${t} stark herausgefordert.\n\nEntscheidungsprozesse sind oft zu langsam, um mit der Rasanz der Entwicklungen Schritt zu halten, was exekutive Machtausdehnungen begünstigt.\n\nRechtssysteme müssen adaptiert werden. Das Gesetz hinkt der normativen Realität von ${t} meist Jahre hinterher.\n\nDie Rolle von Zivilgesellschaft und NGOs als Korrektiv zur staatlichen Politik wird zunehmend wichtiger, aber auch umstrittener.\n\nLetztlich stellt ${t} die Systemfrage: Sind unsere derzeitigen demokratischen Institutionen zukunftsfähig genug, um diese Transformationen zu überleben?`
    }
  ];
};

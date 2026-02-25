const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Subject = require("./models/Subject");
const Topic = require("./models/Topic");

dotenv.config();

const subjects = [
  { name: "Mathematics", level: "O-Level" },
  { name: "Physics", level: "O-Level" },
  { name: "Biology", level: "O-Level" },
  { name: "English", level: "O-Level" },
  { name: "Chemistry", level: "O-Level" },
  { name: "Geography", level: "O-Level" },
];

const topicsBySubject = {
  "Mathematics": [
    // Chapter 1 – Numbers & Expressions
    { title: "Number Systems", chapter: 1, chapterTitle: "Numbers & Expressions", order: 1, difficulty: "beginner", notes: "Natural numbers, integers, rational and irrational numbers, and real number properties.", summary: [
      "Natural numbers (ℕ) start from 1; whole numbers include 0.",
      "Integers (ℤ) include negative numbers, zero, and positive numbers.",
      "Rational numbers can be expressed as a fraction p/q where q ≠ 0.",
      "Irrational numbers (e.g. √2, π) cannot be written as simple fractions.",
      "Real numbers = rational ∪ irrational; they fill the entire number line."
    ]},
    { title: "Algebra", chapter: 1, chapterTitle: "Numbers & Expressions", order: 2, difficulty: "beginner", notes: "Solving linear and quadratic equations, inequalities, and polynomials.", summary: [
      "A linear equation has the form ax + b = 0 and produces one solution.",
      "Quadratic equations (ax² + bx + c = 0) are solved using factoring, completing the square, or the quadratic formula.",
      "The discriminant (b² − 4ac) determines the number of real roots.",
      "Inequalities use <, >, ≤, ≥ and the solution is a range of values.",
      "Polynomials can be added, subtracted, multiplied, and factored."
    ]},
    { title: "Indices and Logarithms", chapter: 1, chapterTitle: "Numbers & Expressions", order: 3, difficulty: "intermediate", notes: "Laws of indices, logarithmic equations, and change of base.", summary: [
      "Key index laws: aᵐ × aⁿ = aᵐ⁺ⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ.",
      "a⁰ = 1 for any non-zero a; a⁻ⁿ = 1/aⁿ.",
      "Logarithm is the inverse of exponentiation: if aˣ = b then logₐ(b) = x.",
      "Log laws: log(ab) = log a + log b; log(a/b) = log a − log b; log(aⁿ) = n·log a.",
      "Change of base formula: logₐ(b) = log(b) / log(a)."
    ]},
    // Chapter 2 – Shapes & Space
    { title: "Geometry", chapter: 2, chapterTitle: "Shapes & Space", order: 1, difficulty: "intermediate", notes: "Properties of shapes, angles, circles, and coordinate geometry.", summary: [
      "Angles in a triangle sum to 180°; angles in a quadrilateral sum to 360°.",
      "Types of triangles: equilateral, isosceles, scalene, right-angled.",
      "Circle theorems: angle at centre = 2× angle at circumference; angles in the same segment are equal.",
      "Coordinate geometry: distance = √[(x₂−x₁)² + (y₂−y₁)²]; midpoint = ((x₁+x₂)/2, (y₁+y₂)/2).",
      "Gradient of a line = (y₂−y₁)/(x₂−x₁); perpendicular gradients multiply to −1."
    ]},
    { title: "Trigonometry", chapter: 2, chapterTitle: "Shapes & Space", order: 2, difficulty: "intermediate", notes: "Sine, cosine, tangent ratios, trigonometric identities, and applications.", summary: [
      "SOH-CAH-TOA: sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent.",
      "The sine rule: a/sin A = b/sin B = c/sin C (used for non-right triangles).",
      "The cosine rule: a² = b² + c² − 2bc·cos A.",
      "Key identity: sin²θ + cos²θ = 1.",
      "Trigonometry is used to find unknown sides, angles, heights, and distances."
    ]},
    { title: "Vectors", chapter: 2, chapterTitle: "Shapes & Space", order: 3, difficulty: "advanced", notes: "Vector addition, scalar multiplication, dot product, and position vectors.", summary: [
      "A vector has both magnitude and direction, written as a column vector or using notation like →AB.",
      "Vector addition: add corresponding components; subtraction reverses the second vector.",
      "Scalar multiplication scales each component: k(a, b) = (ka, kb).",
      "The magnitude of vector (a, b) = √(a² + b²).",
      "Position vector of a point P relative to origin O is →OP."
    ]},
    // Chapter 3 – Data & Probability
    { title: "Statistics", chapter: 3, chapterTitle: "Data & Probability", order: 1, difficulty: "intermediate", notes: "Mean, median, mode, probability, and data representation.", summary: [
      "Mean = sum of all values ÷ number of values.",
      "Median = middle value when data is ordered; for even counts, average the two middle values.",
      "Mode = the most frequently occurring value in a data set.",
      "Range = highest value − lowest value; it measures spread.",
      "Data can be displayed using bar charts, histograms, pie charts, and frequency tables."
    ]},
    { title: "Probability", chapter: 3, chapterTitle: "Data & Probability", order: 2, difficulty: "advanced", notes: "Conditional probability, independent events, tree diagrams, and combinatorics.", summary: [
      "Probability of an event = number of favourable outcomes / total outcomes.",
      "P(A and B) = P(A) × P(B) for independent events.",
      "P(A or B) = P(A) + P(B) − P(A and B).",
      "Tree diagrams help visualise sequential events and their probabilities.",
      "Conditional probability: P(A|B) = P(A and B) / P(B)."
    ]},
    // Chapter 4 – Advanced Topics
    { title: "Sequences and Series", chapter: 4, chapterTitle: "Advanced Topics", order: 1, difficulty: "advanced", notes: "Arithmetic and geometric sequences, sum formulas, and convergence.", summary: [
      "Arithmetic sequence: each term differs by a constant d; nth term = a + (n−1)d.",
      "Sum of arithmetic series: Sₙ = n/2 × (2a + (n−1)d).",
      "Geometric sequence: each term is multiplied by a constant ratio r; nth term = arⁿ⁻¹.",
      "Sum of geometric series: Sₙ = a(1 − rⁿ)/(1 − r) when r ≠ 1.",
      "An infinite geometric series converges if |r| < 1; sum = a/(1 − r)."
    ]},
    { title: "Matrices", chapter: 4, chapterTitle: "Advanced Topics", order: 2, difficulty: "advanced", notes: "Matrix operations, determinants, inverse matrices, and solving systems of equations.", summary: [
      "A matrix is a rectangular array of numbers arranged in rows and columns.",
      "Matrices can be added/subtracted if they have the same dimensions.",
      "Matrix multiplication: number of columns in A must equal rows in B.",
      "Determinant of a 2×2 matrix [[a,b],[c,d]] = ad − bc.",
      "The inverse A⁻¹ exists only if det(A) ≠ 0; useful for solving AX = B as X = A⁻¹B."
    ]},
  ],
  "Physics": [
    // Chapter 1 – Forces & Motion
    { title: "Measurements and Units", chapter: 1, chapterTitle: "Forces & Motion", order: 1, difficulty: "beginner", notes: "SI units, measuring instruments, significant figures, and unit conversions.", summary: [
      "The 7 SI base units include metre (m), kilogram (kg), second (s), ampere (A), and kelvin (K).",
      "Derived units are combinations of base units (e.g. m/s for speed, N for force).",
      "Common instruments: ruler, vernier caliper, micrometer, stopwatch, balance.",
      "Significant figures indicate the precision of a measurement.",
      "Always convert units before substituting into formulas."
    ]},
    { title: "Mechanics", chapter: 1, chapterTitle: "Forces & Motion", order: 2, difficulty: "beginner", notes: "Newton's laws of motion, forces, energy, and work.", summary: [
      "Newton's 1st law: an object stays at rest or in uniform motion unless acted on by a net force.",
      "Newton's 2nd law: F = ma (force equals mass times acceleration).",
      "Newton's 3rd law: every action has an equal and opposite reaction.",
      "Work = force × distance in the direction of force (W = Fd).",
      "Kinetic energy = ½mv²; gravitational potential energy = mgh."
    ]},
    { title: "Momentum and Impulse", chapter: 1, chapterTitle: "Forces & Motion", order: 3, difficulty: "intermediate", notes: "Conservation of momentum, collisions, impulse, and force-time graphs.", summary: [
      "Momentum = mass × velocity (p = mv); it is a vector quantity.",
      "Law of conservation of momentum: total momentum before = total momentum after (in a closed system).",
      "Impulse = force × time = change in momentum (FΔt = Δp).",
      "Elastic collisions conserve both momentum and kinetic energy; inelastic do not conserve KE.",
      "The area under a force-time graph equals the impulse."
    ]},
    // Chapter 2 – Electric Circuits
    { title: "Electricity", chapter: 2, chapterTitle: "Electric Circuits", order: 1, difficulty: "intermediate", notes: "Current, voltage, resistance, Ohm's law, and circuits.", summary: [
      "Current (I) is the rate of flow of charge, measured in amperes (A).",
      "Voltage (V) is the energy per unit charge, measured in volts.",
      "Ohm's law: V = IR; resistance is measured in ohms (Ω).",
      "Series circuits: same current through all components; voltages add up.",
      "Parallel circuits: same voltage across branches; currents add up."
    ]},
    { title: "Electromagnetism", chapter: 2, chapterTitle: "Electric Circuits", order: 2, difficulty: "intermediate", notes: "Magnetic fields, electromagnetic induction, transformers, and motors.", summary: [
      "A current-carrying conductor produces a magnetic field around it.",
      "Fleming's left-hand rule gives the direction of force on a conductor in a magnetic field.",
      "Electromagnetic induction: a changing magnetic field induces an EMF (Faraday's law).",
      "Transformers change voltage: Vp/Vs = Np/Ns (turns ratio).",
      "Electric motors convert electrical energy to mechanical energy using the motor effect."
    ]},
    { title: "Electrostatics", chapter: 2, chapterTitle: "Electric Circuits", order: 3, difficulty: "advanced", notes: "Coulomb's law, electric fields, potential difference, and capacitors.", summary: [
      "Like charges repel; opposite charges attract.",
      "Coulomb's law: F = kQ₁Q₂/r² where k ≈ 9 × 10⁹ N·m²/C².",
      "Electric field strength E = F/q = V/d (for uniform fields).",
      "Capacitance C = Q/V, measured in farads (F).",
      "Energy stored in a capacitor: E = ½CV²."
    ]},
    // Chapter 3 – Light & Waves
    { title: "Optics", chapter: 3, chapterTitle: "Light & Waves", order: 1, difficulty: "intermediate", notes: "Reflection, refraction, lenses, and the electromagnetic spectrum.", summary: [
      "Law of reflection: angle of incidence = angle of reflection.",
      "Refraction occurs when light changes speed between media; Snell's law: n₁ sin θ₁ = n₂ sin θ₂.",
      "Convex lenses converge light; concave lenses diverge light.",
      "The lens equation: 1/f = 1/v + 1/u.",
      "The electromagnetic spectrum (radio → microwave → infrared → visible → UV → X-ray → gamma)."
    ]},
    { title: "Wave Motion", chapter: 3, chapterTitle: "Light & Waves", order: 2, difficulty: "advanced", notes: "Transverse and longitudinal waves, interference, diffraction, and standing waves.", summary: [
      "Transverse waves: oscillation perpendicular to direction of travel (e.g. light).",
      "Longitudinal waves: oscillation parallel to direction of travel (e.g. sound).",
      "Wave equation: v = fλ (speed = frequency × wavelength).",
      "Interference: constructive (waves in phase) or destructive (waves out of phase).",
      "Standing waves form when two waves of equal frequency travel in opposite directions."
    ]},
    { title: "Sound", chapter: 3, chapterTitle: "Light & Waves", order: 3, difficulty: "advanced", notes: "Sound wave properties, resonance, Doppler effect, and musical instruments.", summary: [
      "Sound is a longitudinal wave that requires a medium to travel.",
      "Speed of sound: ~340 m/s in air; faster in solids and liquids.",
      "Pitch depends on frequency; loudness depends on amplitude.",
      "Resonance occurs when a forced vibration matches the natural frequency.",
      "Doppler effect: apparent frequency changes when source or observer moves."
    ]},
    // Chapter 4 – Thermal Physics
    { title: "Heat and Temperature", chapter: 4, chapterTitle: "Thermal Physics", order: 1, difficulty: "beginner", notes: "Temperature scales, thermal expansion, specific heat capacity, and latent heat.", summary: [
      "Temperature measures the average kinetic energy of particles.",
      "Celsius and Kelvin scales: K = °C + 273.",
      "Specific heat capacity: energy to raise 1 kg by 1°C → Q = mcΔT.",
      "Latent heat: energy for state change without temperature change → Q = mL.",
      "Most materials expand when heated (thermal expansion)."
    ]},
    { title: "Gas Laws", chapter: 4, chapterTitle: "Thermal Physics", order: 2, difficulty: "intermediate", notes: "Boyle's law, Charles's law, pressure law, and the ideal gas equation.", summary: [
      "Boyle's law: P₁V₁ = P₂V₂ (constant temperature).",
      "Charles's law: V₁/T₁ = V₂/T₂ (constant pressure); temperature in Kelvin.",
      "Pressure law: P₁/T₁ = P₂/T₂ (constant volume).",
      "Ideal gas equation: PV = nRT.",
      "Gas particles move randomly; pressure results from particle collisions with container walls."
    ]},
  ],
  "Biology": [
    // Chapter 1 – The Cell
    { title: "Cell Biology", chapter: 1, chapterTitle: "The Cell", order: 1, difficulty: "beginner", notes: "Cell structure, organelles, mitosis, and meiosis.", summary: [
      "All living things are made of cells — the basic unit of life.",
      "Animal cells have a nucleus, cytoplasm, cell membrane, mitochondria, and ribosomes.",
      "Plant cells additionally have a cell wall, chloroplasts, and a large vacuole.",
      "Mitosis produces two identical daughter cells (for growth and repair).",
      "Meiosis produces four genetically different cells (for gamete production)."
    ]},
    { title: "Cell Transport", chapter: 1, chapterTitle: "The Cell", order: 2, difficulty: "beginner", notes: "Osmosis, diffusion, active transport, and membrane structure.", summary: [
      "Diffusion: movement of particles from high to low concentration (passive).",
      "Osmosis: movement of water across a semi-permeable membrane from dilute to concentrated solution.",
      "Active transport: movement against the concentration gradient using energy (ATP).",
      "The cell membrane is a phospholipid bilayer with embedded proteins.",
      "Factors affecting diffusion rate: temperature, concentration gradient, surface area."
    ]},
    { title: "Enzymes", chapter: 1, chapterTitle: "The Cell", order: 3, difficulty: "intermediate", notes: "Enzyme structure, function, factors affecting enzyme activity, and specificity.", summary: [
      "Enzymes are biological catalysts — they speed up reactions without being used up.",
      "Lock-and-key model: the substrate fits exactly into the enzyme's active site.",
      "Each enzyme is specific to one substrate.",
      "Enzyme activity is affected by temperature, pH, and substrate concentration.",
      "Denaturation occurs when high temperature or extreme pH changes the active site shape."
    ]},
    // Chapter 2 – Human Anatomy
    { title: "Human Body Systems", chapter: 2, chapterTitle: "Human Anatomy", order: 1, difficulty: "intermediate", notes: "Circulatory, respiratory, digestive, and nervous systems.", summary: [
      "Circulatory: heart pumps blood; arteries carry oxygenated blood, veins return deoxygenated blood.",
      "Respiratory: gas exchange in alveoli — O₂ diffuses in, CO₂ diffuses out.",
      "Digestive: mouth → oesophagus → stomach → small intestine (absorption) → large intestine.",
      "Nervous: brain, spinal cord, and nerves; signals travel as electrical impulses.",
      "All systems work together to maintain homeostasis."
    ]},
    { title: "Reproduction", chapter: 2, chapterTitle: "Human Anatomy", order: 2, difficulty: "intermediate", notes: "Human reproductive system, menstrual cycle, fertilization, and fetal development.", summary: [
      "Male reproductive system produces sperm in the testes.",
      "Female reproductive system produces eggs (ova) in the ovaries.",
      "The menstrual cycle (~28 days) is controlled by hormones: FSH, LH, oestrogen, progesterone.",
      "Fertilization occurs when sperm meets egg, usually in the fallopian tube.",
      "The embryo implants in the uterus wall and develops over ~9 months."
    ]},
    { title: "Nutrition and Diet", chapter: 2, chapterTitle: "Human Anatomy", order: 3, difficulty: "beginner", notes: "Food groups, balanced diet, vitamins, minerals, and deficiency diseases.", summary: [
      "A balanced diet includes carbohydrates, proteins, fats, vitamins, minerals, fibre, and water.",
      "Carbohydrates provide energy; proteins are needed for growth and repair.",
      "Fats store energy and insulate the body.",
      "Vitamin C prevents scurvy; vitamin D prevents rickets; iron prevents anaemia.",
      "Fibre aids digestion and prevents constipation."
    ]},
    // Chapter 3 – Environment & Life
    { title: "Ecology", chapter: 3, chapterTitle: "Environment & Life", order: 1, difficulty: "intermediate", notes: "Ecosystems, food chains, biodiversity, and conservation.", summary: [
      "An ecosystem includes all living organisms and their physical environment.",
      "Food chains show energy flow: producer → primary consumer → secondary consumer → tertiary consumer.",
      "Energy is lost at each trophic level (mainly as heat from respiration).",
      "Biodiversity is the variety of species in an ecosystem.",
      "Conservation efforts include habitat protection, breeding programs, and legislation."
    ]},
    { title: "Classification of Living Things", chapter: 3, chapterTitle: "Environment & Life", order: 2, difficulty: "beginner", notes: "Kingdoms of life, binomial nomenclature, taxonomy, and dichotomous keys.", summary: [
      "Living things are classified into 5 kingdoms: Animals, Plants, Fungi, Protists, Prokaryotes.",
      "Classification hierarchy: Kingdom → Phylum → Class → Order → Family → Genus → Species.",
      "Binomial nomenclature uses two Latin names: Genus species (e.g. Homo sapiens).",
      "Organisms are grouped by shared characteristics.",
      "Dichotomous keys use a series of yes/no questions to identify organisms."
    ]},
    { title: "Evolution and Adaptation", chapter: 3, chapterTitle: "Environment & Life", order: 3, difficulty: "advanced", notes: "Natural selection, speciation, fossil evidence, and genetic variation.", summary: [
      "Natural selection: organisms with advantageous traits survive and reproduce more.",
      "Variation within a population arises from mutations, meiosis, and sexual reproduction.",
      "Over many generations, natural selection can lead to new species (speciation).",
      "Fossils provide evidence for evolution by showing how organisms changed over time.",
      "Adaptations can be structural, behavioural, or physiological."
    ]},
    // Chapter 4 – Genetics
    { title: "Heredity and Genetics", chapter: 4, chapterTitle: "Genetics", order: 1, difficulty: "advanced", notes: "Mendelian genetics, Punnett squares, genotype vs phenotype, and genetic disorders.", summary: [
      "Genes are sections of DNA that code for specific proteins/traits.",
      "Alleles are different versions of the same gene (dominant or recessive).",
      "Genotype = the combination of alleles (e.g. Bb); phenotype = the observable trait.",
      "Punnett squares predict the probability of offspring genotypes.",
      "Genetic disorders include sickle cell anaemia (recessive) and Huntington's disease (dominant)."
    ]},
    { title: "DNA and Protein Synthesis", chapter: 4, chapterTitle: "Genetics", order: 2, difficulty: "advanced", notes: "DNA structure, replication, transcription, translation, and mutations.", summary: [
      "DNA is a double helix made of nucleotides (A-T, C-G base pairs).",
      "DNA replication is semi-conservative — each new molecule has one old and one new strand.",
      "Transcription: DNA → mRNA in the nucleus.",
      "Translation: mRNA → protein at ribosomes using tRNA and amino acids.",
      "Mutations are changes in the DNA base sequence; they can be harmful, neutral, or beneficial."
    ]},
  ],
  "English": [
    // Chapter 1 – Language Foundations
    { title: "Grammar", chapter: 1, chapterTitle: "Language Foundations", order: 1, difficulty: "beginner", notes: "Tenses, sentence structure, parts of speech, and punctuation.", summary: [
      "Parts of speech: nouns, verbs, adjectives, adverbs, pronouns, prepositions, conjunctions.",
      "Tenses indicate time: past, present, future (simple, continuous, perfect forms).",
      "Subject-verb agreement: singular subjects take singular verbs.",
      "Punctuation marks: full stop, comma, semicolon, colon, apostrophe, question mark.",
      "A complete sentence needs a subject and a predicate."
    ]},
    { title: "Vocabulary Building", chapter: 1, chapterTitle: "Language Foundations", order: 2, difficulty: "beginner", notes: "Word roots, prefixes, suffixes, synonyms, antonyms, and context clues.", summary: [
      "Prefixes change meaning (un-, re-, pre-, dis-); suffixes change word class (-tion, -ly, -ful).",
      "Latin/Greek roots help decode unfamiliar words (e.g. 'bio' = life, 'graph' = write).",
      "Synonyms are words with similar meanings; antonyms have opposite meanings.",
      "Context clues: use surrounding words and sentences to infer meaning.",
      "Regular reading is the most effective way to expand vocabulary."
    ]},
    { title: "Sentence Construction", chapter: 1, chapterTitle: "Language Foundations", order: 3, difficulty: "intermediate", notes: "Simple, compound, and complex sentences, clauses, and conjunctions.", summary: [
      "Simple sentence: one independent clause (e.g. 'The cat sat on the mat.').",
      "Compound sentence: two independent clauses joined by a coordinating conjunction (and, but, or).",
      "Complex sentence: one independent clause + one or more dependent clauses.",
      "Subordinating conjunctions: because, although, when, if, while.",
      "Varying sentence structure improves writing clarity and flow."
    ]},
    // Chapter 2 – Reading & Analysis
    { title: "Comprehension", chapter: 2, chapterTitle: "Reading & Analysis", order: 1, difficulty: "intermediate", notes: "Reading passages, inference, and summary writing.", summary: [
      "Read the passage carefully; underline key points and unfamiliar words.",
      "Inference means reading between the lines — understanding what is implied, not just stated.",
      "Summary writing: identify the main idea and supporting details; use your own words.",
      "Answer questions by referring back to specific parts of the text.",
      "Pay attention to the author's tone and purpose."
    ]},
    { title: "Literary Analysis", chapter: 2, chapterTitle: "Reading & Analysis", order: 2, difficulty: "advanced", notes: "Themes, symbolism, character development, figurative language, and literary devices.", summary: [
      "Theme: the central message or lesson of a literary work.",
      "Symbolism: using objects or actions to represent deeper meanings.",
      "Character development: how characters change throughout the story.",
      "Figurative language includes metaphor, simile, personification, and hyperbole.",
      "Literary devices: foreshadowing, irony, allusion, and imagery add depth to writing."
    ]},
    { title: "Poetry Appreciation", chapter: 2, chapterTitle: "Reading & Analysis", order: 3, difficulty: "advanced", notes: "Rhyme schemes, meter, imagery, tone, and analysis of selected poems.", summary: [
      "Rhyme scheme is the pattern of end rhymes (e.g. ABAB, ABBA, AABB).",
      "Meter is the rhythmic pattern of stressed and unstressed syllables.",
      "Imagery appeals to the five senses to create vivid mental pictures.",
      "Tone = the poet's attitude toward the subject (e.g. joyful, melancholic, sarcastic).",
      "Analyse poems by looking at structure, language, themes, and poetic devices."
    ]},
    // Chapter 3 – Written Expression
    { title: "Essay Writing", chapter: 3, chapterTitle: "Written Expression", order: 1, difficulty: "intermediate", notes: "Narrative, descriptive, and argumentative essay techniques.", summary: [
      "Essay structure: introduction (thesis), body paragraphs (evidence), conclusion (summary).",
      "Narrative essays tell a story with a clear beginning, middle, and end.",
      "Descriptive essays use sensory details to paint a picture for the reader.",
      "Argumentative essays present a claim supported by evidence and reasoning.",
      "Use transition words (however, furthermore, in addition) for smooth flow."
    ]},
    { title: "Creative Writing", chapter: 3, chapterTitle: "Written Expression", order: 2, difficulty: "advanced", notes: "Short stories, dialogue writing, point of view, and descriptive techniques.", summary: [
      "A short story has characters, setting, plot (conflict), climax, and resolution.",
      "Dialogue should sound natural and reveal character personality.",
      "Point of view: first person (I), second person (you), third person (he/she).",
      "Show, don't tell: use actions and details rather than stating emotions directly.",
      "Strong openings hook the reader; satisfying endings leave a lasting impression."
    ]},
    { title: "Formal Writing", chapter: 3, chapterTitle: "Written Expression", order: 3, difficulty: "intermediate", notes: "Letter writing, report writing, email etiquette, and professional tone.", summary: [
      "Formal letters include: sender's address, date, recipient's address, salutation, body, closing.",
      "Reports have a title, introduction, findings, and conclusion/recommendations.",
      "Use professional language — avoid slang, contractions, and informal expressions.",
      "Emails should have a clear subject line, greeting, concise body, and sign-off.",
      "Proofread for grammar, spelling, and tone before sending."
    ]},
    // Chapter 4 – Oral Communication
    { title: "Speaking and Listening", chapter: 4, chapterTitle: "Oral Communication", order: 1, difficulty: "beginner", notes: "Pronunciation, public speaking, active listening, and group discussions.", summary: [
      "Clear pronunciation helps your audience understand you.",
      "Public speaking tips: prepare, practise, make eye contact, and project your voice.",
      "Active listening: pay attention, don't interrupt, ask clarifying questions.",
      "In group discussions, take turns, respect others' opinions, and stay on topic.",
      "Body language (posture, gestures, facial expressions) supports verbal communication."
    ]},
    { title: "Debate and Presentation", chapter: 4, chapterTitle: "Oral Communication", order: 2, difficulty: "advanced", notes: "Argumentation, persuasion techniques, structuring debates, and slide presentations.", summary: [
      "A debate has a proposition (for) and opposition (against) with structured arguments.",
      "Persuasion techniques: ethos (credibility), pathos (emotion), logos (logic).",
      "Structure: opening statement → arguments → rebuttals → closing statement.",
      "Presentations should have clear slides, minimal text, and strong visuals.",
      "Timing, confidence, and clarity are key to effective oral delivery."
    ]},
  ],
  "Chemistry": [
    // Chapter 1 – Matter & Atoms
    { title: "Introduction to Chemistry", chapter: 1, chapterTitle: "Matter & Atoms", order: 1, difficulty: "beginner", notes: "States of matter, physical vs chemical changes, and laboratory safety.", summary: [
      "Three states of matter: solid (fixed shape), liquid (fixed volume), gas (fills container).",
      "Physical changes are reversible (e.g. melting); chemical changes form new substances (e.g. burning).",
      "Particles in solids vibrate in place; in liquids they slide; in gases they move freely.",
      "Lab safety: wear goggles, handle chemicals carefully, know emergency procedures.",
      "Common lab equipment: Bunsen burner, beaker, measuring cylinder, test tube, pipette."
    ]},
    { title: "Atomic Structure", chapter: 1, chapterTitle: "Matter & Atoms", order: 2, difficulty: "beginner", notes: "Atoms, elements, periodic table, and electron configuration.", summary: [
      "An atom has protons (+) and neutrons (neutral) in the nucleus, with electrons (−) orbiting.",
      "Atomic number = number of protons; mass number = protons + neutrons.",
      "Elements are arranged in the periodic table by increasing atomic number.",
      "Groups (columns) have similar properties; periods (rows) show trends.",
      "Electron configuration fills shells: 2, 8, 8 (e.g. sodium: 2,8,1)."
    ]},
    { title: "Chemical Bonding", chapter: 1, chapterTitle: "Matter & Atoms", order: 3, difficulty: "intermediate", notes: "Ionic, covalent, and metallic bonds, electronegativity, and Lewis structures.", summary: [
      "Ionic bonds: metal transfers electrons to non-metal; forms ions held by electrostatic attraction.",
      "Covalent bonds: non-metals share pairs of electrons.",
      "Metallic bonds: positive metal ions surrounded by a 'sea' of delocalised electrons.",
      "Electronegativity measures how strongly an atom attracts bonding electrons.",
      "Lewis (dot-cross) diagrams show the arrangement of outer-shell electrons in bonds."
    ]},
    // Chapter 2 – Reactions & Equations
    { title: "Chemical Reactions", chapter: 2, chapterTitle: "Reactions & Equations", order: 1, difficulty: "intermediate", notes: "Balancing equations, reaction types, and stoichiometry.", summary: [
      "In a balanced equation, the number of atoms of each element is equal on both sides.",
      "Reaction types: synthesis, decomposition, single replacement, double replacement, combustion.",
      "Stoichiometry uses mole ratios from balanced equations to calculate amounts of reactants/products.",
      "State symbols: (s) solid, (l) liquid, (g) gas, (aq) aqueous solution.",
      "Conservation of mass: matter is neither created nor destroyed in a reaction."
    ]},
    { title: "Acids, Bases, and Salts", chapter: 2, chapterTitle: "Reactions & Equations", order: 2, difficulty: "intermediate", notes: "pH scale, neutralization, indicators, and salt preparation.", summary: [
      "Acids produce H⁺ ions in solution; bases produce OH⁻ ions.",
      "pH scale: 0–6 acidic, 7 neutral, 8–14 alkaline.",
      "Neutralization: acid + base → salt + water.",
      "Indicators (litmus, phenolphthalein, universal indicator) show pH by colour change.",
      "Salts are prepared by reacting acids with metals, bases, or carbonates."
    ]},
    { title: "Redox Reactions", chapter: 2, chapterTitle: "Reactions & Equations", order: 3, difficulty: "advanced", notes: "Oxidation states, half-equations, electrochemical cells, and electrolysis.", summary: [
      "Oxidation = loss of electrons; reduction = gain of electrons (OIL RIG).",
      "Oxidation states track electron transfer; they increase in oxidation and decrease in reduction.",
      "Half-equations show what happens at each electrode separately.",
      "Electrolysis uses electrical energy to drive non-spontaneous reactions.",
      "Electrochemical cells convert chemical energy to electrical energy (e.g. batteries)."
    ]},
    // Chapter 3 – Carbon Compounds
    { title: "Organic Chemistry", chapter: 3, chapterTitle: "Carbon Compounds", order: 1, difficulty: "advanced", notes: "Hydrocarbons, functional groups, and naming conventions.", summary: [
      "Organic chemistry is the study of carbon-containing compounds.",
      "Hydrocarbons contain only carbon and hydrogen: alkanes (C-C), alkenes (C=C), alkynes (C≡C).",
      "Functional groups determine chemical properties: -OH (alcohol), -COOH (carboxylic acid), -NH₂ (amine).",
      "IUPAC naming: prefix (chain length) + suffix (functional group), e.g. methane, ethanol.",
      "Isomers have the same formula but different structural arrangements."
    ]},
    { title: "Polymers and Plastics", chapter: 3, chapterTitle: "Carbon Compounds", order: 2, difficulty: "advanced", notes: "Addition and condensation polymerization, plastics, and environmental impact.", summary: [
      "Polymers are long-chain molecules made by joining many small monomers.",
      "Addition polymerization: monomers with C=C bonds join without losing atoms (e.g. polyethene).",
      "Condensation polymerization: monomers join with loss of a small molecule like water (e.g. nylon).",
      "Plastics are synthetic polymers — lightweight, durable, and versatile.",
      "Environmental concern: most plastics are non-biodegradable; recycling and alternatives are important."
    ]},
    // Chapter 4 – Quantitative Chemistry
    { title: "The Mole Concept", chapter: 4, chapterTitle: "Quantitative Chemistry", order: 1, difficulty: "intermediate", notes: "Avogadro's number, molar mass, concentration, and dilution calculations.", summary: [
      "One mole = 6.022 × 10²³ particles (Avogadro's number).",
      "Molar mass = mass of one mole of a substance (in g/mol), equal to relative formula mass.",
      "Number of moles = mass / molar mass.",
      "Concentration = moles / volume (in mol/dm³ or mol/L).",
      "Dilution formula: C₁V₁ = C₂V₂."
    ]},
    { title: "Rates of Reaction", chapter: 4, chapterTitle: "Quantitative Chemistry", order: 2, difficulty: "advanced", notes: "Collision theory, factors affecting rate, catalysts, and energy profiles.", summary: [
      "Rate of reaction = change in concentration (or mass/volume) per unit time.",
      "Collision theory: reactions occur when particles collide with enough energy and correct orientation.",
      "Factors increasing rate: higher temperature, concentration, surface area, and catalysts.",
      "A catalyst lowers the activation energy without being consumed.",
      "Energy profile diagrams show activation energy, reactants, products, and energy change."
    ]},
    { title: "Energetics", chapter: 4, chapterTitle: "Quantitative Chemistry", order: 3, difficulty: "advanced", notes: "Exothermic and endothermic reactions, enthalpy changes, and Hess's law.", summary: [
      "Exothermic reactions release heat (ΔH < 0); endothermic reactions absorb heat (ΔH > 0).",
      "Enthalpy change (ΔH) is the heat energy change at constant pressure.",
      "Bond breaking is endothermic; bond making is exothermic.",
      "Hess's law: total enthalpy change is independent of the route taken.",
      "Calorimetry: Q = mcΔT is used to measure enthalpy changes experimentally."
    ]},
  ],
  "Geography": [
    // Chapter 1 – Earth's Surface
    { title: "Physical Geography", chapter: 1, chapterTitle: "Earth's Surface", order: 1, difficulty: "beginner", notes: "Landforms, weathering, erosion, and plate tectonics.", summary: [
      "Weathering breaks down rocks in situ: physical (freeze-thaw), chemical (acid rain), biological (roots).",
      "Erosion transports weathered material by water, wind, ice, or gravity.",
      "Deposition occurs when transporting agents lose energy and drop sediment.",
      "Major landforms: mountains, valleys, plains, plateaus, and coastal features.",
      "The Earth's surface is constantly shaped by internal (tectonic) and external (weathering) forces."
    ]},
    { title: "Rocks and Minerals", chapter: 1, chapterTitle: "Earth's Surface", order: 2, difficulty: "beginner", notes: "Igneous, sedimentary, and metamorphic rocks, rock cycle, and mineral properties.", summary: [
      "Igneous rocks form from cooled magma/lava (e.g. granite, basalt).",
      "Sedimentary rocks form from layers of compacted sediment (e.g. sandstone, limestone).",
      "Metamorphic rocks form when existing rocks are changed by heat/pressure (e.g. marble, slate).",
      "The rock cycle shows how rocks transform between the three types over time.",
      "Minerals are naturally occurring inorganic solids with a definite chemical composition."
    ]},
    { title: "Plate Tectonics", chapter: 1, chapterTitle: "Earth's Surface", order: 3, difficulty: "intermediate", notes: "Tectonic plates, earthquakes, volcanoes, and continental drift.", summary: [
      "The Earth's crust is divided into tectonic plates that float on the mantle.",
      "Plate boundaries: convergent (collision), divergent (moving apart), transform (sliding past).",
      "Earthquakes occur at fault lines due to sudden release of built-up pressure.",
      "Volcanoes form at convergent boundaries and hotspots where magma reaches the surface.",
      "Continental drift theory (Wegener): continents were once joined as Pangaea."
    ]},
    // Chapter 2 – Atmosphere
    { title: "Climate and Weather", chapter: 2, chapterTitle: "Atmosphere", order: 1, difficulty: "intermediate", notes: "Atmospheric processes, climate zones, and weather patterns.", summary: [
      "Weather = short-term atmospheric conditions; climate = long-term average weather.",
      "Factors affecting climate: latitude, altitude, distance from sea, ocean currents, prevailing winds.",
      "Climate zones: tropical, arid, temperate, continental, polar.",
      "The water cycle: evaporation → condensation → precipitation → collection.",
      "Weather instruments: thermometer, barometer, rain gauge, anemometer, weather vane."
    ]},
    { title: "Water Cycle and Rivers", chapter: 2, chapterTitle: "Atmosphere", order: 2, difficulty: "beginner", notes: "Evaporation, condensation, precipitation, river features, and flooding.", summary: [
      "The water cycle is a continuous process: evaporation, condensation, precipitation, and runoff.",
      "Rivers have three courses: upper (V-shaped valleys, waterfalls), middle (meanders), lower (floodplains, deltas).",
      "Erosion processes in rivers: hydraulic action, abrasion, attrition, solution.",
      "Flooding is caused by heavy rainfall, deforestation, impermeable surfaces, and snowmelt.",
      "Flood management: dams, levees, flood walls, and land-use planning."
    ]},
    { title: "Natural Disasters", chapter: 2, chapterTitle: "Atmosphere", order: 3, difficulty: "advanced", notes: "Hurricanes, tsunamis, droughts, and disaster preparedness.", summary: [
      "Hurricanes form over warm ocean water (>26°C) and bring strong winds, heavy rain, and storm surges.",
      "Tsunamis are giant waves caused by underwater earthquakes or volcanic eruptions.",
      "Droughts are prolonged periods of low rainfall leading to water shortages and crop failure.",
      "Disaster preparedness: early warning systems, evacuation plans, emergency supplies.",
      "Developing countries are often more vulnerable due to limited infrastructure and resources."
    ]},
    // Chapter 3 – Spatial Skills
    { title: "Map Reading", chapter: 3, chapterTitle: "Spatial Skills", order: 1, difficulty: "beginner", notes: "Contour lines, grid references, scale, and compass directions.", summary: [
      "Contour lines connect points of equal elevation; close lines = steep slope.",
      "Grid references: 4-figure (identifies a square), 6-figure (identifies a specific point).",
      "Scale shows the ratio of map distance to real distance (e.g. 1:50,000).",
      "8 compass directions: N, NE, E, SE, S, SW, W, NW.",
      "Map symbols represent features like roads, rivers, buildings, and vegetation."
    ]},
    { title: "GIS and Remote Sensing", chapter: 3, chapterTitle: "Spatial Skills", order: 2, difficulty: "advanced", notes: "Satellite imagery, GPS technology, data layers, and geographic analysis.", summary: [
      "GIS (Geographic Information Systems) stores, analyses, and displays spatial data.",
      "Remote sensing collects data about the Earth from satellites or aircraft.",
      "GPS uses satellites to determine precise location on Earth.",
      "GIS data layers can be overlaid to analyse relationships (e.g. land use + flooding).",
      "Applications: urban planning, disaster response, environmental monitoring, agriculture."
    ]},
    // Chapter 4 – Human Geography
    { title: "Population and Settlement", chapter: 4, chapterTitle: "Human Geography", order: 1, difficulty: "intermediate", notes: "Population growth, urbanization, migration, and demographic transition model.", summary: [
      "World population is unevenly distributed; dense in fertile, accessible, urban areas.",
      "Birth rate, death rate, and migration determine population change.",
      "The Demographic Transition Model (DTM) has 5 stages from high to low birth/death rates.",
      "Urbanization: movement from rural to urban areas driven by jobs and services.",
      "Push factors (poverty, conflict) and pull factors (employment, education) drive migration."
    ]},
    { title: "Agriculture and Industry", chapter: 4, chapterTitle: "Human Geography", order: 2, difficulty: "intermediate", notes: "Farming systems, industrialization, trade, and economic development.", summary: [
      "Subsistence farming: growing food for the farmer's own use; commercial farming: for profit/sale.",
      "Factors affecting farming: climate, soil, relief, market access, and technology.",
      "Industrialization: shift from primary (farming/mining) to secondary (manufacturing) and tertiary (services).",
      "Trade: exports and imports; developing countries often export raw materials.",
      "Economic development is measured by GDP, HDI, literacy rate, and life expectancy."
    ]},
    { title: "Environmental Management", chapter: 4, chapterTitle: "Human Geography", order: 3, difficulty: "advanced", notes: "Deforestation, climate change, sustainability, and conservation strategies.", summary: [
      "Deforestation causes habitat loss, soil erosion, and increased CO₂ levels.",
      "Climate change is driven by greenhouse gases (CO₂, methane); effects include rising sea levels and extreme weather.",
      "Sustainability means meeting present needs without compromising future generations.",
      "Renewable energy sources: solar, wind, hydro, geothermal.",
      "Conservation strategies: protected areas, reforestation, international agreements (e.g. Paris Agreement)."
    ]},
  ],
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Subject.deleteMany({});
    await Topic.deleteMany({});
    console.log("Cleared existing data");

    const createdSubjects = await Subject.insertMany(subjects);
    console.log(`Seeded ${createdSubjects.length} subjects`);

    let topicCount = 0;
    for (const subject of createdSubjects) {
      const key = subject.name;
      const topics = topicsBySubject[key];
      if (topics) {
        const topicsWithSubject = topics.map((t) => ({ ...t, subject: subject._id }));
        await Topic.insertMany(topicsWithSubject);
        topicCount += topicsWithSubject.length;
      }
    }
    console.log(`Seeded ${topicCount} topics`);

    await mongoose.connection.close();
    console.log("Done!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();

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
    { title: "Number Systems", chapter: 1, chapterTitle: "Numbers & Expressions", order: 1, difficulty: "beginner", notes: "Natural numbers, integers, rational and irrational numbers, and real number properties." },
    { title: "Algebra", chapter: 1, chapterTitle: "Numbers & Expressions", order: 2, difficulty: "beginner", notes: "Solving linear and quadratic equations, inequalities, and polynomials." },
    { title: "Indices and Logarithms", chapter: 1, chapterTitle: "Numbers & Expressions", order: 3, difficulty: "intermediate", notes: "Laws of indices, logarithmic equations, and change of base." },
    // Chapter 2 – Shapes & Space
    { title: "Geometry", chapter: 2, chapterTitle: "Shapes & Space", order: 1, difficulty: "intermediate", notes: "Properties of shapes, angles, circles, and coordinate geometry." },
    { title: "Trigonometry", chapter: 2, chapterTitle: "Shapes & Space", order: 2, difficulty: "intermediate", notes: "Sine, cosine, tangent ratios, trigonometric identities, and applications." },
    { title: "Vectors", chapter: 2, chapterTitle: "Shapes & Space", order: 3, difficulty: "advanced", notes: "Vector addition, scalar multiplication, dot product, and position vectors." },
    // Chapter 3 – Data & Probability
    { title: "Statistics", chapter: 3, chapterTitle: "Data & Probability", order: 1, difficulty: "intermediate", notes: "Mean, median, mode, probability, and data representation." },
    { title: "Probability", chapter: 3, chapterTitle: "Data & Probability", order: 2, difficulty: "advanced", notes: "Conditional probability, independent events, tree diagrams, and combinatorics." },
    // Chapter 4 – Advanced Topics
    { title: "Sequences and Series", chapter: 4, chapterTitle: "Advanced Topics", order: 1, difficulty: "advanced", notes: "Arithmetic and geometric sequences, sum formulas, and convergence." },
    { title: "Matrices", chapter: 4, chapterTitle: "Advanced Topics", order: 2, difficulty: "advanced", notes: "Matrix operations, determinants, inverse matrices, and solving systems of equations." },
  ],
  "Physics": [
    // Chapter 1 – Forces & Motion
    { title: "Measurements and Units", chapter: 1, chapterTitle: "Forces & Motion", order: 1, difficulty: "beginner", notes: "SI units, measuring instruments, significant figures, and unit conversions." },
    { title: "Mechanics", chapter: 1, chapterTitle: "Forces & Motion", order: 2, difficulty: "beginner", notes: "Newton's laws of motion, forces, energy, and work." },
    { title: "Momentum and Impulse", chapter: 1, chapterTitle: "Forces & Motion", order: 3, difficulty: "intermediate", notes: "Conservation of momentum, collisions, impulse, and force-time graphs." },
    // Chapter 2 – Electric Circuits
    { title: "Electricity", chapter: 2, chapterTitle: "Electric Circuits", order: 1, difficulty: "intermediate", notes: "Current, voltage, resistance, Ohm's law, and circuits." },
    { title: "Electromagnetism", chapter: 2, chapterTitle: "Electric Circuits", order: 2, difficulty: "intermediate", notes: "Magnetic fields, electromagnetic induction, transformers, and motors." },
    { title: "Electrostatics", chapter: 2, chapterTitle: "Electric Circuits", order: 3, difficulty: "advanced", notes: "Coulomb's law, electric fields, potential difference, and capacitors." },
    // Chapter 3 – Light & Waves
    { title: "Optics", chapter: 3, chapterTitle: "Light & Waves", order: 1, difficulty: "intermediate", notes: "Reflection, refraction, lenses, and the electromagnetic spectrum." },
    { title: "Wave Motion", chapter: 3, chapterTitle: "Light & Waves", order: 2, difficulty: "advanced", notes: "Transverse and longitudinal waves, interference, diffraction, and standing waves." },
    { title: "Sound", chapter: 3, chapterTitle: "Light & Waves", order: 3, difficulty: "advanced", notes: "Sound wave properties, resonance, Doppler effect, and musical instruments." },
    // Chapter 4 – Thermal Physics
    { title: "Heat and Temperature", chapter: 4, chapterTitle: "Thermal Physics", order: 1, difficulty: "beginner", notes: "Temperature scales, thermal expansion, specific heat capacity, and latent heat." },
    { title: "Gas Laws", chapter: 4, chapterTitle: "Thermal Physics", order: 2, difficulty: "intermediate", notes: "Boyle's law, Charles's law, pressure law, and the ideal gas equation." },
  ],
  "Biology": [
    // Chapter 1 – The Cell
    { title: "Cell Biology", chapter: 1, chapterTitle: "The Cell", order: 1, difficulty: "beginner", notes: "Cell structure, organelles, mitosis, and meiosis." },
    { title: "Cell Transport", chapter: 1, chapterTitle: "The Cell", order: 2, difficulty: "beginner", notes: "Osmosis, diffusion, active transport, and membrane structure." },
    { title: "Enzymes", chapter: 1, chapterTitle: "The Cell", order: 3, difficulty: "intermediate", notes: "Enzyme structure, function, factors affecting enzyme activity, and specificity." },
    // Chapter 2 – Human Anatomy
    { title: "Human Body Systems", chapter: 2, chapterTitle: "Human Anatomy", order: 1, difficulty: "intermediate", notes: "Circulatory, respiratory, digestive, and nervous systems." },
    { title: "Reproduction", chapter: 2, chapterTitle: "Human Anatomy", order: 2, difficulty: "intermediate", notes: "Human reproductive system, menstrual cycle, fertilization, and fetal development." },
    { title: "Nutrition and Diet", chapter: 2, chapterTitle: "Human Anatomy", order: 3, difficulty: "beginner", notes: "Food groups, balanced diet, vitamins, minerals, and deficiency diseases." },
    // Chapter 3 – Environment & Life
    { title: "Ecology", chapter: 3, chapterTitle: "Environment & Life", order: 1, difficulty: "intermediate", notes: "Ecosystems, food chains, biodiversity, and conservation." },
    { title: "Classification of Living Things", chapter: 3, chapterTitle: "Environment & Life", order: 2, difficulty: "beginner", notes: "Kingdoms of life, binomial nomenclature, taxonomy, and dichotomous keys." },
    { title: "Evolution and Adaptation", chapter: 3, chapterTitle: "Environment & Life", order: 3, difficulty: "advanced", notes: "Natural selection, speciation, fossil evidence, and genetic variation." },
    // Chapter 4 – Genetics
    { title: "Heredity and Genetics", chapter: 4, chapterTitle: "Genetics", order: 1, difficulty: "advanced", notes: "Mendelian genetics, Punnett squares, genotype vs phenotype, and genetic disorders." },
    { title: "DNA and Protein Synthesis", chapter: 4, chapterTitle: "Genetics", order: 2, difficulty: "advanced", notes: "DNA structure, replication, transcription, translation, and mutations." },
  ],
  "English": [
    // Chapter 1 – Language Foundations
    { title: "Grammar", chapter: 1, chapterTitle: "Language Foundations", order: 1, difficulty: "beginner", notes: "Tenses, sentence structure, parts of speech, and punctuation." },
    { title: "Vocabulary Building", chapter: 1, chapterTitle: "Language Foundations", order: 2, difficulty: "beginner", notes: "Word roots, prefixes, suffixes, synonyms, antonyms, and context clues." },
    { title: "Sentence Construction", chapter: 1, chapterTitle: "Language Foundations", order: 3, difficulty: "intermediate", notes: "Simple, compound, and complex sentences, clauses, and conjunctions." },
    // Chapter 2 – Reading & Analysis
    { title: "Comprehension", chapter: 2, chapterTitle: "Reading & Analysis", order: 1, difficulty: "intermediate", notes: "Reading passages, inference, and summary writing." },
    { title: "Literary Analysis", chapter: 2, chapterTitle: "Reading & Analysis", order: 2, difficulty: "advanced", notes: "Themes, symbolism, character development, figurative language, and literary devices." },
    { title: "Poetry Appreciation", chapter: 2, chapterTitle: "Reading & Analysis", order: 3, difficulty: "advanced", notes: "Rhyme schemes, meter, imagery, tone, and analysis of selected poems." },
    // Chapter 3 – Written Expression
    { title: "Essay Writing", chapter: 3, chapterTitle: "Written Expression", order: 1, difficulty: "intermediate", notes: "Narrative, descriptive, and argumentative essay techniques." },
    { title: "Creative Writing", chapter: 3, chapterTitle: "Written Expression", order: 2, difficulty: "advanced", notes: "Short stories, dialogue writing, point of view, and descriptive techniques." },
    { title: "Formal Writing", chapter: 3, chapterTitle: "Written Expression", order: 3, difficulty: "intermediate", notes: "Letter writing, report writing, email etiquette, and professional tone." },
    // Chapter 4 – Oral Communication
    { title: "Speaking and Listening", chapter: 4, chapterTitle: "Oral Communication", order: 1, difficulty: "beginner", notes: "Pronunciation, public speaking, active listening, and group discussions." },
    { title: "Debate and Presentation", chapter: 4, chapterTitle: "Oral Communication", order: 2, difficulty: "advanced", notes: "Argumentation, persuasion techniques, structuring debates, and slide presentations." },
  ],
  "Chemistry": [
    // Chapter 1 – Matter & Atoms
    { title: "Introduction to Chemistry", chapter: 1, chapterTitle: "Matter & Atoms", order: 1, difficulty: "beginner", notes: "States of matter, physical vs chemical changes, and laboratory safety." },
    { title: "Atomic Structure", chapter: 1, chapterTitle: "Matter & Atoms", order: 2, difficulty: "beginner", notes: "Atoms, elements, periodic table, and electron configuration." },
    { title: "Chemical Bonding", chapter: 1, chapterTitle: "Matter & Atoms", order: 3, difficulty: "intermediate", notes: "Ionic, covalent, and metallic bonds, electronegativity, and Lewis structures." },
    // Chapter 2 – Reactions & Equations
    { title: "Chemical Reactions", chapter: 2, chapterTitle: "Reactions & Equations", order: 1, difficulty: "intermediate", notes: "Balancing equations, reaction types, and stoichiometry." },
    { title: "Acids, Bases, and Salts", chapter: 2, chapterTitle: "Reactions & Equations", order: 2, difficulty: "intermediate", notes: "pH scale, neutralization, indicators, and salt preparation." },
    { title: "Redox Reactions", chapter: 2, chapterTitle: "Reactions & Equations", order: 3, difficulty: "advanced", notes: "Oxidation states, half-equations, electrochemical cells, and electrolysis." },
    // Chapter 3 – Carbon Compounds
    { title: "Organic Chemistry", chapter: 3, chapterTitle: "Carbon Compounds", order: 1, difficulty: "advanced", notes: "Hydrocarbons, functional groups, and naming conventions." },
    { title: "Polymers and Plastics", chapter: 3, chapterTitle: "Carbon Compounds", order: 2, difficulty: "advanced", notes: "Addition and condensation polymerization, plastics, and environmental impact." },
    // Chapter 4 – Quantitative Chemistry
    { title: "The Mole Concept", chapter: 4, chapterTitle: "Quantitative Chemistry", order: 1, difficulty: "intermediate", notes: "Avogadro's number, molar mass, concentration, and dilution calculations." },
    { title: "Rates of Reaction", chapter: 4, chapterTitle: "Quantitative Chemistry", order: 2, difficulty: "advanced", notes: "Collision theory, factors affecting rate, catalysts, and energy profiles." },
    { title: "Energetics", chapter: 4, chapterTitle: "Quantitative Chemistry", order: 3, difficulty: "advanced", notes: "Exothermic and endothermic reactions, enthalpy changes, and Hess's law." },
  ],
  "Geography": [
    // Chapter 1 – Earth's Surface
    { title: "Physical Geography", chapter: 1, chapterTitle: "Earth's Surface", order: 1, difficulty: "beginner", notes: "Landforms, weathering, erosion, and plate tectonics." },
    { title: "Rocks and Minerals", chapter: 1, chapterTitle: "Earth's Surface", order: 2, difficulty: "beginner", notes: "Igneous, sedimentary, and metamorphic rocks, rock cycle, and mineral properties." },
    { title: "Plate Tectonics", chapter: 1, chapterTitle: "Earth's Surface", order: 3, difficulty: "intermediate", notes: "Tectonic plates, earthquakes, volcanoes, and continental drift." },
    // Chapter 2 – Atmosphere
    { title: "Climate and Weather", chapter: 2, chapterTitle: "Atmosphere", order: 1, difficulty: "intermediate", notes: "Atmospheric processes, climate zones, and weather patterns." },
    { title: "Water Cycle and Rivers", chapter: 2, chapterTitle: "Atmosphere", order: 2, difficulty: "beginner", notes: "Evaporation, condensation, precipitation, river features, and flooding." },
    { title: "Natural Disasters", chapter: 2, chapterTitle: "Atmosphere", order: 3, difficulty: "advanced", notes: "Hurricanes, tsunamis, droughts, and disaster preparedness." },
    // Chapter 3 – Spatial Skills
    { title: "Map Reading", chapter: 3, chapterTitle: "Spatial Skills", order: 1, difficulty: "beginner", notes: "Contour lines, grid references, scale, and compass directions." },
    { title: "GIS and Remote Sensing", chapter: 3, chapterTitle: "Spatial Skills", order: 2, difficulty: "advanced", notes: "Satellite imagery, GPS technology, data layers, and geographic analysis." },
    // Chapter 4 – Human Geography
    { title: "Population and Settlement", chapter: 4, chapterTitle: "Human Geography", order: 1, difficulty: "intermediate", notes: "Population growth, urbanization, migration, and demographic transition model." },
    { title: "Agriculture and Industry", chapter: 4, chapterTitle: "Human Geography", order: 2, difficulty: "intermediate", notes: "Farming systems, industrialization, trade, and economic development." },
    { title: "Environmental Management", chapter: 4, chapterTitle: "Human Geography", order: 3, difficulty: "advanced", notes: "Deforestation, climate change, sustainability, and conservation strategies." },
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

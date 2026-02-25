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
  { name: "Mathematics (Advanced)", level: "A-Level" },
  { name: "Physics (Advanced)", level: "A-Level" },
  { name: "Biology (Advanced)", level: "A-Level" },
  { name: "English (Advanced)", level: "A-Level" },
  { name: "Chemistry (Advanced)", level: "A-Level" },
];

const topicsBySubject = {
  "Mathematics": [
    // Chapter 1 – Numbers & Expressions
    {
      title: "Number Systems", chapter: 1, chapterTitle: "Numbers & Expressions", order: 1, difficulty: "beginner",
      notes: "Natural numbers, integers, rational and irrational numbers, and real number properties.",
      summary: ["Understand the different sets of numbers", "Classify numbers correctly", "Apply properties of real numbers"],
      content: [
        {
          heading: "Sets of Numbers",
          body: "Numbers are organized into sets based on their properties.\n\n- **Natural numbers (ℕ):** 1, 2, 3, …\n- **Whole numbers:** 0, 1, 2, 3, …\n- **Integers (ℤ):** …, −2, −1, 0, 1, 2, …\n- **Rational numbers (ℚ):** Numbers that can be expressed as a fraction p/q where q ≠ 0\n- **Irrational numbers:** Numbers that cannot be expressed as a simple fraction (e.g., √2, π)\n- **Real numbers (ℝ):** The union of rational and irrational numbers",
          examples: [
            { label: "Classifying Numbers", content: "Classify the number −7:\n\n−7 is an **integer** and a **rational number** (since −7 = −7/1). It is NOT a natural number or a whole number." },
            { label: "Identifying Irrationals", content: "Is √9 irrational?\n\n√9 = 3, which is a rational number. However, √5 ≈ 2.2360679… is irrational because it cannot be expressed as a fraction." }
          ]
        },
        {
          heading: "Properties of Real Numbers",
          body: "Real numbers follow several fundamental properties:\n\n| Property | Addition | Multiplication |\n|---|---|---|\n| Commutative | a + b = b + a | a × b = b × a |\n| Associative | (a + b) + c = a + (b + c) | (a × b) × c = a × (b × c) |\n| Identity | a + 0 = a | a × 1 = a |\n| Inverse | a + (−a) = 0 | a × (1/a) = 1, a ≠ 0 |\n| Distributive | a × (b + c) = a × b + a × c | |",
          examples: [
            { label: "Distributive Property", content: "Expand 3(x + 4):\n\n3(x + 4) = 3 × x + 3 × 4 = 3x + 12" }
          ]
        }
      ]
    },
    {
      title: "Algebra", chapter: 1, chapterTitle: "Numbers & Expressions", order: 2, difficulty: "beginner",
      notes: "Solving linear and quadratic equations, inequalities, and polynomials.",
      summary: ["Solve linear equations in one variable", "Factor and solve quadratic equations", "Work with inequalities and polynomials"],
      content: [
        {
          heading: "Linear Equations",
          body: "A linear equation is an equation of the first degree, meaning the variable is raised to the power of 1.\n\n**General form:** ax + b = 0\n\n**Steps to solve:**\n1. Simplify both sides of the equation\n2. Collect variable terms on one side\n3. Isolate the variable",
          examples: [
            { label: "Solving a Linear Equation", content: "Solve 2x + 5 = 13:\n\n2x + 5 = 13\n2x = 13 − 5\n2x = 8\nx = 4" },
            { label: "Equation with Variables on Both Sides", content: "Solve 3x − 2 = x + 6:\n\n3x − x = 6 + 2\n2x = 8\nx = 4" }
          ]
        },
        {
          heading: "Quadratic Equations",
          body: "A quadratic equation has the general form **ax² + bx + c = 0** where a ≠ 0.\n\n**Methods of solving:**\n- Factoring\n- Completing the square\n- Quadratic formula: x = (−b ± √(b² − 4ac)) / 2a",
          examples: [
            { label: "Solving by Factoring", content: "Solve x² − 5x + 6 = 0:\n\nFactor: (x − 2)(x − 3) = 0\n\nSo x = 2 or x = 3" },
            { label: "Using the Quadratic Formula", content: "Solve 2x² + 3x − 2 = 0:\n\na = 2, b = 3, c = −2\nx = (−3 ± √(9 + 16)) / 4\nx = (−3 ± 5) / 4\n\nx = 1/2 or x = −2" }
          ]
        },
        {
          heading: "Inequalities",
          body: "Inequalities are solved similarly to equations, but the inequality sign **reverses** when multiplying or dividing by a negative number.\n\n**Symbols:** < (less than), > (greater than), ≤ (less than or equal), ≥ (greater than or equal)",
          examples: [
            { label: "Solving an Inequality", content: "Solve −3x + 6 > 0:\n\n−3x > −6\nx < 2 (sign reverses!)\n\nSolution set: x ∈ (−∞, 2)" }
          ]
        }
      ]
    },
    { title: "Indices and Logarithms", chapter: 1, chapterTitle: "Numbers & Expressions", order: 3, difficulty: "intermediate",
      notes: "Laws of indices, logarithmic equations, and change of base.",
      summary: ["Apply laws of indices", "Convert between exponential and logarithmic form", "Use change of base formula"],
      content: [
        {
          heading: "Laws of Indices",
          body: "Indices (or exponents) follow these key rules:\n\n- aᵐ × aⁿ = aᵐ⁺ⁿ\n- aᵐ ÷ aⁿ = aᵐ⁻ⁿ\n- (aᵐ)ⁿ = aᵐⁿ\n- a⁰ = 1 (where a ≠ 0)\n- a⁻ⁿ = 1/aⁿ\n- a^(1/n) = ⁿ√a",
          examples: [
            { label: "Simplifying Expressions", content: "Simplify 2³ × 2⁴:\n\n2³ × 2⁴ = 2³⁺⁴ = 2⁷ = 128" }
          ]
        },
        {
          heading: "Logarithms",
          body: "A logarithm answers the question: \"To what power must the base be raised to get this number?\"\n\nIf aˣ = b, then log_a(b) = x\n\n**Key properties:**\n- log_a(mn) = log_a(m) + log_a(n)\n- log_a(m/n) = log_a(m) − log_a(n)\n- log_a(mⁿ) = n × log_a(m)\n- Change of base: log_a(b) = log_c(b) / log_c(a)",
          examples: [
            { label: "Evaluating Logarithms", content: "Find log₂(32):\n\n2ˣ = 32\n2ˣ = 2⁵\nx = 5\n\nSo log₂(32) = 5" }
          ]
        }
      ]
    },
    // Chapter 2 – Shapes & Space
    {
      title: "Geometry", chapter: 2, chapterTitle: "Shapes & Space", order: 1, difficulty: "intermediate",
      notes: "Properties of shapes, angles, circles, and coordinate geometry.",
      summary: ["Identify angle relationships", "Calculate areas and perimeters", "Use coordinate geometry formulas"],
      content: [
        {
          heading: "Angle Relationships",
          body: "When lines intersect, they create specific angle relationships:\n\n- **Complementary angles:** sum to 90°\n- **Supplementary angles:** sum to 180°\n- **Vertically opposite angles:** are equal\n- **Angles on a straight line:** sum to 180°\n- **Angles at a point:** sum to 360°",
          examples: [
            { label: "Finding an Angle", content: "Two supplementary angles are in the ratio 2:3. Find them.\n\nLet the angles be 2x and 3x.\n2x + 3x = 180°\n5x = 180°\nx = 36°\n\nThe angles are 72° and 108°." }
          ]
        },
        {
          heading: "Coordinate Geometry",
          body: "Key formulas for working with points on the Cartesian plane:\n\n- **Distance:** d = √((x₂−x₁)² + (y₂−y₁)²)\n- **Midpoint:** M = ((x₁+x₂)/2, (y₁+y₂)/2)\n- **Gradient (slope):** m = (y₂−y₁)/(x₂−x₁)\n- **Equation of a line:** y − y₁ = m(x − x₁)",
          examples: [
            { label: "Distance Between Points", content: "Find the distance between A(1, 2) and B(4, 6):\n\nd = √((4−1)² + (6−2)²)\nd = √(9 + 16) = √25 = 5 units" }
          ]
        }
      ]
    },
    { title: "Trigonometry", chapter: 2, chapterTitle: "Shapes & Space", order: 2, difficulty: "intermediate", notes: "Sine, cosine, tangent ratios, trigonometric identities, and applications.",
      summary: ["Use SOH-CAH-TOA for right triangles", "Apply trigonometric identities", "Solve real-world problems with trigonometry"],
      content: [
        {
          heading: "Trigonometric Ratios",
          body: "For a right-angled triangle with angle θ:\n\n- **sin θ** = Opposite / Hypotenuse\n- **cos θ** = Adjacent / Hypotenuse\n- **tan θ** = Opposite / Adjacent\n\nRemember: **SOH-CAH-TOA**",
          examples: [
            { label: "Finding a Side", content: "A right triangle has a hypotenuse of 10 cm and an angle of 30°. Find the opposite side.\n\nsin 30° = Opposite / 10\n0.5 = Opposite / 10\nOpposite = 5 cm" }
          ]
        }
      ]
    },
    { title: "Vectors", chapter: 2, chapterTitle: "Shapes & Space", order: 3, difficulty: "advanced", notes: "Vector addition, scalar multiplication, dot product, and position vectors." },
    // Chapter 3 – Data & Probability
    { title: "Statistics", chapter: 3, chapterTitle: "Data & Probability", order: 1, difficulty: "intermediate", notes: "Mean, median, mode, probability, and data representation.",
      summary: ["Calculate measures of central tendency", "Represent data using charts and graphs", "Interpret statistical results"],
      content: [
        {
          heading: "Measures of Central Tendency",
          body: "Three common ways to summarize a data set:\n\n- **Mean:** The average — sum of all values divided by the number of values\n- **Median:** The middle value when data is arranged in order\n- **Mode:** The value that appears most frequently",
          examples: [
            { label: "Calculating Mean, Median, Mode", content: "Data: 3, 5, 5, 7, 9, 11\n\n**Mean** = (3+5+5+7+9+11)/6 = 40/6 ≈ 6.67\n**Median** = (5+7)/2 = 6 (average of the 3rd and 4th values)\n**Mode** = 5 (appears twice)" }
          ]
        }
      ]
    },
    { title: "Probability", chapter: 3, chapterTitle: "Data & Probability", order: 2, difficulty: "advanced", notes: "Conditional probability, independent events, tree diagrams, and combinatorics." },
    // Chapter 4 – Advanced Topics
    { title: "Sequences and Series", chapter: 4, chapterTitle: "Advanced Topics", order: 1, difficulty: "advanced", notes: "Arithmetic and geometric sequences, sum formulas, and convergence." },
    { title: "Matrices", chapter: 4, chapterTitle: "Advanced Topics", order: 2, difficulty: "advanced", notes: "Matrix operations, determinants, inverse matrices, and solving systems of equations." },
  ],
  "Physics": [
    // Chapter 1 – Forces & Motion
    {
      title: "Measurements and Units", chapter: 1, chapterTitle: "Forces & Motion", order: 1, difficulty: "beginner",
      notes: "SI units, measuring instruments, significant figures, and unit conversions.",
      summary: ["Know the 7 SI base units", "Convert between units", "Use measuring instruments correctly"],
      content: [
        {
          heading: "SI Base Units",
          body: "The International System of Units (SI) defines seven base quantities:\n\n| Quantity | Unit | Symbol |\n|---|---|---|\n| Length | metre | m |\n| Mass | kilogram | kg |\n| Time | second | s |\n| Electric current | ampere | A |\n| Temperature | kelvin | K |\n| Amount of substance | mole | mol |\n| Luminous intensity | candela | cd |",
          examples: [
            { label: "Unit Conversion", content: "Convert 2.5 km to metres:\n\n2.5 km × 1000 m/km = 2500 m" }
          ]
        },
        {
          heading: "Significant Figures",
          body: "Rules for counting significant figures:\n\n1. All non-zero digits are significant\n2. Zeros between non-zero digits are significant\n3. Leading zeros are NOT significant\n4. Trailing zeros after a decimal point ARE significant",
          examples: [
            { label: "Counting Significant Figures", content: "0.00340 has **3** significant figures (3, 4, and the trailing 0).\n\n2050 has **3** significant figures (2, 0 between, and 5)." }
          ]
        }
      ]
    },
    {
      title: "Mechanics", chapter: 1, chapterTitle: "Forces & Motion", order: 2, difficulty: "beginner",
      notes: "Newton's laws of motion, forces, energy, and work.",
      summary: ["State and apply Newton's three laws", "Calculate force, work, and energy", "Understand the relationship between force and motion"],
      content: [
        {
          heading: "Newton's Laws of Motion",
          body: "**First Law (Inertia):** An object remains at rest or in uniform motion unless acted upon by a net external force.\n\n**Second Law:** The acceleration of an object is directly proportional to the net force and inversely proportional to its mass.\n\nF = ma (Force = mass × acceleration)\n\n**Third Law:** For every action, there is an equal and opposite reaction.",
          examples: [
            { label: "Applying Newton's Second Law", content: "A 5 kg object accelerates at 3 m/s². What is the net force?\n\nF = ma\nF = 5 × 3 = 15 N" },
            { label: "Third Law in Action", content: "When you push against a wall with 10 N of force, the wall pushes back on you with 10 N in the opposite direction." }
          ]
        },
        {
          heading: "Work and Energy",
          body: "**Work** is done when a force moves an object through a distance:\n\nW = F × d × cos θ\n\nwhere θ is the angle between force and displacement.\n\n**Kinetic Energy:** KE = ½mv²\n**Potential Energy:** PE = mgh\n\nThe **Work-Energy Theorem** states that the net work done equals the change in kinetic energy.",
          examples: [
            { label: "Calculating Work", content: "A force of 20 N pushes a box 5 m along the floor. How much work is done?\n\nW = F × d = 20 × 5 = 100 J" }
          ]
        }
      ]
    },
    { title: "Momentum and Impulse", chapter: 1, chapterTitle: "Forces & Motion", order: 3, difficulty: "intermediate", notes: "Conservation of momentum, collisions, impulse, and force-time graphs.",
      summary: ["Calculate momentum (p = mv)", "Apply conservation of momentum", "Understand impulse"],
      content: [
        {
          heading: "Momentum",
          body: "Momentum is the product of mass and velocity:\n\n**p = mv**\n\nMomentum is a vector quantity — it has both magnitude and direction.\n\n**Conservation of Momentum:** In a closed system (no external forces), the total momentum before a collision equals the total momentum after.",
          examples: [
            { label: "Conservation of Momentum", content: "A 2 kg ball moving at 3 m/s collides with a stationary 1 kg ball. After collision, the 2 kg ball moves at 1 m/s. Find the velocity of the 1 kg ball.\n\nBefore: (2×3) + (1×0) = 6 kg·m/s\nAfter: (2×1) + (1×v) = 6\n2 + v = 6\nv = 4 m/s" }
          ]
        }
      ]
    },
    // Chapter 2 – Electric Circuits
    {
      title: "Electricity", chapter: 2, chapterTitle: "Electric Circuits", order: 1, difficulty: "intermediate",
      notes: "Current, voltage, resistance, Ohm's law, and circuits.",
      summary: ["Define current, voltage, and resistance", "Apply Ohm's law", "Analyze series and parallel circuits"],
      content: [
        {
          heading: "Ohm's Law",
          body: "Ohm's law describes the relationship between voltage (V), current (I), and resistance (R):\n\n**V = IR**\n\n- **Voltage (V):** measured in volts (V)\n- **Current (I):** measured in amperes (A)\n- **Resistance (R):** measured in ohms (Ω)",
          examples: [
            { label: "Using Ohm's Law", content: "A 12 V battery is connected to a 4 Ω resistor. What is the current?\n\nI = V/R = 12/4 = 3 A" }
          ]
        },
        {
          heading: "Series and Parallel Circuits",
          body: "**Series Circuit:**\n- Components are connected end-to-end\n- Same current flows through all components\n- Total resistance: R_total = R₁ + R₂ + R₃ + …\n\n**Parallel Circuit:**\n- Components are connected across the same two points\n- Same voltage across each branch\n- Total resistance: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + …",
          examples: [
            { label: "Series Resistors", content: "Three resistors (2 Ω, 3 Ω, 5 Ω) in series:\n\nR_total = 2 + 3 + 5 = 10 Ω" },
            { label: "Parallel Resistors", content: "Two resistors (6 Ω and 3 Ω) in parallel:\n\n1/R_total = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2\nR_total = 2 Ω" }
          ]
        }
      ]
    },
    { title: "Electromagnetism", chapter: 2, chapterTitle: "Electric Circuits", order: 2, difficulty: "intermediate", notes: "Magnetic fields, electromagnetic induction, transformers, and motors." },
    { title: "Electrostatics", chapter: 2, chapterTitle: "Electric Circuits", order: 3, difficulty: "advanced", notes: "Coulomb's law, electric fields, potential difference, and capacitors." },
    // Chapter 3 – Light & Waves
    { title: "Optics", chapter: 3, chapterTitle: "Light & Waves", order: 1, difficulty: "intermediate", notes: "Reflection, refraction, lenses, and the electromagnetic spectrum.",
      summary: ["State laws of reflection and refraction", "Apply Snell's law", "Describe lens behavior"],
      content: [
        {
          heading: "Laws of Reflection",
          body: "When light reflects off a surface:\n\n1. The angle of incidence equals the angle of reflection (θᵢ = θᵣ)\n2. The incident ray, reflected ray, and normal all lie in the same plane",
          examples: []
        },
        {
          heading: "Refraction & Snell's Law",
          body: "Refraction occurs when light passes from one medium to another, changing speed and direction.\n\n**Snell's Law:** n₁ sin θ₁ = n₂ sin θ₂\n\nwhere n is the refractive index of each medium.",
          examples: [
            { label: "Applying Snell's Law", content: "Light travels from air (n=1.00) into glass (n=1.50) at an angle of 30°. Find the refracted angle.\n\n1.00 × sin 30° = 1.50 × sin θ₂\n0.5 = 1.50 × sin θ₂\nsin θ₂ = 0.333\nθ₂ ≈ 19.5°" }
          ]
        }
      ]
    },
    { title: "Wave Motion", chapter: 3, chapterTitle: "Light & Waves", order: 2, difficulty: "advanced", notes: "Transverse and longitudinal waves, interference, diffraction, and standing waves." },
    { title: "Sound", chapter: 3, chapterTitle: "Light & Waves", order: 3, difficulty: "advanced", notes: "Sound wave properties, resonance, Doppler effect, and musical instruments." },
    // Chapter 4 – Thermal Physics
    { title: "Heat and Temperature", chapter: 4, chapterTitle: "Thermal Physics", order: 1, difficulty: "beginner", notes: "Temperature scales, thermal expansion, specific heat capacity, and latent heat." },
    { title: "Gas Laws", chapter: 4, chapterTitle: "Thermal Physics", order: 2, difficulty: "intermediate", notes: "Boyle's law, Charles's law, pressure law, and the ideal gas equation." },
  ],
  "Biology": [
    // Chapter 1 – The Cell
    {
      title: "Cell Biology", chapter: 1, chapterTitle: "The Cell", order: 1, difficulty: "beginner",
      notes: "Cell structure, organelles, mitosis, and meiosis.",
      summary: ["Identify cell organelles and their functions", "Compare plant and animal cells", "Describe the stages of mitosis and meiosis"],
      content: [
        {
          heading: "Cell Structure",
          body: "All living organisms are made of cells. Cells are the basic units of life.\n\n**Key organelles:**\n- **Nucleus:** Contains DNA; controls cell activities\n- **Cell membrane:** Controls what enters and leaves the cell\n- **Cytoplasm:** Jelly-like substance where chemical reactions occur\n- **Mitochondria:** \"Powerhouse\" — site of aerobic respiration\n- **Ribosomes:** Site of protein synthesis\n- **Endoplasmic reticulum (ER):** Transport network within the cell",
          examples: [
            { label: "Plant vs Animal Cells", content: "Plant cells have three structures that animal cells lack:\n\n1. **Cell wall** — rigid outer layer made of cellulose\n2. **Chloroplasts** — contain chlorophyll for photosynthesis\n3. **Large central vacuole** — stores water and maintains turgor pressure" }
          ]
        },
        {
          heading: "Mitosis",
          body: "Mitosis is cell division that produces two genetically identical daughter cells. It is used for growth and repair.\n\n**Stages:**\n1. **Prophase:** Chromosomes condense; nuclear membrane breaks down\n2. **Metaphase:** Chromosomes line up at the cell's equator\n3. **Anaphase:** Chromatids are pulled to opposite poles\n4. **Telophase:** Nuclear membranes reform; cytoplasm divides",
          examples: [
            { label: "Remembering the Stages", content: "Use the mnemonic: **PMAT**\n\nP — Prophase\nM — Metaphase\nA — Anaphase\nT — Telophase" }
          ]
        }
      ]
    },
    { title: "Cell Transport", chapter: 1, chapterTitle: "The Cell", order: 2, difficulty: "beginner", notes: "Osmosis, diffusion, active transport, and membrane structure.",
      summary: ["Explain diffusion and osmosis", "Distinguish passive from active transport"],
      content: [
        {
          heading: "Diffusion and Osmosis",
          body: "**Diffusion** is the net movement of particles from an area of higher concentration to an area of lower concentration. No energy is required.\n\n**Osmosis** is a special case of diffusion — the movement of **water molecules** through a semi-permeable membrane from a dilute solution to a more concentrated one.",
          examples: [
            { label: "Osmosis in Action", content: "When you place a red blood cell in distilled water (hypotonic solution), water enters the cell by osmosis. The cell swells and may burst (lysis).\n\nIn a concentrated salt solution (hypertonic), water leaves the cell, causing it to shrink (crenation)." }
          ]
        }
      ]
    },
    { title: "Enzymes", chapter: 1, chapterTitle: "The Cell", order: 3, difficulty: "intermediate", notes: "Enzyme structure, function, factors affecting enzyme activity, and specificity." },
    // Chapter 2 – Human Anatomy
    {
      title: "Human Body Systems", chapter: 2, chapterTitle: "Human Anatomy", order: 1, difficulty: "intermediate",
      notes: "Circulatory, respiratory, digestive, and nervous systems.",
      summary: ["Describe the four major body systems", "Explain blood circulation", "Trace the path of food through the digestive system"],
      content: [
        {
          heading: "The Circulatory System",
          body: "The heart pumps blood through two circuits:\n\n- **Pulmonary circulation:** Heart → Lungs → Heart (picks up oxygen)\n- **Systemic circulation:** Heart → Body → Heart (delivers oxygen)\n\n**Components of blood:**\n- Red blood cells — carry oxygen (haemoglobin)\n- White blood cells — fight infection\n- Platelets — help clotting\n- Plasma — liquid that carries nutrients, hormones, and waste",
          examples: [
            { label: "Path of Blood", content: "Right atrium → Right ventricle → Pulmonary artery → Lungs → Pulmonary vein → Left atrium → Left ventricle → Aorta → Body" }
          ]
        },
        {
          heading: "The Digestive System",
          body: "Digestion breaks down food into nutrients the body can absorb.\n\n**The journey of food:**\n1. **Mouth:** Mechanical digestion (chewing) + chemical digestion (amylase in saliva)\n2. **Oesophagus:** Peristalsis pushes food to the stomach\n3. **Stomach:** Acid and pepsin break down proteins\n4. **Small intestine:** Most absorption occurs here; villi increase surface area\n5. **Large intestine:** Water absorption; formation of faeces",
          examples: []
        }
      ]
    },
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
    {
      title: "Grammar", chapter: 1, chapterTitle: "Language Foundations", order: 1, difficulty: "beginner",
      notes: "Tenses, sentence structure, parts of speech, and punctuation.",
      summary: ["Identify the eight parts of speech", "Use verb tenses correctly", "Apply punctuation rules"],
      content: [
        {
          heading: "Parts of Speech",
          body: "Every word in English belongs to one of eight categories:\n\n1. **Noun** — names a person, place, thing, or idea (e.g., *Kigali*, *student*)\n2. **Pronoun** — replaces a noun (e.g., *he*, *they*, *it*)\n3. **Verb** — expresses an action or state (e.g., *run*, *is*)\n4. **Adjective** — describes a noun (e.g., *tall*, *green*)\n5. **Adverb** — modifies a verb, adjective, or another adverb (e.g., *quickly*, *very*)\n6. **Preposition** — shows relationship (e.g., *in*, *on*, *between*)\n7. **Conjunction** — joins words or clauses (e.g., *and*, *but*, *because*)\n8. **Interjection** — expresses emotion (e.g., *Wow!*, *Ouch!*)",
          examples: [
            { label: "Identifying Parts of Speech", content: "\"The tall student quickly answered the difficult question.\"\n\n- The → article (adjective)\n- tall → **adjective**\n- student → **noun**\n- quickly → **adverb**\n- answered → **verb**\n- the → article\n- difficult → **adjective**\n- question → **noun**" }
          ]
        },
        {
          heading: "Verb Tenses",
          body: "English has three main time frames, each with four aspects:\n\n| | Simple | Continuous | Perfect | Perfect Continuous |\n|---|---|---|---|---|\n| **Past** | I walked | I was walking | I had walked | I had been walking |\n| **Present** | I walk | I am walking | I have walked | I have been walking |\n| **Future** | I will walk | I will be walking | I will have walked | I will have been walking |",
          examples: [
            { label: "Choosing the Right Tense", content: "\"By the time she arrived, I ______ (wait) for two hours.\"\n\n**Answer:** had been waiting (past perfect continuous — an action that was ongoing before another past action)" }
          ]
        }
      ]
    },
    { title: "Vocabulary Building", chapter: 1, chapterTitle: "Language Foundations", order: 2, difficulty: "beginner", notes: "Word roots, prefixes, suffixes, synonyms, antonyms, and context clues." },
    { title: "Sentence Construction", chapter: 1, chapterTitle: "Language Foundations", order: 3, difficulty: "intermediate", notes: "Simple, compound, and complex sentences, clauses, and conjunctions." },
    // Chapter 2 – Reading & Analysis
    { title: "Comprehension", chapter: 2, chapterTitle: "Reading & Analysis", order: 1, difficulty: "intermediate", notes: "Reading passages, inference, and summary writing." },
    { title: "Literary Analysis", chapter: 2, chapterTitle: "Reading & Analysis", order: 2, difficulty: "advanced", notes: "Themes, symbolism, character development, figurative language, and literary devices." },
    { title: "Poetry Appreciation", chapter: 2, chapterTitle: "Reading & Analysis", order: 3, difficulty: "advanced", notes: "Rhyme schemes, meter, imagery, tone, and analysis of selected poems." },
    // Chapter 3 – Written Expression
    {
      title: "Essay Writing", chapter: 3, chapterTitle: "Written Expression", order: 1, difficulty: "intermediate",
      notes: "Narrative, descriptive, and argumentative essay techniques.",
      summary: ["Structure an essay with introduction, body, and conclusion", "Write thesis statements", "Use linking words effectively"],
      content: [
        {
          heading: "Essay Structure",
          body: "Every good essay follows a clear structure:\n\n**1. Introduction**\n- Hook: grab the reader's attention\n- Background: give context\n- Thesis statement: state your main argument\n\n**2. Body Paragraphs** (typically 3)\n- Topic sentence → Supporting details → Explanation → Link to thesis\n\n**3. Conclusion**\n- Restate thesis (in different words)\n- Summarize main points\n- Final thought or call to action",
          examples: [
            { label: "Thesis Statement Examples", content: "**Weak:** \"Education is important.\"\n**Strong:** \"Investing in girls' education in Rwanda leads to improved health outcomes, economic growth, and stronger communities.\"" }
          ]
        },
        {
          heading: "Linking Words and Transitions",
          body: "Transitions connect ideas and improve flow:\n\n- **Adding:** furthermore, moreover, in addition, also\n- **Contrasting:** however, on the other hand, nevertheless, although\n- **Cause/Effect:** therefore, consequently, as a result, because\n- **Sequencing:** firstly, next, then, finally\n- **Concluding:** in conclusion, to summarize, overall, in short",
          examples: []
        }
      ]
    },
    { title: "Creative Writing", chapter: 3, chapterTitle: "Written Expression", order: 2, difficulty: "advanced", notes: "Short stories, dialogue writing, point of view, and descriptive techniques." },
    { title: "Formal Writing", chapter: 3, chapterTitle: "Written Expression", order: 3, difficulty: "intermediate", notes: "Letter writing, report writing, email etiquette, and professional tone." },
    // Chapter 4 – Oral Communication
    { title: "Speaking and Listening", chapter: 4, chapterTitle: "Oral Communication", order: 1, difficulty: "beginner", notes: "Pronunciation, public speaking, active listening, and group discussions." },
    { title: "Debate and Presentation", chapter: 4, chapterTitle: "Oral Communication", order: 2, difficulty: "advanced", notes: "Argumentation, persuasion techniques, structuring debates, and slide presentations." },
  ],
  "Chemistry": [
    // Chapter 1 – Matter & Atoms
    {
      title: "Introduction to Chemistry", chapter: 1, chapterTitle: "Matter & Atoms", order: 1, difficulty: "beginner",
      notes: "States of matter, physical vs chemical changes, and laboratory safety.",
      summary: ["Describe the three states of matter", "Distinguish physical from chemical changes", "Follow laboratory safety rules"],
      content: [
        {
          heading: "States of Matter",
          body: "Matter exists in three common states:\n\n| Property | Solid | Liquid | Gas |\n|---|---|---|---|\n| Shape | Fixed | Takes container | Fills container |\n| Volume | Fixed | Fixed | Fills container |\n| Particle arrangement | Regular, closely packed | Irregular, close | Random, far apart |\n| Particle movement | Vibrate in place | Slide over each other | Move freely at high speed |",
          examples: [
            { label: "Changes of State", content: "Ice (solid) → Water (liquid) → Steam (gas)\n\n- Melting: solid → liquid (absorbs heat)\n- Boiling: liquid → gas (absorbs heat)\n- Condensation: gas → liquid (releases heat)\n- Freezing: liquid → solid (releases heat)" }
          ]
        },
        {
          heading: "Physical vs Chemical Changes",
          body: "**Physical change:** No new substance is formed. The change is usually reversible.\n- Examples: melting ice, dissolving sugar, tearing paper\n\n**Chemical change:** A new substance is formed. Usually irreversible.\n- Examples: burning wood, rusting iron, cooking an egg\n\n**Signs of a chemical change:** colour change, gas production, temperature change, precipitate formation",
          examples: []
        }
      ]
    },
    {
      title: "Atomic Structure", chapter: 1, chapterTitle: "Matter & Atoms", order: 2, difficulty: "beginner",
      notes: "Atoms, elements, periodic table, and electron configuration.",
      summary: ["Describe the structure of an atom", "Read the periodic table", "Write electron configurations"],
      content: [
        {
          heading: "Structure of the Atom",
          body: "An atom consists of three sub-atomic particles:\n\n| Particle | Charge | Mass (amu) | Location |\n|---|---|---|---|\n| Proton | +1 | 1 | Nucleus |\n| Neutron | 0 | 1 | Nucleus |\n| Electron | −1 | ~0 | Electron shells |\n\n- **Atomic number (Z):** Number of protons\n- **Mass number (A):** Protons + Neutrons\n- **Isotopes:** Atoms of the same element with different numbers of neutrons",
          examples: [
            { label: "Reading the Periodic Table", content: "Carbon (C): Atomic number = 6, Mass number = 12\n\n- Protons: 6\n- Electrons: 6 (in a neutral atom)\n- Neutrons: 12 − 6 = 6" }
          ]
        },
        {
          heading: "Electron Configuration",
          body: "Electrons are arranged in energy levels (shells) around the nucleus.\n\n- **1st shell:** holds up to 2 electrons\n- **2nd shell:** holds up to 8 electrons\n- **3rd shell:** holds up to 8 electrons (at O-Level)\n\nElectrons fill the lowest energy level first.",
          examples: [
            { label: "Writing Electron Configurations", content: "Sodium (Na), atomic number 11:\n\nElectron configuration: 2, 8, 1\n\n- 1st shell: 2 electrons\n- 2nd shell: 8 electrons\n- 3rd shell: 1 electron\n\nSodium has 1 electron in its outer shell, making it very reactive." }
          ]
        }
      ]
    },
    { title: "Chemical Bonding", chapter: 1, chapterTitle: "Matter & Atoms", order: 3, difficulty: "intermediate", notes: "Ionic, covalent, and metallic bonds, electronegativity, and Lewis structures." },
    // Chapter 2 – Reactions & Equations
    {
      title: "Chemical Reactions", chapter: 2, chapterTitle: "Reactions & Equations", order: 1, difficulty: "intermediate",
      notes: "Balancing equations, reaction types, and stoichiometry.",
      summary: ["Balance chemical equations", "Identify reaction types", "Perform simple stoichiometric calculations"],
      content: [
        {
          heading: "Balancing Chemical Equations",
          body: "In a balanced equation, the number of atoms of each element must be the same on both sides. This reflects the **Law of Conservation of Mass**.\n\n**Steps:**\n1. Write the unbalanced equation\n2. Count atoms on each side\n3. Add coefficients to balance\n4. Check your work",
          examples: [
            { label: "Balancing an Equation", content: "Balance: H₂ + O₂ → H₂O\n\n- Unbalanced: H₂ + O₂ → H₂O (O is unbalanced: 2 vs 1)\n- Add coefficient: H₂ + O₂ → **2**H₂O (now O is balanced, but H: 2 vs 4)\n- Balance H: **2**H₂ + O₂ → 2H₂O\n- Check: H: 4=4 ✓ O: 2=2 ✓" }
          ]
        },
        {
          heading: "Types of Chemical Reactions",
          body: "Common reaction types:\n\n- **Combination:** A + B → AB\n- **Decomposition:** AB → A + B\n- **Single displacement:** A + BC → AC + B\n- **Double displacement:** AB + CD → AD + CB\n- **Combustion:** Fuel + O₂ → CO₂ + H₂O",
          examples: []
        }
      ]
    },
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
    {
      title: "Physical Geography", chapter: 1, chapterTitle: "Earth's Surface", order: 1, difficulty: "beginner",
      notes: "Landforms, weathering, erosion, and plate tectonics.",
      summary: ["Identify major landforms", "Explain weathering and erosion processes", "Understand how landscapes change over time"],
      content: [
        {
          heading: "Weathering",
          body: "Weathering is the breakdown of rocks in situ (without movement).\n\n**Physical (mechanical) weathering:**\n- Freeze-thaw: Water enters cracks, freezes, expands, and breaks the rock\n- Onion-skin: Repeated heating and cooling causes layers to peel off\n\n**Chemical weathering:**\n- Acid rain dissolves limestone (calcium carbonate)\n- Water reacts with minerals to form new, weaker compounds\n\n**Biological weathering:**\n- Plant roots grow into cracks and widen them\n- Burrowing animals break up rock",
          examples: [
            { label: "Rwandan Context", content: "In Rwanda, chemical weathering is common due to the tropical climate with high rainfall. The red laterite soils seen across the country are a result of intense chemical weathering of the underlying rock." }
          ]
        },
        {
          heading: "Erosion and Deposition",
          body: "**Erosion** is the wearing away and transport of rock material by agents:\n- **Rivers** — hydraulic action, abrasion, attrition, solution\n- **Wind** — deflation and abrasion in arid areas\n- **Glaciers** — plucking and abrasion\n- **Sea** — wave action on coastlines\n\n**Deposition** occurs when the agent of erosion loses energy and drops its load.",
          examples: []
        }
      ]
    },
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
  "Mathematics (Advanced)": [
    { title: "Algebra", chapter: 1, chapterTitle: "Algebra and Functions", order: 1, difficulty: "intermediate", notes: "Linear equations, quadratic functions, and polynomial operations." },
    { title: "Trigonometry", chapter: 1, chapterTitle: "Algebra and Functions", order: 2, difficulty: "intermediate", notes: "Trigonometric ratios, identities, and inverse functions." },
    { title: "Calculus", chapter: 1, chapterTitle: "Algebra and Functions", order: 3, difficulty: "advanced", notes: "Differentiation and integration of functions." },
  ],
  "Physics (Advanced)": [
    { title: "Mechanics", chapter: 1, chapterTitle: "Forces & Motion", order: 1, difficulty: "intermediate", notes: "Kinematics, dynamics, work, energy, and power." },
    { title: "Momentum and Impulse", chapter: 1, chapterTitle: "Forces & Motion", order: 2, difficulty: "intermediate", notes: "Conservation of momentum, collisions, impulse, and force-time graphs." },
    { title: "Electricity", chapter: 2, chapterTitle: "Electric Circuits", order: 1, difficulty: "intermediate", notes: "Current, voltage, resistance, Ohm's law, and circuits." },
    { title: "Electromagnetism", chapter: 2, chapterTitle: "Electric Circuits", order: 2, difficulty: "intermediate", notes: "Magnetic fields, electromagnetic induction, transformers, and motors." },
    { title: "Electrostatics", chapter: 2, chapterTitle: "Electric Circuits", order: 3, difficulty: "advanced", notes: "Coulomb's law, electric fields, potential difference, and capacitors." },
    { title: "Optics", chapter: 3, chapterTitle: "Light & Waves", order: 1, difficulty: "intermediate", notes: "Reflection, refraction, lenses, and the electromagnetic spectrum." },
    { title: "Wave Motion", chapter: 3, chapterTitle: "Light & Waves", order: 2, difficulty: "advanced", notes: "Transverse and longitudinal waves, interference, diffraction, and standing waves." },
    { title: "Sound", chapter: 3, chapterTitle: "Light & Waves", order: 3, difficulty: "advanced", notes: "Sound wave properties, resonance, Doppler effect, and musical instruments." },
    { title: "Heat and Temperature", chapter: 4, chapterTitle: "Thermal Physics", order: 1, difficulty: "beginner", notes: "Temperature scales, thermal expansion, specific heat capacity, and latent heat." },
    { title: "Gas Laws", chapter: 4, chapterTitle: "Thermal Physics", order: 2, difficulty: "intermediate", notes: "Boyle's law, Charles's law, pressure law, and the ideal gas equation." },
  ],
  "Biology (Advanced)": [
    { title: "Cell Biology", chapter: 1, chapterTitle: "The Cell", order: 1, difficulty: "beginner", notes: "Cell structure, organelles, mitosis, and meiosis." },
    { title: "Cell Transport", chapter: 1, chapterTitle: "The Cell", order: 2, difficulty: "beginner", notes: "Osmosis, diffusion, active transport, and membrane structure." },
    { title: "Enzymes", chapter: 1, chapterTitle: "The Cell", order: 3, difficulty: "intermediate", notes: "Enzyme structure, function, factors affecting enzyme activity, and specificity." },
    { title: "Human Body Systems", chapter: 2, chapterTitle: "Human Anatomy", order: 1, difficulty: "intermediate", notes: "Circulatory, respiratory, digestive, and nervous systems." },
    { title: "Reproduction", chapter: 2, chapterTitle: "Human Anatomy", order: 2, difficulty: "intermediate", notes: "Human reproductive system, menstrual cycle, fertilization, and fetal development." },
    { title: "Nutrition and Diet", chapter: 2, chapterTitle: "Human Anatomy", order: 3, difficulty: "beginner", notes: "Food groups, balanced diet, vitamins, minerals, and deficiency diseases." },
    { title: "Ecology", chapter: 3, chapterTitle: "Environment & Life", order: 1, difficulty: "intermediate", notes: "Ecosystems, food chains, biodiversity, and conservation." },
    { title: "Classification of Living Things", chapter: 3, chapterTitle: "Environment & Life", order: 2, difficulty: "beginner", notes: "Kingdoms of life, binomial nomenclature, taxonomy, and dichotomous keys." },
    { title: "Evolution and Adaptation", chapter: 3, chapterTitle: "Environment & Life", order: 3, difficulty: "advanced", notes: "Natural selection, speciation, fossil evidence, and genetic variation." },
    { title: "Heredity and Genetics", chapter: 4, chapterTitle: "Genetics", order: 1, difficulty: "advanced", notes: "Mendelian genetics, Punnett squares, genotype vs phenotype, and genetic disorders." },
    { title: "DNA and Protein Synthesis", chapter: 4, chapterTitle: "Genetics", order: 2, difficulty: "advanced", notes: "DNA structure, replication, transcription, translation, and mutations." },
  ],
  "English (Advanced)": [
    { title: "Grammar", chapter: 1, chapterTitle: "Language Foundations", order: 1, difficulty: "beginner", notes: "Tenses, sentence structure, parts of speech, and punctuation." },
    { title: "Vocabulary Building", chapter: 1, chapterTitle: "Language Foundations", order: 2, difficulty: "beginner", notes: "Word roots, prefixes, suffixes, synonyms, antonyms, and context clues." },
    { title: "Sentence Construction", chapter: 1, chapterTitle: "Language Foundations", order: 3, difficulty: "intermediate", notes: "Simple, compound, and complex sentences, clauses, and conjunctions." },
    { title: "Comprehension", chapter: 2, chapterTitle: "Reading & Analysis", order: 1, difficulty: "intermediate", notes: "Reading passages, inference, and summary writing." },
    { title: "Literary Analysis", chapter: 2, chapterTitle: "Reading & Analysis", order: 2, difficulty: "advanced", notes: "Themes, symbolism, character development, figurative language, and literary devices." },
    { title: "Poetry Appreciation", chapter: 2, chapterTitle: "Reading & Analysis", order: 3, difficulty: "advanced", notes: "Rhyme schemes, meter, imagery, tone, and analysis of selected poems." },
    { title: "Essay Writing", chapter: 3, chapterTitle: "Written Expression", order: 1, difficulty: "intermediate", notes: "Narrative, descriptive, and argumentative essay techniques." },
    { title: "Creative Writing", chapter: 3, chapterTitle: "Written Expression", order: 2, difficulty: "advanced", notes: "Short stories, dialogue writing, point of view, and descriptive techniques." },
    { title: "Formal Writing", chapter: 3, chapterTitle: "Written Expression", order: 3, difficulty: "intermediate", notes: "Letter writing, report writing, email etiquette, and professional tone." },
    { title: "Speaking and Listening", chapter: 4, chapterTitle: "Oral Communication", order: 1, difficulty: "beginner", notes: "Pronunciation, public speaking, active listening, and group discussions." },
    { title: "Debate and Presentation", chapter: 4, chapterTitle: "Oral Communication", order: 2, difficulty: "advanced", notes: "Argumentation, persuasion techniques, structuring debates, and slide presentations." },
  ],
  "Chemistry (Advanced)": [
    { title: "Introduction to Chemistry", chapter: 1, chapterTitle: "Matter & Atoms", order: 1, difficulty: "beginner", notes: "States of matter, physical vs chemical changes, and laboratory safety." },
    { title: "Atomic Structure", chapter: 1, chapterTitle: "Matter & Atoms", order: 2, difficulty: "beginner", notes: "Atoms, elements, periodic table, and electron configuration." },
    { title: "Chemical Bonding", chapter: 1, chapterTitle: "Matter & Atoms", order: 3, difficulty: "intermediate", notes: "Ionic, covalent, and metallic bonds, electronegativity, and Lewis structures." },
    { title: "Chemical Reactions", chapter: 2, chapterTitle: "Reactions & Equations", order: 1, difficulty: "intermediate", notes: "Balancing equations, reaction types, and stoichiometry." },
    { title: "Acids, Bases, and Salts", chapter: 2, chapterTitle: "Reactions & Equations", order: 2, difficulty: "intermediate", notes: "pH scale, neutralization, indicators, and salt preparation." },
    { title: "Redox Reactions", chapter: 2, chapterTitle: "Reactions & Equations", order: 3, difficulty: "advanced", notes: "Oxidation states, half-equations, electrochemical cells, and electrolysis." },
    { title: "Organic Chemistry", chapter: 3, chapterTitle: "Carbon Compounds", order: 1, difficulty: "advanced", notes: "Hydrocarbons, functional groups, and naming conventions." },
    { title: "Polymers and Plastics", chapter: 3, chapterTitle: "Carbon Compounds", order: 2, difficulty: "advanced", notes: "Addition and condensation polymerization, plastics, and environmental impact." },
    { title: "The Mole Concept", chapter: 4, chapterTitle: "Quantitative Chemistry", order: 1, difficulty: "intermediate", notes: "Avogadro's number, molar mass, concentration, and dilution calculations." },
    { title: "Rates of Reaction", chapter: 4, chapterTitle: "Quantitative Chemistry", order: 2, difficulty: "advanced", notes: "Collision theory, factors affecting rate, catalysts, and energy profiles." },
    { title: "Energetics", chapter: 4, chapterTitle: "Quantitative Chemistry", order: 3, difficulty: "advanced", notes: "Exothermic and endothermic reactions, enthalpy changes, and Hess's law." },
  ]
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

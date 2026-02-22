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
    { title: "Algebra", notes: "Solving linear and quadratic equations, inequalities, and polynomials." },
    { title: "Geometry", notes: "Properties of shapes, angles, circles, and coordinate geometry." },
    { title: "Statistics", notes: "Mean, median, mode, probability, and data representation." },
  ],
  "Physics": [
    { title: "Mechanics", notes: "Newton's laws of motion, forces, energy, and work." },
    { title: "Electricity", notes: "Current, voltage, resistance, Ohm's law, and circuits." },
    { title: "Optics", notes: "Reflection, refraction, lenses, and the electromagnetic spectrum." },
  ],
  "Biology": [
    { title: "Cell Biology", notes: "Cell structure, organelles, mitosis, and meiosis." },
    { title: "Human Body Systems", notes: "Circulatory, respiratory, digestive, and nervous systems." },
    { title: "Ecology", notes: "Ecosystems, food chains, biodiversity, and conservation." },
  ],
  "English": [
    { title: "Grammar", notes: "Tenses, sentence structure, parts of speech, and punctuation." },
    { title: "Comprehension", notes: "Reading passages, inference, and summary writing." },
    { title: "Essay Writing", notes: "Narrative, descriptive, and argumentative essay techniques." },
  ],
  "Chemistry": [
    { title: "Atomic Structure", notes: "Atoms, elements, periodic table, and electron configuration." },
    { title: "Chemical Reactions", notes: "Balancing equations, reaction types, and stoichiometry." },
    { title: "Organic Chemistry", notes: "Hydrocarbons, functional groups, and naming conventions." },
  ],
  "Geography": [
    { title: "Physical Geography", notes: "Landforms, weathering, erosion, and plate tectonics." },
    { title: "Climate and Weather", notes: "Atmospheric processes, climate zones, and weather patterns." },
    { title: "Map Reading", notes: "Contour lines, grid references, scale, and compass directions." },
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

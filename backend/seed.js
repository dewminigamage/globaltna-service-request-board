require('dotenv').config();
const mongoose = require('mongoose');
const JobRequest = require('./models/JobRequest');

const SAMPLE_JOBS = [
  {
    title: 'Leaking kitchen tap needs fixing',
    description: 'The kitchen tap has been dripping constantly for about a week. Washer probably needs replacing. Would prefer someone to come in the morning.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Sarah Mackenzie',
    contactEmail: 'sarah.mackenzie@example.com',
    status: 'Open',
  },
  {
    title: 'Bathroom light not working — fuse issue?',
    description: 'The main bathroom ceiling light stopped working after a power cut. Fuse box checked but not sure what the issue is. Could be the fitting itself.',
    category: 'Electrical',
    location: 'Edinburgh',
    contactName: 'James Robertson',
    contactEmail: 'james.r@example.com',
    status: 'Open',
  },
  {
    title: 'Living room and hallway repaint',
    description: 'Looking for someone to repaint the living room and hallway. Walls are magnolia at the moment, want to go to a light grey. Two coats needed.',
    category: 'Painting',
    location: 'Aberdeen',
    contactName: 'Carol Hughes',
    contactEmail: 'carol.h@example.com',
    status: 'In Progress',
  },
  {
    title: 'Garden shed door repair',
    description: 'The garden shed door has warped and does not close properly. Looking for a joiner to either fix or replace the door and frame.',
    category: 'Joinery',
    location: 'Dundee',
    contactName: 'Peter Walsh',
    contactEmail: 'p.walsh@example.com',
    status: 'Open',
  },
  {
    title: 'Boiler pressure keeps dropping',
    description: 'Combi boiler loses pressure every few days. I re-pressurise manually but it drops again. Suspect a small leak somewhere in the system.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Liam Campbell',
    contactEmail: 'liam.campbell@example.com',
    status: 'Open',
  },
  {
    title: 'Install 3 external plug sockets in garage',
    description: 'Need three weatherproof plug sockets installed in the garage for workshop equipment. Existing consumer unit has spare capacity.',
    category: 'Electrical',
    location: 'Stirling',
    contactName: 'Fiona Baxter',
    contactEmail: 'f.baxter@example.com',
    status: 'Closed',
  },
  {
    title: 'Kitchen cupboard doors rehang',
    description: 'Several kitchen cupboard doors are misaligned and two hinges have snapped. Need a joiner to rehang the doors and replace any broken hardware.',
    category: 'Joinery',
    location: 'Inverness',
    contactName: 'Angus Murray',
    contactEmail: 'angus.m@example.com',
    status: 'Open',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await JobRequest.deleteMany({});
  console.log('Cleared existing jobs');

  const inserted = await JobRequest.insertMany(SAMPLE_JOBS);
  console.log(`Seeded ${inserted.length} jobs successfully`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});

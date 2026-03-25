const knowledgeBase = {
  institution: {
    name: "Belgium Campus iTversity",
    country: "South Africa",
    campuses: ["Pretoria", "Kempton Park", "Stellenbosch"]
  },

  qualifications: {
    diplomaIT: {
      name: "Diploma in Information Technology",
      nqfLevel: 6,
      duration: "3 years",
      credits: 360,
      admission: [
        "National Senior Certificate endorsed for a Diploma"
      ],
      notes: [
        "Good option for students who want a shorter, more affordable IT qualification",
        "Focused on practical and vocational IT skills"
      ],
      careers: [
        "Junior software developer",
        "Support technician",
        "Systems support",
        "Entry-level infrastructure roles"
      ]
    },

    bachelorIT: {
      name: "Bachelor of Information Technology",
      nqfLevel: 7,
      duration: "3 years",
      credits: 360,
      admission: [
        "National Senior Certificate endorsed for a Degree",
        "50% or more for English",
        "50% or more for pure Mathematics",
        "If Mathematics is below requirement, a Mathematics Bridging Course may be used",
        "Bridging requirement for BIT: 50%"
      ],
      notes: [
        "Suitable for students wanting a broader bachelor-level IT qualification",
        "Strong pathway into software development and related IT careers"
      ],
      careers: [
        "Software developer",
        "Web developer",
        "Business systems roles",
        "General IT professional roles"
      ]
    },

    bachelorComputing: {
      name: "Bachelor of Computing",
      nqfLevel: 8,
      duration: "3 years academic + 1 year workplace training",
      credits: 506,
      specialisations: [
        "Data Science",
        "Software Engineering"
      ],
      admission: [
        "National Senior Certificate endorsed for a Degree",
        "50% or more for English",
        "50% or more for pure Mathematics",
        "If Mathematics is below requirement, a Mathematics Bridging Course may be used",
        "Bridging requirement for BComp: 70%"
      ],
      notes: [
        "More advanced and technical qualification",
        "Includes a workplace training year",
        "Good for students who enjoy analytical thinking, mathematics, and complex systems"
      ],
      careers: [
        "Software engineer",
        "Data scientist",
        "Machine learning specialist",
        "AI-related roles"
      ]
    }
  },

  subjectGuidance: {
    mathsVsMathLit: {
      maths: [
        "Pure Mathematics is important for degree-level IT entry at Belgium Campus",
        "It keeps more options open, especially for BIT and Bachelor of Computing"
      ],
      mathLit: [
        "Math Literacy is usually more limiting for degree entry",
        "Students may need to look at diploma routes or bridging options depending on requirements"
      ],
      bridgingCourse: {
  description: [
    "A Mathematics bridging course is offered to students who do not meet the required Mathematics marks for degree programmes.",
    "It helps improve mathematical skills needed for IT studies."
  ],
  requirements: [
    "For Bachelor of IT (BIT): Minimum 50% in the bridging course",
    "For Bachelor of Computing (BComp): Minimum 70% in the bridging course"
  ],
  purpose: [
    "Allows students without sufficient Maths marks to still qualify for degree programmes",
    "Strengthens logical thinking and problem-solving skills"
  ]
}
    }
  },

  faqStyle: {
    tone: "Clear, supportive, and student-friendly",
    audience: "South African matric students interested in IT at Belgium Campus"
  }
};

module.exports = knowledgeBase;
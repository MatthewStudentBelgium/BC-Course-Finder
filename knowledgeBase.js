const knowledgeBase = {
  institution: {
    name: "Belgium Campus iTversity",
    country: "South Africa",
    type: "Private higher education institution focused on IT",
    registration:
      "Belgium Campus ITversity 1 NPC is registered with the Department of Higher Education and Training as a private higher education institution under the Higher Education Act, 1997. Registration Certificate No 2003/HE08/001.",
    campuses: [
      {
        name: "Pretoria Campus",
        note: "Main contact and study campus for full-time and selected part-time offerings."
      },
      {
        name: "Kempton Park Campus",
        note: "Study campus listed for selected Belgium Campus qualifications."
      },
      {
        name: "Stellenbosch Campus",
        note: "Study campus listed by Belgium Campus for selected offerings and student support."
      }
    ],
    intakes: ["January", "May", "July", "September"],
    website: "https://www.belgiumcampus.ac.za/",
    email: "info@belgiumcampus.ac.za"
  },

  apsGuidance: {
    disclaimer:
      "Belgium Campus admission is based mainly on NSC endorsement, English, Mathematics and programme rules. APS results in this app are a local guidance tool and final admission must be confirmed by Belgium Campus.",
    pointsScale: [
      { min: 80, max: 100, points: 7 },
      { min: 70, max: 79, points: 6 },
      { min: 60, max: 69, points: 5 },
      { min: 50, max: 59, points: 4 },
      { min: 40, max: 49, points: 3 },
      { min: 30, max: 39, points: 2 },
      { min: 0, max: 29, points: 1 }
    ],
    generalNscGuide: [
      "A Bachelor pass is usually needed for degree programmes.",
      "A Diploma pass is usually needed for diploma programmes.",
      "APS is useful for guidance, but subject requirements still matter."
    ]
  },

  qualifications: {
    diplomaIT: {
      name: "Diploma in Information Technology",
      shortName: "Diploma in IT",
      nqfLevel: 6,
      duration: "3 years",
      credits: 360,
      saqaId: "Not listed in this local data",
      locations: ["Pretoria", "Kempton Park", "Stellenbosch"],
      apsGuide: 19,
      endorsementRequired: "Diploma",
      admission: [
        "National Senior Certificate endorsed for Diploma study",
        "NSC or equivalent qualification",
        "English is required",
        "Mathematics or Mathematical Literacy can strengthen readiness for IT studies"
      ],
      notes: [
        "Good route for students who want a practical IT qualification",
        "Focused on vocational and industry-relevant IT skills",
        "Can support entry into junior technical, development and support roles"
      ],
      careers: [
        "Junior software developer",
        "Web developer",
        "Computer programmer",
        "System support technician",
        "Computer systems analyst",
        "Junior project support"
      ]
    },

    bachelorIT: {
      name: "Bachelor of Information Technology",
      shortName: "BIT",
      nqfLevel: 7,
      duration: "3 years academic",
      credits: 360,
      saqaId: "94121",
      locations: ["Pretoria", "Kempton Park"],
      apsGuide: 23,
      endorsementRequired: "Bachelor",
      admission: [
        "National Senior Certificate endorsed for Degree study",
        "50% or more for English",
        "50% or more for pure Mathematics",
        "If pure Mathematics is below 50%, the Mathematics Bridging Course may be used",
        "Required bridging result for BIT: 50%"
      ],
      notes: [
        "Broad bachelor-level IT qualification",
        "Covers software engineering, business intelligence, networks, AI and intelligent systems",
        "Suitable for students who want a strong professional IT career path"
      ],
      careers: [
        "Software developer",
        "Web or mobile app developer",
        "Business intelligence developer",
        "Systems analyst",
        "Database developer",
        "IT entrepreneur"
      ]
    },

    bachelorComputing: {
      name: "Bachelor of Computing",
      shortName: "BComp",
      nqfLevel: 8,
      duration: "3 years academic + 1 workplace training year",
      credits: 506,
      saqaId: "62689",
      locations: ["Pretoria", "Kempton Park", "Stellenbosch"],
      apsGuide: 26,
      endorsementRequired: "Bachelor",
      specialisations: ["Data Science", "Software Engineering"],
      admission: [
        "National Senior Certificate endorsed for Degree study",
        "50% or more for English",
        "50% or more for pure Mathematics",
        "If pure Mathematics is below 50%, the Mathematics Bridging Course may be used",
        "Required bridging result for BComp: 70%"
      ],
      notes: [
        "Advanced computing qualification with a stronger technical and analytical focus",
        "Includes workplace training",
        "Good for students who enjoy mathematics, problem solving, software engineering and data"
      ],
      careers: [
        "Software engineer",
        "Data scientist",
        "Machine learning specialist",
        "AI-related developer",
        "Systems architect",
        "Research and development technologist"
      ]
    }
  },

  subjectGuidance: {
    mathsVsMathLit: {
      maths: [
        "Pure Mathematics keeps degree options open at Belgium Campus.",
        "Degree programmes require 50% or more for pure Mathematics, or successful completion of the Mathematics Bridging Course."
      ],
      mathLit: [
        "Mathematical Literacy is more limiting for degree entry.",
        "Students with Mathematical Literacy should ask Belgium Campus about diploma routes and bridging options."
      ],
      bridgingCourse: {
        description: [
          "The Mathematics Bridging Course supports students who do not meet the Mathematics mark required for degree programmes.",
          "Students must meet the required bridging result before they are granted entry to the relevant degree."
        ],
        requirements: [
          "Bachelor of Information Technology: minimum 50% in the bridging course",
          "Bachelor of Computing: minimum 70% in the bridging course"
        ],
        purpose: [
          "Builds mathematical skills needed for IT studies",
          "Strengthens logic, problem solving and technical readiness"
        ]
      }
    }
  },

  studentSupport: {
    applicationDocuments: [
      "Copy of ID",
      "Final Grade 11 results",
      "National Senior Certificate when available",
      "ID copy for the person responsible for the account",
      "Medical aid details, if applicable"
    ],
    advice: [
      "Apply early because classes depend on availability.",
      "Confirm programme choice with the admissions team.",
      "Use the CourseFinder chat for guidance, then verify final admission with Belgium Campus."
    ]
  },

  faqStyle: {
    tone: "Clear, supportive, and student-friendly",
    audience: "South African matric students interested in IT at Belgium Campus"
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = knowledgeBase;
}

if (typeof window !== "undefined") {
  window.BC_KNOWLEDGE_BASE = knowledgeBase;
}

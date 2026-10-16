import { SyllabusExamTrack } from '../types/learningHub';

export const COMPREHENSIVE_SYLLABUS_TRACKS: SyllabusExamTrack[] = [
  // =========================================================================
  // ENGINEERING
  // =========================================================================
  {
    id: 'syllabus-jee-main',
    name: 'JEE Main',
    abbreviation: 'JEE Main',
    fullName: 'Joint Entrance Examination (Main) - National Testing Agency',
    category: 'Engineering',
    year: '2026',
    description: 'National entrance examination for admission to NITs, IIITs, and eligibility for JEE Advanced.',
    officialExamDate: '2026-01-22',
    isOfficialDateAnnounced: true,
    verifiedOfficialSource: 'National Testing Agency (NTA) Official Information Bulletin',
    variants: [
      { id: 'paper-1-be-btech', name: 'Paper 1 (B.E. / B.Tech)', description: 'Physics, Chemistry & Mathematics' },
      { id: 'paper-2a-barch', name: 'Paper 2A (B.Arch)', description: 'Maths, Aptitude Test & Drawing' },
      { id: 'paper-2b-bplan', name: 'Paper 2B (B.Planning)', description: 'Maths, Aptitude Test & Planning' }
    ],
    stages: ['Main Paper 1'],
    subjects: [
      {
        id: 'jee-main-phy',
        name: 'Physics',
        chapters: [
          {
            id: 'jmp-ch1',
            name: 'Physics and Measurement',
            weightage: 'Medium',
            expectedQuestions: '1-2 Questions',
            topics: [
              { id: 'jmp-t1', name: 'Units, Dimensions and Dimensional Analysis', status: 'not_started', estimatedMinutes: 60 },
              { id: 'jmp-t2', name: 'Errors in Measurement and Significant Figures', status: 'not_started', estimatedMinutes: 60 }
            ]
          },
          {
            id: 'jmp-ch2',
            name: 'Kinematics',
            weightage: 'High',
            expectedQuestions: '2-3 Questions',
            topics: [
              { id: 'jmp-t3', name: 'Motion in a Straight Line & Relative Velocity', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmp-t4', name: 'Projectile Motion and Vector Analysis', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmp-t5', name: 'Uniform and Non-uniform Circular Motion', status: 'not_started', estimatedMinutes: 75 }
            ]
          },
          {
            id: 'jmp-ch3',
            name: 'Laws of Motion',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'jmp-t6', name: "Newton's Laws & Free Body Diagrams (FBD)", status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmp-t7', name: 'Static and Kinetic Friction & Banking of Roads', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'jmp-ch4',
            name: 'Work, Energy and Power',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'jmp-t8', name: 'Work-Energy Theorem & Conservative Forces', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmp-t9', name: 'Elastic and Inelastic Collisions in 1D & 2D', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'jmp-ch5',
            name: 'Rotational Motion',
            weightage: 'High',
            expectedQuestions: '2-3 Questions',
            topics: [
              { id: 'jmp-t10', name: 'Centre of Mass & Conservation of Linear Momentum', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmp-t11', name: 'Moment of Inertia Theorems & Radius of Gyration', status: 'not_started', estimatedMinutes: 100 },
              { id: 'jmp-t12', name: 'Torque, Angular Momentum and Pure Rolling', status: 'not_started', estimatedMinutes: 120 }
            ]
          },
          {
            id: 'jmp-ch6',
            name: 'Gravitation',
            weightage: 'Medium',
            expectedQuestions: '1-2 Questions',
            topics: [
              { id: 'jmp-t13', name: "Kepler's Laws & Gravitational Potential Energy", status: 'not_started', estimatedMinutes: 75 },
              { id: 'jmp-t14', name: 'Escape Velocity and Orbital Velocity of Satellites', status: 'not_started', estimatedMinutes: 60 }
            ]
          },
          {
            id: 'jmp-ch7',
            name: 'Thermodynamics & Kinetic Theory',
            weightage: 'High',
            expectedQuestions: '2-3 Questions',
            topics: [
              { id: 'jmp-t15', name: 'First & Second Laws of Thermodynamics, Carnot Engine', status: 'not_started', estimatedMinutes: 100 },
              { id: 'jmp-t16', name: 'Specific Heats of Gases & Kinetic Theory Postulates', status: 'not_started', estimatedMinutes: 75 }
            ]
          },
          {
            id: 'jmp-ch8',
            name: 'Electrostatics',
            weightage: 'High',
            expectedQuestions: '3 Questions',
            topics: [
              { id: 'jmp-t17', name: "Coulomb's Law, Electric Field and Dipoles", status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmp-t18', name: "Gauss's Law and Continuous Charge Distributions", status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmp-t19', name: 'Capacitance, Dielectric Polarisation & Energy Stored', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'jmp-ch9',
            name: 'Current Electricity',
            weightage: 'High',
            expectedQuestions: '2-3 Questions',
            topics: [
              { id: 'jmp-t20', name: "Drift Velocity, Ohm's Law and Resistivity Temperature Dependency", status: 'not_started', estimatedMinutes: 75 },
              { id: 'jmp-t21', name: "Kirchhoff's Rules, Wheatstone Bridge & Meter Bridge", status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'jmp-ch10',
            name: 'Magnetic Effects of Current & Magnetism',
            weightage: 'High',
            expectedQuestions: '2-3 Questions',
            topics: [
              { id: 'jmp-t22', name: 'Biot-Savart Law, Ampere Circuital Law & Solenoids', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmp-t23', name: 'Lorentz Force, Galvanometer Conversion & Dia/Para/Ferromagnetism', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'jmp-ch11',
            name: 'Electromagnetic Induction & Alternating Currents',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'jmp-t24', name: "Faraday's Law, Lenz's Law and Self/Mutual Inductance", status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmp-t25', name: 'Series LCR Circuits, Resonance & Power Factor', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'jmp-ch12',
            name: 'Optics (Ray & Wave)',
            weightage: 'High',
            expectedQuestions: '3 Questions',
            topics: [
              { id: 'jmp-t26', name: 'TIR, Refraction at Spherical Surfaces & Thin Lenses', status: 'not_started', estimatedMinutes: 100 },
              { id: 'jmp-t27', name: "Wavefronts, Huygens' Principle & Young's Double Slit Experiment", status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmp-t28', name: 'Diffraction at Single Slit & Polarisation', status: 'not_started', estimatedMinutes: 75 }
            ]
          },
          {
            id: 'jmp-ch13',
            name: 'Modern Physics (Dual Nature, Atoms & Nuclei)',
            weightage: 'High',
            expectedQuestions: '3-4 Questions',
            topics: [
              { id: 'jmp-t29', name: 'Photoelectric Effect and de Broglie Wavelength', status: 'not_started', estimatedMinutes: 75 },
              { id: 'jmp-t30', name: "Bohr's Atomic Model & Hydrogen Emission Spectrum", status: 'not_started', estimatedMinutes: 75 },
              { id: 'jmp-t31', name: 'Nuclear Binding Energy, Radioactivity & Fission/Fusion', status: 'not_started', estimatedMinutes: 75 }
            ]
          }
        ]
      },
      {
        id: 'jee-main-chem',
        name: 'Chemistry',
        chapters: [
          {
            id: 'jmc-ch1',
            name: 'Some Basic Concepts in Chemistry (Mole Concept)',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'jmc-t1', name: 'Atomic & Molecular Mass, Mole Calculations', status: 'not_started', estimatedMinutes: 60 },
              { id: 'jmc-t2', name: 'Stoichiometry, Limiting Reagent & Concentration Units', status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'jmc-ch2',
            name: 'Structure of Atom',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'jmc-t3', name: 'Bohr Model, Quantum Numbers & Electronic Configurations', status: 'not_started', estimatedMinutes: 80 },
              { id: 'jmc-t4', name: 'Dual Nature of Matter & Heisenberg Uncertainty Principle', status: 'not_started', estimatedMinutes: 60 }
            ]
          },
          {
            id: 'jmc-ch3',
            name: 'Chemical Bonding and Molecular Structure',
            weightage: 'High',
            expectedQuestions: '3 Questions',
            topics: [
              { id: 'jmc-t5', name: 'VSEPR Theory, Hybridisation & Geometry', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmc-t6', name: 'Molecular Orbital Theory (MOT) & Hydrogen Bonding', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'jmc-ch4',
            name: 'Chemical Thermodynamics & Energetics',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'jmc-t7', name: 'First Law, Enthalpy of Reactions & Hess Law', status: 'not_started', estimatedMinutes: 80 },
              { id: 'jmc-t8', name: 'Entropy, Gibbs Free Energy & Spontaneity Criteria', status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'jmc-ch5',
            name: 'Chemical & Ionic Equilibrium',
            weightage: 'High',
            expectedQuestions: '2-3 Questions',
            topics: [
              { id: 'jmc-t9', name: "Law of Mass Action, Kp vs Kc, Le Chatelier's Principle", status: 'not_started', estimatedMinutes: 80 },
              { id: 'jmc-t10', name: 'pH Scale, Buffer Solutions, Solubility Product (Ksp)', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'jmc-ch6',
            name: 'Electrochemistry',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'jmc-t11', name: 'Nernst Equation, Cell Potential & Gibbs Energy', status: 'not_started', estimatedMinutes: 80 },
              { id: 'jmc-t12', name: "Kohlrausch's Law, Conductance & Electrolysis Laws", status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'jmc-ch7',
            name: 'Chemical Kinetics',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'jmc-t13', name: 'Rate Laws, Order of Reaction (Zero & 1st Order)', status: 'not_started', estimatedMinutes: 75 },
              { id: 'jmc-t14', name: 'Arrhenius Equation & Activation Energy', status: 'not_started', estimatedMinutes: 75 }
            ]
          },
          {
            id: 'jmc-ch8',
            name: 'p-Block, d-Block and f-Block Elements',
            weightage: 'High',
            expectedQuestions: '3 Questions',
            topics: [
              { id: 'jmc-t15', name: 'Transition Metals Periodic Trends, Oxidation States & Color', status: 'not_started', estimatedMinutes: 80 },
              { id: 'jmc-t16', name: 'Lanthanoid Contraction and Important Compounds (KMnO4, K2Cr2O7)', status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'jmc-ch9',
            name: 'Coordination Compounds',
            weightage: 'High',
            expectedQuestions: '2-3 Questions',
            topics: [
              { id: 'jmc-t17', name: 'IUPAC Nomenclature & Isomerism in Complexes', status: 'not_started', estimatedMinutes: 75 },
              { id: 'jmc-t18', name: 'Crystal Field Theory (CFT) and Magnetic Properties', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'jmc-ch10',
            name: 'General Organic Chemistry (GOC) & Hydrocarbons',
            weightage: 'High',
            expectedQuestions: '3 Questions',
            topics: [
              { id: 'jmc-t19', name: 'Inductive, Mesomeric, Hyperconjugation Effects & Aromaticity', status: 'not_started', estimatedMinutes: 100 },
              { id: 'jmc-t20', name: 'Reaction Intermediates: Carbocations, Carbanions, Radicals', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmc-t21', name: 'Alkanes, Alkenes, Alkynes Reactions & Markovnikov Rule', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'jmc-ch11',
            name: 'Functional Organic Chemistry (Halides, Oxygen & Nitrogen)',
            weightage: 'High',
            expectedQuestions: '4 Questions',
            topics: [
              { id: 'jmc-t22', name: 'SN1, SN2, E1, E2 Mechanisms of Alkyl Halides', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmc-t23', name: 'Alcohols, Phenols and Ethers Mechanisms & Reagents', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmc-t24', name: 'Aldehydes, Ketones (Aldol, Cannizzaro) & Carboxylic Acids', status: 'not_started', estimatedMinutes: 100 },
              { id: 'jmc-t25', name: 'Amines, Diazonium Salts & Coupling Reactions', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        id: 'jee-main-math',
        name: 'Mathematics',
        chapters: [
          {
            id: 'jmm-ch1',
            name: 'Sets, Relations and Functions',
            weightage: 'Medium',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'jmm-t1', name: 'Equivalence Relations, Reflexive, Symmetric, Transitive', status: 'not_started', estimatedMinutes: 60 },
              { id: 'jmm-t2', name: 'Domain, Range, Injective, Surjective & Composite Functions', status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'jmm-ch2',
            name: 'Complex Numbers and Quadratic Equations',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'jmm-t3', name: 'Modulus, Argument, Triangle Inequality & Cube Roots of Unity', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmm-t4', name: 'Roots of Quadratic Equations and Location of Roots', status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'jmm-ch3',
            name: 'Matrices and Determinants',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'jmm-t5', name: 'Matrix Operations, Transpose, Inverse & Adjoint', status: 'not_started', estimatedMinutes: 80 },
              { id: 'jmm-t6', name: "Cramer's Rule & Consistency of Linear Equations", status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'jmm-ch4',
            name: 'Permutations, Combinations & Binomial Theorem',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'jmm-t7', name: 'Fundamental Principle of Counting, P&C with Repetition', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmm-t8', name: 'General Term, Middle Term and Binomial Coefficients', status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'jmm-ch5',
            name: 'Sequences and Series',
            weightage: 'Medium',
            expectedQuestions: '1-2 Questions',
            topics: [
              { id: 'jmm-t9', name: 'Arithmetic & Geometric Progressions (AP, GP)', status: 'not_started', estimatedMinutes: 75 },
              { id: 'jmm-t10', name: 'Arithmetico-Geometric Series and Sum of Special Series', status: 'not_started', estimatedMinutes: 75 }
            ]
          },
          {
            id: 'jmm-ch6',
            name: 'Differential Calculus (Limits, Continuity & Derivatives)',
            weightage: 'High',
            expectedQuestions: '3-4 Questions',
            topics: [
              { id: 'jmm-t11', name: "Standard Limits, L'Hopital Rule and Continuity Check", status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmm-t12', name: 'Differentiability, Chain Rule, Implicit Differentiation', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmm-t13', name: 'Monotonicity, Tangents & Normals, Maxima-Minima', status: 'not_started', estimatedMinutes: 100 }
            ]
          },
          {
            id: 'jmm-ch7',
            name: 'Integral Calculus & Differential Equations',
            weightage: 'High',
            expectedQuestions: '3-4 Questions',
            topics: [
              { id: 'jmm-t14', name: 'Indefinite Integration Substitution, By Parts, Partial Fractions', status: 'not_started', estimatedMinutes: 100 },
              { id: 'jmm-t15', name: 'Definite Integrals Properties & King Property', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmm-t16', name: 'Area Under Curves (Bounded Regions)', status: 'not_started', estimatedMinutes: 80 },
              { id: 'jmm-t17', name: 'Linear Differential Equations & Variable Separable', status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'jmm-ch8',
            name: 'Coordinate Geometry (Straight Lines & Conics)',
            weightage: 'High',
            expectedQuestions: '3-4 Questions',
            topics: [
              { id: 'jmm-t18', name: 'Slope, Distance, Family of Lines & Pair of Lines', status: 'not_started', estimatedMinutes: 80 },
              { id: 'jmm-t19', name: 'Circles: Tangents, Normals & Chord of Contact', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmm-t20', name: 'Parabola, Ellipse and Hyperbola Standard Forms & Tangents', status: 'not_started', estimatedMinutes: 100 }
            ]
          },
          {
            id: 'jmm-ch9',
            name: 'Vector Algebra & 3D Geometry',
            weightage: 'High',
            expectedQuestions: '3-4 Questions',
            topics: [
              { id: 'jmm-t21', name: 'Dot & Cross Products, Scalar Triple Product', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jmm-t22', name: 'Direction Cosines, Equation of Lines, Shortest Distance', status: 'not_started', estimatedMinutes: 100 }
            ]
          },
          {
            id: 'jmm-ch10',
            name: 'Probability and Statistics',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'jmm-t23', name: 'Mean, Median, Mode, Variance & Standard Deviation', status: 'not_started', estimatedMinutes: 75 },
              { id: 'jmm-t24', name: "Conditional Probability, Bayes' Theorem & Distributions", status: 'not_started', estimatedMinutes: 90 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'syllabus-jee-advanced',
    name: 'JEE Advanced',
    abbreviation: 'JEE Adv',
    fullName: 'Joint Entrance Examination (Advanced) - IITs',
    category: 'Engineering',
    year: '2026',
    description: 'Premier entrance examination for admissions to the 23 Indian Institutes of Technology (IITs).',
    officialExamDate: '2026-05-17',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'Joint Admission Board (JAB) / IIT Organizing Institute',
    variants: [
      { id: 'paper-1', name: 'Paper 1 (Morning Session)', description: 'Physics, Chemistry, Maths mixed pattern' },
      { id: 'paper-2', name: 'Paper 2 (Afternoon Session)', description: 'Advanced comprehension, matrix match & multi-correct' }
    ],
    stages: ['Paper 1', 'Paper 2'],
    subjects: [
      {
        id: 'jeea-phy',
        name: 'Physics (Advanced)',
        chapters: [
          {
            id: 'jeea-p1',
            name: 'Mechanics (Advanced Dynamics & Rigid Bodies)',
            weightage: 'High',
            expectedQuestions: '6-8 Questions',
            topics: [
              { id: 'jeea-pt1', name: 'Rigid Body Dynamics, Conservation of Angular Momentum with Collisions', status: 'not_started', estimatedMinutes: 120 },
              { id: 'jeea-pt2', name: 'Fluid Statics, Fluid Dynamics, Viscosity & Surface Tension', status: 'not_started', estimatedMinutes: 100 },
              { id: 'jeea-pt3', name: 'Oscillations, Damped Oscillations and Coupled Resonators', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'jeea-p2',
            name: 'Electrodynamics & Field Theory',
            weightage: 'High',
            expectedQuestions: '6-8 Questions',
            topics: [
              { id: 'jeea-pt4', name: 'Advanced Electrostatic Boundary Problems & Variable Dielectrics', status: 'not_started', estimatedMinutes: 120 },
              { id: 'jeea-pt5', name: 'Mutual Inductance, LC Oscillations & Poynting Vector Concept', status: 'not_started', estimatedMinutes: 110 }
            ]
          },
          {
            id: 'jeea-p3',
            name: 'Wave Optics & Modern Physics Advanced',
            weightage: 'High',
            expectedQuestions: '5-7 Questions',
            topics: [
              { id: 'jeea-pt6', name: 'Diffraction, Resolving Power & Optical Instruments', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jeea-pt7', name: 'X-rays, Moseley Law, Bragg Law & Nuclear Reactions Q-Value', status: 'not_started', estimatedMinutes: 90 }
            ]
          }
        ]
      },
      {
        id: 'jeea-chem',
        name: 'Chemistry (Advanced)',
        chapters: [
          {
            id: 'jeea-c1',
            name: 'Physical Chemistry Analytical Problems',
            weightage: 'High',
            expectedQuestions: '6-7 Questions',
            topics: [
              { id: 'jeea-ct1', name: 'Colligative Properties with Van\'t Hoff Factor & Abnormal Molar Mass', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jeea-ct2', name: 'Multi-stage Kinetics, Steady State Approximation & Catalysis', status: 'not_started', estimatedMinutes: 100 }
            ]
          },
          {
            id: 'jeea-c2',
            name: 'Inorganic Chemistry & Qualitative Analysis',
            weightage: 'High',
            expectedQuestions: '6-7 Questions',
            topics: [
              { id: 'jeea-ct3', name: 'Cation and Anion Salt Analysis (Dry and Wet Tests)', status: 'not_started', estimatedMinutes: 110 },
              { id: 'jeea-ct4', name: 'Silicates, Silicones, Boranes & Organometallics', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'jeea-c3',
            name: 'Organic Stereochemistry & Reaction Pathways',
            weightage: 'High',
            expectedQuestions: '7-8 Questions',
            topics: [
              { id: 'jeea-ct5', name: 'Optical Activity, Enantiomers, Diastereomers & Conformations', status: 'not_started', estimatedMinutes: 100 },
              { id: 'jeea-ct6', name: 'Named Reactions, Multi-step Synthesis & Pericyclic Concepts', status: 'not_started', estimatedMinutes: 120 }
            ]
          }
        ]
      },
      {
        id: 'jeea-math',
        name: 'Mathematics (Advanced)',
        chapters: [
          {
            id: 'jeea-m1',
            name: 'Advanced Calculus & Functional Equations',
            weightage: 'High',
            expectedQuestions: '7-8 Questions',
            topics: [
              { id: 'jeea-mt1', name: "Leibnitz Rule for Differentiation of Integrals & Estimation of Sums", status: 'not_started', estimatedMinutes: 110 },
              { id: 'jeea-mt2', name: 'Differential Equations with Integrating Factors & Orthogonal Trajectories', status: 'not_started', estimatedMinutes: 100 }
            ]
          },
          {
            id: 'jeea-m2',
            name: 'Vectors, 3D Geometry & Linear Systems',
            weightage: 'High',
            expectedQuestions: '6-7 Questions',
            topics: [
              { id: 'jeea-mt3', name: 'Vector Triple Product, Quadruple Product and Geometric Applications', status: 'not_started', estimatedMinutes: 100 },
              { id: 'jeea-mt4', name: 'Planes, Coplanarity of Lines & Intersection Geometry', status: 'not_started', estimatedMinutes: 100 }
            ]
          },
          {
            id: 'jeea-m3',
            name: 'Combinatorics, Probability & Matrices',
            weightage: 'High',
            expectedQuestions: '6-7 Questions',
            topics: [
              { id: 'jeea-mt5', name: 'Derangements, Pigeonhole Principle, Multinomial Theorem', status: 'not_started', estimatedMinutes: 90 },
              { id: 'jeea-mt6', name: 'Advanced Probability: Random Variables & Geometric Probability', status: 'not_started', estimatedMinutes: 90 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'syllabus-gate',
    name: 'GATE',
    abbreviation: 'GATE',
    fullName: 'Graduate Aptitude Test in Engineering (CS / IT / EC / ME)',
    category: 'Engineering',
    year: '2026',
    description: 'National examination for M.Tech admissions to IITs/NITs and recruitment in PSUs.',
    officialExamDate: '2026-02-07',
    isOfficialDateAnnounced: true,
    verifiedOfficialSource: 'IIT Organizing Institute Official GATE Syllabus',
    variants: [
      { id: 'gate-cs', name: 'Computer Science & IT (CS)', description: 'Algorithms, OS, DBMS, Networks, TOC, Compiler' },
      { id: 'gate-da', name: 'Data Science & AI (DA)', description: 'Probability, Linear Algebra, ML, AI, Databases' },
      { id: 'gate-ece', name: 'Electronics & Communication (EC)', description: 'Signals, Analog, Digital, Electromagnetics' }
    ],
    stages: ['Computer-Based Test'],
    subjects: [
      {
        id: 'gate-eng-math',
        name: 'Engineering Mathematics',
        chapters: [
          {
            id: 'gate-em-1',
            name: 'Linear Algebra & Calculus',
            weightage: 'High',
            expectedQuestions: '6-8 Marks',
            topics: [
              { id: 'gem-t1', name: 'Matrices, Determinants, Rank, Eigenvalues and Eigenvectors', status: 'not_started', estimatedMinutes: 90 },
              { id: 'gem-t2', name: 'Maxima and Minima, Taylor Series, Gradient, Divergence, Curl', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'gate-em-2',
            name: 'Discrete Mathematics',
            weightage: 'High',
            expectedQuestions: '8-10 Marks',
            topics: [
              { id: 'gem-t3', name: 'Propositional and First-Order Logic, Proof Techniques', status: 'not_started', estimatedMinutes: 90 },
              { id: 'gem-t4', name: 'Sets, Relations, Functions, Partial Orders and Lattices', status: 'not_started', estimatedMinutes: 90 },
              { id: 'gem-t5', name: 'Combinatorics, Generating Functions, Recurrence Relations & Graph Theory', status: 'not_started', estimatedMinutes: 100 }
            ]
          }
        ]
      },
      {
        id: 'gate-cs-core',
        name: 'Computer Science Core',
        chapters: [
          {
            id: 'gate-dsa',
            name: 'Data Structures and Algorithms',
            weightage: 'High',
            expectedQuestions: '10-12 Marks',
            topics: [
              { id: 'gcs-t1', name: 'Arrays, Stacks, Queues, Linked Lists, Trees, Heaps, Graphs', status: 'not_started', estimatedMinutes: 100 },
              { id: 'gcs-t2', name: 'Asymptotic Analysis, Divide & Conquer, Greedy, Dynamic Programming', status: 'not_started', estimatedMinutes: 120 }
            ]
          },
          {
            id: 'gate-os',
            name: 'Operating Systems',
            weightage: 'High',
            expectedQuestions: '8-10 Marks',
            topics: [
              { id: 'gcs-t3', name: 'Processes, Threads, CPU Scheduling, Synchronization, Deadlocks', status: 'not_started', estimatedMinutes: 100 },
              { id: 'gcs-t4', name: 'Memory Management, Virtual Memory, Paging, Page Replacement, Disk Scheduling', status: 'not_started', estimatedMinutes: 100 }
            ]
          },
          {
            id: 'gate-dbms',
            name: 'Database Management Systems',
            weightage: 'High',
            expectedQuestions: '7-9 Marks',
            topics: [
              { id: 'gcs-t5', name: 'ER Model, Relational Algebra, Tuple Calculus, SQL', status: 'not_started', estimatedMinutes: 90 },
              { id: 'gcs-t6', name: 'Functional Dependencies, Normal Forms (1NF-BCNF), Transactions & ACID', status: 'not_started', estimatedMinutes: 100 }
            ]
          },
          {
            id: 'gate-cn',
            name: 'Computer Networks',
            weightage: 'High',
            expectedQuestions: '8-10 Marks',
            topics: [
              { id: 'gcs-t7', name: 'OSI & TCP/IP Stack, Framing, Error Detection, Flow Control', status: 'not_started', estimatedMinutes: 90 },
              { id: 'gcs-t8', name: 'IP Addressing, Subnetting, Routing Algorithms, TCP Congestion Control', status: 'not_started', estimatedMinutes: 100 }
            ]
          },
          {
            id: 'gate-toc',
            name: 'Theory of Computation & Compiler Design',
            weightage: 'High',
            expectedQuestions: '10-12 Marks',
            topics: [
              { id: 'gcs-t9', name: 'Regular Expressions, Finite Automata, Context-Free Grammars, Pushdown Automata', status: 'not_started', estimatedMinutes: 100 },
              { id: 'gcs-t10', name: 'Turing Machines, Decidability, Lexical Analysis, Parsing (LL, LR)', status: 'not_started', estimatedMinutes: 100 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // MEDICAL
  // =========================================================================
  {
    id: 'syllabus-neet-ug',
    name: 'NEET UG',
    abbreviation: 'NEET UG',
    fullName: 'National Eligibility cum Entrance Test (Undergraduate)',
    category: 'Medical',
    year: '2026',
    description: 'Sole national entrance examination for admission to MBBS, BDS, and AYUSH courses in India.',
    officialExamDate: '2026-05-03',
    isOfficialDateAnnounced: true,
    verifiedOfficialSource: 'National Medical Commission (NMC) & National Testing Agency',
    variants: [
      { id: 'neet-mbbs', name: 'NEET (MBBS / BDS / AYUSH)', description: 'Botany, Zoology, Physics & Chemistry' }
    ],
    stages: ['Single Stage Examination'],
    subjects: [
      {
        id: 'neet-botany',
        name: 'Botany',
        chapters: [
          {
            id: 'nb-ch1',
            name: 'Diversity of the Living World',
            weightage: 'High',
            expectedQuestions: '8-10 Questions',
            topics: [
              { id: 'nbt-1', name: 'Biological Classification (Monera, Protista, Fungi, Viruses)', status: 'not_started', estimatedMinutes: 80 },
              { id: 'nbt-2', name: 'Plant Kingdom (Algae, Bryophytes, Pteridophytes, Gymnosperms, Angiosperms)', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'nb-ch2',
            name: 'Structural Organisation in Plants (Morphology & Anatomy)',
            weightage: 'High',
            expectedQuestions: '6-8 Questions',
            topics: [
              { id: 'nbt-3', name: 'Morphology of Flowering Plants: Root, Stem, Leaf, Inflorescence, Flower', status: 'not_started', estimatedMinutes: 90 },
              { id: 'nbt-4', name: 'Anatomy of Flowering Plants: Tissues, Meristems, Secondary Growth', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'nb-ch3',
            name: 'Plant Physiology',
            weightage: 'High',
            expectedQuestions: '10-12 Questions',
            topics: [
              { id: 'nbt-5', name: 'Photosynthesis in Higher Plants (Light Reaction, Calvin Cycle, C4, CAM)', status: 'not_started', estimatedMinutes: 100 },
              { id: 'nbt-6', name: 'Respiration in Plants (Glycolysis, Krebs Cycle, ETS, Fermentation)', status: 'not_started', estimatedMinutes: 100 },
              { id: 'nbt-7', name: 'Plant Growth & Development (Auxins, Gibberellins, Cytokinins, ABA, Ethylene)', status: 'not_started', estimatedMinutes: 75 }
            ]
          },
          {
            id: 'nb-ch4',
            name: 'Reproduction in Plants',
            weightage: 'High',
            expectedQuestions: '6-8 Questions',
            topics: [
              { id: 'nbt-8', name: 'Sexual Reproduction in Flowering Plants: Pollination, Double Fertilisation', status: 'not_started', estimatedMinutes: 90 },
              { id: 'nbt-9', name: 'Development of Seed, Fruit, Apomixis and Polyembryony', status: 'not_started', estimatedMinutes: 75 }
            ]
          },
          {
            id: 'nb-ch5',
            name: 'Ecology & Environment',
            weightage: 'High',
            expectedQuestions: '10-12 Questions',
            topics: [
              { id: 'nbt-10', name: 'Organisms and Populations: Adaptations, Population Growth Models', status: 'not_started', estimatedMinutes: 80 },
              { id: 'nbt-11', name: 'Ecosystem: Productivity, Decomposition, Energy Flow, Ecological Pyramids', status: 'not_started', estimatedMinutes: 80 },
              { id: 'nbt-12', name: 'Biodiversity and Conservation: Patterns, Loss, In-situ and Ex-situ Measures', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        id: 'neet-zoology',
        name: 'Zoology',
        chapters: [
          {
            id: 'nz-ch1',
            name: 'Animal Kingdom',
            weightage: 'High',
            expectedQuestions: '6-8 Questions',
            topics: [
              { id: 'nzt-1', name: 'Non-chordates (Porifera to Echinodermata & Hemichordata)', status: 'not_started', estimatedMinutes: 90 },
              { id: 'nzt-2', name: 'Chordates (Cyclostomata, Chondrichthyes, Osteichthyes, Amphibia, Reptilia, Aves, Mammalia)', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'nz-ch2',
            name: 'Structural Organisation in Animals',
            weightage: 'Medium',
            expectedQuestions: '4-5 Questions',
            topics: [
              { id: 'nzt-3', name: 'Animal Tissues: Epithelial, Connective, Muscular, Neural', status: 'not_started', estimatedMinutes: 75 },
              { id: 'nzt-4', name: 'Morphology & Anatomy of Frog', status: 'not_started', estimatedMinutes: 75 }
            ]
          },
          {
            id: 'nz-ch3',
            name: 'Human Physiology',
            weightage: 'High',
            expectedQuestions: '12-14 Questions',
            topics: [
              { id: 'nzt-5', name: 'Breathing and Exchange of Gases (Respiratory Volumes, Transport of O2 & CO2)', status: 'not_started', estimatedMinutes: 80 },
              { id: 'nzt-6', name: 'Body Fluids and Circulation (Cardiac Cycle, ECG, Blood Groups, Double Circulation)', status: 'not_started', estimatedMinutes: 90 },
              { id: 'nzt-7', name: 'Excretory Products and Elimination (Nephron, Urine Formation, RAAS Mechanism)', status: 'not_started', estimatedMinutes: 90 },
              { id: 'nzt-8', name: 'Locomotion and Movement (Sliding Filament Theory, Joints, Skeletal Disorders)', status: 'not_started', estimatedMinutes: 80 },
              { id: 'nzt-9', name: 'Neural Control & Chemical Coordination (Action Potential, Endocrine Hormones)', status: 'not_started', estimatedMinutes: 100 }
            ]
          },
          {
            id: 'nz-ch4',
            name: 'Human Reproduction & Reproductive Health',
            weightage: 'High',
            expectedQuestions: '6-8 Questions',
            topics: [
              { id: 'nzt-10', name: 'Male & Female Reproductive Systems, Gametogenesis & Menstrual Cycle', status: 'not_started', estimatedMinutes: 90 },
              { id: 'nzt-11', name: 'Fertilisation, Embryo Development, Parturition & Contraceptive Methods, ART', status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'nz-ch5',
            name: 'Genetics and Evolution',
            weightage: 'High',
            expectedQuestions: '12-14 Questions',
            topics: [
              { id: 'nzt-12', name: 'Principles of Inheritance and Variation (Mendelian Genetics, Linkage, Genetic Disorders)', status: 'not_started', estimatedMinutes: 110 },
              { id: 'nzt-13', name: 'Molecular Basis of Inheritance (DNA Replication, Transcription, Genetic Code, Translation)', status: 'not_started', estimatedMinutes: 120 },
              { id: 'nzt-14', name: 'Evolution: Origin of Life, Evidence, Natural Selection, Hardy-Weinberg Principle', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'nz-ch6',
            name: 'Biotechnology & Human Health',
            weightage: 'High',
            expectedQuestions: '8-10 Questions',
            topics: [
              { id: 'nzt-15', name: 'Human Health & Diseases: Immunity, Vaccines, Cancer, AIDS, Common Pathogens', status: 'not_started', estimatedMinutes: 90 },
              { id: 'nzt-16', name: 'Biotechnology Principles and Processes: Recombinant DNA Technology, PCR, Vectors', status: 'not_started', estimatedMinutes: 90 },
              { id: 'nzt-17', name: 'Applications of Biotechnology in Medicine and Agriculture, GMOs, Gene Therapy', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        id: 'neet-physics',
        name: 'Physics',
        chapters: [
          {
            id: 'np-ch1',
            name: 'Mechanics (Kinematics, Laws of Motion & Gravitation)',
            weightage: 'High',
            expectedQuestions: '12-14 Questions',
            topics: [
              { id: 'npt-1', name: 'Vectors, 1D & 2D Kinematics and Relative Motion', status: 'not_started', estimatedMinutes: 80 },
              { id: 'npt-2', name: "Newton's Laws, Friction and Circular Motion Dynamics", status: 'not_started', estimatedMinutes: 80 },
              { id: 'npt-3', name: 'Work, Energy, Power & Collisions', status: 'not_started', estimatedMinutes: 80 },
              { id: 'npt-4', name: 'Rotational Motion, Moment of Inertia and Angular Momentum', status: 'not_started', estimatedMinutes: 90 },
              { id: 'npt-5', name: "Gravitation, Orbital Velocity and Kepler's Laws", status: 'not_started', estimatedMinutes: 70 }
            ]
          },
          {
            id: 'np-ch2',
            name: 'Thermodynamics & Kinetic Theory',
            weightage: 'High',
            expectedQuestions: '4-5 Questions',
            topics: [
              { id: 'npt-6', name: 'Thermal Properties, Calorimetry, Conduction, Radiation & Stefan Law', status: 'not_started', estimatedMinutes: 75 },
              { id: 'npt-7', name: 'Laws of Thermodynamics, Heat Engines, Refrigerators & KTG Postulates', status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'np-ch3',
            name: 'Electrodynamics & Magnetism',
            weightage: 'High',
            expectedQuestions: '12-14 Questions',
            topics: [
              { id: 'npt-8', name: "Electrostatics, Coulomb's Law, Electric Potential and Capacitance", status: 'not_started', estimatedMinutes: 90 },
              { id: 'npt-9', name: "Current Electricity, Ohm's Law, Kirchhoff's Laws and Wheatstone Bridge", status: 'not_started', estimatedMinutes: 85 },
              { id: 'npt-10', name: 'Magnetic Effects of Current, Biot-Savart Law and Solenoids', status: 'not_started', estimatedMinutes: 85 },
              { id: 'npt-11', name: 'Electromagnetic Induction, Lenz Law and Alternating Currents (LCR)', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'np-ch4',
            name: 'Optics & Modern Physics',
            weightage: 'High',
            expectedQuestions: '10-12 Questions',
            topics: [
              { id: 'npt-12', name: 'Ray Optics: Reflection, Refraction, Lenses, Prisms and Microscopes', status: 'not_started', estimatedMinutes: 90 },
              { id: 'npt-13', name: "Wave Optics: Huygens Principle, Young's Experiment and Polarisation", status: 'not_started', estimatedMinutes: 80 },
              { id: 'npt-14', name: 'Photoelectric Effect, de Broglie Wavelength, Atomic Models and Radioactivity', status: 'not_started', estimatedMinutes: 90 }
            ]
          }
        ]
      },
      {
        id: 'neet-chemistry',
        name: 'Chemistry',
        chapters: [
          {
            id: 'nc-ch1',
            name: 'Physical Chemistry',
            weightage: 'High',
            expectedQuestions: '15-16 Questions',
            topics: [
              { id: 'nct-1', name: 'Mole Concept, Stoichiometry and Concentrations', status: 'not_started', estimatedMinutes: 75 },
              { id: 'nct-2', name: 'Atomic Structure, Quantum Numbers and Electronic Configuration', status: 'not_started', estimatedMinutes: 75 },
              { id: 'nct-3', name: 'Thermodynamics, Enthalpy, Entropy and Gibbs Free Energy', status: 'not_started', estimatedMinutes: 80 },
              { id: 'nct-4', name: 'Chemical and Ionic Equilibrium (pH, Buffers, Ksp)', status: 'not_started', estimatedMinutes: 85 },
              { id: 'nct-5', name: 'Solutions, Raoult Law and Colligative Properties', status: 'not_started', estimatedMinutes: 80 },
              { id: 'nct-6', name: 'Electrochemistry (Nernst Equation) and Chemical Kinetics', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'nc-ch2',
            name: 'Inorganic Chemistry',
            weightage: 'High',
            expectedQuestions: '14-16 Questions',
            topics: [
              { id: 'nct-7', name: 'Periodic Table Trends and Chemical Bonding (VSEPR, MOT)', status: 'not_started', estimatedMinutes: 90 },
              { id: 'nct-8', name: 'p-Block Elements Trends and Important Inorganic Compounds', status: 'not_started', estimatedMinutes: 85 },
              { id: 'nct-9', name: 'd and f-Block Elements, Coordination Compounds (CFT, Isomerism)', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'nc-ch3',
            name: 'Organic Chemistry',
            weightage: 'High',
            expectedQuestions: '16-18 Questions',
            topics: [
              { id: 'nct-10', name: 'GOC: Electronic Effects, Reaction Intermediates and Hydrocarbons', status: 'not_started', estimatedMinutes: 90 },
              { id: 'nct-11', name: 'Haloalkanes, Haloarenes, Alcohols, Phenols and Ethers', status: 'not_started', estimatedMinutes: 90 },
              { id: 'nct-12', name: 'Aldehydes, Ketones, Carboxylic Acids and Nitrogen Compounds (Amines)', status: 'not_started', estimatedMinutes: 95 },
              { id: 'nct-13', name: 'Biomolecules: Carbohydrates, Proteins, Nucleic Acids and Vitamins', status: 'not_started', estimatedMinutes: 75 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // GOVERNMENT AND CIVIL SERVICES
  // =========================================================================
  {
    id: 'syllabus-upsc-cse',
    name: 'UPSC CSE',
    abbreviation: 'UPSC CSE',
    fullName: 'Civil Services Examination - Union Public Service Commission',
    category: 'Govt & Civil',
    year: '2026',
    description: 'Premier national civil service examination for IAS, IPS, IFS, and Central Group A/B services.',
    officialExamDate: '2026-05-24',
    isOfficialDateAnnounced: true,
    verifiedOfficialSource: 'UPSC Official Examination Calendar & Notification',
    variants: [
      { id: 'prelims', name: 'Civil Services Prelims', description: 'General Studies Paper 1 & CSAT Paper 2' },
      { id: 'mains', name: 'Civil Services Mains', description: 'Essay, GS 1-4 & Optional Papers' }
    ],
    stages: ['Prelims', 'Mains'],
    subjects: [
      {
        id: 'upsc-gs1-prelims',
        name: 'General Studies Paper I (Prelims)',
        stage: 'Prelims',
        chapters: [
          {
            id: 'ug-polity',
            name: 'Indian Polity and Governance',
            stage: 'Prelims',
            weightage: 'High',
            expectedQuestions: '14-18 Questions',
            topics: [
              { id: 'ugp-1', name: 'Constitutional Framework: Preamble, Fundamental Rights, DPSP, Fundamental Duties', status: 'not_started', estimatedMinutes: 120 },
              { id: 'ugp-2', name: 'Union & State Executive: President, Governor, PM, CM, Council of Ministers', status: 'not_started', estimatedMinutes: 100 },
              { id: 'ugp-3', name: 'Parliament and State Legislatures: Lawmaking, Committees, Budgets', status: 'not_started', estimatedMinutes: 120 },
              { id: 'ugp-4', name: 'Judiciary: Supreme Court, High Courts, Judicial Review, Public Interest Litigation (PIL)', status: 'not_started', estimatedMinutes: 90 },
              { id: 'ugp-5', name: 'Panchayati Raj, Municipalities, Federal Relations and Inter-State Councils', status: 'not_started', estimatedMinutes: 80 },
              { id: 'ugp-6', name: 'Constitutional & Statutory Bodies (ECI, UPSC, CAG, Finance Commission, NITI Aayog)', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'ug-economy',
            name: 'Indian Economy & Social Development',
            stage: 'Prelims',
            weightage: 'High',
            expectedQuestions: '15-18 Questions',
            topics: [
              { id: 'uge-1', name: 'National Income, GDP/GVA, Inflation (CPI, WPI) and Monetary Policy', status: 'not_started', estimatedMinutes: 100 },
              { id: 'uge-2', name: 'Banking Sector, RBI Tools (Repo, CRR), NPAs and Financial Inclusion', status: 'not_started', estimatedMinutes: 100 },
              { id: 'uge-3', name: 'Fiscal Policy, Government Budgeting, FRBM Act and Taxation Reforms (GST)', status: 'not_started', estimatedMinutes: 90 },
              { id: 'uge-4', name: 'External Sector: Balance of Payments, Forex Reserves, WTO and Trade Agreements', status: 'not_started', estimatedMinutes: 90 },
              { id: 'uge-5', name: 'Agriculture: MSP, Food Security, Subsidies, Supply Chain and Land Reforms', status: 'not_started', estimatedMinutes: 100 },
              { id: 'uge-6', name: 'Poverty, Demographics, Sustainable Development Goals (SDGs) & Social Schemes', status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'ug-env',
            name: 'Environment, Ecology & Climate Change',
            stage: 'Prelims',
            weightage: 'High',
            expectedQuestions: '16-20 Questions',
            topics: [
              { id: 'ugen-1', name: 'Ecosystems, Ecological Succession, Biomes and Biodiversity Hotspots', status: 'not_started', estimatedMinutes: 90 },
              { id: 'ugen-2', name: 'Protected Areas: National Parks, Wildlife Sanctuaries, Tiger Reserves, Ramsar Sites', status: 'not_started', estimatedMinutes: 110 },
              { id: 'ugen-3', name: 'Climate Protocols: UNFCCC, COP Summits, Paris Agreement, Montreal, CITES', status: 'not_started', estimatedMinutes: 100 },
              { id: 'ugen-4', name: 'Pollution, Waste Management Rules, Renewable Energy & Environmental Acts (WPA 1972, EPA 1986)', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'ug-history',
            name: 'History of India & Indian National Movement',
            stage: 'Prelims',
            weightage: 'High',
            expectedQuestions: '13-17 Questions',
            topics: [
              { id: 'ugh-1', name: 'Ancient India: Indus Valley, Vedic Age, Buddhism, Jainism, Mauryas, Guptas', status: 'not_started', estimatedMinutes: 110 },
              { id: 'ugh-2', name: 'Medieval India: Delhi Sultanate, Vijayanagara Empire, Mughal Empire, Bhakti & Sufi Movements', status: 'not_started', estimatedMinutes: 100 },
              { id: 'ugh-3', name: 'Indian Art & Culture: Architecture, Sculpture, Paintings, Classical Dances and Music', status: 'not_started', estimatedMinutes: 90 },
              { id: 'ugh-4', name: 'Modern India (1757-1947): British Expansion, 1857 Revolt, Socio-Religious Reforms', status: 'not_started', estimatedMinutes: 120 },
              { id: 'ugh-5', name: 'Freedom Struggle: Moderate, Extremist, Gandhian Phases, Revolutionary Movements', status: 'not_started', estimatedMinutes: 120 }
            ]
          },
          {
            id: 'ug-geography',
            name: 'Physical & Human Geography',
            stage: 'Prelims',
            weightage: 'High',
            expectedQuestions: '10-14 Questions',
            topics: [
              { id: 'ugg-1', name: 'Geomorphology: Plate Tectonics, Earthquakes, Volcanoes, Landforms', status: 'not_started', estimatedMinutes: 90 },
              { id: 'ugg-2', name: 'Climatology & Oceanography: Atmospheric Circulation, Monsoons, Ocean Currents, El Nino', status: 'not_started', estimatedMinutes: 100 },
              { id: 'ugg-3', name: 'Indian Geography: Drainage Systems, Himalayan Rivers, Soils, Minerals and Industries', status: 'not_started', estimatedMinutes: 100 }
            ]
          },
          {
            id: 'ug-sci-tech',
            name: 'Science & Technology and Current Affairs',
            stage: 'Prelims',
            weightage: 'High',
            expectedQuestions: '12-16 Questions',
            topics: [
              { id: 'ugst-1', name: 'Space Technology: ISRO Missions (Gaganyaan, Chandrayaan, Aditya-L1), Launch Vehicles', status: 'not_started', estimatedMinutes: 80 },
              { id: 'ugst-2', name: 'Defence & Nuclear: Missiles, Submarines, Stealth Tech, Nuclear Energy', status: 'not_started', estimatedMinutes: 70 },
              { id: 'ugst-3', name: 'Biotech, AI, Quantum Computing, Semiconductor Missions & Emerging Tech', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        id: 'upsc-csat-prelims',
        name: 'CSAT Paper II (Prelims)',
        stage: 'Prelims',
        chapters: [
          {
            id: 'ug-csat',
            name: 'Aptitude, Comprehension & Reasoning',
            stage: 'Prelims',
            weightage: 'Medium',
            expectedQuestions: '80 Questions (Qualifying 33%)',
            topics: [
              { id: 'ugc-1', name: 'Reading Comprehension Passages & Inference Analysis', status: 'not_started', estimatedMinutes: 80 },
              { id: 'ugc-2', name: 'Number System, Divisibility, Remainder Theorem, HCF & LCM', status: 'not_started', estimatedMinutes: 80 },
              { id: 'ugc-3', name: 'Percentages, Profit & Loss, Ratio, Time & Work, Permutations & Combinations', status: 'not_started', estimatedMinutes: 90 },
              { id: 'ugc-4', name: 'Logical Deductions, Syllogisms, Blood Relations, Seating Arrangements & Puzzles', status: 'not_started', estimatedMinutes: 90 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'syllabus-ssc-cgl',
    name: 'SSC CGL',
    abbreviation: 'SSC CGL',
    fullName: 'Combined Graduate Level Examination - Staff Selection Commission',
    category: 'Govt & Civil',
    year: '2026',
    description: 'National recruitment exam for Grade B & C Gazetted/Non-Gazetted posts in Central Ministries and Departments.',
    officialExamDate: '2026-09-15',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'Staff Selection Commission (SSC) Annual Examination Calendar',
    variants: [
      { id: 'tier-1', name: 'Tier 1 (Preliminary Exam)', description: 'General Intelligence, GA, Quant, English' },
      { id: 'tier-2', name: 'Tier 2 (Mains + Typing/DEST)', description: 'Maths, Reasoning, English, GA, Computer Knowledge' }
    ],
    stages: ['Tier 1', 'Tier 2'],
    subjects: [
      {
        id: 'ssc-quant',
        name: 'Quantitative Aptitude',
        chapters: [
          {
            id: 'sscq-arithmetic',
            name: 'Arithmetic Mathematics',
            weightage: 'High',
            expectedQuestions: '12-14 Questions',
            topics: [
              { id: 'sq-t1', name: 'Percentages, Profit & Loss, Discount, True Discount', status: 'not_started', estimatedMinutes: 75 },
              { id: 'sq-t2', name: 'Ratio & Proportion, Partnership, Mixture & Alligation', status: 'not_started', estimatedMinutes: 75 },
              { id: 'sq-t3', name: 'Time, Speed and Distance, Trains, Boats & Streams', status: 'not_started', estimatedMinutes: 80 },
              { id: 'sq-t4', name: 'Time & Work, Pipes & Cisterns, Wages', status: 'not_started', estimatedMinutes: 75 },
              { id: 'sq-t5', name: 'Simple and Compound Interest, Installments', status: 'not_started', estimatedMinutes: 75 }
            ]
          },
          {
            id: 'sscq-advance',
            name: 'Advanced Mathematics',
            weightage: 'High',
            expectedQuestions: '11-13 Questions',
            topics: [
              { id: 'sq-t6', name: 'Algebra: Basic Algebraic Identities, Surds, Indices, Maxima-Minima', status: 'not_started', estimatedMinutes: 90 },
              { id: 'sq-t7', name: 'Geometry: Triangles, Similarity, Congruence, Circles, Tangents, Quadrilaterals', status: 'not_started', estimatedMinutes: 100 },
              { id: 'sq-t8', name: 'Mensuration 2D & 3D: Areas, Surface Areas and Volumes of Cylinders, Cones, Spheres', status: 'not_started', estimatedMinutes: 90 },
              { id: 'sq-t9', name: 'Trigonometry: Ratios, Standard Angles, Identities, Heights and Distances', status: 'not_started', estimatedMinutes: 90 },
              { id: 'sq-t10', name: 'Data Interpretation: Bar Charts, Pie Charts, Tables and Histograms', status: 'not_started', estimatedMinutes: 60 }
            ]
          }
        ]
      },
      {
        id: 'ssc-reasoning',
        name: 'General Intelligence and Reasoning',
        chapters: [
          {
            id: 'sscr-verbal',
            name: 'Verbal & Non-Verbal Reasoning',
            weightage: 'High',
            expectedQuestions: '25 Questions',
            topics: [
              { id: 'sr-t1', name: 'Analogies, Classification (Odd One Out), Alphabetical Series', status: 'not_started', estimatedMinutes: 60 },
              { id: 'sr-t2', name: 'Coding-Decoding, Matrix, Blood Relations, Direction Sense', status: 'not_started', estimatedMinutes: 70 },
              { id: 'sr-t3', name: 'Syllogism, Statement and Conclusions, Venn Diagrams', status: 'not_started', estimatedMinutes: 75 },
              { id: 'sr-t4', name: 'Puzzles, Seating Arrangements, Calendar, Clock, Dice and Cube', status: 'not_started', estimatedMinutes: 80 },
              { id: 'sr-t5', name: 'Non-Verbal: Mirror Images, Water Images, Paper Folding, Embedded Figures', status: 'not_started', estimatedMinutes: 60 }
            ]
          }
        ]
      },
      {
        id: 'ssc-english',
        name: 'English Comprehension',
        chapters: [
          {
            id: 'ssce-core',
            name: 'Grammar, Vocabulary & Reading',
            weightage: 'High',
            expectedQuestions: '25 Questions (Tier 1) / 45 Questions (Tier 2)',
            topics: [
              { id: 'se-t1', name: 'Spotting Errors (Subject-Verb, Tenses, Prepositions, Articles)', status: 'not_started', estimatedMinutes: 80 },
              { id: 'se-t2', name: 'Active and Passive Voice, Direct and Indirect Speech', status: 'not_started', estimatedMinutes: 80 },
              { id: 'se-t3', name: 'Vocabulary: Synonyms, Antonyms, One-Word Substitution, Idioms & Phrases', status: 'not_started', estimatedMinutes: 80 },
              { id: 'se-t4', name: 'Cloze Test, Sentence Improvement, Para Jumbles & Comprehension Passages', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        id: 'ssc-ga',
        name: 'General Awareness',
        chapters: [
          {
            id: 'sscga-core',
            name: 'Static GK, General Science & Current Affairs',
            weightage: 'High',
            expectedQuestions: '25 Questions',
            topics: [
              { id: 'sga-t1', name: 'Polity: Articles, Amendments, President, Parliament, Judiciary', status: 'not_started', estimatedMinutes: 70 },
              { id: 'sga-t2', name: 'History: Ancient, Medieval and Modern Indian Freedom Struggle', status: 'not_started', estimatedMinutes: 70 },
              { id: 'sga-t3', name: 'Geography: Rivers, National Parks, Crops, World Geography Facts', status: 'not_started', estimatedMinutes: 70 },
              { id: 'sga-t4', name: 'General Science: Physics, Chemistry, Biology Everyday Principles', status: 'not_started', estimatedMinutes: 70 },
              { id: 'sga-t5', name: 'Current Affairs: National, International, Sports, Awards, Government Schemes', status: 'not_started', estimatedMinutes: 60 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'syllabus-ssc-chsl',
    name: 'SSC CHSL',
    abbreviation: 'SSC CHSL',
    fullName: 'Combined Higher Secondary Level (10+2) Examination',
    category: 'Govt & Civil',
    year: '2026',
    description: 'Recruitment for Lower Divisional Clerk (LDC), Junior Secretariat Assistant (JSA) and Data Entry Operator (DEO).',
    officialExamDate: '2026-07-10',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'Staff Selection Commission (SSC) Notification',
    variants: [
      { id: 'tier-1', name: 'Tier 1 Examination', description: 'English, Quant, Reasoning, General Awareness' },
      { id: 'tier-2', name: 'Tier 2 + Skill/Typing', description: 'Mathematical Abilities, Reasoning, English, General Awareness, Computer' }
    ],
    stages: ['Tier 1', 'Tier 2'],
    subjects: [
      {
        id: 'chsl-quant',
        name: 'Quantitative Aptitude',
        chapters: [
          {
            id: 'chsl-q1',
            name: 'Arithmetic & Basic Algebra',
            weightage: 'High',
            expectedQuestions: '25 Questions',
            topics: [
              { id: 'cq-t1', name: 'Number Systems, Decimals, Fractions, Percentage, Ratio and Proportion', status: 'not_started', estimatedMinutes: 60 },
              { id: 'cq-t2', name: 'Square Roots, Averages, Interest (Simple & Compound), Profit & Loss, Discount', status: 'not_started', estimatedMinutes: 70 },
              { id: 'cq-t3', name: 'Time and Distance, Time and Work, Basic Algebraic Identities', status: 'not_started', estimatedMinutes: 70 },
              { id: 'cq-t4', name: 'Geometry, Mensuration and Trigonometry Foundations', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        id: 'chsl-reasoning',
        name: 'General Intelligence',
        chapters: [
          {
            id: 'chsl-r1',
            name: 'Logical Reasoning & Non-Verbal Abilities',
            weightage: 'High',
            expectedQuestions: '25 Questions',
            topics: [
              { id: 'cr-t1', name: 'Semantic Analogy, Symbolic Operations, Number Analogy', status: 'not_started', estimatedMinutes: 60 },
              { id: 'cr-t2', name: 'Venn Diagrams, Blood Relations, Coding & Decoding, Direction Sense', status: 'not_started', estimatedMinutes: 60 },
              { id: 'cr-t3', name: 'Paper Folding, Unfolding, Figural Pattern, Embedded Figures', status: 'not_started', estimatedMinutes: 50 }
            ]
          }
        ]
      },
      {
        id: 'chsl-english',
        name: 'English Language',
        chapters: [
          {
            id: 'chsl-e1',
            name: 'Grammar and Reading Comprehension',
            weightage: 'High',
            expectedQuestions: '25 Questions',
            topics: [
              { id: 'ce-t1', name: 'Spotting the Error, Fill in the Blanks, Antonyms, Synonyms', status: 'not_started', estimatedMinutes: 60 },
              { id: 'ce-t2', name: 'Idioms & Phrases, One Word Substitution, Active/Passive Voice, Narration', status: 'not_started', estimatedMinutes: 60 },
              { id: 'ce-t3', name: 'Shuffling of Sentence Parts, Cloze Passage, Comprehension Passage', status: 'not_started', estimatedMinutes: 60 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'syllabus-ssc-gd',
    name: 'SSC GD',
    abbreviation: 'SSC GD',
    fullName: 'General Duty Constable (CAPFs, SSF, Rifleman in Assam Rifles)',
    category: 'Govt & Civil',
    year: '2026',
    description: 'National constable recruitment for BSF, CISF, CRPF, SSB, ITBP, AR and SSF.',
    officialExamDate: '2026-02-15',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'Staff Selection Commission (SSC) Examination Notification',
    variants: [
      { id: 'cbe', name: 'Computer-Based Examination (CBE)', description: 'Reasoning, GK, Elementary Maths, English/Hindi' }
    ],
    stages: ['Computer-Based Exam', 'Physical Efficiency Test'],
    subjects: [
      {
        id: 'gd-reasoning',
        name: 'General Intelligence & Reasoning',
        chapters: [
          {
            id: 'gd-r1',
            name: 'Reasoning Ability',
            weightage: 'High',
            expectedQuestions: '20 Questions',
            topics: [
              { id: 'gdr-1', name: 'Analogies, Similarities and Differences, Spatial Visualization', status: 'not_started', estimatedMinutes: 50 },
              { id: 'gdr-2', name: 'Visual Memory, Discrimination, Observation, Relationship Concepts', status: 'not_started', estimatedMinutes: 50 },
              { id: 'gdr-3', name: 'Arithmetical Reasoning and Figural Classification, Arithmetic Number Series', status: 'not_started', estimatedMinutes: 50 },
              { id: 'gdr-4', name: 'Non-Verbal Series, Coding and Decoding', status: 'not_started', estimatedMinutes: 50 }
            ]
          }
        ]
      },
      {
        id: 'gd-maths',
        name: 'Elementary Mathematics',
        chapters: [
          {
            id: 'gd-m1',
            name: 'Basic Mathematics',
            weightage: 'High',
            expectedQuestions: '20 Questions',
            topics: [
              { id: 'gdm-1', name: 'Number Systems, Computation of Whole Numbers, Decimals and Fractions', status: 'not_started', estimatedMinutes: 50 },
              { id: 'gdm-2', name: 'Fundamental Arithmetical Operations, Percentages, Ratio and Proportion', status: 'not_started', estimatedMinutes: 50 },
              { id: 'gdm-3', name: 'Averages, Interest, Profit and Loss, Discount, Mensuration, Time and Distance', status: 'not_started', estimatedMinutes: 60 }
            ]
          }
        ]
      },
      {
        id: 'gd-gk',
        name: 'General Knowledge & General Awareness',
        chapters: [
          {
            id: 'gd-gk1',
            name: 'India and Neighbouring Countries',
            weightage: 'High',
            expectedQuestions: '20 Questions',
            topics: [
              { id: 'gdg-1', name: 'Sports, History, Culture, Geography, Economic Scene', status: 'not_started', estimatedMinutes: 50 },
              { id: 'gdg-2', name: 'General Polity, Indian Constitution, Scientific Research', status: 'not_started', estimatedMinutes: 50 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'syllabus-ibps-po',
    name: 'IBPS PO',
    abbreviation: 'IBPS PO',
    fullName: 'Probationary Officers / Management Trainees - Institute of Banking Personnel Selection',
    category: 'Govt & Civil',
    year: '2026',
    description: 'Recruitment for Probationary Officers in 11 Public Sector Banks across India.',
    officialExamDate: '2026-10-18',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'IBPS Official Exam Calendar',
    variants: [
      { id: 'prelims', name: 'Prelims Examination', description: 'English, Quantitative Aptitude, Reasoning' },
      { id: 'mains', name: 'Mains Examination', description: 'Reasoning & Computer, GA & Banking, English, Data Analysis' }
    ],
    stages: ['Prelims', 'Mains', 'Interview'],
    subjects: [
      {
        id: 'ibps-po-quant',
        name: 'Quantitative Aptitude & Data Analysis',
        chapters: [
          {
            id: 'ipq-di',
            name: 'Data Interpretation & Analysis',
            weightage: 'High',
            expectedQuestions: '15-20 Questions',
            topics: [
              { id: 'ipq-t1', name: 'Table DI, Bar Graphs, Line Graphs, Pie Charts and Mixed DI', status: 'not_started', estimatedMinutes: 80 },
              { id: 'ipq-t2', name: 'Caselet DI, Missing DI, Radar DI and Funnel DI', status: 'not_started', estimatedMinutes: 90 },
              { id: 'ipq-t3', name: 'Data Sufficiency (2 statements & 3 statements)', status: 'not_started', estimatedMinutes: 70 }
            ]
          },
          {
            id: 'ipq-speed',
            name: 'Speed Maths & Arithmetic',
            weightage: 'High',
            expectedQuestions: '15-20 Questions',
            topics: [
              { id: 'ipq-t4', name: 'Approximation, Simplification & Quadratic Equations', status: 'not_started', estimatedMinutes: 60 },
              { id: 'ipq-t5', name: 'Wrong Number Series and Missing Number Series', status: 'not_started', estimatedMinutes: 60 },
              { id: 'ipq-t6', name: 'Profit & Loss, Time & Work, Speed Distance Time, Simple & Compound Interest', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        id: 'ibps-po-reasoning',
        name: 'Reasoning & Computer Aptitude',
        chapters: [
          {
            id: 'ipr-puzzles',
            name: 'High-Level Puzzles & Seating Arrangements',
            weightage: 'High',
            expectedQuestions: '20-25 Questions',
            topics: [
              { id: 'ipr-t1', name: 'Floor & Flat Puzzles, Box Puzzles, Year & Age Based Puzzles', status: 'not_started', estimatedMinutes: 90 },
              { id: 'ipr-t2', name: 'Circular, Square, Linear (Single & Double Row, Unknown Persons) Seating', status: 'not_started', estimatedMinutes: 90 },
              { id: 'ipr-t3', name: 'Variable-Based Multi-Parameter Puzzles', status: 'not_started', estimatedMinutes: 100 }
            ]
          },
          {
            id: 'ipr-misc',
            name: 'Logical Reasoning & Coding',
            weightage: 'High',
            expectedQuestions: '15-20 Questions',
            topics: [
              { id: 'ipr-t4', name: 'Syllogism (Only A Few, Reverse Syllogism)', status: 'not_started', estimatedMinutes: 70 },
              { id: 'ipr-t5', name: 'Inequalities (Coded Inequalities) & Blood Relations', status: 'not_started', estimatedMinutes: 60 },
              { id: 'ipr-t6', name: 'Machine Input-Output & Direction Sense', status: 'not_started', estimatedMinutes: 80 },
              { id: 'ipr-t7', name: 'Critical Reasoning: Statement & Assumptions, Arguments, Course of Action', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        id: 'ibps-po-ga',
        name: 'General, Economy & Banking Awareness',
        chapters: [
          {
            id: 'ipga-banking',
            name: 'Banking Awareness & Current Affairs',
            weightage: 'High',
            expectedQuestions: '40 Questions (Mains)',
            topics: [
              { id: 'ipga-t1', name: 'RBI Monetary Policy, Priority Sector Lending (PSL), Basel Norms', status: 'not_started', estimatedMinutes: 80 },
              { id: 'ipga-t2', name: 'Payment Systems (UPI, NEFT, RTGS, IMPS, CBDC) and Financial Terminology', status: 'not_started', estimatedMinutes: 75 },
              { id: 'ipga-t3', name: 'Union Budget, Economic Survey & Financial News (Last 6 Months)', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'syllabus-ibps-clerk',
    name: 'IBPS Clerk',
    abbreviation: 'IBPS Clerk',
    fullName: 'Clerical Cadre Recruitment - Institute of Banking Personnel Selection',
    category: 'Govt & Civil',
    year: '2026',
    description: 'Annual clerical recruitment examination across public sector participating banks.',
    officialExamDate: '2026-08-22',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'IBPS Notification & Examination Calendar',
    variants: [
      { id: 'prelims', name: 'Prelims', description: 'English, Numerical Ability, Reasoning' },
      { id: 'mains', name: 'Mains', description: 'General/Financial Awareness, English, Reasoning, Quantitative Aptitude' }
    ],
    stages: ['Prelims', 'Mains'],
    subjects: [
      {
        id: 'clerk-quant',
        name: 'Numerical Ability',
        chapters: [
          {
            id: 'cq-core',
            name: 'Arithmetic, Simplification & DI',
            weightage: 'High',
            expectedQuestions: '35 Questions',
            topics: [
              { id: 'cqt-1', name: 'Simplification and Approximation (10-15 Questions)', status: 'not_started', estimatedMinutes: 60 },
              { id: 'cqt-2', name: 'Number Series (Missing & Wrong Series)', status: 'not_started', estimatedMinutes: 60 },
              { id: 'cqt-3', name: 'Quadratic Equations (Factorisation & Signs)', status: 'not_started', estimatedMinutes: 50 },
              { id: 'cqt-4', name: 'Data Interpretation: Tables and Bar Graphs', status: 'not_started', estimatedMinutes: 60 },
              { id: 'cqt-5', name: 'Arithmetic: Percentages, Profit & Loss, Ratio, Simple Interest, Age, Mixture', status: 'not_started', estimatedMinutes: 70 }
            ]
          }
        ]
      },
      {
        id: 'clerk-reasoning',
        name: 'Reasoning Ability',
        chapters: [
          {
            id: 'cr-core',
            name: 'Puzzles & Miscellaneous Reasoning',
            weightage: 'High',
            expectedQuestions: '35 Questions',
            topics: [
              { id: 'crt-1', name: 'Seating Arrangements (Circle, Square, Linear)', status: 'not_started', estimatedMinutes: 70 },
              { id: 'crt-2', name: 'Box Puzzles, Day/Month Based Puzzles', status: 'not_started', estimatedMinutes: 70 },
              { id: 'crt-3', name: 'Syllogism, Inequalities, Alphanumeric Series', status: 'not_started', estimatedMinutes: 60 },
              { id: 'crt-4', name: 'Coding-Decoding and Blood Relations', status: 'not_started', estimatedMinutes: 50 }
            ]
          }
        ]
      },
      {
        id: 'clerk-english',
        name: 'English Language',
        chapters: [
          {
            id: 'ce-core',
            name: 'Grammar and Reading',
            weightage: 'High',
            expectedQuestions: '30 Questions',
            topics: [
              { id: 'cet-1', name: 'Reading Comprehension Passages', status: 'not_started', estimatedMinutes: 60 },
              { id: 'cet-2', name: 'Error Detection, Sentence Improvement & Fillers', status: 'not_started', estimatedMinutes: 60 },
              { id: 'cet-3', name: 'Cloze Test and Para Jumbles', status: 'not_started', estimatedMinutes: 60 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'syllabus-sbi-po',
    name: 'SBI PO',
    abbreviation: 'SBI PO',
    fullName: 'State Bank of India - Probationary Officer Examination',
    category: 'Govt & Civil',
    year: '2026',
    description: 'Premier banking career examination for Probationary Officers in State Bank of India.',
    officialExamDate: '2026-11-15',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'SBI Careers Official Notification',
    variants: [
      { id: 'prelims', name: 'Phase I (Preliminary Exam)', description: 'English, Quant, Reasoning' },
      { id: 'mains', name: 'Phase II (Mains + Descriptive)', description: 'Reasoning & Computer, Data Analysis, GA, English + Letter/Essay' }
    ],
    stages: ['Prelims', 'Mains', 'Group Exercise & Interview'],
    subjects: [
      {
        id: 'sbi-data-analysis',
        name: 'Data Analysis and Interpretation',
        chapters: [
          {
            id: 'sbida-core',
            name: 'Advanced DI & Quant',
            weightage: 'High',
            expectedQuestions: '30 Questions (Mains)',
            topics: [
              { id: 'sbida-1', name: 'Cumulative DI, Probability DI, Venn Diagram DI', status: 'not_started', estimatedMinutes: 90 },
              { id: 'sbida-2', name: 'Arithmetic Caselets, Quantity 1 vs Quantity 2 Comparisons', status: 'not_started', estimatedMinutes: 80 },
              { id: 'sbida-3', name: 'Data Sufficiency on High-Level Topics', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        id: 'sbi-reasoning',
        name: 'Reasoning and Computer Aptitude',
        chapters: [
          {
            id: 'sbir-core',
            name: 'Puzzles & Analytical Reasoning',
            weightage: 'High',
            expectedQuestions: '40 Questions (Mains)',
            topics: [
              { id: 'sbir-1', name: 'Concentric Circular, Hexagonal, Blood-Relation Mixed Puzzles', status: 'not_started', estimatedMinutes: 100 },
              { id: 'sbir-2', name: 'High-Level Coded Input Output and Binary Logic', status: 'not_started', estimatedMinutes: 90 },
              { id: 'sbir-3', name: 'Critical Reasoning: Inferences, Cause and Effect, Strengthen/Weaken Arguments', status: 'not_started', estimatedMinutes: 85 }
            ]
          }
        ]
      },
      {
        id: 'sbi-ga',
        name: 'General, Economy and Banking Awareness',
        chapters: [
          {
            id: 'sbi-ga-core',
            name: 'Current Banking Affairs',
            weightage: 'High',
            expectedQuestions: '50 Questions (Mains)',
            topics: [
              { id: 'sbiga-1', name: 'RBI Directives, Banking Regulations, FinTech & Digital Rupee', status: 'not_started', estimatedMinutes: 80 },
              { id: 'sbiga-2', name: 'Government Economic Policies, MoUs, Global Banking Summits', status: 'not_started', estimatedMinutes: 75 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'syllabus-rbi-grade-b',
    name: 'RBI Grade B',
    abbreviation: 'RBI Gr B',
    fullName: 'Reserve Bank of India - Officers in Grade B (General)',
    category: 'Govt & Civil',
    year: '2026',
    description: 'Premier central banking examination for officers in the Reserve Bank of India.',
    officialExamDate: '2026-06-20',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'Reserve Bank of India Services Board Notification',
    variants: [
      { id: 'phase-1', name: 'Phase I (Online Exam)', description: 'GA (80Q), English (30Q), Quant (30Q), Reasoning (60Q)' },
      { id: 'phase-2', name: 'Phase II (ESI, English, FM)', description: 'Economic & Social Issues, English Writing, Finance & Management' }
    ],
    stages: ['Phase I', 'Phase II', 'Interview'],
    subjects: [
      {
        id: 'rbi-esi',
        name: 'Economic & Social Issues (ESI)',
        chapters: [
          {
            id: 'resi-growth',
            name: 'Growth & Development, Indian Economy',
            weightage: 'High',
            expectedQuestions: '50 Marks (Obj) + 50 Marks (Desc)',
            topics: [
              { id: 'resi-1', name: 'National Income, Per Capita Income, Poverty Alleviation, Employment Generation', status: 'not_started', estimatedMinutes: 90 },
              { id: 'resi-2', name: 'Monetary & Fiscal Policy, Balance of Payments, Foreign Trade Policy', status: 'not_started', estimatedMinutes: 90 },
              { id: 'resi-3', name: 'Sustainable Development, Climate Change, Multilateral Bodies (IMF, World Bank, WTO)', status: 'not_started', estimatedMinutes: 85 }
            ]
          }
        ]
      },
      {
        id: 'rbi-fm',
        name: 'Finance & Management (FM)',
        chapters: [
          {
            id: 'rfm-fin',
            name: 'Financial System & Financial Markets',
            weightage: 'High',
            expectedQuestions: '50 Marks (Obj) + 50 Marks (Desc)',
            topics: [
              { id: 'rfm-1', name: 'Structure and Functions of Financial Institutions, RBI, SEBI, IRDAI', status: 'not_started', estimatedMinutes: 90 },
              { id: 'rfm-2', name: 'Money Market, Bond Market, Equity Market, Forex Market and Derivatives', status: 'not_started', estimatedMinutes: 100 },
              { id: 'rfm-3', name: 'Corporate Governance, Accounting Ratios, Cash Flow Statement, Working Capital', status: 'not_started', estimatedMinutes: 90 },
              { id: 'rfm-4', name: 'Management Principles, Leadership Theories, Motivation, Organizational Behaviour', status: 'not_started', estimatedMinutes: 90 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'syllabus-rrb-ntpc',
    name: 'RRB NTPC',
    abbreviation: 'RRB NTPC',
    fullName: 'Non-Technical Popular Categories - Railway Recruitment Boards',
    category: 'Govt & Civil',
    year: '2026',
    description: 'Recruitment for Station Master, Goods Train Manager, Senior Clerk, Junior Accounts Assistant in Indian Railways.',
    officialExamDate: '2026-08-10',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'Railway Recruitment Boards (RRB) Official Notification',
    variants: [
      { id: 'cbt-1', name: 'CBT 1 (Screening Test)', description: 'General Awareness (40Q), Mathematics (30Q), Reasoning (30Q)' },
      { id: 'cbt-2', name: 'CBT 2 (Final Merit Test)', description: 'General Awareness (50Q), Mathematics (35Q), Reasoning (35Q)' }
    ],
    stages: ['CBT 1', 'CBT 2', 'Skill Test (Typing/CBAT)'],
    subjects: [
      {
        id: 'rrb-math',
        name: 'Mathematics',
        chapters: [
          {
            id: 'rrbm-core',
            name: 'Arithmetic and Elementary Algebra',
            weightage: 'High',
            expectedQuestions: '30-35 Questions',
            topics: [
              { id: 'rrbm-1', name: 'Number System, Decimals, Fractions, LCM and HCF', status: 'not_started', estimatedMinutes: 50 },
              { id: 'rrbm-2', name: 'Ratio and Proportions, Percentages, Mensuration, Time and Work', status: 'not_started', estimatedMinutes: 60 },
              { id: 'rrbm-3', name: 'Time and Distance, Simple and Compound Interest, Profit and Loss', status: 'not_started', estimatedMinutes: 60 },
              { id: 'rrbm-4', name: 'Elementary Algebra, Geometry, Trigonometry, Elementary Statistics', status: 'not_started', estimatedMinutes: 70 }
            ]
          }
        ]
      },
      {
        id: 'rrb-ga',
        name: 'General Awareness',
        chapters: [
          {
            id: 'rrbga-core',
            name: 'Static GK, Science & Current Events',
            weightage: 'High',
            expectedQuestions: '40-50 Questions',
            topics: [
              { id: 'rrbg-1', name: 'Indian Railways Facts, History, Geography, Indian Literature', status: 'not_started', estimatedMinutes: 60 },
              { id: 'rrbg-2', name: 'General Science and Life Science (up to 10th CBSE)', status: 'not_started', estimatedMinutes: 60 },
              { id: 'rrbg-3', name: 'UN and Other Important World Organizations, Computer and Applications', status: 'not_started', estimatedMinutes: 50 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // COMMERCE
  // =========================================================================
  {
    id: 'syllabus-ca-foundation',
    name: 'CA Foundation',
    abbreviation: 'CA Fnd',
    fullName: 'Chartered Accountancy - Foundation Course (ICAI New Scheme)',
    category: 'Commerce',
    year: '2026',
    description: 'Entry-level examination conducted by the Institute of Chartered Accountants of India (ICAI).',
    officialExamDate: '2026-06-15',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'ICAI New Scheme of Education and Training Syllabus',
    variants: [
      { id: 'paper-1', name: 'Paper 1: Accounting', description: '100 Marks Subjective' },
      { id: 'paper-2', name: 'Paper 2: Business Laws', description: '100 Marks Subjective' },
      { id: 'paper-3', name: 'Paper 3: Quantitative Aptitude', description: '100 Marks Objective' },
      { id: 'paper-4', name: 'Paper 4: Business Economics', description: '100 Marks Objective' }
    ],
    stages: ['Single Examination Session'],
    subjects: [
      {
        id: 'caf-acc',
        name: 'Accounting',
        chapters: [
          {
            id: 'cafa-p1',
            name: 'Theoretical Framework & Accounting Process',
            weightage: 'High',
            expectedQuestions: '20-25 Marks',
            topics: [
              { id: 'caf-t1', name: 'Accounting Concepts, Principles, Conventions and Standards', status: 'not_started', estimatedMinutes: 80 },
              { id: 'caf-t2', name: 'Journal, Ledger, Trial Balance, Rectification of Errors', status: 'not_started', estimatedMinutes: 90 },
              { id: 'caf-t3', name: 'Bank Reconciliation Statement (BRS) & Depreciation Accounting', status: 'not_started', estimatedMinutes: 90 }
            ]
          },
          {
            id: 'cafa-p2',
            name: 'Special Transactions & Partnership Accounts',
            weightage: 'High',
            expectedQuestions: '35-40 Marks',
            topics: [
              { id: 'caf-t4', name: 'Bills of Exchange, Promissory Notes and Accommodation Bills', status: 'not_started', estimatedMinutes: 80 },
              { id: 'caf-t5', name: 'Inventory Valuation (FIFO, LIFO, Weighted Average, NRV)', status: 'not_started', estimatedMinutes: 80 },
              { id: 'caf-t6', name: 'Partnership Accounts: Admission, Retirement, Death of Partner', status: 'not_started', estimatedMinutes: 100 }
            ]
          },
          {
            id: 'cafa-p3',
            name: 'Company Accounts & NPO',
            weightage: 'High',
            expectedQuestions: '30-35 Marks',
            topics: [
              { id: 'caf-t7', name: 'Financial Statements of Not-for-Profit Organisations (NPO)', status: 'not_started', estimatedMinutes: 90 },
              { id: 'caf-t8', name: 'Issue of Shares, Forfeiture, Re-issue and Issue of Debentures', status: 'not_started', estimatedMinutes: 100 }
            ]
          }
        ]
      },
      {
        id: 'caf-law',
        name: 'Business Laws',
        chapters: [
          {
            id: 'cafl-p1',
            name: 'The Indian Regulatory Framework & Contract Act',
            weightage: 'High',
            expectedQuestions: '35-40 Marks',
            topics: [
              { id: 'cafl-t1', name: 'Indian Contract Act 1872: Offer, Acceptance, Consideration, Capacity', status: 'not_started', estimatedMinutes: 90 },
              { id: 'cafl-t2', name: 'Free Consent, Legality of Object, Void Agreements, Performance & Breach', status: 'not_started', estimatedMinutes: 90 },
              { id: 'cafl-t3', name: 'Sale of Goods Act 1930: Conditions, Warranties, Transfer of Ownership', status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'cafl-p2',
            name: 'Companies Act, Partnership Act & LLP Act',
            weightage: 'High',
            expectedQuestions: '35-40 Marks',
            topics: [
              { id: 'cafl-t4', name: 'Indian Partnership Act 1932: Rights, Duties, Dissolution of Firm', status: 'not_started', estimatedMinutes: 80 },
              { id: 'cafl-t5', name: 'Limited Liability Partnership Act 2008: Characteristics & Incorporation', status: 'not_started', estimatedMinutes: 70 },
              { id: 'cafl-t6', name: 'Companies Act 2013: Meaning, Features, Types of Companies, MoA, AoA', status: 'not_started', estimatedMinutes: 90 }
            ]
          }
        ]
      },
      {
        id: 'caf-qa',
        name: 'Quantitative Aptitude',
        chapters: [
          {
            id: 'cafq-math',
            name: 'Business Mathematics, LR and Statistics',
            weightage: 'High',
            expectedQuestions: '100 Marks',
            topics: [
              { id: 'cafq-t1', name: 'Ratio, Proportion, Indices, Logarithms and Equations', status: 'not_started', estimatedMinutes: 70 },
              { id: 'cafq-t2', name: 'Mathematics of Finance: Simple & Compound Interest, Annuity, Perpetuity', status: 'not_started', estimatedMinutes: 90 },
              { id: 'cafq-t3', name: 'Logical Reasoning: Number Series, Direction, Seating, Blood Relations', status: 'not_started', estimatedMinutes: 70 },
              { id: 'cafq-t4', name: 'Statistics: Central Tendency, Dispersion, Correlation, Regression, Probability', status: 'not_started', estimatedMinutes: 90 }
            ]
          }
        ]
      },
      {
        id: 'caf-eco',
        name: 'Business Economics',
        chapters: [
          {
            id: 'cafe-core',
            name: 'Microeconomics & Macroeconomics',
            weightage: 'High',
            expectedQuestions: '100 Marks',
            topics: [
              { id: 'cafe-t1', name: 'Demand & Supply Analysis, Elasticity, Consumer Equilibrium', status: 'not_started', estimatedMinutes: 80 },
              { id: 'cafe-t2', name: 'Theory of Production and Cost, Market Forms (Perfect, Monopoly, Oligopoly)', status: 'not_started', estimatedMinutes: 90 },
              { id: 'cafe-t3', name: 'National Income, Public Finance, Monetary Policy and International Trade', status: 'not_started', estimatedMinutes: 90 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'syllabus-ca-intermediate',
    name: 'CA Intermediate',
    abbreviation: 'CA Inter',
    fullName: 'Chartered Accountancy - Intermediate Examination (ICAI New Scheme)',
    category: 'Commerce',
    year: '2026',
    description: 'Second level of CA examination comprising Group 1 and Group 2 papers under ICAI New Scheme.',
    officialExamDate: '2026-05-02',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'ICAI Board of Studies Curriculum',
    variants: [
      { id: 'group-1', name: 'Group 1 (3 Papers)', description: 'Advanced Accounting, Corporate Laws, Taxation' },
      { id: 'group-2', name: 'Group 2 (3 Papers)', description: 'Costing, Audit & Ethics, FM & Strategic Management' },
      { id: 'both-groups', name: 'Both Groups (6 Papers)', description: 'Complete CA Intermediate' }
    ],
    stages: ['Group 1', 'Group 2'],
    subjects: [
      {
        id: 'cai-adv-acc',
        name: 'Advanced Accounting',
        stage: 'Group 1',
        chapters: [
          {
            id: 'cai-as',
            name: 'Accounting Standards (AS)',
            weightage: 'High',
            expectedQuestions: '40-50 Marks',
            topics: [
              { id: 'cai-t1', name: 'AS 1, 2, 3, 4, 5, 7, 9, 10, 11 (Framework & Disclosure)', status: 'not_started', estimatedMinutes: 100 },
              { id: 'cai-t2', name: 'AS 12, 13, 14 (Amalgamation), AS 16, 17, 18, 19 (Leases)', status: 'not_started', estimatedMinutes: 110 },
              { id: 'cai-t3', name: 'AS 20 (EPS), AS 22 (Taxes on Income), AS 24, 26 (Intangibles), AS 28, 29', status: 'not_started', estimatedMinutes: 110 }
            ]
          },
          {
            id: 'cai-corp',
            name: 'Corporate Financial Statements & Reconstructions',
            weightage: 'High',
            expectedQuestions: '45-55 Marks',
            topics: [
              { id: 'cai-t4', name: 'Preparation of Company Financial Statements Schedule III', status: 'not_started', estimatedMinutes: 90 },
              { id: 'cai-t5', name: 'Buyback of Securities, Internal Reconstruction and Branch Accounting', status: 'not_started', estimatedMinutes: 100 },
              { id: 'cai-t6', name: 'Consolidation of Financial Statements (Holding Companies - AS 21)', status: 'not_started', estimatedMinutes: 120 }
            ]
          }
        ]
      },
      {
        id: 'cai-tax',
        name: 'Taxation (Direct Tax & Indirect Tax)',
        stage: 'Group 1',
        chapters: [
          {
            id: 'cai-dt',
            name: 'Income Tax Law (50 Marks)',
            weightage: 'High',
            expectedQuestions: '50 Marks',
            topics: [
              { id: 'caidt-1', name: 'Heads of Income: Salaries, House Property, PGBP', status: 'not_started', estimatedMinutes: 110 },
              { id: 'caidt-2', name: 'Capital Gains, Income from Other Sources, Clubbing & Set-off', status: 'not_started', estimatedMinutes: 100 },
              { id: 'caidt-3', name: 'Deductions (Chapter VI-A), TDS, TCS, Advance Tax and Total Income Computation', status: 'not_started', estimatedMinutes: 110 }
            ]
          },
          {
            id: 'cai-idt',
            name: 'Goods and Services Tax - GST (50 Marks)',
            weightage: 'High',
            expectedQuestions: '50 Marks',
            topics: [
              { id: 'caiidt-1', name: 'Concept of Supply, Place of Supply, Time and Value of Supply', status: 'not_started', estimatedMinutes: 100 },
              { id: 'caiidt-2', name: 'Input Tax Credit (ITC) Rules, Registration under GST, Returns and E-way Bill', status: 'not_started', estimatedMinutes: 100 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'syllabus-ca-final',
    name: 'CA Final',
    abbreviation: 'CA Final',
    fullName: 'Chartered Accountancy - Final Examination (ICAI New Scheme)',
    category: 'Commerce',
    year: '2026',
    description: 'Final qualifying examination to practice as a certified Chartered Accountant in India.',
    officialExamDate: '2026-05-01',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'ICAI Board of Studies - Final Syllabus',
    variants: [
      { id: 'group-1', name: 'Group 1 (FR, AFM, Auditing)', description: 'Financial Reporting, Advanced FM, Audit' },
      { id: 'group-2', name: 'Group 2 (Direct Tax, Indirect Tax, Multi-disciplinary)', description: 'DT, IDT & Integrated Case Studies' }
    ],
    stages: ['Group 1', 'Group 2'],
    subjects: [
      {
        id: 'cafin-fr',
        name: 'Financial Reporting (Ind AS)',
        stage: 'Group 1',
        chapters: [
          {
            id: 'cfr-indas',
            name: 'Indian Accounting Standards (Ind AS)',
            weightage: 'High',
            expectedQuestions: '100 Marks',
            topics: [
              { id: 'cfr-t1', name: 'Ind AS 115 (Revenue from Contracts with Customers)', status: 'not_started', estimatedMinutes: 120 },
              { id: 'cfr-t2', name: 'Ind AS 116 (Leases) & Ind AS 109, 32, 107 (Financial Instruments)', status: 'not_started', estimatedMinutes: 130 },
              { id: 'cfr-t3', name: 'Ind AS 103 (Business Combinations) and Consolidated Financial Statements (Ind AS 110)', status: 'not_started', estimatedMinutes: 140 },
              { id: 'cfr-t4', name: 'Share-Based Payment (Ind AS 102), Employee Benefits (Ind AS 19), Impairment (Ind AS 36)', status: 'not_started', estimatedMinutes: 110 }
            ]
          }
        ]
      },
      {
        id: 'cafin-afm',
        name: 'Advanced Financial Management (AFM)',
        stage: 'Group 1',
        chapters: [
          {
            id: 'cafm-core',
            name: 'Portfolio Management & Derivatives',
            weightage: 'High',
            expectedQuestions: '100 Marks',
            topics: [
              { id: 'cafm-t1', name: 'Financial Policy, Risk Management, Security Valuation (Equity & Bonds)', status: 'not_started', estimatedMinutes: 100 },
              { id: 'cafm-t2', name: 'Portfolio Management: CAPM, Arbitrage Pricing, Sharpe & Treynor Ratios', status: 'not_started', estimatedMinutes: 110 },
              { id: 'cafm-t3', name: 'Derivatives Analysis: Futures, Options Valuation, Greeks, Swaps', status: 'not_started', estimatedMinutes: 120 },
              { id: 'cafm-t4', name: 'Foreign Exchange Exposure & International Financial Management', status: 'not_started', estimatedMinutes: 110 },
              { id: 'cafm-t5', name: 'Mergers, Acquisitions and Corporate Restructuring Valuation', status: 'not_started', estimatedMinutes: 100 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // DEFENCE AND LAW
  // =========================================================================
  {
    id: 'syllabus-nda',
    name: 'NDA',
    abbreviation: 'NDA',
    fullName: 'National Defence Academy & Naval Academy Examination (UPSC)',
    category: 'Defence & Law',
    year: '2026',
    description: 'Premier tri-service entrance exam for Indian Army, Navy, and Air Force officer cadet training.',
    officialExamDate: '2026-04-12',
    isOfficialDateAnnounced: true,
    verifiedOfficialSource: 'UPSC Examination Notice for NDA & NA',
    variants: [
      { id: 'nda-exam', name: 'NDA & NA Written Examination', description: 'Paper 1 (Mathematics) + Paper 2 (GAT)' }
    ],
    stages: ['Written Examination', 'SSB Interview'],
    subjects: [
      {
        id: 'nda-math',
        name: 'Mathematics (Paper I)',
        chapters: [
          {
            id: 'ndam-alg',
            name: 'Algebra, Matrices & Trigonometry',
            weightage: 'High',
            expectedQuestions: '50-60 Questions (300 Marks total)',
            topics: [
              { id: 'ndam-1', name: 'Sets, Venn Diagrams, De Morgan Laws, Relations and Functions', status: 'not_started', estimatedMinutes: 70 },
              { id: 'ndam-2', name: 'Complex Numbers, Modulus, Argument, Quadratic Equations, Progressions', status: 'not_started', estimatedMinutes: 75 },
              { id: 'ndam-3', name: 'Matrices, Determinants, Cramer Rule and Inverse of Matrix', status: 'not_started', estimatedMinutes: 70 },
              { id: 'ndam-4', name: 'Trigonometry: Angles, Trigonometric Identities, Heights and Distances, Properties of Triangles', status: 'not_started', estimatedMinutes: 80 }
            ]
          },
          {
            id: 'ndam-calc',
            name: 'Calculus, Vectors & Statistics',
            weightage: 'High',
            expectedQuestions: '60-70 Questions',
            topics: [
              { id: 'ndam-5', name: 'Coordinate Geometry 2D: Lines, Circles, Parabola, Ellipse, Hyperbola', status: 'not_started', estimatedMinutes: 80 },
              { id: 'ndam-6', name: 'Differential Calculus: Limits, Continuity, Derivatives, Maxima & Minima', status: 'not_started', estimatedMinutes: 90 },
              { id: 'ndam-7', name: 'Integral Calculus & Differential Equations Standard Solutions', status: 'not_started', estimatedMinutes: 90 },
              { id: 'ndam-8', name: 'Vector Algebra and Statistics & Probability (Bayes Theorem, Binomial)', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        id: 'nda-gat',
        name: 'General Ability Test - GAT (Paper II)',
        chapters: [
          {
            id: 'ndag-eng',
            name: 'Part A: English Language (200 Marks)',
            weightage: 'High',
            expectedQuestions: '50 Questions',
            topics: [
              { id: 'ndae-1', name: 'Grammar and Usage, Spotting Errors, Prepositions, Tenses', status: 'not_started', estimatedMinutes: 60 },
              { id: 'ndae-2', name: 'Vocabulary: Synonyms, Antonyms, Idioms and Phrases', status: 'not_started', estimatedMinutes: 60 },
              { id: 'ndae-3', name: 'Sentence Ordering (Jumbled Sentences) and Reading Comprehension', status: 'not_started', estimatedMinutes: 60 }
            ]
          },
          {
            id: 'ndag-gk',
            name: 'Part B: General Knowledge & Science (400 Marks)',
            weightage: 'High',
            expectedQuestions: '100 Questions',
            topics: [
              { id: 'ndagk-1', name: 'Physics: Motion, Newton Laws, Gravitation, Electricity, Sound, Optics', status: 'not_started', estimatedMinutes: 70 },
              { id: 'ndagk-2', name: 'Chemistry: Physical/Chemical changes, Elements, Acids, Bases, Air, Water', status: 'not_started', estimatedMinutes: 60 },
              { id: 'ndagk-3', name: 'General Science: Cells, Reproduction, Human Diseases, Nutrition', status: 'not_started', estimatedMinutes: 60 },
              { id: 'ndagk-4', name: 'History, Freedom Movement, Indian Constitution and Geography', status: 'not_started', estimatedMinutes: 75 },
              { id: 'ndagk-5', name: 'Current Events: Defence Exercises, Sports, Awards, National/Global Affairs', status: 'not_started', estimatedMinutes: 60 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'syllabus-clat',
    name: 'CLAT',
    abbreviation: 'CLAT',
    fullName: 'Common Law Admission Test (UG) - Consortium of NLUs',
    category: 'Defence & Law',
    year: '2026',
    description: 'National centralized entrance exam for admissions to 24 National Law Universities across India.',
    officialExamDate: '2026-12-06',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'Consortium of National Law Universities Official Notification',
    variants: [
      { id: 'clat-ug', name: 'CLAT Undergraduate (BA LLB / BBA LLB)', description: 'Comprehension-based 120 Questions' },
      { id: 'clat-pg', name: 'CLAT Postgraduate (LLM)', description: 'Constitutional Law, Jurisprudence, Contracts' }
    ],
    stages: ['Single Comprehension Paper'],
    subjects: [
      {
        id: 'clat-legal',
        name: 'Legal Reasoning',
        chapters: [
          {
            id: 'clatl-core',
            name: 'Law Principles & Legal Facts Application',
            weightage: 'High',
            expectedQuestions: '28-32 Questions (approx 25%)',
            topics: [
              { id: 'clat-t1', name: 'Constitutional Law: Fundamental Rights, Preamble, Separation of Powers', status: 'not_started', estimatedMinutes: 80 },
              { id: 'clat-t2', name: 'Law of Torts: Negligence, Nuisance, Defamation, Strict & Absolute Liability', status: 'not_started', estimatedMinutes: 90 },
              { id: 'clat-t3', name: 'Law of Contracts: Offer, Acceptance, Consideration, Breach, Damages', status: 'not_started', estimatedMinutes: 90 },
              { id: 'clat-t4', name: 'Criminal Law (BNS/IPC): General Exceptions, Offences Against Body & Property', status: 'not_started', estimatedMinutes: 90 }
            ]
          }
        ]
      },
      {
        id: 'clat-logical',
        name: 'Logical Reasoning',
        chapters: [
          {
            id: 'clatr-core',
            name: 'Critical & Analytical Reasoning',
            weightage: 'High',
            expectedQuestions: '22-26 Questions (approx 20%)',
            topics: [
              { id: 'clatr-1', name: 'Identifying Arguments, Premises and Conclusions in Editorial Passages', status: 'not_started', estimatedMinutes: 75 },
              { id: 'clatr-2', name: 'Strengthening and Weakening Arguments, Hidden Assumptions', status: 'not_started', estimatedMinutes: 80 },
              { id: 'clatr-3', name: 'Detecting Logical Fallacies, Parallel Reasoning and Inferences', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        id: 'clat-gk',
        name: 'Current Affairs & General Knowledge',
        chapters: [
          {
            id: 'clatgk-core',
            name: 'Contemporary National & Global Affairs',
            weightage: 'High',
            expectedQuestions: '28-32 Questions (approx 25%)',
            topics: [
              { id: 'clatg-1', name: 'Judicial Pronouncements, Supreme Court Landmark Judgments', status: 'not_started', estimatedMinutes: 75 },
              { id: 'clatg-2', name: 'International Geopolitics, UN Treaties, Conflicts and Diplomacy', status: 'not_started', estimatedMinutes: 75 },
              { id: 'clatg-3', name: 'National Governance, Bills Passed in Parliament, Constitutional Amendments', status: 'not_started', estimatedMinutes: 75 }
            ]
          }
        ]
      },
      {
        id: 'clat-eng-qt',
        name: 'English Language & Quantitative Techniques',
        chapters: [
          {
            id: 'clateq-core',
            name: 'Reading Passages & Data Analysis',
            weightage: 'High',
            expectedQuestions: '32-38 Questions combined',
            topics: [
              { id: 'clate-1', name: 'English: Complex Reading Passages, Vocabulary in Context, Tone & Metaphors', status: 'not_started', estimatedMinutes: 80 },
              { id: 'clatq-1', name: 'Quant Techniques: Data Interpretation Passages, Caselet DI, Ratios and Percentages', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // UNIVERSITY
  // =========================================================================
  {
    id: 'syllabus-cuet-ug',
    name: 'CUET UG',
    abbreviation: 'CUET UG',
    fullName: 'Common University Entrance Test (Undergraduate) - NTA',
    category: 'University',
    year: '2026',
    description: 'National university entrance examination for admission into Delhi University, BHU, JNU, and all Central Universities.',
    officialExamDate: '2026-05-15',
    isOfficialDateAnnounced: false,
    verifiedOfficialSource: 'National Testing Agency (NTA) CUET Bulletin',
    variants: [
      { id: 'science', name: 'Science Domain (PCM / PCB)', description: 'Physics, Chemistry, Maths, Biology + General Test' },
      { id: 'humanities', name: 'Humanities & Arts', description: 'History, Political Science, Economics, Sociology' },
      { id: 'commerce-domain', name: 'Commerce Domain', description: 'Accountancy, Business Studies, Economics, Applied Maths' }
    ],
    stages: ['Computer-Based Test / Hybrid'],
    subjects: [
      {
        id: 'cuet-general-test',
        name: 'Section III: General Test',
        chapters: [
          {
            id: 'cuetg-core',
            name: 'GK, Numerical Ability & Reasoning',
            weightage: 'High',
            expectedQuestions: '60 Questions (Attempt 50)',
            topics: [
              { id: 'cug-t1', name: 'General Knowledge, Current Affairs, General Mental Ability', status: 'not_started', estimatedMinutes: 60 },
              { id: 'cug-t2', name: 'Numerical Ability: Arithmetic, Mensuration, Statistics, Basic Algebra', status: 'not_started', estimatedMinutes: 70 },
              { id: 'cug-t3', name: 'Reasoning: Simple analogies, Series, Analytical Reasoning, Logical Sequences', status: 'not_started', estimatedMinutes: 70 }
            ]
          }
        ]
      },
      {
        id: 'cuet-domain-phy',
        name: 'Domain: Physics (Class 12 NCERT Standard)',
        chapters: [
          {
            id: 'cuetp-core',
            name: 'Electrostatics to Modern Physics',
            weightage: 'High',
            expectedQuestions: '50 Questions (Attempt 40)',
            topics: [
              { id: 'cup-t1', name: 'Electrostatics & Current Electricity (NCERT Class 12)', status: 'not_started', estimatedMinutes: 75 },
              { id: 'cup-t2', name: 'Magnetic Effects of Current, Magnetism & EMI, AC Circuits', status: 'not_started', estimatedMinutes: 75 },
              { id: 'cup-t3', name: 'Electromagnetic Waves, Optics, Dual Nature, Atoms & Nuclei, Semiconductor Devices', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        id: 'cuet-domain-chem',
        name: 'Domain: Chemistry (Class 12 NCERT Standard)',
        chapters: [
          {
            id: 'cuetc-core',
            name: 'Physical, Inorganic and Organic Chemistry',
            weightage: 'High',
            expectedQuestions: '50 Questions (Attempt 40)',
            topics: [
              { id: 'cuc-t1', name: 'Solutions, Electrochemistry and Chemical Kinetics', status: 'not_started', estimatedMinutes: 75 },
              { id: 'cuc-t2', name: 'd and f-Block Elements & Coordination Compounds', status: 'not_started', estimatedMinutes: 75 },
              { id: 'cuc-t3', name: 'Haloalkanes, Alcohols, Phenols, Aldehydes, Ketones, Amines, Biomolecules', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        id: 'cuet-domain-math',
        name: 'Domain: Mathematics / Applied Mathematics',
        chapters: [
          {
            id: 'cuetm-core',
            name: 'Core Mathematics & Applied Mathematics',
            weightage: 'High',
            expectedQuestions: '50 Questions (Attempt 40)',
            topics: [
              { id: 'cum-t1', name: 'Relations, Functions, Inverse Trigonometric Functions, Matrices, Determinants', status: 'not_started', estimatedMinutes: 75 },
              { id: 'cum-t2', name: 'Continuity, Differentiability, Applications of Derivatives, Integrals, Differential Equations', status: 'not_started', estimatedMinutes: 85 },
              { id: 'cum-t3', name: 'Vectors, Three-Dimensional Geometry, Linear Programming & Probability', status: 'not_started', estimatedMinutes: 80 }
            ]
          }
        ]
      }
    ]
  }
];

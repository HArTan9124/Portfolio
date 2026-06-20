// Client-side Portfolio Data definition to avoid hardcoded strings in preview pages
window.portfolioData = {
  profile: {
    name: "Harshit Tandon",
    role: "Software Engineer, Mobile AI Developer & Wearable Computing Researcher",
    tagline: "Engineering Intelligence at the Edge of Healthcare",
    bio: "I design and build distributed low-latency IoT systems, WearOS applications, and on-device machine learning models to detect acute health anomalies in real-time.",
    email: "contact@harshittandon.com",
    location: "New Delhi, India // Remote",
    github: "https://github.com/HArTan9124",
    linkedin: "https://linkedin.com",
    researchPhilosophy: "I believe that the next breakthrough in healthcare will not happen in massive clinical rooms, but silently on our wrists. By combining wearable sensors with on-device artificial intelligence, we can move from reactive healthcare to predictive, continuous safeguarding.",
    researchFocus: "Investigating decentralized cyber-physical healthcare systems. Integrating BLE mesh with local mobile hubs for continuous intensive care telemetry.",
    stats: [
      { value: "98.4%", label: "ANOMALY ACCURACY" },
      { value: "< 10ms", label: "ALERT TRIGGER TIMING" },
      { value: "200h+", label: "COLLECTED ECG DATASETS" }
    ]
  },
  specialties: [
    {
      icon: "brain",
      title: "Embedded & Edge AI",
      desc: "Optimizing neural networks (CNNs, LSTMs) to run on-device inside WearOS and Android systems with restricted memory layouts."
    },
    {
      icon: "activity",
      title: "Biosignal Preprocessing",
      desc: "Filtering real-time PPG, ECG, and accelerometer signals using Butterworth and Chebyshev filters prior to local model inference."
    },
    {
      icon: "shield",
      title: "Anomaly Detection",
      desc: "Creating zero-latency heuristic and ML alert cascades for identifying fall signatures, seizures, and cardiovascular instabilities."
    }
  ],
  experiences: [
    {
      role: "Lead Wearable AI Researcher",
      company: "Bio-Medical AI & Signal Processing Lab",
      duration: "2025 - Present",
      location: "On-site / Research Center",
      icon: "cpu",
      highlights: [
        "Architecting WearOS EEG/ECG anomaly detection models that achieve 98.4% validation accuracy inside 10ms inference loops.",
        "Optimized CNN-LSTM models for low-power ARM architectures, reducing battery depletion from 25% down to 12% per 24 hours.",
        "Authoring scientific paper on real-time cyber-physical systems for cardiovascular telemetry."
      ]
    },
    {
      role: "Mobile AI & IoT Developer",
      company: "IntelliHealth Systems",
      duration: "2023 - 2025",
      location: "Hybrid",
      icon: "cpu",
      highlights: [
        "Engineered a distributed ESP32 sensor network using BLE mesh to stream ICU bio-signals with under 50ms latency.",
        "Created an offline-first Android application featuring local SQLite filtering and dynamic signal visualizers.",
        "Integrated Supabase Auth and remote sync layers ensuring zero-packet loss during network transitions."
      ]
    },
    {
      role: "Android Systems Software Engineer",
      company: "Quantum Wearables",
      duration: "2021 - 2023",
      location: "On-site",
      icon: "smartphone",
      highlights: [
        "Maintained custom AOSP ROM components for hardware-level sensor pooling on custom IoT medical panels.",
        "Implemented Butterworth low-pass filters inside Java/C++ JNI layers for high-fidelity noise cancellation.",
        "Scaled background telemetry service handler architecture to handle 500Hz raw IMU coordinate streams."
      ]
    }
  ],
  projects: [
    {
      title: "NeuroWatch OS",
      desc: "An on-wrist EEG/ECG stroke and seizure classification system for WearOS. Integrates custom C++ JNI filters and runs a quantized CNN-LSTM model with zero network dependence to guard patient privacy.",
      tags: ["WearOS", "C++ JNI", "TensorFlow Lite", "Android SDK"],
      icon: "activity",
      github: "https://github.com/HArTan9124/neurowatch-os",
      featured: true,
      metrics: "Inference: 10ms | Battery impact: -12% / 24h"
    },
    {
      title: "GaitAnalyse AI",
      desc: "Spatial coordinate preprocessing client for Parkinson's disease gait analysis. Uses body keypoint pre-processing and dynamic time warping to highlight progressive motor deterioration.",
      tags: ["Flutter", "Clean Architecture", "PyTorch Mobile", "On-device ML"],
      icon: "cpu",
      github: "https://github.com/HArTan9124/gait-analyse-ai",
      featured: false,
      metrics: "Spatial resolution: 0.1mm | Contrast: AAA"
    },
    {
      title: "BioLink IoT Mesh",
      desc: "Distributed ESP32 firmware running a lightweight BLE mesh network. Enables simultaneous bio-sensor broadcast to local edge routers with automatic path failover and sub-50ms transmission lag.",
      tags: ["C++", "ESP-IDF", "FreeRTOS", "BLE Mesh"],
      icon: "shield",
      github: "https://github.com/HArTan9124/biolink-mesh",
      featured: false,
      metrics: "Packet loss: 0% | Nodes: 64 Max"
    }
  ],
  research: [
    {
      title: "Wearable Bio-Sensing & Signal Processing",
      subtitle: "REAL-TIME SIGNAL DE-NOISING & SAMPLING",
      icon: "activity",
      desc: "Developing noise cancellation and adaptive filtering strategies for wearable devices. Focusing on eliminating motion artifacts from Photoplethysmogram (PPG) and Electrocardiogram (ECG) channels using low-complexity Butterworth and Chebyshev pipelines.",
      id: "#RES-001"
    },
    {
      title: "Edge Machine Learning (TinyML)",
      subtitle: "QUANTIZATION & SYSTEM OPTIMIZATION",
      icon: "brain",
      desc: "Investigating model pruning, quantization, and architectural optimizations for running deep neural networks (CNNs, LSTMs, and GRUs) directly on WearOS and microcontrollers. Target is maximum inference accuracy under sub-50mW power footprints.",
      id: "#RES-002"
    },
    {
      title: "Cyber-Physical Systems in Healthcare",
      subtitle: "DECENTRALIZED MEDICAL INTERNET OF THINGS",
      icon: "cpu",
      desc: "Designing secure, zero-packet-loss communication layers that connect Wearable devices, mobile hub routers, and clinical clouds. Investigating low-latency local edge alert systems for immediate clinical triage.",
      id: "#RES-003"
    }
  ],
  techStack: [
    {
      title: "Programming Languages",
      icon: "terminal",
      skills: ["C / C++", "Java / Kotlin", "Dart", "Python", "TypeScript", "SQL"]
    },
    {
      title: "Mobile & Wearable OS",
      icon: "smartphone",
      skills: ["Android SDK", "WearOS", "AOSP Integration", "Flutter", "Android Jetpack", "BLE Telemetry"]
    },
    {
      title: "Machine Learning & Signals",
      icon: "brain",
      skills: ["TensorFlow Lite", "PyTorch Mobile", "Butterworth Filtering", "NumPy / SciPy", "Edge Inference"]
    },
    {
      title: "IoT & Hardware Interfacing",
      icon: "cpu",
      skills: ["ESP32 / ESP-IDF", "FreeRTOS", "BLE Mesh Network", "SPI / I2C / UART", "Sensor Multiplexing"]
    },
    {
      title: "Backend & Cloud Services",
      icon: "cloud",
      skills: ["Next.js / React", "Node.js", "Supabase", "Firebase", "PostgreSQL", "Git / GitHub Actions"]
    }
  ],
  achievements: [
    {
      title: "Real-time Gait Anomaly Publication",
      category: "ACADEMIC PAPER",
      desc: "First author on 'Low-Latency Gait Anomaly Categorization on Constraint Mobile Devices' published in IEEE Bio-Sensor Symposium 2025.",
      icon: "fileText"
    },
    {
      title: "WearOS Health Innovation Award",
      category: "INDUSTRY AWARD",
      desc: "Recognized by AOSP Development group for implementing an optimized on-wrist ECG signal preprocessing stack with sub-5mW power footprint.",
      icon: "award"
    },
    {
      title: "SmartTriage IoT Hackathon (1st Place)",
      category: "COMPETITION",
      desc: "Led a team of three to build an ad-hoc clinical ESP32 BLE mesh network that auto-configured and routed ICU signals under 50ms latency.",
      icon: "trophy"
    }
  ],
  blog: [
    {
      title: "Optimizing PyTorch Models for WearOS",
      desc: "An in-depth guide on deploying deep neural networks on smartwatches, focusing on float16/int8 quantization and memory optimizations for constrained systems.",
      date: "May 12, 2026",
      readTime: "8 min read",
      tags: ["On-device ML", "WearOS", "TinyML"],
      url: "#"
    },
    {
      title: "Filtering Biosignals in ESP32 Firmware",
      desc: "How to implement high-speed Butterworth bandpass filters in C++ using ESP-IDF to clean PPG and ECG signals before edge inference.",
      date: "Apr 28, 2026",
      readTime: "6 min read",
      tags: ["Signal Processing", "ESP32", "C++"],
      url: "#"
    },
    {
      title: "Understanding Gait Anomaly Signatures",
      desc: "Exploring the spatial coordinate algorithms and feature extraction pipelines used to recognize early signs of motor decay from wearable IMU streams.",
      date: "Mar 15, 2026",
      readTime: "11 min read",
      tags: ["Healthcare AI", "Kinematics", "Data Science"],
      url: "#"
    }
  ]
};

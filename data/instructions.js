export const instructions = [
  {
    id: 1,
    steps: [
      {
        animationData: "phone.json",
        description: "Find a quiet spot and place your phone at eye level",
      },
      {
        animationData: "strech.json",
        description: "Clear a 6-foot radius around you for safe movement",
      },
      {
        animationData: "breathing.json",
        description: "Take 3 deep breaths to center yourself before starting",
      }
    ],
    link: "/strech",
    isPartnership: true,
  },
  {
    id: 2,
    steps: [
      {
        animationData: "focus.json",
        description: "Choose a distraction-free environment for better focus",
      },
      {
        animationData: "timer.json",
        description: "Set aside 3-5 minutes for uninterrupted practice",
      },
      {
        animationData: "puzzle.json",
        description: "Keep your puzzle pieces organized in a well-lit area",
      }
    ],
    link: "/puzzle",
    isPartnership: false,
  },
];
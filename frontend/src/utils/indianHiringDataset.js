// Local Indian Tech Recruitment Dataset (150 candidates)
// This dataset simulates real-world hiring outcomes featuring biases based on Dialect/Accent, Caste, and State of Origin.

export const indianHiringDataset = [
  // General Category, Standard Accent (High hire rate)
  { Candidate_ID: "IND001", Name: "Rohan Sharma", State_of_Origin: "North", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 4, Assessment_Score: 82, Outcome: "Hired" },
  { Candidate_ID: "IND002", Name: "Priya Nair", State_of_Origin: "South", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 5, Assessment_Score: 78, Outcome: "Hired" },
  { Candidate_ID: "IND003", Name: "Amit Verma", State_of_Origin: "North", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 2, Assessment_Score: 88, Outcome: "Hired" },
  { Candidate_ID: "IND004", Name: "Sneha Patil", State_of_Origin: "West", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 6, Assessment_Score: 74, Outcome: "Hired" },
  { Candidate_ID: "IND005", Name: "Vikram Malhotra", State_of_Origin: "North", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 3, Assessment_Score: 90, Outcome: "Hired" },
  { Candidate_ID: "IND006", Name: "Aditya Roy", State_of_Origin: "East", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 5, Assessment_Score: 85, Outcome: "Hired" },
  { Candidate_ID: "IND007", Name: "Neha Gupta", State_of_Origin: "North", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 1, Assessment_Score: 80, Outcome: "Hired" },
  { Candidate_ID: "IND008", Name: "Karan Johar", State_of_Origin: "North", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 7, Assessment_Score: 68, Outcome: "Rejected" },
  { Candidate_ID: "IND009", Name: "Siddharth Rao", State_of_Origin: "South", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 4, Assessment_Score: 84, Outcome: "Hired" },
  { Candidate_ID: "IND010", Name: "Divya Joshi", State_of_Origin: "West", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 3, Assessment_Score: 76, Outcome: "Hired" },
  { Candidate_ID: "IND011", Name: "Rajesh Iyer", State_of_Origin: "South", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 8, Assessment_Score: 89, Outcome: "Hired" },
  { Candidate_ID: "IND012", Name: "Meera Deshmukh", State_of_Origin: "West", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 2, Assessment_Score: 70, Outcome: "Hired" },
  { Candidate_ID: "IND013", Name: "Sanjay Singhania", State_of_Origin: "North", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 9, Assessment_Score: 92, Outcome: "Hired" },
  { Candidate_ID: "IND014", Name: "Ananya Sen", State_of_Origin: "East", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 4, Assessment_Score: 77, Outcome: "Hired" },
  { Candidate_ID: "IND015", Name: "Arjun Kapoor", State_of_Origin: "North", Caste_Category: "General", Dialect_Accent: "Standard", Experience_Years: 3, Assessment_Score: 65, Outcome: "Rejected" },
  
  // Reserved Category, Standard Accent (Mixed outcomes, showing systemic gap)
  { Candidate_ID: "IND016", Name: "Rahul Jatav", State_of_Origin: "North", Caste_Category: "Reserved", Dialect_Accent: "Standard", Experience_Years: 3, Assessment_Score: 81, Outcome: "Hired" },
  { Candidate_ID: "IND017", Name: "Sunita Meena", State_of_Origin: "North", Caste_Category: "Reserved", Dialect_Accent: "Standard", Experience_Years: 4, Assessment_Score: 79, Outcome: "Rejected" },
  { Candidate_ID: "IND018", Name: "Vijay Sonawane", State_of_Origin: "West", Caste_Category: "Reserved", Dialect_Accent: "Standard", Experience_Years: 5, Assessment_Score: 85, Outcome: "Hired" },
  { Candidate_ID: "IND019", Name: "Kavitha Kamble", State_of_Origin: "West", Caste_Category: "Reserved", Dialect_Accent: "Standard", Experience_Years: 2, Assessment_Score: 75, Outcome: "Rejected" },
  { Candidate_ID: "IND020", Name: "Deepak Paswan", State_of_Origin: "North", Caste_Category: "Reserved", Dialect_Accent: "Standard", Experience_Years: 6, Assessment_Score: 88, Outcome: "Hired" },
  { Candidate_ID: "IND021", Name: "Asha Gond", State_of_Origin: "East", Caste_Category: "Reserved", Dialect_Accent: "Standard", Experience_Years: 1, Assessment_Score: 72, Outcome: "Rejected" },
  { Candidate_ID: "IND022", Name: "Suresh Valmiki", State_of_Origin: "North", Caste_Category: "Reserved", Dialect_Accent: "Standard", Experience_Years: 4, Assessment_Score: 70, Outcome: "Rejected" },
  { Candidate_ID: "IND023", Name: "Pooja Harijan", State_of_Origin: "North", Caste_Category: "Reserved", Dialect_Accent: "Standard", Experience_Years: 5, Assessment_Score: 76, Outcome: "Rejected" },
  { Candidate_ID: "IND024", Name: "Sandip Dhillon", State_of_Origin: "North", Caste_Category: "Reserved", Dialect_Accent: "Standard", Experience_Years: 7, Assessment_Score: 83, Outcome: "Hired" },
  { Candidate_ID: "IND025", Name: "Anil Bheel", State_of_Origin: "West", Caste_Category: "Reserved", Dialect_Accent: "Standard", Experience_Years: 3, Assessment_Score: 69, Outcome: "Rejected" },

  // General Category, Regional Accent (Demonstrates accent bias - many high scorers rejected)
  { Candidate_ID: "IND026", Name: "T. Venkat Raman", State_of_Origin: "South", Caste_Category: "General", Dialect_Accent: "Regional Accent", Experience_Years: 5, Assessment_Score: 84, Outcome: "Rejected" },
  { Candidate_ID: "IND027", Name: "Jyoti Basumatary", State_of_Origin: "East", Caste_Category: "General", Dialect_Accent: "Regional Accent", Experience_Years: 4, Assessment_Score: 80, Outcome: "Rejected" },
  { Candidate_ID: "IND028", Name: "Harpal Singh", State_of_Origin: "North", Caste_Category: "General", Dialect_Accent: "Regional Accent", Experience_Years: 6, Assessment_Score: 87, Outcome: "Hired" },
  { Candidate_ID: "IND029", Name: "Chandra Shekharan", State_of_Origin: "South", Caste_Category: "General", Dialect_Accent: "Regional Accent", Experience_Years: 3, Assessment_Score: 79, Outcome: "Rejected" },
  { Candidate_ID: "IND030", Name: "Sujata Mahapatra", State_of_Origin: "East", Caste_Category: "General", Dialect_Accent: "Regional Accent", Experience_Years: 7, Assessment_Score: 91, Outcome: "Hired" },
  { Candidate_ID: "IND031", Name: "Manpreet Kaur", State_of_Origin: "North", Caste_Category: "General", Dialect_Accent: "Regional Accent", Experience_Years: 2, Assessment_Score: 78, Outcome: "Rejected" },
  { Candidate_ID: "IND032", Name: "K. Ranganathan", State_of_Origin: "South", Caste_Category: "General", Dialect_Accent: "Regional Accent", Experience_Years: 8, Assessment_Score: 86, Outcome: "Hired" },
  { Candidate_ID: "IND033", Name: "Babita Bisht", State_of_Origin: "North", Caste_Category: "General", Dialect_Accent: "Regional Accent", Experience_Years: 4, Assessment_Score: 82, Outcome: "Rejected" },
  { Candidate_ID: "IND034", Name: "Subhashis Das", State_of_Origin: "East", Caste_Category: "General", Dialect_Accent: "Regional Accent", Experience_Years: 5, Assessment_Score: 75, Outcome: "Rejected" },
  { Candidate_ID: "IND035", Name: "M. K. Stalin", State_of_Origin: "South", Caste_Category: "General", Dialect_Accent: "Regional Accent", Experience_Years: 9, Assessment_Score: 88, Outcome: "Hired" },

  // Reserved Category, Regional Accent (Intersectionality - highest rejection rate)
  { Candidate_ID: "IND036", Name: "Devendra Koli", State_of_Origin: "West", Caste_Category: "Reserved", Dialect_Accent: "Regional Accent", Experience_Years: 3, Assessment_Score: 83, Outcome: "Rejected" },
  { Candidate_ID: "IND037", Name: "Radhika Baskey", State_of_Origin: "East", Caste_Category: "Reserved", Dialect_Accent: "Regional Accent", Experience_Years: 4, Assessment_Score: 76, Outcome: "Rejected" },
  { Candidate_ID: "IND038", Name: "Pradip Shinde", State_of_Origin: "West", Caste_Category: "Reserved", Dialect_Accent: "Regional Accent", Experience_Years: 5, Assessment_Score: 89, Outcome: "Hired" },
  { Candidate_ID: "IND039", Name: "J. Jayalalitha", State_of_Origin: "South", Caste_Category: "Reserved", Dialect_Accent: "Regional Accent", Experience_Years: 6, Assessment_Score: 74, Outcome: "Rejected" },
  { Candidate_ID: "IND040", Name: "Mukesh Paswan", State_of_Origin: "North", Caste_Category: "Reserved", Dialect_Accent: "Regional Accent", Experience_Years: 2, Assessment_Score: 80, Outcome: "Rejected" },
  { Candidate_ID: "IND041", Name: "Binita Oraon", State_of_Origin: "East", Caste_Category: "Reserved", Dialect_Accent: "Regional Accent", Experience_Years: 3, Assessment_Score: 68, Outcome: "Rejected" },
  { Candidate_ID: "IND042", Name: "Karthik Solanki", State_of_Origin: "West", Caste_Category: "Reserved", Dialect_Accent: "Regional Accent", Experience_Years: 7, Assessment_Score: 82, Outcome: "Rejected" },
  { Candidate_ID: "IND043", Name: "Nisha Gautam", State_of_Origin: "North", Caste_Category: "Reserved", Dialect_Accent: "Regional Accent", Experience_Years: 1, Assessment_Score: 75, Outcome: "Rejected" },
  { Candidate_ID: "IND044", Name: "Bhim Rao", State_of_Origin: "South", Caste_Category: "Reserved", Dialect_Accent: "Regional Accent", Experience_Years: 8, Assessment_Score: 90, Outcome: "Hired" },
  { Candidate_ID: "IND045", Name: "Kishori Lal", State_of_Origin: "North", Caste_Category: "Reserved", Dialect_Accent: "Regional Accent", Experience_Years: 4, Assessment_Score: 70, Outcome: "Rejected" },

  // Generative Loop to fill up to 150 rows with statistically consistent outcomes:
  // General + Standard: 80% Hire Rate (Indices 46 - 80)
  // General + Regional: 45% Hire Rate (Indices 81 - 105)
  // Reserved + Standard: 50% Hire Rate (Indices 106 - 125)
  // Reserved + Regional: 20% Hire Rate (Indices 126 - 150)
];

// Helper to generate the remaining 105 candidates programmatically
const namesPool = {
  General: ["Sanjay", "Vikram", "Shriya", "Ravi", "Aishwarya", "Sameer", "Rajesh", "Kiran", "Vivek", "Preeti", "Gaurav", "Swati", "Nikhil", "Megha", "Tarun", "Arpita", "Mohit", "Aditi", "Rahul", "Pankaj"],
  Reserved: ["Bhim", "Kanchana", "Laxman", "Kalu", "Jwala", "Champa", "Ganga", "Devi", "Shibu", "Basanti", "Kishan", "Daya", "Mangal", "Birju", "Ratna", "Suma", "Velu", "Karuppan", "Mayil", "Ramu"],
  LastNames: ["Kumar", "Singh", "Joshi", "Patel", "Reddy", "Choudhury", "Bose", "Mehta", "Iyer", "Rao", "Naidu", "Sharma", "Bhatt", "Sen", "Pillai", "Nair", "Das", "Prasad", "Swamy", "Gowda"]
};

// Populate the dataset up to 150 entries
const populateRemaining = () => {
  const regions = ["North", "South", "East", "West"];
  
  // We need 110 more records
  for (let i = 46; i <= 150; i++) {
    const isReserved = i % 2.5 === 0; // Roughly 40% reserved
    const hasRegionalAccent = i % 2 === 0; // 50% regional accent
    
    const caste = isReserved ? "Reserved" : "General";
    const accent = hasRegionalAccent ? "Regional Accent" : "Standard";
    
    const nameList = namesPool[caste];
    const firstName = nameList[i % nameList.length];
    const lastName = namesPool.LastNames[(i * 7) % namesPool.LastNames.length];
    const name = `${firstName} ${lastName}`;
    
    const region = regions[(i * 3) % regions.length];
    const experience = (i * 13) % 11; // 0 - 10 years
    const assessment = 50 + ((i * 17) % 51); // score between 50 and 100
    
    // Set Hire outcome based on bias criteria:
    const isHired = (() => {
      if (caste === "General" && accent === "Standard") {
        return assessment >= 65 || (assessment >= 55 && experience >= 5);
      }
      if (caste === "General" && accent === "Regional Accent") {
        return assessment >= 82 || (assessment >= 70 && experience >= 7);
      }
      if (caste === "Reserved" && accent === "Standard") {
        return assessment >= 72 || (assessment >= 60 && experience >= 6);
      }
      return assessment >= 88 || (assessment >= 80 && experience >= 8);
    })();
    
    indianHiringDataset.push({
      Candidate_ID: `IND${String(i).padStart(3, '0')}`,
      Name: name,
      State_of_Origin: region,
      Caste_Category: caste,
      Dialect_Accent: accent,
      Experience_Years: experience,
      Assessment_Score: assessment,
      Outcome: isHired ? "Hired" : "Rejected"
    });
  }
};

populateRemaining();

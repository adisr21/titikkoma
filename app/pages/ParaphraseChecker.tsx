import { FileText } from "lucide-react";
import React, { useState } from "react";
import { TextArea } from "~/components/TextArea";

const ParaphraseChecker: React.FC = () => {
  const [originalText, setOriginalText] = useState("");
  const [paraphrasedText, setParaphrasedText] = useState("");
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function termFrequency(tokens: string[]): Record<string, number> {
  const freq: Record<string, number> = {};
  tokens.forEach((t) => {
    freq[t] = (freq[t] || 0) + 1;
  });
  return freq;
}

function cosineSimilarity(a: Record<string, number>, b: Record<string, number>): number {
  const words = new Set([...Object.keys(a), ...Object.keys(b)]);

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  words.forEach((word) => {
    const valA = a[word] || 0;
    const valB = b[word] || 0;

    dotProduct += valA * valB;
    magA += valA * valA;
    magB += valB * valB;
  });

  if (magA === 0 || magB === 0) return 0;

  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}

function calculateSimilarity(text1: string, text2: string): number {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  const tf1 = termFrequency(tokens1);
  const tf2 = termFrequency(tokens2);

  const similarity = cosineSimilarity(tf1, tf2);

  return Math.round(similarity * 100);
}

const checkParaphrase = () => {
  if (!originalText.trim() || !paraphrasedText.trim()) {
    alert("Please fill in both text fields.");
    return;
  }

  setIsLoading(true);

  try {
    const score = calculateSimilarity(originalText, paraphrasedText);
    setSimilarityScore(score);
  } finally {
    setIsLoading(false);
  }
};

  const clearAll = () => {
    setOriginalText("");
    setParaphrasedText("");
    setSimilarityScore(null);
  };

  const getSimilarityLabel = (score: number) => {
    if (score >= 80) return "High Similarity";
    if (score >= 50) return "Moderate Similarity";
    return "Low Similarity";
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 80) return "text-red-500";
    if (score >= 50) return "text-orange-500";
    return "text-green-500";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

    <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="text-green-500" size={22} />
            Paraphrase Checker
        </h2>

        <p className="text-gray-500 text-sm">
            Check the similarity between two texts
        </p>
    </div>

      <div className="flex flex-wrap">
        <div className="w-full xl:w-1/2 lg-rounded-xl p-3 shadow">
        <label className="font-semibold text-sm">Original Text</label>
        <TextArea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Enter the original text here..."
        />
        <p className="text-xs text-gray-400 text-right">
          {originalText.length} characters
        </p>
      </div>

      <div className="w-full xl:w-1/2 lg-rounded-xl p-3 shadow">
        <label className="font-semibold text-sm">Paraphrased Text</label>
        <TextArea
            value={paraphrasedText}
            onChange={(e) => setParaphrasedText(e.target.value)}
            placeholder="Enter the paraphrased text here..."
        />
        <p className="text-xs text-gray-400 text-right">
          {paraphrasedText.length} characters
        </p>
      </div>
      </div>

      <div className="flex gap-3 mt-6 pb-16">
        <button
          onClick={clearAll}
          className="flex-1 border rounded-lg py-3 font-semibold"
        >
          Clear
        </button>

        <button
          onClick={checkParaphrase}
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "Checking..." : "Check Similarity"}
        </button>
      </div>

      {similarityScore !== null && (
        <div className="bg-white p-6 rounded-xl shadow text-center space-y-4 mt-6 pb-16">
          <h3 className="font-bold text-lg">Result</h3>

          <div className={`${getSimilarityColor(similarityScore)} text-5xl font-bold`}>
            {similarityScore}%
          </div>

          <p className={`font-semibold ${getSimilarityColor(similarityScore)}`}>
            {getSimilarityLabel(similarityScore)}
          </p>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${similarityScore}%` }}
            />
          </div>

          <p className="text-gray-600 text-sm">
            {similarityScore >= 80
              ? "The texts are very similar. This may indicate insufficient paraphrasing."
              : similarityScore >= 50
              ? "The texts have moderate similarity. Consider rephrasing more sections."
              : "The texts have low similarity. Good paraphrasing detected!"}
          </p>
        </div>
      )}

    </div>
  );
};

export default ParaphraseChecker;
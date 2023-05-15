import React, { useState} from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,Legend } from 'recharts';
import { saveAs } from 'file-saver';

const Homepage = () => {
  const [wordData, setWordData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await fetch('https://www.terriblytinytales.com/test.txt');
      const text = await response.text();
      const wordList = text.trim().split(/\s+/);
      const wordCounts = {};
      wordList.forEach((word) => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
      const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
      setWordData(sortedWords.slice(0, 20));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      wordData.map(([word, count]) => `${word},${count}`).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8',
    });
    saveAs(blob, 'word_histogram.csv');
  };

  return (
    <div className="bg-container">
      {wordData.length === 0 ? (
        <button className="submit-button" disabled={isFetching} onClick={fetchData}>
          {isFetching ? 'Loading...' : 'Submit'}
        </button>
      ) : (
        <div className="content-container">
          <h1 className="heading">Word Frequency Analysis</h1>
          <BarChart width={1000} height={600} data={wordData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="0" />
            <YAxis />
            <Tooltip />
            <Legend/>
            <Bar dataKey="1" fill="rgba(215, 86, 17, 0.8)" name="Word Count"/>
          </BarChart>
          <div>
            <button className="export-button" onClick={exportCSV}>
              Export
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;

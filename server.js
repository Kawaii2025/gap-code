import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = join(__dirname, 'problems.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables and seed data
function initializeDatabase() {
  db.serialize(() => {
    // Create problems table
    db.run(`CREATE TABLE IF NOT EXISTS problems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      acceptance TEXT NOT NULL,
      description TEXT NOT NULL,
      examples TEXT NOT NULL,
      hints TEXT NOT NULL,
      initialCode TEXT NOT NULL,
      correctAnswers TEXT NOT NULL,
      testCases TEXT NOT NULL,
      functionName TEXT NOT NULL
    )`);

    // Seed data if table is empty
    db.get('SELECT COUNT(*) as count FROM problems', (err, row) => {
      if (err) {
        console.error('Error checking problems count:', err.message);
        return;
      }
      if (row.count === 0) {
        console.log('Seeding problems...');
        seedProblems();
      }
    });

    // Create submissions table
    db.run(`CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      problemId INTEGER NOT NULL,
      code TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (problemId) REFERENCES problems(id)
    )`);
  });
}

// Seed problems data
function seedProblems() {
  const problems = [
    {
      title: '两数之和（填空模板版）',
      difficulty: 'easy',
      acceptance: '49.3%',
      description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。',
      examples: JSON.stringify([{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }]),
      hints: JSON.stringify(['尝试暴力解法：用两个循环遍历数组', '找到 nums[i] + nums[j] === target 后，返回 [i, j]']),
      initialCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    for(let i = 0; i < nums.length; i++){
        for(let j = i + 1; j < nums.length; j++){
            if(nums[i] + nums[j] === target){
                // 请补全下方代码缺口
                return ________;
            }
        }
    }
    return [];
};`,
      correctAnswers: JSON.stringify(['[i,j]', '[j,i]', '[0,1]']),
      testCases: JSON.stringify([{ input: '[2,7,11,15], 9', expectedOutput: '[0,1]' }]),
      functionName: 'twoSum'
    },
    {
      title: '反转字符串（填空模板版）',
      difficulty: 'easy',
      acceptance: '76.8%',
      description: '编写一个函数，其作用是将输入的字符串反转过来。',
      examples: JSON.stringify([{ input: 's = "hello"', output: '"olleh"' }]),
      hints: JSON.stringify(['可以将字符串转成数组，反转数组后再转回字符串', '或者使用双指针法：左右指针向中间移动，交换字符']),
      initialCode: `/**
 * @param {string} s
 * @return {string}
 */
var reverseString = function(s) {
    return s.split('').________().join('');
};`,
      correctAnswers: JSON.stringify(['reverse']),
      testCases: JSON.stringify([{ input: '"hello"', expectedOutput: '"olleh"' }]),
      functionName: 'reverseString'
    },
    {
      title: '最大子数组和（填空模板版）',
      difficulty: 'medium',
      acceptance: '49.8%',
      description: '给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。',
      examples: JSON.stringify([{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' }]),
      hints: JSON.stringify(['使用 Kadane 算法', '维护两个变量：当前最大和、全局最大和', '对于每个元素，决定是继续累加还是重新开始']),
      initialCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let currentMax = nums[0];
    let globalMax = nums[0];
    
    for(let i = 1; i < nums.length; i++){
        currentMax = Math.max(nums[i], currentMax + nums[i]);
        if(________ > globalMax){
            globalMax = currentMax;
        }
    }
    
    return globalMax;
};`,
      correctAnswers: JSON.stringify(['currentMax']),
      testCases: JSON.stringify([{ input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' }]),
      functionName: 'maxSubArray'
    }
  ];

  const insertStmt = db.prepare(`INSERT INTO problems (title, difficulty, acceptance, description, examples, hints, initialCode, correctAnswers, testCases, functionName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  problems.forEach(problem => {
    insertStmt.run(
      problem.title,
      problem.difficulty,
      problem.acceptance,
      problem.description,
      problem.examples,
      problem.hints,
      problem.initialCode,
      problem.correctAnswers,
      problem.testCases,
      problem.functionName
    );
  });

  insertStmt.finalize((err) => {
    if (err) {
      console.error('Error seeding problems:', err.message);
    } else {
      console.log('Problems seeded successfully');
    }
  });
}

// API Endpoints

// Get all problems
app.get('/api/problems', (req, res) => {
  db.all('SELECT * FROM problems', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const problems = rows.map(row => ({
      ...row,
      examples: JSON.parse(row.examples),
      hints: JSON.parse(row.hints),
      correctAnswers: JSON.parse(row.correctAnswers),
      testCases: JSON.parse(row.testCases)
    }));
    res.json(problems);
  });
});

// Get a single problem by id
app.get('/api/problems/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM problems WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Problem not found' });
      return;
    }
    const problem = {
      ...row,
      examples: JSON.parse(row.examples),
      hints: JSON.parse(row.hints),
      correctAnswers: JSON.parse(row.correctAnswers),
      testCases: JSON.parse(row.testCases)
    };
    res.json(problem);
  });
});

// Add a submission
app.post('/api/submissions', (req, res) => {
  const { problemId, code, status } = req.body;
  db.run(
    'INSERT INTO submissions (problemId, code, status) VALUES (?, ?, ?)',
    [problemId, code, status],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        problemId,
        code,
        status
      });
    }
  );
});

// Get all submissions
app.get('/api/submissions', (req, res) => {
  db.all('SELECT * FROM submissions ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

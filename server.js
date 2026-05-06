import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const PORT = 4000;

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
      title: '两数之和',
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
      title: '反转字符串',
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
      title: '最大子数组和',
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
    },
    {
      title: '斐波那契数',
      difficulty: 'easy',
      acceptance: '68.5%',
      description: '斐波那契数，通常用 F(n) 表示，形成的序列称为斐波那契数列。该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。',
      examples: JSON.stringify([{ input: 'n = 4', output: '3' }]),
      hints: JSON.stringify(['F(0) = 0, F(1) = 1', 'F(n) = F(n - 1) + F(n - 2), for n > 1', '可以用迭代或递归实现']),
      initialCode: `/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
    if(n <= 1) return n;
    let a = 0, b = 1;
    for(let i = 2; i <= n; i++){
        let temp = a + b;
        a = b;
        b = ________;
    }
    return b;
};`,
      correctAnswers: JSON.stringify(['temp']),
      testCases: JSON.stringify([{ input: '4', expectedOutput: '3' }]),
      functionName: 'fib'
    },
    {
      title: '回文数',
      difficulty: 'easy',
      acceptance: '55.7%',
      description: '给你一个整数 x，如果 x 是一个回文整数，返回 true，否则返回 false。',
      examples: JSON.stringify([{ input: 'x = 121', output: 'true' }]),
      hints: JSON.stringify(['回文数是指正读和反读都一样的数', '可以将整数转成字符串，或者反转一半数字']),
      initialCode: `/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    if(x < 0) return false;
    let str = x.toString();
    return str === str.split('').reverse().________();
};`,
      correctAnswers: JSON.stringify(["join('')"]),
      testCases: JSON.stringify([{ input: '121', expectedOutput: 'true' }]),
      functionName: 'isPalindrome'
    },
    {
      title: '爬楼梯',
      difficulty: 'easy',
      acceptance: '52.9%',
      description: '假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？',
      examples: JSON.stringify([{ input: 'n = 3', output: '3' }]),
      hints: JSON.stringify(['动态规划经典问题', 'dp[n] = dp[n-1] + dp[n-2]', '其实就是斐波那契数列']),
      initialCode: `/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    if(n <= 2) return n;
    let a = 1, b = 2;
    for(let i = 3; i <= n; i++){
        let temp = a + b;
        a = b;
        b = ________;
    }
    return b;
};`,
      correctAnswers: JSON.stringify(['temp']),
      testCases: JSON.stringify([{ input: '3', expectedOutput: '3' }]),
      functionName: 'climbStairs'
    },
    {
      title: '删除排序数组中的重复项',
      difficulty: 'easy',
      acceptance: '54.2%',
      description: '给你一个有序数组 nums，请你原地删除重复出现的元素，使每个元素只出现一次，返回删除后数组的新长度。',
      examples: JSON.stringify([{ input: 'nums = [1,1,2]', output: '2' }]),
      hints: JSON.stringify(['使用双指针法', '一个指针记录新数组的位置', '另一个指针遍历原数组']),
      initialCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
    let i = 0;
    for(let j = 1; j < nums.length; j++){
        if(nums[j] !== nums[i]){
            i++;
            nums[i] = ________;
        }
    }
    return i + 1;
};`,
      correctAnswers: JSON.stringify(['nums[j]']),
      testCases: JSON.stringify([{ input: '[1,1,2]', expectedOutput: '2' }]),
      functionName: 'removeDuplicates'
    },
    {
      title: '买卖股票的最佳时机',
      difficulty: 'easy',
      acceptance: '53.8%',
      description: '给定一个数组 prices，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。你只能选择某一天买入这只股票，并选择在未来的某一个不同的日子卖出该股票。设计一个算法来计算你所能获取的最大利润。',
      examples: JSON.stringify([{ input: 'prices = [7,1,5,3,6,4]', output: '5' }]),
      hints: JSON.stringify(['维护最小价格和最大利润', '遍历一次即可解决', '每次更新最小价格，然后计算当前利润']),
      initialCode: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    for(let price of prices){
        if(price < minPrice){
            minPrice = price;
        } else {
            maxProfit = Math.max(maxProfit, ________ - minPrice);
        }
    }
    return maxProfit;
};`,
      correctAnswers: JSON.stringify(['price']),
      testCases: JSON.stringify([{ input: '[7,1,5,3,6,4]', expectedOutput: '5' }]),
      functionName: 'maxProfit'
    },
    {
      title: '有效的括号',
      difficulty: 'easy',
      acceptance: '43.9%',
      description: '给定一个只包括 \'(\', \')\', \'{\', \'}\', \'[\', \']\' 的字符串 s，判断字符串是否有效。',
      examples: JSON.stringify([{ input: 's = "()[]{}"', output: 'true' }]),
      hints: JSON.stringify(['使用栈来解决', '遇到左括号入栈，遇到右括号出栈匹配', '最后栈必须为空']),
      initialCode: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    const stack = [];
    const map = { '(': ')', '{': '}', '[': ']' };
    for(let char of s){
        if(map[char]){
            stack.push(map[char]);
        } else {
            if(stack.pop() !== char) return false;
        }
    }
    return stack.length === ________;
};`,
      correctAnswers: JSON.stringify(['0']),
      testCases: JSON.stringify([{ input: '"()[]{}"', expectedOutput: 'true' }]),
      functionName: 'isValid'
    },
    {
      title: '最长公共前缀',
      difficulty: 'easy',
      acceptance: '41.2%',
      description: '编写一个函数来查找字符串数组中的最长公共前缀。',
      examples: JSON.stringify([{ input: 'strs = ["flower","flow","flight"]', output: '"fl"' }]),
      hints: JSON.stringify(['先找最短字符串', '逐个字符比较', '一旦出现不同字符就停止']),
      initialCode: `/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    if(strs.length === 0) return '';
    let prefix = strs[0];
    for(let i = 1; i < strs.length; i++){
        while(strs[i].indexOf(prefix) !== 0){
            prefix = prefix.substring(0, prefix.length - ________);
            if(prefix.length === 0) return '';
        }
    }
    return prefix;
};`,
      correctAnswers: JSON.stringify(['1']),
      testCases: JSON.stringify([{ input: '["flower","flow","flight"]', expectedOutput: '"fl"' }]),
      functionName: 'longestCommonPrefix'
    },
    {
      title: '搜索插入位置',
      difficulty: 'easy',
      acceptance: '46.3%',
      description: '给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。',
      examples: JSON.stringify([{ input: 'nums = [1,3,5,6], target = 5', output: '2' }]),
      hints: JSON.stringify(['使用二分查找', '这是经典的二分查找变体']),
      initialCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    let left = 0, right = nums.length - 1;
    while(left <= right){
        let mid = Math.floor((left + right) / 2);
        if(nums[mid] === target) return mid;
        else if(nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return ________;
};`,
      correctAnswers: JSON.stringify(['left']),
      testCases: JSON.stringify([{ input: '[1,3,5,6], 5', expectedOutput: '2' }]),
      functionName: 'searchInsert'
    },
    {
      title: '实现 strStr()',
      difficulty: 'easy',
      acceptance: '35.1%',
      description: '给你两个字符串 haystack 和 needle，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。',
      examples: JSON.stringify([{ input: 'haystack = "hello", needle = "ll"', output: '2' }]),
      hints: JSON.stringify(['可以用字符串的 indexOf 方法', '或者用双循环比较']),
      initialCode: `/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    if(needle === '') return 0;
    for(let i = 0; i <= haystack.length - needle.length; i++){
        if(haystack.substring(i, i + needle.length) === ________){
            return i;
        }
    }
    return -1;
};`,
      correctAnswers: JSON.stringify(['needle']),
      testCases: JSON.stringify([{ input: '"hello", "ll"', expectedOutput: '2' }]),
      functionName: 'strStr'
    },
    {
      title: '整数反转',
      difficulty: 'easy',
      acceptance: '35.1%',
      description: '给你一个 32 位的有符号整数 x，返回将 x 中的数字部分反转后的结果。',
      examples: JSON.stringify([{ input: 'x = 123', output: '321' }]),
      hints: JSON.stringify(['可以通过取模和除法来反转', '注意处理溢出问题']),
      initialCode: `/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    let rev = 0;
    let sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    while(x > 0){
        rev = rev * 10 + x % 10;
        x = Math.floor(x / ________);
    }
    return sign * rev;
};`,
      correctAnswers: JSON.stringify(['10']),
      testCases: JSON.stringify([{ input: '123', expectedOutput: '321' }]),
      functionName: 'reverse'
    },
    {
      title: '罗马数字转整数',
      difficulty: 'easy',
      acceptance: '58.8%',
      description: '罗马数字包含以下七种字符：I，V，X，L，C，D 和 M。给定一个罗马数字，将其转换成整数。',
      examples: JSON.stringify([{ input: 's = "III"', output: '3' }]),
      hints: JSON.stringify(['通常大的数字在前，小的在后', '如果小的数字在前，就是减法']),
      initialCode: `/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {
    const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
    let result = 0;
    for(let i = 0; i < s.length; i++){
        if(i < s.length - 1 && map[s[i]] < map[s[i+1]]){
            result -= map[s[i]];
        } else {
            result += map[s[i]];
        }
    }
    return ________;
};`,
      correctAnswers: JSON.stringify(['result']),
      testCases: JSON.stringify([{ input: '"III"', expectedOutput: '3' }]),
      functionName: 'romanToInt'
    },
    {
      title: '合并两个有序链表',
      difficulty: 'easy',
      acceptance: '62.3%',
      description: '将两个升序链表合并为一个新的升序链表并返回。',
      examples: JSON.stringify([{ input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]' }]),
      hints: JSON.stringify(['使用递归或者迭代', '比较两个链表的头节点']),
      initialCode: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
    if(!list1) return list2;
    if(!list2) return list1;
    if(list1.val < list2.val){
        list1.next = mergeTwoLists(list1.next, list2);
        return list1;
    } else {
        list2.next = mergeTwoLists(list1, list2.next);
        return list2;
    }
};`,
      correctAnswers: JSON.stringify(['list2']),
      testCases: JSON.stringify([{ input: '[1,2,4], [1,3,4]', expectedOutput: '[1,1,2,3,4,4]' }]),
      functionName: 'mergeTwoLists'
    },
    {
      title: '二分查找',
      difficulty: 'easy',
      acceptance: '54.5%',
      description: '给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。',
      examples: JSON.stringify([{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }]),
      hints: JSON.stringify(['经典二分查找算法', 'left = 0, right = length - 1']),
      initialCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    let left = 0, right = nums.length - 1;
    while(left <= right){
        let mid = Math.floor((left + right) / 2);
        if(nums[mid] === target) return mid;
        else if(nums[mid] < target) left = ________ + 1;
        else right = mid - 1;
    }
    return -1;
};`,
      correctAnswers: JSON.stringify(['mid']),
      testCases: JSON.stringify([{ input: '[-1,0,3,5,9,12], 9', expectedOutput: '4' }]),
      functionName: 'search'
    },
    {
      title: '第一个错误的版本',
      difficulty: 'easy',
      acceptance: '42.6%',
      description: '你是产品经理，目前正在带领一个团队开发新的产品。不幸的是，你的产品的最新版本没有通过质量检测。由于每个版本都是基于之前的版本开发的，所以错误的版本之后的所有版本都是错的。',
      examples: JSON.stringify([{ input: 'n = 5, bad = 4', output: '4' }]),
      hints: JSON.stringify(['二分查找的经典应用', '找第一个满足条件的版本']),
      initialCode: `/**
 * Definition for isBadVersion()
 * 
 * @param {integer} version number
 * @return {boolean} whether the version is bad
 * isBadVersion = function(version) {
 *     ...
 * };
 */
/**
 * @param {function} isBadVersion()
 * @return {function}
 */
var solution = function(isBadVersion) {
    return function(n) {
        let left = 1, right = n;
        while(left < right){
            let mid = Math.floor((left + right) / 2);
            if(isBadVersion(mid)){
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return ________;
    };
};`,
      correctAnswers: JSON.stringify(['left']),
      testCases: JSON.stringify([{ input: '5, 4', expectedOutput: '4' }]),
      functionName: 'solution'
    },
    {
      title: 'x 的平方根',
      difficulty: 'easy',
      acceptance: '38.4%',
      description: '给你一个非负整数 x，计算并返回 x 的算术平方根。由于返回类型是整数，结果只保留整数部分，小数部分将被舍去。',
      examples: JSON.stringify([{ input: 'x = 8', output: '2' }]),
      hints: JSON.stringify(['可以用二分查找', '在 0 到 x 之间找答案']),
      initialCode: `/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function(x) {
    if(x === 0) return 0;
    let left = 1, right = x;
    while(left <= right){
        let mid = Math.floor((left + right) / 2);
        if(mid * mid === x) return mid;
        else if(mid * mid < x) left = mid + 1;
        else right = mid - 1;
    }
    return ________;
};`,
      correctAnswers: JSON.stringify(['right']),
      testCases: JSON.stringify([{ input: '8', expectedOutput: '2' }]),
      functionName: 'mySqrt'
    },
    {
      title: '最长回文子串',
      difficulty: 'medium',
      acceptance: '36.8%',
      description: '给你一个字符串 s，找到 s 中最长的回文子串。',
      examples: JSON.stringify([{ input: 's = "babad"', output: '"bab"' }]),
      hints: JSON.stringify(['中心扩展法', '对于每个字符作为中心向两边扩展']),
      initialCode: `/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    let result = '';
    function expand(l, r){
        while(l >= 0 && r < s.length && s[l] === s[r]){
            l--;
            r++;
        }
        return s.substring(l + 1, r);
    }
    for(let i = 0; i < s.length; i++){
        let odd = expand(i, i);
        let even = expand(i, i + 1);
        let curr = odd.length > even.length ? odd : even;
        if(curr.length > result.length) result = curr;
    }
    return ________;
};`,
      correctAnswers: JSON.stringify(['result']),
      testCases: JSON.stringify([{ input: '"babad"', expectedOutput: '"bab"' }]),
      functionName: 'longestPalindrome'
    },
    {
      title: '三数之和',
      difficulty: 'medium',
      acceptance: '34.5%',
      description: '给你一个整数数组 nums，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k，同时还满足 nums[i] + nums[j] + nums[k] == 0。请你返回所有和为 0 且不重复的三元组。',
      examples: JSON.stringify([{ input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' }]),
      hints: JSON.stringify(['先排序', '固定一个数，然后双指针找另外两个', '注意去重']),
      initialCode: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    for(let i = 0; i < nums.length - 2; i++){
        if(i > 0 && nums[i] === nums[i-1]) continue;
        let left = i + 1, right = nums.length - 1;
        while(left < right){
            const sum = nums[i] + nums[left] + nums[right];
            if(sum === 0){
                result.push([nums[i], nums[left], nums[right]]);
                while(left < right && nums[left] === nums[left+1]) left++;
                while(left < right && nums[right] === nums[right-1]) right--;
                left++;
                right--;
            } else if(sum < 0) left++;
            else right--;
        }
    }
    return ________;
};`,
      correctAnswers: JSON.stringify(['result']),
      testCases: JSON.stringify([{ input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]' }]),
      functionName: 'threeSum'
    },
    {
      title: '无重复字符的最长子串',
      difficulty: 'medium',
      acceptance: '38.7%',
      description: '给定一个字符串 s，请你找出其中不含有重复字符的最长子串的长度。',
      examples: JSON.stringify([{ input: 's = "abcabcbb"', output: '3' }]),
      hints: JSON.stringify(['滑动窗口', '使用哈希表记录字符位置']),
      initialCode: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    const map = new Map();
    let left = 0, maxLen = 0;
    for(let right = 0; right < s.length; right++){
        if(map.has(s[right]) && map.get(s[right]) >= left){
            left = map.get(s[right]) + 1;
        }
        map.set(s[right], right);
        maxLen = Math.max(maxLen, right - left + ________);
    }
    return maxLen;
};`,
      correctAnswers: JSON.stringify(['1']),
      testCases: JSON.stringify([{ input: '"abcabcbb"', expectedOutput: '3' }]),
      functionName: 'lengthOfLongestSubstring'
    },
    {
      title: '最长递增子序列',
      difficulty: 'medium',
      acceptance: '52.7%',
      description: '给你一个整数数组 nums，找到其中最长严格递增子序列的长度。',
      examples: JSON.stringify([{ input: 'nums = [10,9,2,5,3,7,101,18]', output: '4' }]),
      hints: JSON.stringify(['动态规划', 'dp[i] 表示以 i 结尾的最长递增子序列长度']),
      initialCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    const dp = new Array(nums.length).fill(1);
    for(let i = 1; i < nums.length; i++){
        for(let j = 0; j < i; j++){
            if(nums[i] > nums[j]){
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    return Math.max(...dp);
};`,
      correctAnswers: JSON.stringify(['Math.max(...dp)']),
      testCases: JSON.stringify([{ input: '[10,9,2,5,3,7,101,18]', expectedOutput: '4' }]),
      functionName: 'lengthOfLIS'
    },
    {
      title: '最大子序和',
      difficulty: 'medium',
      acceptance: '54.5%',
      description: '给你一个整数数组 nums，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。',
      examples: JSON.stringify([{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' }]),
      hints: JSON.stringify(['Kadane 算法', '贪心思想']),
      initialCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let curr = nums[0];
    let max = nums[0];
    for(let i = 1; i < nums.length; i++){
        curr = Math.max(nums[i], curr + nums[i]);
        max = Math.max(________, max);
    }
    return max;
};`,
      correctAnswers: JSON.stringify(['curr']),
      testCases: JSON.stringify([{ input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' }]),
      functionName: 'maxSubArray'
    },
    {
      title: '零钱兑换',
      difficulty: 'medium',
      acceptance: '45.8%',
      description: '给你一个整数数组 coins，表示不同面额的硬币；以及一个整数 amount，表示总金额。计算并返回可以凑成总金额所需的最少的硬币个数。',
      examples: JSON.stringify([{ input: 'coins = [1,2,5], amount = 11', output: '3' }]),
      hints: JSON.stringify(['动态规划', 'dp[i] 表示凑成 i 所需的最少硬币数']),
      initialCode: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for(let i = 1; i <= amount; i++){
        for(let coin of coins){
            if(i - coin >= 0){
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
};`,
      correctAnswers: JSON.stringify(['dp[amount]']),
      testCases: JSON.stringify([{ input: '[1,2,5], 11', expectedOutput: '3' }]),
      functionName: 'coinChange'
    },
    {
      title: '打家劫舍',
      difficulty: 'medium',
      acceptance: '53.3%',
      description: '你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统。',
      examples: JSON.stringify([{ input: 'nums = [1,2,3,1]', output: '4' }]),
      hints: JSON.stringify(['动态规划', 'dp[i] 表示偷到第 i 间房的最大金额']),
      initialCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    if(nums.length === 0) return 0;
    let prev = 0, curr = 0;
    for(let num of nums){
        let temp = curr;
        curr = Math.max(prev + num, curr);
        prev = temp;
    }
    return ________;
};`,
      correctAnswers: JSON.stringify(['curr']),
      testCases: JSON.stringify([{ input: '[1,2,3,1]', expectedOutput: '4' }]),
      functionName: 'rob'
    },
    {
      title: '二叉树的最大深度',
      difficulty: 'easy',
      acceptance: '74.7%',
      description: '给定一个二叉树，找出其最大深度。',
      examples: JSON.stringify([{ input: '[3,9,20,null,null,15,7]', output: '3' }]),
      hints: JSON.stringify(['递归', '深度 = max(左子树深度, 右子树深度) + 1']),
      initialCode: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    if(!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
};`,
      correctAnswers: JSON.stringify(['1 + Math.max(maxDepth(root.left), maxDepth(root.right))']),
      testCases: JSON.stringify([{ input: '[3,9,20,null,null,15,7]', expectedOutput: '3' }]),
      functionName: 'maxDepth'
    },
    {
      title: '二叉树的层序遍历',
      difficulty: 'medium',
      acceptance: '64.6%',
      description: '给你二叉树的根节点 root，返回其节点值的层序遍历。',
      examples: JSON.stringify([{ input: '[3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }]),
      hints: JSON.stringify(['广度优先搜索 BFS', '使用队列']),
      initialCode: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if(!root) return [];
    const result = [];
    const queue = [root];
    while(queue.length > 0){
        const level = [];
        const size = queue.length;
        for(let i = 0; i < size; i++){
            const node = queue.shift();
            level.push(node.val);
            if(node.left) queue.push(node.left);
            if(node.right) queue.push(node.right);
        }
        result.push(level);
    }
    return result;
};`,
      correctAnswers: JSON.stringify(['result']),
      testCases: JSON.stringify([{ input: '[3,9,20,null,null,15,7]', expectedOutput: '[[3],[9,20],[15,7]]' }]),
      functionName: 'levelOrder'
    },
    {
      title: '二叉树的中序遍历',
      difficulty: 'easy',
      acceptance: '75.5%',
      description: '给定一个二叉树的根节点 root，返回它的中序遍历。',
      examples: JSON.stringify([{ input: '[1,null,2,3]', output: '[1,3,2]' }]),
      hints: JSON.stringify(['递归或者迭代', '左-根-右']),
      initialCode: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    const result = [];
    function traverse(node){
        if(!node) return;
        traverse(node.left);
        result.push(node.val);
        traverse(node.right);
    }
    traverse(root);
    return result;
};`,
      correctAnswers: JSON.stringify(['result']),
      testCases: JSON.stringify([{ input: '[1,null,2,3]', expectedOutput: '[1,3,2]' }]),
      functionName: 'inorderTraversal'
    },
    {
      title: '二叉树的前序遍历',
      difficulty: 'easy',
      acceptance: '70.6%',
      description: '给你二叉树的根节点 root，返回它节点值的前序遍历。',
      examples: JSON.stringify([{ input: '[1,null,2,3]', output: '[1,2,3]' }]),
      hints: JSON.stringify(['根-左-右']),
      initialCode: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    const result = [];
    function traverse(node){
        if(!node) return;
        result.push(node.val);
        traverse(node.left);
        traverse(node.right);
    }
    traverse(root);
    return result;
};`,
      correctAnswers: JSON.stringify(['result']),
      testCases: JSON.stringify([{ input: '[1,null,2,3]', expectedOutput: '[1,2,3]' }]),
      functionName: 'preorderTraversal'
    },
    {
      title: '二叉树的后序遍历',
      difficulty: 'easy',
      acceptance: '73.6%',
      description: '给你一棵二叉树的根节点 root，返回它节点值的后序遍历。',
      examples: JSON.stringify([{ input: '[1,null,2,3]', output: '[3,2,1]' }]),
      hints: JSON.stringify(['左-右-根']),
      initialCode: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function(root) {
    const result = [];
    function traverse(node){
        if(!node) return;
        traverse(node.left);
        traverse(node.right);
        result.push(node.val);
    }
    traverse(root);
    return result;
};`,
      correctAnswers: JSON.stringify(['result']),
      testCases: JSON.stringify([{ input: '[1,null,2,3]', expectedOutput: '[3,2,1]' }]),
      functionName: 'postorderTraversal'
    },
    {
      title: '对称二叉树',
      difficulty: 'easy',
      acceptance: '57.8%',
      description: '给你一个二叉树的根节点 root，检查它是否轴对称。',
      examples: JSON.stringify([{ input: '[1,2,2,3,4,4,3]', output: 'true' }]),
      hints: JSON.stringify(['递归检查', '左子树的左边等于右子树的右边']),
      initialCode: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
    if(!root) return true;
    function isMirror(l, r){
        if(!l && !r) return true;
        if(!l || !r || l.val !== r.val) return false;
        return isMirror(l.left, r.right) && isMirror(l.right, r.left);
    }
    return isMirror(root.left, root.right);
};`,
      correctAnswers: JSON.stringify(['isMirror(root.left, root.right)']),
      testCases: JSON.stringify([{ input: '[1,2,2,3,4,4,3]', expectedOutput: 'true' }]),
      functionName: 'isSymmetric'
    },
    {
      title: '相同的树',
      difficulty: 'easy',
      acceptance: '60.1%',
      description: '给你两棵二叉树的根节点 p 和 q，编写一个函数来检验这两棵树是否相同。',
      examples: JSON.stringify([{ input: 'p = [1,2,3], q = [1,2,3]', output: 'true' }]),
      hints: JSON.stringify(['递归比较', '结构和值都要相同']),
      initialCode: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function(p, q) {
    if(!p && !q) return true;
    if(!p || !q || p.val !== q.val) return false;
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};`,
      correctAnswers: JSON.stringify(['isSameTree(p.left, q.left) && isSameTree(p.right, q.right)']),
      testCases: JSON.stringify([{ input: '[1,2,3], [1,2,3]', expectedOutput: 'true' }]),
      functionName: 'isSameTree'
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

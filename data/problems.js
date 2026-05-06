export const problems = [
  {
    id: 1,
    title: '两数之和（填空模板版）',
    difficulty: 'easy',
    acceptance: '49.3%',
    description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }
    ],
    hints: [
      '尝试暴力解法：用两个循环遍历数组',
      '找到 nums[i] + nums[j] === target 后，返回 [i, j]'
    ],
    initialCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    for(let i = 0; i < nums.length; i++){
        for(let j = i + 1; j < nums.length; j++){
            if(nums[i] + nums[j] === target){
                return ________;
            }
        }
    }
    return [];
};`,
    correctAnswers: ['[i,j]', '[j,i]', '[0,1]'],
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' }
    ],
    functionName: 'twoSum'
  },
  {
    id: 2,
    title: '反转字符串（填空模板版）',
    difficulty: 'easy',
    acceptance: '76.8%',
    description: '编写一个函数，其作用是将输入的字符串反转过来。',
    examples: [
      { input: 's = "hello"', output: '"olleh"' }
    ],
    hints: [
      '可以将字符串转成数组，反转数组后再转回字符串',
      '或者使用双指针法：左右指针向中间移动，交换字符'
    ],
    initialCode: `/**
 * @param {string} s
 * @return {string}
 */
var reverseString = function(s) {
    return s.split('').________().join('');
};`,
    correctAnswers: ['reverse'],
    testCases: [
      { input: '"hello"', expectedOutput: '"olleh"' }
    ],
    functionName: 'reverseString'
  },
  {
    id: 3,
    title: '最大子数组和（填空模板版）',
    difficulty: 'medium',
    acceptance: '49.8%',
    description: '给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' }
    ],
    hints: [
      '使用 Kadane 算法',
      '维护两个变量：当前最大和、全局最大和',
      '对于每个元素，决定是继续累加还是重新开始'
    ],
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
    correctAnswers: ['currentMax'],
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' }
    ],
    functionName: 'maxSubArray'
  },
  {
    id: 4,
    title: '斐波那契数（入门填空）',
    difficulty: 'easy',
    acceptance: '68.5%',
    description: '斐波那契数列从 0 和 1 开始，后面的每一项都是前两项之和。请返回第 n 项。',
    examples: [
      { input: 'n = 4', output: '3' }
    ],
    hints: [
      '当 n <= 1 时，直接返回 n',
      '用两个变量记录前两项并迭代更新'
    ],
    initialCode: `/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
    if(n <= 1) return n;
    let a = 0, b = 1;
    for(let i = 2; i <= n; i++){
        const temp = a + b;
        a = b;
        b = ________;
    }
    return b;
};`,
    correctAnswers: ['temp'],
    testCases: [
      { input: '4', expectedOutput: '3' }
    ],
    functionName: 'fib'
  },
  {
    id: 5,
    title: '回文数（入门填空）',
    difficulty: 'easy',
    acceptance: '55.7%',
    description: '给定整数 x，判断它是否是回文数。回文数正读和反读相同。',
    examples: [
      { input: 'x = 121', output: 'true' }
    ],
    hints: [
      '负数一定不是回文数',
      '可以把数字转成字符串再比较'
    ],
    initialCode: `/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    if(x < 0) return false;
    const str = x.toString();
    return str === str.split('').reverse().________();
};`,
    correctAnswers: ["join('')", 'join("")'],
    testCases: [
      { input: '121', expectedOutput: 'true' }
    ],
    functionName: 'isPalindrome'
  },
  {
    id: 6,
    title: '爬楼梯（入门填空）',
    difficulty: 'easy',
    acceptance: '52.9%',
    description: '每次可以爬 1 或 2 个台阶，求爬到第 n 阶共有多少种不同方法。',
    examples: [
      { input: 'n = 3', output: '3' }
    ],
    hints: [
      '这是经典动态规划题',
      'f(n) = f(n-1) + f(n-2)'
    ],
    initialCode: `/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    if(n <= 2) return n;
    let a = 1, b = 2;
    for(let i = 3; i <= n; i++){
        const temp = a + b;
        a = b;
        b = ________;
    }
    return b;
};`,
    correctAnswers: ['temp'],
    testCases: [
      { input: '3', expectedOutput: '3' }
    ],
    functionName: 'climbStairs'
  },
  {
    id: 7,
    title: '最长公共前缀（入门填空）',
    difficulty: 'easy',
    acceptance: '44.8%',
    description: '编写一个函数来查找字符串数组中的最长公共前缀。',
    examples: [
      { input: 'strs = ["flower","flow","flight"]', output: '"fl"' }
    ],
    hints: [
      '先把第一个字符串当作前缀',
      '不断缩短前缀直到它是每个字符串的前缀'
    ],
    initialCode: `/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    if(!strs.length) return '';
    let prefix = strs[0];
    for(let i = 1; i < strs.length; i++){
        while(strs[i].indexOf(prefix) !== 0){
            prefix = prefix.slice(0, -1);
            if(prefix === '') return '';
        }
    }
    return ________;
};`,
    correctAnswers: ['prefix'],
    testCases: [
      { input: '["flower","flow","flight"]', expectedOutput: '"fl"' }
    ],
    functionName: 'longestCommonPrefix'
  },
  {
    id: 8,
    title: '合并两个有序数组（入门填空）',
    difficulty: 'easy',
    acceptance: '49.1%',
    description: '给你两个按非递减顺序排列的整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中。',
    examples: [
      { input: 'nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3', output: '[1,2,2,3,5,6]' }
    ],
    hints: [
      '从后往前放元素可以避免覆盖 nums1 中有效值',
      '比较 nums1[m-1] 和 nums2[n-1]，把较大者放到末尾'
    ],
    initialCode: `/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
    let p1 = m - 1, p2 = n - 1, tail = m + n - 1;
    while(p2 >= 0){
        if(p1 >= 0 && nums1[p1] > nums2[p2]){
            nums1[tail--] = nums1[p1--];
        } else {
            nums1[tail--] = ________;
        }
    }
};`,
    correctAnswers: ['nums2[p2--]'],
    testCases: [
      { input: '[1,2,3,0,0,0],3,[2,5,6],3', expectedOutput: '[1,2,2,3,5,6]' }
    ],
    functionName: 'merge'
  }
]

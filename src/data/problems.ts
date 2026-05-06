export interface Problem {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  acceptance: string
  description: string
  examples: Array<{ input: string; output: string }>
  hints: string[]
  initialCode: string
  correctAnswers: string[]
  testCases: Array<{ input: string; expectedOutput: string }>
  functionName: string
}

export const problems: Problem[] = [
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
                // 请补全下方代码缺口
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
  }
]

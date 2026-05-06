export const problems = [
  {
    title: '两数之和',
    difficulty: 'easy',
    acceptance: '49.3%',
    description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。你可以假设每种输入只会对应一个答案，但是，数组中同一个元素在答案里不能重复出现。',
    examples: JSON.stringify([{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }]),
    hints: JSON.stringify(['暴力解法：用两层循环遍历所有组合', '找到 nums[i] + nums[j] === target 后，返回 [i, j]', '注意 j 从 i+1 开始，避免重复使用同一元素']),
    initialCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, ________];
            }
        }
    }
    return [];
};`,
    correctAnswers: JSON.stringify(['j']),
    testCases: JSON.stringify([
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' }
    ]),
    functionName: 'twoSum'
  },
  {
    title: '反转字符串',
    difficulty: 'easy',
    acceptance: '76.8%',
    description: '编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 s 的形式给出，不要给另外的数组分配额外的空间，你必须原地修改输入数组。',
    examples: JSON.stringify([{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }]),
    hints: JSON.stringify(['使用双指针：左指针从头，右指针从尾', '交换 s[left] 和 s[right]，然后两指针向中间移动', '当 left >= right 时停止']),
    initialCode: `/**
 * @param {character[]} s
 * @return {void}
 */
var reverseString = function(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        let temp = s[left];
        s[left] = s[right];
        s[right] = ________;
        left++;
        right--;
    }
};`,
    correctAnswers: JSON.stringify(['temp']),
    testCases: JSON.stringify([
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
      { input: '["A","B","C"]', expectedOutput: '["C","B","A"]' }
    ]),
    functionName: 'reverseString'
  },
  {
    title: '最大子数组和',
    difficulty: 'medium',
    acceptance: '49.8%',
    description: '给你一个整数数组 nums，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。',
    examples: JSON.stringify([{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' }]),
    hints: JSON.stringify(['使用 Kadane 算法：遍历数组，维护当前子数组的和', '如果当前和加上新元素比新元素本身还小，就从新元素重新开始', 'currentMax = Math.max(nums[i], currentMax + nums[i])']),
    initialCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let currentMax = nums[0];
    let globalMax = nums[0];
    for (let i = 1; i < nums.length; i++) {
        currentMax = Math.max(nums[i], ________ + nums[i]);
        globalMax = Math.max(globalMax, currentMax);
    }
    return globalMax;
};`,
    correctAnswers: JSON.stringify(['currentMax']),
    testCases: JSON.stringify([
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' }
    ]),
    functionName: 'maxSubArray'
  },
  {
    title: '斐波那契数',
    difficulty: 'easy',
    acceptance: '68.5%',
    description: '斐波那契数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。给你 n，请计算 F(n)。F(0) = 0，F(1) = 1，F(n) = F(n-1) + F(n-2)。',
    examples: JSON.stringify([{ input: 'n = 6', output: '8' }]),
    hints: JSON.stringify(['用迭代而非递归，避免指数级时间复杂度', '维护两个变量 a, b 分别代表前两项', '每次迭代：temp = a + b，a = b，b = temp']),
    initialCode: `/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        let temp = ________ + b;
        a = b;
        b = temp;
    }
    return b;
};`,
    correctAnswers: JSON.stringify(['a']),
    testCases: JSON.stringify([
      { input: '6', expectedOutput: '8' },
      { input: '10', expectedOutput: '55' }
    ]),
    functionName: 'fib'
  },
  {
    title: '回文数',
    difficulty: 'easy',
    acceptance: '55.7%',
    description: '给你一个整数 x，如果 x 是一个回文整数，返回 true；否则，返回 false。回文数是指正序和倒序读都一样的整数。负数不是回文数。',
    examples: JSON.stringify([{ input: 'x = 121', output: 'true' }, { input: 'x = -121', output: 'false' }]),
    hints: JSON.stringify(['负数直接返回 false', '将整数转为字符串，比较它与其反转是否相同', 'str === str.split("").reverse().join("")']),
    initialCode: `/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    if (x < 0) return false;
    const str = x.toString();
    const reversed = str.split('').reverse().________('');
    return str === reversed;
};`,
    correctAnswers: JSON.stringify(['join']),
    testCases: JSON.stringify([
      { input: '121', expectedOutput: 'true' },
      { input: '-121', expectedOutput: 'false' },
      { input: '10', expectedOutput: 'false' }
    ]),
    functionName: 'isPalindrome'
  },
  {
    title: '爬楼梯',
    difficulty: 'easy',
    acceptance: '52.9%',
    description: '假设你正在爬楼梯，需要 n 阶才能到达楼顶。每次你可以爬 1 或 2 个台阶，有多少种不同的方法可以爬到楼顶？',
    examples: JSON.stringify([{ input: 'n = 4', output: '5' }]),
    hints: JSON.stringify(['这其实是斐波那契数列：dp[n] = dp[n-1] + dp[n-2]', '到达第 n 阶，只能从第 n-1 阶爬 1 步，或从第 n-2 阶爬 2 步', '用两个变量滚动更新，无需数组']),
    initialCode: `/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    if (n <= 2) return n;
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) {
        let temp = a + ________;
        a = b;
        b = temp;
    }
    return b;
};`,
    correctAnswers: JSON.stringify(['b']),
    testCases: JSON.stringify([
      { input: '4', expectedOutput: '5' },
      { input: '5', expectedOutput: '8' }
    ]),
    functionName: 'climbStairs'
  },
  {
    title: '删除排序数组中的重复项',
    difficulty: 'easy',
    acceptance: '54.2%',
    description: '给你一个非严格递增排列的数组 nums，请你原地删除重复出现的元素，使每个元素只出现一次，返回删除后数组的新长度。元素的相对顺序应该保持一致。',
    examples: JSON.stringify([{ input: 'nums = [1,1,2]', output: '2' }]),
    hints: JSON.stringify(['使用慢快双指针', '慢指针 i 指向当前有效数组的末尾', '当快指针 j 的值与 i 不同时，i 前进一步并复制 j 的值']),
    initialCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
    let i = 0;
    for (let j = 1; j < nums.length; j++) {
        if (nums[j] !== nums[________]) {
            i++;
            nums[i] = nums[j];
        }
    }
    return i + 1;
};`,
    correctAnswers: JSON.stringify(['i']),
    testCases: JSON.stringify([
      { input: '[1,1,2]', expectedOutput: '2' },
      { input: '[0,0,1,1,1,2,2,3,3,4]', expectedOutput: '5' }
    ]),
    functionName: 'removeDuplicates'
  },
  {
    title: '买卖股票的最佳时机',
    difficulty: 'easy',
    acceptance: '53.8%',
    description: '给定数组 prices，其中 prices[i] 表示第 i 天的股票价格。你只能选择某天买入并在未来某天卖出，求最大利润。不能在买入前卖出。',
    examples: JSON.stringify([{ input: 'prices = [7,1,5,3,6,4]', output: '5' }]),
    hints: JSON.stringify(['遍历一次：维护历史最低价和最大利润', '每天更新：若今天价格低于历史最低，更新最低价', '否则计算今天卖出的利润，更新最大利润']),
    initialCode: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    for (let price of prices) {
        if (price < minPrice) {
            minPrice = ________;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    return maxProfit;
};`,
    correctAnswers: JSON.stringify(['price']),
    testCases: JSON.stringify([
      { input: '[7,1,5,3,6,4]', expectedOutput: '5' },
      { input: '[7,6,4,3,1]', expectedOutput: '0' }
    ]),
    functionName: 'maxProfit'
  },
  {
    title: '有效的括号',
    difficulty: 'easy',
    acceptance: '43.9%',
    description: "给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s，判断字符串是否有效。有效字符串需满足：左括号必须用相同类型的右括号闭合，且必须以正确的顺序闭合。",
    examples: JSON.stringify([{ input: 's = "()[]{}"', output: 'true' }, { input: 's = "([)]"', output: 'false' }]),
    hints: JSON.stringify(['使用栈：遇到左括号压栈，遇到右括号出栈匹配', '用 Map 存储括号配对关系', '最终栈为空则说明所有括号都正确闭合了']),
    initialCode: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    const stack = [];
    const map = { '(': ')', '{': '}', '[': ']' };
    for (let char of s) {
        if (map[char]) {
            stack.________(map[char]);
        } else {
            if (stack.pop() !== char) return false;
        }
    }
    return stack.length === 0;
};`,
    correctAnswers: JSON.stringify(['push']),
    testCases: JSON.stringify([
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"([)]"', expectedOutput: 'false' },
      { input: '"{[]}"', expectedOutput: 'true' }
    ]),
    functionName: 'isValid'
  },
  {
    title: '最长公共前缀',
    difficulty: 'easy',
    acceptance: '41.2%',
    description: '编写一个函数来查找字符串数组中的最长公共前缀。如果不存在公共前缀，返回空字符串 ""。',
    examples: JSON.stringify([{ input: 'strs = ["flower","flow","flight"]', output: '"fl"' }]),
    hints: JSON.stringify(['以第一个字符串为基准前缀', '对每个后续字符串，当前缀不匹配时缩短前缀', '用 indexOf(prefix) !== 0 来检测是否以前缀开头']),
    initialCode: `/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    if (strs.length === 0) return '';
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].________(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix.length === 0) return '';
        }
    }
    return prefix;
};`,
    correctAnswers: JSON.stringify(['indexOf']),
    testCases: JSON.stringify([
      { input: '["flower","flow","flight"]', expectedOutput: '"fl"' },
      { input: '["dog","racecar","car"]', expectedOutput: '""' }
    ]),
    functionName: 'longestCommonPrefix'
  },
  {
    title: '搜索插入位置',
    difficulty: 'easy',
    acceptance: '46.3%',
    description: '给定一个排序数组和一个目标值，在数组中找到目标值并返回其索引。如果不存在，返回它将会被按顺序插入的位置。请使用 O(log n) 算法。',
    examples: JSON.stringify([{ input: 'nums = [1,3,5,6], target = 5', output: '2' }, { input: 'nums = [1,3,5,6], target = 2', output: '1' }]),
    hints: JSON.stringify(['标准二分查找框架', '循环结束时，left 就是目标应该插入的位置', '无论目标是否存在，left 总是正确答案']),
    initialCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + ________) / 2);
        if (nums[mid] === target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return left;
};`,
    correctAnswers: JSON.stringify(['right']),
    testCases: JSON.stringify([
      { input: '[1,3,5,6], 5', expectedOutput: '2' },
      { input: '[1,3,5,6], 2', expectedOutput: '1' },
      { input: '[1,3,5,6], 7', expectedOutput: '4' }
    ]),
    functionName: 'searchInsert'
  },
  {
    title: '整数反转',
    difficulty: 'medium',
    acceptance: '35.1%',
    description: '给你一个 32 位的有符号整数 x，返回将 x 中的数字部分反转后的结果。如果反转后整数超过 32 位有符号整数的范围，则返回 0。',
    examples: JSON.stringify([{ input: 'x = 123', output: '321' }, { input: 'x = -123', output: '-321' }]),
    hints: JSON.stringify(['每次用 x % 10 取出最后一位，加到 rev 上', '然后 x = Math.floor(x / 10) 去掉最后一位', '注意 JavaScript 中负数取模：-123 % 10 === -3']),
    initialCode: `/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    let rev = 0;
    while (x !== 0) {
        rev = rev * 10 + x % ________;
        x = Math.trunc(x / 10);
    }
    if (rev > 2**31 - 1 || rev < -(2**31)) return 0;
    return rev;
};`,
    correctAnswers: JSON.stringify(['10']),
    testCases: JSON.stringify([
      { input: '123', expectedOutput: '321' },
      { input: '-123', expectedOutput: '-321' },
      { input: '120', expectedOutput: '21' }
    ]),
    functionName: 'reverse'
  },
  {
    title: '罗马数字转整数',
    difficulty: 'easy',
    acceptance: '58.8%',
    description: '给定一个罗马数字，将其转换成整数。罗马数字通常大的在前，但如果小的数字在大的数字之前，表示做减法，如 IV = 4，IX = 9。',
    examples: JSON.stringify([{ input: 's = "MCMXCIV"', output: '1994' }]),
    hints: JSON.stringify(['从左到右遍历，维护结果', '若当前字符对应的值 < 下一个字符对应的值，则减去当前值', '否则加上当前值']),
    initialCode: `/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {
    const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
    let result = 0;
    for (let i = 0; i < s.length; i++) {
        if (i < s.length - 1 && map[s[i]] < map[s[________]]) {
            result -= map[s[i]];
        } else {
            result += map[s[i]];
        }
    }
    return result;
};`,
    correctAnswers: JSON.stringify(['i+1', 'i + 1']),
    testCases: JSON.stringify([
      { input: '"III"', expectedOutput: '3' },
      { input: '"LVIII"', expectedOutput: '58' },
      { input: '"MCMXCIV"', expectedOutput: '1994' }
    ]),
    functionName: 'romanToInt'
  },
  {
    title: '合并两个有序链表',
    difficulty: 'easy',
    acceptance: '62.3%',
    description: '将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。',
    examples: JSON.stringify([{ input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]' }]),
    hints: JSON.stringify(['递归思路：比较两个头节点，较小的那个接上剩余合并结果', '若 list1.val <= list2.val，则 list1.next = merge(list1.next, list2)', '边界：任一链表为空，返回另一个']),
    initialCode: `/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
    if (!list1) return list2;
    if (!list2) return ________;
    if (list1.val <= list2.val) {
        list1.next = mergeTwoLists(list1.next, list2);
        return list1;
    } else {
        list2.next = mergeTwoLists(list1, list2.next);
        return list2;
    }
};`,
    correctAnswers: JSON.stringify(['list1']),
    testCases: JSON.stringify([
      { input: '[1,2,4], [1,3,4]', expectedOutput: '[1,1,2,3,4,4]' }
    ]),
    functionName: 'mergeTwoLists'
  },
  {
    title: '二分查找',
    difficulty: 'easy',
    acceptance: '54.5%',
    description: '给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。',
    examples: JSON.stringify([{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }]),
    hints: JSON.stringify(['标准二分查找', '每次取中间值与 target 比较', '若中间值小于 target，搜索右半；否则搜索左半']),
    initialCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        else if (nums[mid] < target) left = ________ + 1;
        else right = mid - 1;
    }
    return -1;
};`,
    correctAnswers: JSON.stringify(['mid']),
    testCases: JSON.stringify([
      { input: '[-1,0,3,5,9,12], 9', expectedOutput: '4' },
      { input: '[-1,0,3,5,9,12], 2', expectedOutput: '-1' }
    ]),
    functionName: 'search'
  },
  {
    title: '第一个错误的版本',
    difficulty: 'easy',
    acceptance: '42.6%',
    description: '你有 n 个版本 [1, 2, ..., n]，每个版本基于上一个版本。某次更新引入了错误，导致该版本之后的所有版本都是错的。给你 isBadVersion(v) API，找出第一个错误版本。',
    examples: JSON.stringify([{ input: 'n = 5, bad = 4', output: '4' }]),
    hints: JSON.stringify(['二分查找变体：找满足条件的第一个位置', '若 mid 是坏版本，答案在左半（包含 mid）：right = mid', '若 mid 不是坏版本，答案在右半：left = mid + 1']),
    initialCode: `/**
 * @param {function} isBadVersion()
 * @return {function}
 */
var solution = function(isBadVersion) {
    return function(n) {
        let left = 1, right = n;
        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            if (isBadVersion(mid)) {
                right = ________;
            } else {
                left = mid + 1;
            }
        }
        return left;
    };
};`,
    correctAnswers: JSON.stringify(['mid']),
    testCases: JSON.stringify([
      { input: '5, 4', expectedOutput: '4' }
    ]),
    functionName: 'solution'
  },
  {
    title: 'x 的平方根',
    difficulty: 'easy',
    acceptance: '38.4%',
    description: '给你一个非负整数 x，计算并返回 x 的算术平方根，结果只保留整数部分（向下取整）。不能使用 Math.sqrt()。',
    examples: JSON.stringify([{ input: 'x = 8', output: '2' }, { input: 'x = 4', output: '2' }]),
    hints: JSON.stringify(['在 [0, x] 范围内二分查找', '找最大的 mid，使得 mid * mid <= x', '循环结束时 right 就是答案']),
    initialCode: `/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function(x) {
    if (x === 0) return 0;
    let left = 1, right = x;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (mid * mid === x) return mid;
        else if (mid * mid < x) left = mid + 1;
        else right = ________ - 1;
    }
    return right;
};`,
    correctAnswers: JSON.stringify(['mid']),
    testCases: JSON.stringify([
      { input: '4', expectedOutput: '2' },
      { input: '8', expectedOutput: '2' },
      { input: '9', expectedOutput: '3' }
    ]),
    functionName: 'mySqrt'
  },
  {
    title: '最长回文子串',
    difficulty: 'medium',
    acceptance: '36.8%',
    description: '给你一个字符串 s，找到 s 中最长的回文子串。',
    examples: JSON.stringify([{ input: 's = "babad"', output: '"bab"' }, { input: 's = "cbbd"', output: '"bb"' }]),
    hints: JSON.stringify(['中心扩展法：以每个字符（或两字符间隙）为中心向外扩展', '奇数长度以 s[i] 为中心，偶数长度以 s[i],s[i+1] 为中心', '扩展条件：左右指针未越界且 s[l] === s[r]']),
    initialCode: `/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    let result = '';
    function expand(l, r) {
        while (l >= 0 && r < s.length && s[l] === s[________]) {
            l--;
            r++;
        }
        return s.substring(l + 1, r);
    }
    for (let i = 0; i < s.length; i++) {
        let odd = expand(i, i);
        let even = expand(i, i + 1);
        let curr = odd.length > even.length ? odd : even;
        if (curr.length > result.length) result = curr;
    }
    return result;
};`,
    correctAnswers: JSON.stringify(['r']),
    testCases: JSON.stringify([
      { input: '"babad"', expectedOutput: '"bab"' },
      { input: '"cbbd"', expectedOutput: '"bb"' },
      { input: '"racecar"', expectedOutput: '"racecar"' }
    ]),
    functionName: 'longestPalindrome'
  },
  {
    title: '三数之和',
    difficulty: 'medium',
    acceptance: '34.5%',
    description: '给你一个整数数组 nums，判断是否存在三元组 [nums[i], nums[j], nums[k]] 使 nums[i] + nums[j] + nums[k] == 0，返回所有不重复的三元组。',
    examples: JSON.stringify([{ input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' }]),
    hints: JSON.stringify(['先排序！这样才能用双指针去重', '固定 i，用 left=i+1, right=末尾 双指针夹逼', '找到答案后，跳过重复元素']),
    initialCode: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let left = i + 1, right = nums.length - 1;
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < 0) {
                ________++;
            } else {
                right--;
            }
        }
    }
    return result;
};`,
    correctAnswers: JSON.stringify(['left']),
    testCases: JSON.stringify([
      { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]' },
      { input: '[0,0,0]', expectedOutput: '[[0,0,0]]' }
    ]),
    functionName: 'threeSum'
  },
  {
    title: '无重复字符的最长子串',
    difficulty: 'medium',
    acceptance: '38.7%',
    description: '给定一个字符串 s，请你找出其中不含有重复字符的最长子串的长度。',
    examples: JSON.stringify([{ input: 's = "abcabcbb"', output: '3' }, { input: 's = "pwwkew"', output: '3' }]),
    hints: JSON.stringify(['滑动窗口：用 Map 记录每个字符最近出现的位置', '当遇到重复字符时，将左边界移到上次出现位置的右边', '每步更新最大窗口长度']),
    initialCode: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    const map = new Map();
    let left = 0, maxLen = 0;
    for (let right = 0; right < s.length; right++) {
        if (map.has(s[right]) && map.get(s[right]) >= left) {
            left = map.get(s[right]) + 1;
        }
        map.set(s[right], ________);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
};`,
    correctAnswers: JSON.stringify(['right']),
    testCases: JSON.stringify([
      { input: '"abcabcbb"', expectedOutput: '3' },
      { input: '"bbbbb"', expectedOutput: '1' },
      { input: '"pwwkew"', expectedOutput: '3' }
    ]),
    functionName: 'lengthOfLongestSubstring'
  },
  {
    title: '最长递增子序列',
    difficulty: 'medium',
    acceptance: '52.7%',
    description: '给你一个整数数组 nums，找到其中最长严格递增子序列的长度。子序列是由数组中部分元素按原顺序组成的序列，元素不必连续。',
    examples: JSON.stringify([{ input: 'nums = [10,9,2,5,3,7,101,18]', output: '4' }]),
    hints: JSON.stringify(['动态规划：dp[i] 表示以 nums[i] 结尾的最长递增子序列长度', '对每个 i，遍历 j < i，若 nums[j] < nums[i]，则 dp[i] = max(dp[i], dp[j]+1)', '答案是 dp 数组中的最大值']),
    initialCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    const dp = new Array(nums.length).fill(1);
    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[________] + 1);
            }
        }
    }
    return Math.max(...dp);
};`,
    correctAnswers: JSON.stringify(['j']),
    testCases: JSON.stringify([
      { input: '[10,9,2,5,3,7,101,18]', expectedOutput: '4' },
      { input: '[0,1,0,3,2,3]', expectedOutput: '4' }
    ]),
    functionName: 'lengthOfLIS'
  },
  {
    title: '零钱兑换',
    difficulty: 'medium',
    acceptance: '45.8%',
    description: '给你一个整数数组 coins 表示不同面额的硬币，以及一个整数 amount 表示总金额。计算凑成总金额所需的最少硬币个数，如果无法凑成返回 -1。',
    examples: JSON.stringify([{ input: 'coins = [1,2,5], amount = 11', output: '3' }]),
    hints: JSON.stringify(['经典完全背包 DP：dp[i] = 凑成金额 i 的最少硬币数', '初始化：dp[0]=0，其余为 Infinity', '转移：dp[i] = min(dp[i], dp[i-coin]+1)']),
    initialCode: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) {
        for (let coin of coins) {
            if (i - coin >= 0 && dp[i - coin] !== Infinity) {
                dp[i] = Math.min(dp[i], dp[i - ________] + 1);
            }
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
};`,
    correctAnswers: JSON.stringify(['coin']),
    testCases: JSON.stringify([
      { input: '[1,2,5], 11', expectedOutput: '3' },
      { input: '[2], 3', expectedOutput: '-1' },
      { input: '[1], 0', expectedOutput: '0' }
    ]),
    functionName: 'coinChange'
  },
  {
    title: '打家劫舍',
    difficulty: 'medium',
    acceptance: '53.3%',
    description: '你是一个专业的小偷，不能偷相邻的两间房。给定数组 nums 表示每间房的金额，求不触动报警装置的情况下能偷到的最大金额。',
    examples: JSON.stringify([{ input: 'nums = [2,7,9,3,1]', output: '12' }]),
    hints: JSON.stringify(['dp 状态：dp[i] = 偷到第 i 间房的最大金额', '转移：要么偷当前房（dp[i-2]+nums[i]），要么不偷（dp[i-1]）', '用滚动变量优化空间：维护 prev（dp[i-2]）和 curr（dp[i-1]）']),
    initialCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    let prev = 0, curr = 0;
    for (let num of nums) {
        let next = Math.max(curr, ________ + num);
        prev = curr;
        curr = next;
    }
    return curr;
};`,
    correctAnswers: JSON.stringify(['prev']),
    testCases: JSON.stringify([
      { input: '[1,2,3,1]', expectedOutput: '4' },
      { input: '[2,7,9,3,1]', expectedOutput: '12' }
    ]),
    functionName: 'rob'
  },
  {
    title: '二叉树的最大深度',
    difficulty: 'easy',
    acceptance: '74.7%',
    description: '给定一个二叉树，找出其最大深度。二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。',
    examples: JSON.stringify([{ input: '[3,9,20,null,null,15,7]', output: '3' }]),
    hints: JSON.stringify(['递归：当前节点的深度 = max(左子树深度, 右子树深度) + 1', '空节点深度为 0', '这是一个经典的后序遍历（先处理子节点再处理当前节点）']),
    initialCode: `/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    if (!root) return 0;
    const leftDepth = maxDepth(root.________);
    const rightDepth = maxDepth(root.right);
    return 1 + Math.max(leftDepth, rightDepth);
};`,
    correctAnswers: JSON.stringify(['left']),
    testCases: JSON.stringify([
      { input: '[3,9,20,null,null,15,7]', expectedOutput: '3' }
    ]),
    functionName: 'maxDepth'
  },
  {
    title: '二叉树的层序遍历',
    difficulty: 'medium',
    acceptance: '64.6%',
    description: '给你二叉树的根节点 root，返回其节点值的层序遍历（即逐层地，从左到右访问所有节点）。',
    examples: JSON.stringify([{ input: '[3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }]),
    hints: JSON.stringify(['BFS（广度优先搜索）用队列实现', '每次处理队列中当前层的所有节点（用 size 记录当前层节点数）', '将每层结果收集到子数组后加入结果']),
    initialCode: `/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    while (queue.length > 0) {
        const size = queue.________;
        const level = [];
        for (let i = 0; i < size; i++) {
            const node = queue.shift();
            level.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        result.push(level);
    }
    return result;
};`,
    correctAnswers: JSON.stringify(['length']),
    testCases: JSON.stringify([
      { input: '[3,9,20,null,null,15,7]', expectedOutput: '[[3],[9,20],[15,7]]' }
    ]),
    functionName: 'levelOrder'
  },
  {
    title: '二叉树的中序遍历',
    difficulty: 'easy',
    acceptance: '75.5%',
    description: '给定一个二叉树的根节点 root，返回它的中序遍历（左-根-右）结果。',
    examples: JSON.stringify([{ input: '[1,null,2,3]', output: '[1,3,2]' }]),
    hints: JSON.stringify(['递归：先遍历左子树，然后访问根节点，再遍历右子树', '用一个数组收集节点值', '递归边界：节点为 null 时直接返回']),
    initialCode: `/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    const result = [];
    function traverse(node) {
        if (!node) return;
        traverse(node.left);
        result.________(node.val);
        traverse(node.right);
    }
    traverse(root);
    return result;
};`,
    correctAnswers: JSON.stringify(['push']),
    testCases: JSON.stringify([
      { input: '[1,null,2,3]', expectedOutput: '[1,3,2]' }
    ]),
    functionName: 'inorderTraversal'
  },
  {
    title: '对称二叉树',
    difficulty: 'easy',
    acceptance: '57.8%',
    description: '给你一个二叉树的根节点 root，检查它是否轴对称。',
    examples: JSON.stringify([{ input: '[1,2,2,3,4,4,3]', output: 'true' }, { input: '[1,2,2,null,3,null,3]', output: 'false' }]),
    hints: JSON.stringify(['递归判断：左子树的左节点与右子树的右节点对称，左子树的右节点与右子树的左节点对称', '边界：两个节点都为 null → true；只有一个为 null 或值不等 → false', '调用 isMirror(root.left, root.right) 开始']),
    initialCode: `/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
    function isMirror(l, r) {
        if (!l && !r) return true;
        if (!l || !r || l.val !== r.val) return false;
        return isMirror(l.left, r.________) && isMirror(l.right, r.left);
    }
    return isMirror(root.left, root.right);
};`,
    correctAnswers: JSON.stringify(['right']),
    testCases: JSON.stringify([
      { input: '[1,2,2,3,4,4,3]', expectedOutput: 'true' },
      { input: '[1,2,2,null,3,null,3]', expectedOutput: 'false' }
    ]),
    functionName: 'isSymmetric'
  },
  {
    title: '路径总和',
    difficulty: 'easy',
    acceptance: '52.0%',
    description: '给你二叉树的根节点 root 和一个表示目标和的整数 targetSum，判断该树中是否存在根节点到叶子节点的路径，这条路径上所有节点值相加等于目标和。',
    examples: JSON.stringify([{ input: 'root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22', output: 'true' }]),
    hints: JSON.stringify(['递归：每往下走一层，targetSum 减去当前节点的值', '到达叶子节点时，判断 targetSum 是否等于叶子节点的值', '叶子节点：left 和 right 都为 null']),
    initialCode: `/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function(root, targetSum) {
    if (!root) return false;
    if (!root.left && !root.right) {
        return targetSum === root.________;
    }
    const remaining = targetSum - root.val;
    return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
};`,
    correctAnswers: JSON.stringify(['val']),
    testCases: JSON.stringify([
      { input: '[5,4,8,11,null,13,4,7,2,null,null,null,1], 22', expectedOutput: 'true' }
    ]),
    functionName: 'hasPathSum'
  },
  {
    title: '合并区间',
    difficulty: 'medium',
    acceptance: '47.1%',
    description: '以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi]。请你合并所有重叠的区间，并返回一个不重叠的区间数组。',
    examples: JSON.stringify([{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }]),
    hints: JSON.stringify(['先按区间起点排序', '依次检查当前区间是否与结果中最后一个区间重叠', '重叠条件：current[0] <= last[1]，重叠时更新末尾：last[1] = max(last[1], current[1])']),
    initialCode: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const result = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const last = result[result.length - 1];
        if (intervals[i][0] <= last[________]) {
            last[1] = Math.max(last[1], intervals[i][1]);
        } else {
            result.push(intervals[i]);
        }
    }
    return result;
};`,
    correctAnswers: JSON.stringify(['1']),
    testCases: JSON.stringify([
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' }
    ]),
    functionName: 'merge'
  },
  {
    title: '跳跃游戏',
    difficulty: 'medium',
    acceptance: '43.3%',
    description: '给你一个非负整数数组 nums，你最初位于数组的第一个下标。数组中的每个元素代表你在该位置可以跳跃的最大长度。判断你是否能够到达最后一个下标。',
    examples: JSON.stringify([{ input: 'nums = [2,3,1,1,4]', output: 'true' }, { input: 'nums = [3,2,1,0,4]', output: 'false' }]),
    hints: JSON.stringify(['贪心：维护当前能到达的最远位置 maxReach', '遍历每个位置，若当前位置 > maxReach 说明无法到达', '更新 maxReach = max(maxReach, i + nums[i])']),
    initialCode: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    let maxReach = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[________]);
    }
    return true;
};`,
    correctAnswers: JSON.stringify(['i']),
    testCases: JSON.stringify([
      { input: '[2,3,1,1,4]', expectedOutput: 'true' },
      { input: '[3,2,1,0,4]', expectedOutput: 'false' }
    ]),
    functionName: 'canJump'
  }
];

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { API_BASE_URL } from '../config/api'

interface Example {
  input: string
  output: string
}

interface TestCase {
  input: string
  expectedOutput: string
}

interface Problem {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  acceptance: string
  description: string
  examples: Example[]
  hints: string[]
  initialCode: string
  correctAnswers: string[]
  testCases: TestCase[]
  functionName: string
}

interface SolvePageProps {
  darkMode: boolean
}

// ─── Data structure helpers ───────────────────────────────────────────────────

class ListNode {
  val: number
  next: ListNode | null
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val
    this.next = next
  }
}

class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}

/** Build a binary tree from a level-order array (null = missing node) */
function arrayToTree(arr: (number | null)[]): TreeNode | null {
  if (!arr || arr.length === 0 || arr[0] === null) return null
  const root = new TreeNode(arr[0] as number)
  const queue: TreeNode[] = [root]
  let i = 1
  while (i < arr.length) {
    const node = queue.shift()!
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number)
      queue.push(node.left)
    }
    i++
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number)
      queue.push(node.right)
    }
    i++
  }
  return root
}

/** Build a linked list from an array */
function arrayToList(arr: number[]): ListNode | null {
  if (!arr || arr.length === 0) return null
  const dummy = new ListNode(0)
  let cur = dummy
  for (const v of arr) {
    cur.next = new ListNode(v)
    cur = cur.next
  }
  return dummy.next
}

/** Serialize a tree back to level-order array for comparison */
function treeToArray(root: TreeNode | null): (number | null)[] {
  if (!root) return []
  const result: (number | null)[] = []
  const queue: (TreeNode | null)[] = [root]
  while (queue.length > 0) {
    const node = queue.shift()!
    if (node === null) {
      result.push(null)
    } else {
      result.push(node.val)
      queue.push(node.left)
      queue.push(node.right)
    }
  }
  // Trim trailing nulls
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop()
  }
  return result
}

/** Serialize a linked list back to array for comparison */
function listToArray(head: ListNode | null): number[] {
  const result: number[] = []
  let cur = head
  while (cur) {
    result.push(cur.val)
    cur = cur.next
  }
  return result
}

// ─── Input parser ─────────────────────────────────────────────────────────────

/**
 * Parse one argument string into the right JS value.
 * Handles: JSON arrays/objects, quoted strings, numbers, booleans,
 * and level-order tree arrays / linked-list arrays.
 */
function parseArg(raw: string, functionName: string, argIndex: number): unknown {
  raw = raw.trim()

  // Detect tree problems by function name
  const treeFunctions = [
    'maxDepth', 'levelOrder', 'inorderTraversal', 'preorderTraversal',
    'postorderTraversal', 'isSymmetric', 'isSameTree', 'hasPathSum',
    'maxPathSum', 'isBalanced', 'invertTree', 'lowestCommonAncestor',
  ]
  const listFunctions = [
    'mergeTwoLists', 'reverseList', 'hasCycle', 'detectCycle',
    'removeNthFromEnd', 'addTwoNumbers', 'getIntersectionNode',
  ]

  const isTreeFn = treeFunctions.includes(functionName)
  const isListFn = listFunctions.includes(functionName)

  // Try JSON parse first
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    // Quoted string without outer quotes in input?
    if (raw.startsWith('"') && raw.endsWith('"')) {
      return raw.slice(1, -1)
    }
    return raw
  }

  // If it's an array and the function works with trees/lists, convert
  if (Array.isArray(parsed)) {
    if (isTreeFn && argIndex === 0) {
      return arrayToTree(parsed as (number | null)[])
    }
    if (isListFn && (argIndex === 0 || argIndex === 1)) {
      return arrayToList(parsed as number[])
    }
  }

  return parsed
}

/**
 * Split a raw input string like `[1,2], 9` into individual argument strings.
 * Respects nested brackets/braces so commas inside arrays aren't split on.
 */
function splitArgs(input: string): string[] {
  const args: string[] = []
  let depth = 0
  let current = ''
  for (const ch of input) {
    if (ch === '[' || ch === '{' || ch === '(') depth++
    else if (ch === ']' || ch === '}' || ch === ')') depth--
    if (ch === ',' && depth === 0) {
      args.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  if (current.trim()) args.push(current.trim())
  return args
}

/**
 * Serialize an actual output value to a JSON string for comparison.
 * Handles TreeNode and ListNode instances.
 */
function serializeOutput(value: unknown): string {
  if (value instanceof TreeNode || (value && (value as TreeNode).left !== undefined && (value as TreeNode).right !== undefined)) {
    return JSON.stringify(treeToArray(value as TreeNode))
  }
  if (value instanceof ListNode || (value && (value as ListNode).next !== undefined && typeof (value as ListNode).val === 'number')) {
    return JSON.stringify(listToArray(value as ListNode))
  }
  return JSON.stringify(value)
}

// ─── Component ────────────────────────────────────────────────────────────────

function SolvePage({ darkMode }: SolvePageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [loading, setLoading] = useState(true)

  const difficultyText = { easy: '简单', medium: '中等', hard: '困难' }

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/api/problems/${id}`)
        .then(res => res.json())
        .then(data => {
          setProblem(data)
          setCode(data.initialCode)
          setShowResult(false)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching problem:', err)
          setLoading(false)
        })
    }
  }, [id])

  const judge = (type: 'run' | 'submit') => {
    if (!problem) return
    setShowResult(true)
    setResult('<div class="text-blue-500"><i class="fa fa-spinner fa-spin"></i> 正在评测...</div>')

    setTimeout(() => {
      try {
        const results: Array<{
          passed: boolean
          input: string
          expected: string
          actual: string
        }> = []
        let allPassed = true

        const runCase = (inputStr: string) => {
          // Inject helper classes so user code can reference TreeNode / ListNode
          const preamble = `
            class TreeNode {
              constructor(val = 0, left = null, right = null) {
                this.val = val; this.left = left; this.right = right;
              }
            }
            class ListNode {
              constructor(val = 0, next = null) {
                this.val = val; this.next = next;
              }
            }
          `
          const fn = new Function(`
            ${preamble}
            ${code}
            return ${problem.functionName};
          `)()

          const rawArgs = splitArgs(inputStr)
          const parsedArgs = rawArgs.map((raw, idx) =>
            parseArg(raw, problem.functionName, idx)
          )

          return fn(...parsedArgs)
        }

        for (const testCase of problem.testCases) {
          try {
            const actualValue = runCase(testCase.input)
            const actualStr = serializeOutput(actualValue)
            const passed = actualStr === testCase.expectedOutput
            if (!passed) allPassed = false
            results.push({
              passed,
              input: testCase.input,
              expected: testCase.expectedOutput,
              actual: actualStr,
            })
          } catch (err) {
            allPassed = false
            results.push({
              passed: false,
              input: testCase.input,
              expected: testCase.expectedOutput,
              actual: `Error: ${(err as Error).message}`,
            })
          }
        }

        const resultsHtml = results
          .map(
            res => `
          <div class="${res.passed ? 'text-easy' : 'text-hard'} mb-2">
            <div class="font-semibold">
              ${res.passed
                ? '<i class="fa fa-check-circle mr-1"></i> 通过'
                : '<i class="fa fa-times-circle mr-1"></i> 失败'}
            </div>
            <div class="text-xs mt-1 text-gray-500 dark:text-gray-400">
              输入：${res.input}<br>
              期望：${res.expected}<br>
              实际：${res.actual}
            </div>
          </div>
        `
          )
          .join('')

        if (allPassed) {
          setResult(`
            <div class="text-easy font-semibold">
              <i class="fa fa-check-circle"></i>
              ${type === 'submit' ? '提交成功！恭喜你！' : '运行通过！'}
            </div>
            <div class="mt-3">${resultsHtml}</div>
          `)
        } else {
          setResult(`
            <div class="text-hard font-semibold">
              <i class="fa fa-times-circle"></i> 答案错误
            </div>
            <div class="mt-3">${resultsHtml}</div>
          `)
        }
      } catch (err) {
        setResult(`
          <div class="text-hard font-semibold">
            <i class="fa fa-times-circle"></i> 运行错误
          </div>
          <div class="mt-2 text-gray-500">Error: ${(err as Error).message}</div>
        `)
      }
    }, 600)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (!problem) {
    return <div className="p-8 text-center text-gray-500">题目未找到</div>
  }

  return (
    <div id="solve-page">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 main-h">
        {/* Left: problem description */}
        <div className="bg-white dark:bg-gray-800 rounded p-4 overflow-y-auto scrollbar-hide">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">
                {problem.id}. {problem.title}
              </h2>
              <div className="mt-1">
                <span className={`text-${problem.difficulty} text-sm`}>
                  {difficultyText[problem.difficulty]}
                </span>
                <span className="ml-3 text-sm text-gray-500">
                  填空模板模式 · 无需从头编写
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-sm px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              返回
            </button>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded my-4 text-sm">
            <p className="font-medium text-gapcode">💡 做题提示</p>
            <p className="mt-1">
              系统已为你生成完整代码框架，只需补全{' '}
              <code className="px-1 rounded bg-gray-200 dark:bg-gray-600">
                ________
              </code>{' '}
              空缺部分即可。
            </p>
          </div>

          <div className="mb-4 border border-gray-200 dark:border-gray-600 rounded">
            <button
              onClick={() => setShowHints(!showHints)}
              className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="flex items-center gap-2">
                <i className="fa fa-lightbulb-o text-yellow-500"></i>
                解题思路（点击展开）
              </span>
              <i className={`fa ${showHints ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </button>
            {showHints && (
              <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
                {problem.hints.map((hint, index) => (
                  <div key={index} className="mb-2 flex items-start gap-2">
                    <span className="text-gapcode font-bold">{index + 1}.</span>
                    <span>{hint}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-sm leading-relaxed">
            <p>{problem.description}</p>
            {problem.examples.map((example, index) => (
              <pre
                key={index}
                className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm whitespace-pre-wrap"
              >
                输入：{example.input}{'\n'}输出：{example.output}
              </pre>
            ))}
          </div>
        </div>

        {/* Right: editor + result */}
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded">
          <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
            <select className="dark:bg-gray-700 rounded px-2 py-1 text-sm outline-none">
              <option>JavaScript</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => judge('run')}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                运行
              </button>
              <button
                onClick={() => judge('submit')}
                className="px-3 py-1.5 text-sm bg-gapcode text-white rounded hover:bg-gapcode/90"
              >
                提交
              </button>
            </div>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={value => setCode(value || '')}
              theme={darkMode ? 'vs-dark' : 'vs-light'}
              options={{
                minimap: { enabled: false },
                automaticLayout: true,
                fontSize: 14,
              }}
            />
          </div>

          {showResult && (
            <div
              className="border-t dark:border-gray-700 p-4 h-40 overflow-y-auto text-sm"
              dangerouslySetInnerHTML={{ __html: result || '' }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default SolvePage
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { problems, Problem } from '../data/problems'

interface SolvePageProps {
  darkMode: boolean
}

function SolvePage({ darkMode }: SolvePageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showHints, setShowHints] = useState(false)

  const difficultyText = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }

  useEffect(() => {
    const foundProblem = problems.find(p => p.id === Number(id))
    if (foundProblem) {
      setProblem(foundProblem)
      setCode(foundProblem.initialCode)
      setShowResult(false)
    }
  }, [id])

  const judge = (type: 'run' | 'submit') => {
    if (!problem) return
    setShowResult(true)
    setResult('<div class="text-blue-500"><i class="fa fa-spinner fa-spin"></i> 正在评测...</div>')
    setTimeout(() => {
      try {
        const results: Array<{ passed: boolean; input: string; expected: string; actual: string }> = []
        let allPassed = true
        
        // Create a safe environment to run user code
        const safeEval = (codeStr: string, inputStr: string) => {
          // Split input into arguments
          const inputs = inputStr.split(', ').map(s => s.trim())
          // Create function from user code
          const func = new Function(`
            ${codeStr}
            return ${problem.functionName}
          `)()
          // Parse inputs as JavaScript values
          const parsedInputs = inputs.map(input => {
            try {
              return JSON.parse(input)
            } catch {
              // If not JSON (like a string without quotes), return as-is
              return input.replace(/^"|"$/g, '')
            }
          })
          // Call the function
          return func(...parsedInputs)
        }

        problem.testCases.forEach(testCase => {
          try {
            const actualOutput = safeEval(code, testCase.input)
            const actualStr = JSON.stringify(actualOutput)
            const passed = actualStr === testCase.expectedOutput
            if (!passed) allPassed = false
            results.push({
              passed,
              input: testCase.input,
              expected: testCase.expectedOutput,
              actual: actualStr
            })
          } catch (err) {
            allPassed = false
            results.push({
              passed: false,
              input: testCase.input,
              expected: testCase.expectedOutput,
              actual: `Error: ${(err as Error).message}`
            })
          }
        })

        const resultsHtml = results.map(res => `
          <div class="${res.passed ? 'text-easy' : 'text-hard'} mb-2">
            <div class="font-semibold">
              ${res.passed ? '<i class="fa fa-check-circle mr-1"></i> 通过' : '<i class="fa fa-times-circle mr-1"></i> 失败'}
            </div>
            <div class="text-xs mt-1 text-gray-500 dark:text-gray-400">
              输入：${res.input}<br>
              期望：${res.expected}<br>
              实际：${res.actual}
            </div>
          </div>
        `).join('')

        if (allPassed) {
          setResult(`
            <div class="text-easy"><i class="fa fa-check-circle"></i> ${type === 'submit' ? '提交成功！恭喜你！' : '运行通过！'}</div>
            <div class="mt-3">${resultsHtml}</div>
          `)
        } else {
          setResult(`
            <div class="text-hard"><i class="fa fa-times-circle"></i> 答案错误</div>
            <div class="mt-3">${resultsHtml}</div>
          `)
        }
      } catch (err) {
        setResult(`
          <div class="text-hard"><i class="fa fa-times-circle"></i> 运行错误</div>
          <div class="mt-2 text-gray-500">Error: ${(err as Error).message}</div>
        `)
      }
    }, 600)
  }

  if (!problem) {
    return <div className="p-8 text-center text-gray-500">加载中...</div>
  }

  return (
    <div id="solve-page">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 main-h">
        <div className="bg-white dark:bg-gray-800 rounded p-4 overflow-y-auto scrollbar-hide">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">{problem.id}. {problem.title}</h2>
              <div className="mt-1">
                <span className={`text-${problem.difficulty} text-sm`}>{difficultyText[problem.difficulty]}</span>
                <span className="ml-3 text-sm text-gray-500">填空模板模式 · 无需从头编写</span>
              </div>
            </div>
            <button onClick={() => navigate('/')} className="text-sm px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">返回</button>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded my-4 text-sm">
            <p className="font-medium text-gapcode">💡 做题提示</p>
            <p className="mt-1">系统已为你生成完整代码框架，只需补全 <code className="px-1 rounded bg-gray-200 dark:bg-gray-600">________</code> 空缺部分即可。</p>
          </div>

          <div 
            className="mb-4 border border-gray-200 dark:border-gray-600 rounded"
          >
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
              <pre key={index} className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                输入：{example.input}<br/>输出：{example.output}
              </pre>
            ))}
          </div>
        </div>

        <div className="flex flex-col bg-white dark:bg-gray-800 rounded">
          <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
            <select className="dark:bg-gray-700 rounded px-2 py-1 text-sm outline-none">
              <option>JavaScript</option>
            </select>
            <div className="flex gap-2">
              <button onClick={() => judge('run')} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700">运行</button>
              <button onClick={() => judge('submit')} className="px-3 py-1.5 text-sm bg-gapcode text-white rounded hover:bg-gapcode/90">提交</button>
            </div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={darkMode ? 'vs-dark' : 'vs-light'}
              options={{
                minimap: { enabled: false },
                automaticLayout: true,
                fontSize: 14
              }}
            />
          </div>
          {showResult && (
            <div className="border-t dark:border-gray-700 p-4 h-32 overflow-y-auto text-sm" dangerouslySetInnerHTML={{ __html: result || '' }} />
          )}
        </div>
      </div>
    </div>
  )
}

export default SolvePage

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'

interface SolvePageProps {
  darkMode: boolean
}

function SolvePage({ darkMode }: SolvePageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [code, setCode] = useState(`/**
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
};`)
  const [result, setResult] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const judge = (type: 'run' | 'submit') => {
    setShowResult(true)
    setResult('<div class="text-blue-500"><i class="fa fa-spinner fa-spin"></i> 正在评测...</div>')
    setTimeout(() => {
      if (code.includes('[i,j]') || code.includes('[0,1]')) {
        setResult(`
          <div class="text-easy"><i class="fa fa-check-circle"></i> ${type === 'submit' ? '提交成功' : '运行通过'}</div>
          <div class="mt-2 text-gray-600 dark:text-gray-300">输入：[2,7,11,15], 9<br>输出：[0,1]</div>
        `)
      } else {
        setResult(`
          <div class="text-hard"><i class="fa fa-times-circle"></i> 答案错误</div>
          <div class="mt-2 text-gray-500">提示：返回两个下标组成的数组即可</div>
        `)
      }
    }, 600)
  }

  return (
    <div id="solve-page">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 main-h">
        <div className="bg-white dark:bg-gray-800 rounded p-4 overflow-y-auto scrollbar-hide">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">1. 两数之和（填空模板版）</h2>
              <div className="mt-1">
                <span className="text-easy text-sm">简单</span>
                <span className="ml-3 text-sm text-gray-500">填空模板模式 · 无需从头编写</span>
              </div>
            </div>
            <button onClick={() => navigate('/')} className="text-sm px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">返回</button>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded my-4 text-sm">
            <p className="font-medium text-gapcode">💡 做题提示</p>
            <p className="mt-1">系统已为你生成完整代码框架，只需补全 <code className="px-1 rounded bg-gray-200 dark:bg-gray-600">return</code> 空缺部分即可。</p>
          </div>

          <div className="text-sm leading-relaxed">
            <p>给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。</p>
            <p className="mt-2">每种输入只会对应一个答案，同一个元素不能重复使用。</p>
            <pre className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">输入：nums = [2,7,11,15], target = 9
输出：[0,1]</pre>
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

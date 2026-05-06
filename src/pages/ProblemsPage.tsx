import { useNavigate } from 'react-router-dom'
import { problems } from '../data/problems'

function ProblemsPage() {
  const navigate = useNavigate()

  const difficultyText = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }

  return (
    <div id="problems-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">题库</h1>
        <div className="flex gap-2">
          <input placeholder="搜索题目" className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600 outline-none" />
          <select className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600">
            <option>全部难度</option>
            <option>简单</option>
            <option>中等</option>
            <option>困难</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow">
        <table className="w-full">
          <thead className="border-b dark:border-gray-700">
            <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3 font-normal">状态</th>
              <th className="px-4 py-3 font-normal">题号</th>
              <th className="px-4 py-3 font-normal">标题</th>
              <th className="px-4 py-3 font-normal">难度</th>
              <th className="px-4 py-3 font-normal">通过率</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(problem => (
              <tr 
                key={problem.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate(`/problems/${problem.id}`)}
              >
                <td className="px-4 py-3"><i className="fa fa-circle-o text-gray-400"></i></td>
                <td className="px-4 py-3 text-sm">{problem.id}</td>
                <td className="px-4 py-3 text-sm hover:text-gapcode">{problem.title}</td>
                <td className="px-4 py-3"><span className={`text-${problem.difficulty} text-sm`}>{difficultyText[problem.difficulty as keyof typeof difficultyText]}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500">{problem.acceptance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProblemsPage

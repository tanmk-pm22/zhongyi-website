import { Award, BookOpen, Briefcase } from 'lucide-react'

export default function DoctorsPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">医师团队</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            福田药行拥有经验丰富的注册中医师团队，为您提供专业可靠的中医诊疗服务
          </p>
        </div>

        <div className="space-y-12">
          {/* Doctor 1 - 杨源森 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gradient-to-br from-primary-100 to-primary-200 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-5xl text-primary-700">杨</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">杨源森</h2>
                  <p className="text-primary-600 font-medium">注册中医师</p>
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
                    专长领域
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">内科</span>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">针灸</span>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">推拿</span>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">男科</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-primary-600" />
                    资质与经验
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• 从业超过30年</li>
                    <li>• 曾在槟榔屿中医学院任教</li>
                    <li>• 担任临床带教</li>
                    <li>• 拥有政府技术推拿SKM文凭</li>
                    <li>• 西医注册灌注师（多年经验）</li>
                    <li>• 化验师资格</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
                    简介
                  </h3>
                  <p className="text-gray-600">
                    杨源森医师是一位经验丰富的注册中医师，从业超过30年。他不仅精通传统中医诊疗，
                    还拥有西医灌注师和化验师的背景，使他能够从多角度为患者提供全面的健康评估和治疗方案。
                    杨医师曾在槟榔屿中医学院任教并担任临床带教，培养了众多中医人才。
                    他的专业推拿技术获得政府SKM文凭认证，深受患者信赖。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor 2 - 周祥音 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gradient-to-br from-accent-100 to-accent-200 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-5xl text-accent-700">周</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">周祥音</h2>
                  <p className="text-primary-600 font-medium">注册中医师</p>
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
                    专长领域
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">内科</span>
                    <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">妇科</span>
                    <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">儿科</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-primary-600" />
                    资质与经验
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• 从业超过30年</li>
                    <li>• 毕业于槟榔屿中医学院</li>
                    <li>• 曾到中国进修，获得中国文凭</li>
                    <li>• 曾在慈善机构担任中医师多年</li>
                    <li>• 中药店配药和助诊医师经验</li>
                    <li>• 汤药、补品调配经验丰富</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
                    简介
                  </h3>
                  <p className="text-gray-600">
                    周祥音医师是一位专精于妇科和儿科的注册中医师，从业超过30年。
                    她毕业于槟榔屿中医学院，并曾远赴中国进修深造，获得中国文凭。
                    周医师曾在慈善机构服务多年，积累了丰富的临床经验。
                    她在中药配方和汤药调配方面有着深厚的功底，能够根据患者的具体情况配制最适合的药方和补品。
                    周医师对妇女和儿童健康有着特别的关注和专长。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

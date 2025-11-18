import Link from 'next/link'
import { Stethoscope, Baby, Heart, Hand, Activity, Users } from 'lucide-react'

export default function ServicesPage() {
  const services = [
    {
      icon: <Stethoscope className="w-10 h-10" />,
      title: '内科',
      doctor: '杨源森医师 / 周祥音医师',
      description: '针对各种内科疾病提供传统中医诊疗，包括消化系统、呼吸系统、心血管系统等常见疾病。',
      conditions: ['感冒发烧', '咳嗽', '胃病', '失眠', '头痛', '高血压', '糖尿病调理'],
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: '妇科',
      doctor: '周祥音医师',
      description: '专业妇女中医保健治疗，针对女性特有的健康问题提供调理和治疗。',
      conditions: ['月经不调', '痛经', '更年期调理', '产后调理', '不孕调理', '白带异常'],
    },
    {
      icon: <Baby className="w-10 h-10" />,
      title: '儿科',
      doctor: '周祥音医师',
      description: '儿童中医保健和治疗，用温和的方法呵护孩子的健康成长。',
      conditions: ['小儿感冒', '咳嗽', '消化不良', '食欲不振', '夜啼', '发育调理'],
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: '男科',
      doctor: '杨源森医师',
      description: '针对男性健康问题提供专业的中医诊疗和调理。',
      conditions: ['前列腺问题', '性功能调理', '泌尿系统', '肾虚调理', '男性不育'],
    },
    {
      icon: <Activity className="w-10 h-10" />,
      title: '针灸',
      doctor: '杨源森医师',
      description: '传统针灸治疗，通过刺激穴位调节身体机能，治疗各种病症。',
      conditions: ['疼痛治疗', '中风康复', '面瘫', '神经系统问题', '关节炎', '颈椎病'],
    },
    {
      icon: <Hand className="w-10 h-10" />,
      title: '推拿',
      doctor: '杨源森医师',
      description: '专业推拿治疗，缓解肌肉疲劳和疼痛，改善身体机能。杨医师拥有政府SKM文凭认证。',
      conditions: ['腰酸背痛', '肩颈僵硬', '运动损伤', '筋骨劳损', '落枕', '坐骨神经痛'],
      notice: '需提前3天预约，如当天取消或未通知需付全费',
    },
  ]

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">服务项目</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            福田药行提供全面的中医诊疗服务，由经验丰富的注册中医师为您服务
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className="text-primary-600 mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-sm text-primary-600 mb-3">{service.doctor}</p>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">适用症状：</p>
                <div className="flex flex-wrap gap-1">
                  {service.conditions.map((condition, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              {service.notice && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                  {service.notice}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-primary-50 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">需要预约看诊？</h3>
            <p className="text-gray-600 mb-6">
              如需了解更多服务详情或收费标准，请致电咨询或在线预约
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                在线预约
              </Link>
              <a
                href="tel:+601110823286"
                className="px-6 py-3 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                电话咨询
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Phone, Calendar, Award, Users, Stethoscope, Hand } from 'lucide-react'

export default function Home() {
  const services = [
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: '内科',
      description: '针对各种内科疾病提供传统中医诊疗',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '妇科 / 儿科',
      description: '专业妇女和儿童中医保健治疗',
    },
    {
      icon: <Hand className="w-8 h-8" />,
      title: '针灸推拿',
      description: '传统针灸和专业推拿治疗',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-accent-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              福田药行
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              提供传统中医诊疗，专注内科，针灸推拿
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                在线预约
              </Link>
              <a
                href="tel:+601110823286"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                电话咨询
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">30年以上经验</h3>
              <p className="text-gray-600">资深中医师团队，临床经验丰富</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">专业团队</h3>
              <p className="text-gray-600">注册中医师，专业可靠</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">全面服务</h3>
              <p className="text-gray-600">内科、妇科、儿科、针灸、推拿</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">我们的服务</h2>
            <p className="text-gray-600">专业的中医诊疗服务，呵护您的健康</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-primary-600 mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/services"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              查看全部服务 →
            </Link>
          </div>
        </div>
      </section>

      {/* Doctors Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">医师团队</h2>
            <p className="text-gray-600">经验丰富的注册中医师为您服务</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Doctor 1 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-24 h-24 bg-primary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-primary-700">杨</span>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">杨源森 医师</h3>
              <p className="text-primary-600 text-center text-sm mb-3">注册中医师</p>
              <p className="text-gray-600 text-sm">
                专长：内科、针灸、推拿、男科<br />
                从业超过30年，曾在槟榔屿中医学院任教，担任临床带教。拥有政府技术推拿SKM文凭，同时也是西医注册灌注师和化验师。
              </p>
            </div>
            {/* Doctor 2 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-24 h-24 bg-accent-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-accent-700">周</span>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">周祥音 医师</h3>
              <p className="text-primary-600 text-center text-sm mb-3">注册中医师</p>
              <p className="text-gray-600 text-sm">
                专长：内科、妇科、儿科<br />
                从业超过30年，毕业于槟榔屿中医学院，曾到中国进修并获得中国文凭。曾在慈善机构担任中医师多年，对妇科和儿科有特别专长。
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/doctors"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              了解更多 →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">需要预约看诊？</h2>
          <p className="text-primary-100 mb-8">
            立即预约，让我们的专业中医师为您提供最适合的治疗方案
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              在线预约
            </Link>
            <a
              href="https://wa.me/601110823286"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
            >
              WhatsApp 咨询
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

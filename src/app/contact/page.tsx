import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">联系我们</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            如有任何问题或需要预约，欢迎通过以下方式联系我们
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">联系方式</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">地址</h3>
                    <p className="text-gray-600 mt-1">
                      1-1-23 Persiaran Halia 3,<br />
                      Tanjung Bungah 11200 Penang,<br />
                      Malaysia
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">电话</h3>
                    <a href="tel:+601110823286" className="text-primary-600 hover:text-primary-700 mt-1 block">
                      +60 11-1082 3286
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">WhatsApp / 微信</h3>
                    <a
                      href="https://wa.me/601110823286"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 mt-1 block"
                    >
                      +60 11-1082 3286
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">电子邮件</h3>
                    <a href="mailto:futianyc@gmail.com" className="text-primary-600 hover:text-primary-700 mt-1 block">
                      futianyc@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary-600" />
                营业时间
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">周一至周五</span>
                  <span className="font-medium text-gray-900">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">周六</span>
                  <span className="font-medium text-gray-900">3:00 PM - 7:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">周日</span>
                  <span className="font-medium text-gray-900">3:00 PM - 7:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">位置地图</h2>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p>地图加载中...</p>
                <p className="text-sm mt-2">
                  1-1-23 Persiaran Halia 3,<br />
                  Tanjung Bungah 11200 Penang
                </p>
              </div>
            </div>
            <div className="mt-4">
              <a
                href="https://maps.google.com/?q=1-1-23+Persiaran+Halia+3+Tanjung+Bungah+11200+Penang"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                在 Google Maps 中查看 →
              </a>
            </div>
          </div>
        </div>

        {/* Quick Contact CTA */}
        <div className="mt-12 bg-primary-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">需要预约看诊？</h3>
          <p className="text-gray-600 mb-6">
            欢迎通过电话或WhatsApp直接联系我们预约，或使用在线预约系统
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/601110823286"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              WhatsApp 预约
            </a>
            <a
              href="/booking"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              在线预约
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">福田药行</h3>
            <p className="text-gray-400 mb-4">
              提供传统中医诊疗，专注内科，针灸推拿。超过30年临床经验，专业可靠。
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">联系方式</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 text-primary-500" />
                <span>1-1-23 Persiaran Halia 3,<br />Tanjung Bungah 11200 Penang</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-primary-500" />
                <a href="tel:+601110823286" className="hover:text-white">+60 11-1082 3286</a>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-primary-500" />
                <a href="mailto:futianyc@gmail.com" className="hover:text-white">futianyc@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">营业时间</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-3 mt-0.5 text-primary-500" />
                <div>
                  <p>周一至周五: 9:00 AM - 5:00 PM</p>
                  <p>周六、周日: 3:00 PM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} 福田药行 Futian Trading. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

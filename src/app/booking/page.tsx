'use client'

import { useState } from 'react'
import { Calendar, Clock, User, Phone, Mail, AlertCircle } from 'lucide-react'

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    doctor: '',
    date: '',
    time: '',
    message: '',
  })

  const services = [
    { value: 'internal', label: '内科', doctors: ['杨源森医师', '周祥音医师'] },
    { value: 'gynecology', label: '妇科', doctors: ['周祥音医师'] },
    { value: 'pediatrics', label: '儿科', doctors: ['周祥音医师'] },
    { value: 'andrology', label: '男科', doctors: ['杨源森医师'] },
    { value: 'acupuncture', label: '针灸', doctors: ['杨源森医师'] },
    { value: 'tuina', label: '推拿', doctors: ['杨源森医师'] },
  ]

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    alert('预约请求已提交！我们将尽快与您联系确认。')
  }

  const selectedService = services.find(s => s.value === formData.service)
  const isTuina = formData.service === 'tuina'

  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">在线预约</h1>
          <p className="text-gray-600">
            请填写以下表格预约看诊，我们将尽快与您联系确认
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                姓名 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="请输入您的姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                电话 *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="请输入联系电话"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              电子邮件
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="请输入电子邮件（可选）"
            />
          </div>

          {/* Service Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                服务项目 *
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">请选择服务</option>
                {services.map(service => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择医师 *
              </label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
                disabled={!formData.service}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              >
                <option value="">请选择医师</option>
                {selectedService?.doctors.map(doctor => (
                  <option key={doctor} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tuina Warning */}
          {isTuina && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">推拿预约须知：</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>需提前3天预约</li>
                  <li>更改或取消需提前2天通知</li>
                  <li>当天通知或未通知取消需付全费</li>
                </ul>
              </div>
            </div>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                预约日期 *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                预约时间 *
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">请选择时间</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              症状描述 / 备注
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="请简单描述您的症状或其他需要告知的信息..."
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              提交预约
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            提交后我们将通过电话或WhatsApp与您确认预约详情
          </p>
        </form>

        {/* Contact Options */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">或者直接联系我们：</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+601110823286"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              电话：+60 11-1082 3286
            </a>
            <a
              href="https://wa.me/601110823286"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              WhatsApp 咨询
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { QrCode, Search, User, Phone, MapPin, FileText, Calendar } from 'lucide-react'

interface PatientData {
  id: string
  fullName: string
  gender: string
  dateOfBirth: string
  idType: string
  idNumber: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  postcode: string
  country: string
  emergencyContact: string
  emergencyPhone: string
  emergencyRelation: string
  allergies: string
  medicalHistory: string
  currentMedications: string
  createdAt: string
  medicalRecords: any[]
}

export default function ScanPage() {
  const [patientId, setPatientId] = useState('')
  const [patient, setPatient] = useState<PatientData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientId.trim()) return

    setIsLoading(true)
    setError('')
    setPatient(null)

    try {
      // 尝试解析QR码内容（如果是JSON格式）
      let searchId = patientId.trim()
      try {
        const parsed = JSON.parse(patientId)
        if (parsed.id) {
          searchId = parsed.id
        }
      } catch {
        // 不是JSON，使用原始输入
      }

      const response = await fetch(`/api/patients/register?id=${encodeURIComponent(searchId)}`)
      const result = await response.json()

      if (result.success) {
        setPatient(result.patient)
      } else {
        setError(result.message || '找不到患者记录')
      }
    } catch (err) {
      setError('查询失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">患者查询</h1>
          <p className="text-gray-600">
            扫描患者QR码或输入患者编号查询病历资料
          </p>
        </div>

        {/* 搜索表单 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="输入患者编号或扫描QR码内容"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center disabled:bg-gray-400"
            >
              <Search className="w-5 h-5 mr-2" />
              {isLoading ? '查询中...' : '查询'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* 患者资料显示 */}
        {patient && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* 头部信息 */}
            <div className="bg-primary-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{patient.fullName}</h2>
                  <p className="text-primary-100 mt-1">
                    患者编号：{patient.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary-100">注册日期</p>
                  <p>{new Date(patient.createdAt).toLocaleDateString('zh-CN')}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-600" />
                  基本信息
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">性别</p>
                    <p className="font-medium">{patient.gender === 'male' ? '男' : '女'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">年龄</p>
                    <p className="font-medium">{calculateAge(patient.dateOfBirth)} 岁</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">出生日期</p>
                    <p className="font-medium">{patient.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{patient.idType === 'ic' ? '身份证' : '护照'}</p>
                    <p className="font-medium">{patient.idNumber}</p>
                  </div>
                </div>
              </div>

              {/* 联系方式 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-primary-600" />
                  联系方式
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">电话</p>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                  {patient.email && (
                    <div>
                      <p className="text-sm text-gray-500">电子邮件</p>
                      <p className="font-medium">{patient.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 地址 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                  地址
                </h3>
                <p className="text-gray-700">
                  {patient.address}, {patient.city}, {patient.postcode} {patient.state}, {patient.country}
                </p>
              </div>

              {/* 紧急联系人 */}
              {patient.emergencyContact && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">紧急联系人</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">姓名</p>
                      <p className="font-medium">{patient.emergencyContact}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">电话</p>
                      <p className="font-medium">{patient.emergencyPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">关系</p>
                      <p className="font-medium">{patient.emergencyRelation}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 病史资料 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary-600" />
                  病史资料
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">药物过敏</p>
                    <p className="font-medium text-red-600">{patient.allergies || '无'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">过往病史</p>
                    <p className="font-medium">{patient.medicalHistory || '无'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">目前服用药物</p>
                    <p className="font-medium">{patient.currentMedications || '无'}</p>
                  </div>
                </div>
              </div>

              {/* 就诊记录 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                  就诊记录
                </h3>
                {patient.medicalRecords && patient.medicalRecords.length > 0 ? (
                  <div className="space-y-4">
                    {patient.medicalRecords.map((record: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <p className="text-sm text-gray-500">{record.date}</p>
                        <p className="font-medium">{record.diagnosis}</p>
                        <p className="text-gray-600">{record.treatment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">暂无就诊记录</p>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="pt-4 border-t flex gap-4">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  添加就诊记录
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  打印资料
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'

// 简单的内存存储（生产环境应使用数据库）
// 这里仅作演示，实际应连接数据库如PostgreSQL或MongoDB
const patients: Map<string, any> = new Map()

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // 生成唯一患者ID
    const patientId = `FT${Date.now().toString(36).toUpperCase()}${uuidv4().substring(0, 4).toUpperCase()}`

    // 创建患者记录
    const patient = {
      id: patientId,
      ...data,
      createdAt: new Date().toISOString(),
      medicalRecords: [], // 病历记录
    }

    // 存储患者数据（实际应存入数据库）
    patients.set(patientId, patient)

    // 生成QR码内容 - 包含患者ID和基本信息的URL
    const qrContent = JSON.stringify({
      id: patientId,
      name: data.fullName,
      type: 'futian-patient',
    })

    // 生成QR码图片（Base64格式）
    const qrCodeDataUrl = await QRCode.toDataURL(qrContent, {
      width: 300,
      margin: 2,
      color: {
        dark: '#166534', // 深绿色
        light: '#ffffff',
      },
    })

    return NextResponse.json({
      success: true,
      patientId,
      qrCode: qrCodeDataUrl,
      message: '注册成功',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: '注册失败' },
      { status: 500 }
    )
  }
}

// 获取患者信息
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const patientId = searchParams.get('id')

  if (!patientId) {
    return NextResponse.json(
      { success: false, message: '请提供患者ID' },
      { status: 400 }
    )
  }

  const patient = patients.get(patientId)

  if (!patient) {
    return NextResponse.json(
      { success: false, message: '找不到患者记录' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    patient,
  })
}

import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'
import db from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // 生成唯一患者ID
    const patientId = `FT${Date.now().toString(36).toUpperCase()}${uuidv4().substring(0, 4).toUpperCase()}`

    const now = new Date().toISOString()

    // 插入患者数据到数据库
    const stmt = db.prepare(`
      INSERT INTO patients (
        id, fullName, gender, dateOfBirth, idType, idNumber,
        phone, email, address, city, state, postcode, country,
        emergencyContact, emergencyPhone, emergencyRelation,
        allergies, medicalHistory, currentMedications,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      patientId,
      data.fullName,
      data.gender,
      data.dateOfBirth,
      data.idType,
      data.idNumber,
      data.phone,
      data.email || null,
      data.address,
      data.city,
      data.state,
      data.postcode,
      data.country,
      data.emergencyContact || null,
      data.emergencyPhone || null,
      data.emergencyRelation || null,
      data.allergies || null,
      data.medicalHistory || null,
      data.currentMedications || null,
      now,
      now
    )

    // 生成QR码内容
    const qrContent = JSON.stringify({
      id: patientId,
      name: data.fullName,
      type: 'futian-patient',
    })

    // 生成QR码图片
    const qrCodeDataUrl = await QRCode.toDataURL(qrContent, {
      width: 300,
      margin: 2,
      color: {
        dark: '#166534',
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
      { success: false, message: '注册失败：' + (error instanceof Error ? error.message : '未知错误') },
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

  try {
    // 从数据库查询患者信息
    const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(patientId)

    if (!patient) {
      return NextResponse.json(
        { success: false, message: '找不到患者记录' },
        { status: 404 }
      )
    }

    // 查询该患者的就诊记录
    const medicalRecords = db.prepare(
      'SELECT * FROM medical_records WHERE patientId = ? ORDER BY date DESC'
    ).all(patientId)

    return NextResponse.json({
      success: true,
      patient: {
        ...patient,
        medicalRecords,
      },
    })
  } catch (error) {
    console.error('Query error:', error)
    return NextResponse.json(
      { success: false, message: '查询失败' },
      { status: 500 }
    )
  }
}

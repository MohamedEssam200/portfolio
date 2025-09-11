import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { devices, scanResults } = await request.json()

    const report = {
      report_metadata: {
        generated_at: new Date().toISOString(),
        report_type: "IoT Security Assessment",
        version: "1.0",
      },
      scan_summary: scanResults,
      devices: devices,
      recommendations: [
        "Implement network segmentation for IoT devices",
        "Regular firmware updates for all devices",
        "Use strong authentication mechanisms",
        "Monitor network traffic for anomalies",
      ],
    }

    const jsonReport = JSON.stringify(report, null, 2)

    return new NextResponse(jsonReport, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="iot_security_report_${new Date().toISOString().split("T")[0]}.json"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Export failed" }, { status: 500 })
  }
}

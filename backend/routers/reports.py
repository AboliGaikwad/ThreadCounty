from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from services.supabase_client import supabase
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
import io

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/{upload_id}/pdf")
def download_pdf(upload_id: str):
    upload = supabase.from_("uploads").select("*").eq("id", upload_id).single().execute()
    result = supabase.from_("analysis_results").select("*").eq("upload_id", upload_id).single().execute()

    if not upload.data or not result.data:
        raise HTTPException(status_code=404, detail="Report not found.")

    u = upload.data
    r = result.data

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("ThreadCounty — Fabric Analysis Report", styles["Title"]))
    elements.append(Spacer(1, 20))
    elements.append(Paragraph(f"File: {u['file_name']}", styles["Normal"]))
    elements.append(Paragraph(f"Date: {u['created_at'][:10]}", styles["Normal"]))
    elements.append(Spacer(1, 20))

    table_data = [
        ["Field", "Value"],
        ["Fabric Type", r["fabric_type"]],
        ["Thread Density", f"{r['thread_density']} /in²"],
        ["Warp Count", str(r["warp_count"])],
        ["Weft Count", str(r["weft_count"])],
        ["Confidence Score", f"{r['confidence_score']}%"],
    ]

    table = Table(table_data, colWidths=[200, 260])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#141C2B")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#D9A441")),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#1E2A3D"), colors.white]),
        ("TEXTCOLOR", (0, 1), (-1, -1), colors.HexColor("#141C2B")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#1E2A3D")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f5f5f5"), colors.white]),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 20))
    elements.append(Paragraph("AI Suggestions", styles["Heading2"]))
    elements.append(Paragraph(r["ai_suggestions"], styles["Normal"]))

    doc.build(elements)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=threadcounty-report-{upload_id[:8]}.pdf"}
    )
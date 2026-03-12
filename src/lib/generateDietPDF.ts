import { toast } from "sonner";
import { Diet } from "@/components/admin/types";

/**
 * Generates a beautiful PDF from the #diet-pdf-template element.
 *
 * Uses html2canvas's `onclone` callback to modify the element's positioning
 * inside html2canvas's internal clone — the original element stays completely
 * hidden (visibility: hidden, left: -9999px) and NEVER flashes on screen.
 */
export async function generateDietPDF(diet: Diet): Promise<void> {
  const toastId = toast.loading("Gerando PDF…");

  try {
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const source = document.getElementById("diet-pdf-template");
    if (!source) {
      toast.error("Template não encontrado. Reabra e tente novamente.", { id: toastId });
      return;
    }

    const canvas = await html2canvas(source, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#0a0a0a",
      logging: false,
      width: 794,
      // onclone runs on html2canvas's internal DOM copy — completely invisible to the user.
      // We fix the positioning here so it renders correctly without any flash.
      onclone: (clonedDoc: Document) => {
        const el = clonedDoc.getElementById("diet-pdf-template") as HTMLElement | null;
        if (el) {
          el.style.position = "relative";
          el.style.left = "0px";
          el.style.top = "0px";
          el.style.visibility = "visible";
          el.style.zIndex = "1";
        }
      },
    });

    const imgData = canvas.toDataURL("image/png");

    const PDF_WIDTH_MM = 210;
    const PAGE_HEIGHT_MM = 297;
    const contentHeightMM = (canvas.height * PDF_WIDTH_MM) / canvas.width;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    if (contentHeightMM <= PAGE_HEIGHT_MM) {
      // Fits in a single page
      pdf.addImage(imgData, "PNG", 0, 0, PDF_WIDTH_MM, contentHeightMM);
    } else {
      // Multi-page: slice canvas into A4-height chunks
      const pageHeightPx = Math.round((PAGE_HEIGHT_MM * canvas.width) / PDF_WIDTH_MM);
      let offsetY = 0;
      let page = 0;

      while (offsetY < canvas.height) {
        const sliceH = Math.min(pageHeightPx, canvas.height - offsetY);
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceH;

        const ctx = sliceCanvas.getContext("2d")!;
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(canvas, 0, offsetY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

        if (page > 0) pdf.addPage();
        pdf.addImage(
          sliceCanvas.toDataURL("image/png"),
          "PNG",
          0,
          0,
          PDF_WIDTH_MM,
          (sliceH * PDF_WIDTH_MM) / canvas.width
        );

        offsetY += pageHeightPx;
        page++;
      }
    }

    const safeName = diet.studentName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

    pdf.save(`dieta-projeto-active-${safeName}.pdf`);
    toast.success("PDF gerado com sucesso! ✅", { id: toastId });

  } catch (error: unknown) {
    console.error("[generateDietPDF]", error);
    const msg = error instanceof Error ? error.message : String(error);
    toast.error(`Erro ao gerar o PDF: ${msg}`, { id: toastId });
  }
}

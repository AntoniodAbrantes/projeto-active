import { Diet } from "./types";
import { FlameKindling, Clock, Salad } from "lucide-react";

interface DietPDFTemplateProps {
  diet: Diet;
}

/**
 * This component renders off-screen and is captured by html2canvas to generate a beautiful PDF.
 * It uses the same visual language as the Projeto Active landing page.
 */
export function DietPDFTemplate({ diet }: DietPDFTemplateProps) {
  const cleanMeals = diet.meals.filter(m => m.foods.some(f => f.trim() !== ""));

  return (
    <div
      id="diet-pdf-template"
      style={{
        width: "794px",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        background: "#0a0a0a",
        color: "#ffffff",
        position: "absolute",
        left: "-9999px",
        top: "0px",
        zIndex: -1,
        overflow: "hidden",
        visibility: "hidden",
      }}
    >
      {/* === PAGE 1 WRAPPER === */}
      <div style={{ padding: "0", background: "#0a0a0a", minHeight: "1123px", position: "relative" }}>

        {/* Ambient background glow */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "400px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,122,0,0.18) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        {/* === HEADER === */}
        <div style={{
          padding: "44px 48px 36px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          position: "relative",
        }}>
          <div>
            {/* Brand pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255,122,0,0.12)", border: "1px solid rgba(255,122,0,0.3)",
              borderRadius: "999px", padding: "6px 16px", marginBottom: "18px",
            }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF7A00" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF7A00", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Projeto Active — Plano Alimentar
              </span>
            </div>

            <div style={{ fontSize: "42px", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "10px" }}>
              Olá, <span style={{ color: "#FF7A00" }}>{diet.studentName.split(" ")[0]}!</span>
            </div>
            <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
              Sua dieta foi preparada com base no seu perfil<br />
              pela equipe de nutrição do Projeto Active.
            </div>
          </div>

          <div style={{
            width: "72px", height: "72px", borderRadius: "18px",
            background: "linear-gradient(135deg, rgba(255,122,0,0.2), rgba(255,122,0,0.05))",
            border: "1px solid rgba(255,122,0,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "4px",
          }}>
            <div style={{ width: "28px", height: "3px", borderRadius: "2px", background: "#FF7A00" }} />
            <div style={{ width: "22px", height: "3px", borderRadius: "2px", background: "rgba(255,122,0,0.6)" }} />
            <div style={{ width: "16px", height: "3px", borderRadius: "2px", background: "rgba(255,122,0,0.3)" }} />
          </div>
        </div>

        {/* === CALORIE STATS === */}
        <div style={{ padding: "28px 48px", display: "flex", gap: "16px" }}>
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", padding: "20px 24px",
          }}>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: "8px" }}>
              Peso atual
            </div>
            <div style={{ fontSize: "36px", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
              {diet.weight} <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>kg</span>
            </div>
          </div>

          <div style={{
            flex: 2,
            background: "linear-gradient(135deg, rgba(255,122,0,0.15), rgba(255,122,0,0.05))",
            border: "1px solid rgba(255,122,0,0.3)",
            borderRadius: "16px", padding: "20px 24px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", right: "-20px", top: "-20px",
              width: "120px", height: "120px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,122,0,0.2), transparent)",
            }} />
            <div style={{ fontSize: "11px", color: "#FF7A00", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              🔥 Meta Calórica Diária
            </div>
            <div style={{ fontSize: "48px", fontWeight: 900, color: "#FF7A00", letterSpacing: "-0.02em", lineHeight: 1 }}>
              {diet.calories}
              <span style={{ fontSize: "18px", color: "rgba(255,122,0,0.6)", fontWeight: 400, marginLeft: "6px" }}>kcal</span>
            </div>

          </div>
        </div>

        {/* === MEALS === */}
        <div style={{ padding: "0 48px 32px" }}>
          <div style={{
            fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
            letterSpacing: "0.1em", fontWeight: 700, marginBottom: "16px",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            <div style={{ width: "20px", height: "1px", background: "rgba(255,122,0,0.5)" }} />
            Plano de Refeições
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {cleanMeals.map((meal, i) => (
              <div key={meal.id} style={{
                background: i === 2 ? "rgba(255,122,0,0.06)" : "rgba(255,255,255,0.03)",
                border: i === 2 ? "1px solid rgba(255,122,0,0.2)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                overflow: "hidden",
              }}>
                {/* Meal header */}
                <div style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: i === 2 ? "rgba(255,122,0,0.08)" : "rgba(255,255,255,0.03)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: i === 2 ? "#FF7A00" : "rgba(255,255,255,0.3)"
                    }} />
                    <span style={{ fontWeight: 700, fontSize: "13px", color: i === 2 ? "#FF7A00" : "#fff" }}>
                      {meal.name}
                    </span>
                  </div>
                  <span style={{
                    fontSize: "11px", color: "rgba(255,255,255,0.35)",
                    background: "rgba(255,255,255,0.06)", borderRadius: "999px",
                    padding: "3px 10px", fontWeight: 500,
                  }}>
                    {meal.time}
                  </span>
                </div>

                {/* Foods */}
                <div style={{ padding: "12px 16px" }}>
                  {meal.foods.filter(f => f.trim()).map((food, fi) => (
                    <div key={fi} style={{
                      display: "flex", alignItems: "flex-start", gap: "8px",
                      marginBottom: fi < meal.foods.filter(f => f.trim()).length - 1 ? "8px" : "0",
                    }}>
                      <span style={{ color: "#FF7A00", fontSize: "14px", marginTop: "1px", flexShrink: 0 }}>•</span>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{food}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === NOTES === */}
        {diet.notes?.trim() && (
          <div style={{ padding: "0 48px 32px" }}>
            <div style={{
              background: "rgba(255,122,0,0.06)", border: "1px solid rgba(255,122,0,0.2)",
              borderRadius: "14px", padding: "20px 24px",
              borderLeft: "3px solid #FF7A00",
            }}>
              <div style={{ fontSize: "11px", color: "#FF7A00", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
                💬 Observações do Nutricionista
              </div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {diet.notes}
              </div>
            </div>
          </div>
        )}

        {/* === FOOTER === */}
        <div style={{
          position: "absolute", bottom: "0", left: "0", right: "0",
          padding: "20px 48px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(0,0,0,0.4)",
        }}>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 900, color: "#FF7A00", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              PROJETO ACTIVE
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
              projetoactive.com
            </div>
          </div>
          <div style={{
            fontSize: "11px", color: "rgba(255,255,255,0.2)",
            textAlign: "right", lineHeight: 1.5,
          }}>
            Plano preparado exclusivamente para<br />
            <strong style={{ color: "rgba(255,255,255,0.4)" }}>{diet.studentName}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

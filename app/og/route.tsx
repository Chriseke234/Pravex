import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters
    const asset = searchParams.get("asset");
    const symbol = searchParams.get("symbol");
    const price = searchParams.get("price");

    const isAsset = !!asset;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0A1628",
            backgroundImage: "radial-gradient(circle at 50% 50%, #1e293b 0%, #0A1628 100%)",
            position: "relative",
          }}
        >
          {/* Top border decoration */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "8px",
              background: "linear-gradient(to right, #3b82f6, #D4AF37, #10b981)",
            }}
          />

          {/* Logo Brand Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              top: "60px",
              left: "60px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#3b82f6",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
                fontWeight: "900",
              }}
            >
              P
            </div>
            <span
              style={{
                marginLeft: "16px",
                color: "white",
                fontSize: "28px",
                fontWeight: "bold",
                letterSpacing: "-0.5px",
              }}
            >
              Pavex <span style={{ color: "#D4AF37" }}>Institutional</span>
            </span>
          </div>

          {/* Dynamic Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: "60px",
              paddingRight: "60px",
              width: "100%",
              marginTop: "80px",
            }}
          >
            {isAsset ? (
              // Asset OG card layout
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "24px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Real-time Pricing
                </span>
                <span
                  style={{
                    color: "white",
                    fontSize: "64px",
                    fontWeight: "bold",
                    marginTop: "8px",
                    letterSpacing: "-1px",
                  }}
                >
                  {asset}{symbol ? ` (${symbol.toUpperCase()})` : ""}
                </span>
                <span
                  style={{
                    color: "#D4AF37",
                    fontSize: "56px",
                    fontWeight: "bold",
                    marginTop: "16px",
                  }}
                >
                  {price || "Live Data"}
                </span>
              </div>
            ) : (
              // Default OG card layout
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    color: "white",
                    fontSize: "60px",
                    fontWeight: "bold",
                    lineHeight: "1.2",
                    letterSpacing: "-1px",
                  }}
                >
                  Next-Gen Digital Asset <br /> Trading Infrastructure
                </span>
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "24px",
                    marginTop: "20px",
                    maxWidth: "800px",
                    lineHeight: "1.4",
                  }}
                >
                  Secure custody, institutional liquidity, and high-performance execution built for sovereign wealth funds, asset managers, and Tier-1 banks.
                </span>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              left: "60px",
              right: "60px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "24px",
            }}
          >
            <span style={{ color: "#64748b", fontSize: "16px" }}>pavex.io</span>
            <span style={{ color: "#64748b", fontSize: "16px" }}>MPC-CMP Custody &bull; Regulated Brokerage</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response("Failed to generate OG image", { status: 500 });
  }
}

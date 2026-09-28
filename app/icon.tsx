import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#25282a",
        color: "#8dc63f",
        fontFamily: "Arial, sans-serif",
        fontWeight: 800,
        fontSize: 48,
        letterSpacing: "-7px",
        paddingRight: 7,
      }}
    >
      m<span style={{ color: "#fbd355", fontSize: 36, marginLeft: 2 }}>1</span>
    </div>,
    size,
  );
}

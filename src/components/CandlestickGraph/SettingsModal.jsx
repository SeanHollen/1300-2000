import { useState } from "react";

export default function SettingsModal({ lineChartData, onClose, onToggle }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        padding: "1rem",
        borderRadius: "8px",
        position: "relative",
        minWidth: "300px"
      }}>
        <button
          onClick={onClose}
          tabIndex={-1}
          style={{
            position: "absolute",
            top: "10px",
            right: "12px",
            background: "transparent",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            outline: "none"
          }}
        >
          ×
        </button>

        <h2 style={{
          margin: 0,
          marginBottom: "1rem",
          textAlign: "center",
          fontSize: "1.2rem"
        }}>
          Settings
        </h2>

        <div>
          {lineChartData.map(item => (
            <div
              key={item.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.4rem 0"
              }}
            >
              <div key={item.id} style={{ paddingRight: "1rem" }} >
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: item.color,
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </a>
              </div>
              <input
                type="checkbox"
                checked={item.toShow}
                onChange={(event) => onToggle(item.label, event.target.checked)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

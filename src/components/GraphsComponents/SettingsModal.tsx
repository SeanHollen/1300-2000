import { LineTS } from "../types/trendlineData";

type Props = {
  lineChartData: LineTS[];
  onClose: () => void;
  onToggleSelectTendline: (label: string, toShow: boolean) => void;
  onDeselectAllTrendlines: () => void;
  onSliderChange: (value: number) => void;
  sliderValue: number;
  onRestoreDefaults: () => void;
  setShowTimelineChart: (show: boolean) => void;
  showTimelineChart: boolean;
  setShowAllPointTooltips: (show: boolean) => void;
  showAllPointTooltips: boolean;
  setShowTooltipImages: (show: boolean) => void;
  showTooltipImages: boolean;
  isMobile: boolean;
};

export default function SettingsModal({
  lineChartData,
  onClose,
  onToggleSelectTendline,
  onDeselectAllTrendlines,
  onSliderChange,
  sliderValue,
  onRestoreDefaults,
  setShowTimelineChart,
  showTimelineChart,
  setShowAllPointTooltips,
  showAllPointTooltips,
  setShowTooltipImages,
  showTooltipImages,
  isMobile,
}: Props) {
  return (
    <div
    {...(isMobile
      ? { onClick: onClose }
      : {
          onMouseDown: (e) => {
            e.preventDefault();
            onClose();
          },
        })}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          background: "white",
          padding: "1rem",
          borderRadius: "8px",
          position: "relative",
          minWidth: "300px",
          color: "black",
        }}
      >
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
            outline: "none",
          }}
        >
          ×
        </button>

        <h2
          style={{
            margin: 0,
            marginBottom: "1rem",
            textAlign: "center",
            fontSize: "1.2rem",
          }}
        >
          Settings
        </h2>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "500",
            }}
          >
            Trendlines Opened
          </label>
          <div
            style={{
              maxHeight: "235px",
              overflowY: "auto",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              padding: "0.5rem",
              paddingRight: "1rem",
              paddingLeft: "1rem",
            }}
          >
            {lineChartData.map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.1rem 0",
                }}
              >
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingRight: "1rem",
                    fontSize: "14px",
                  }}
                >
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: item.color,
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={`/1300-2000/sourceIcons/${item.sourceIcon}.png`}
                      alt={`${item.label} icon`}
                      style={{
                        width: "16px",
                        height: "16px",
                        marginRight: "0.5rem",
                      }}
                    />
                    {`${item.label} (${item.points[0].year}-${
                      item.points[item.points.length - 1].year
                    })`}
                  </a>
                </div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => onToggleSelectTendline(item.label, !item.toShow)}
                >
                  <input
                    type="checkbox"
                    checked={item.toShow}
                    onChange={() => {}} // dummy to silence warning
                    style={{
                      pointerEvents: "auto",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "500",
            }}
          >
            Chart Width
          </label>
          <input
            type="range"
            min={1000}
            max={20000}
            value={sliderValue}
            onChange={(e) => onSliderChange(Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <div
            style={{
              fontWeight: "500",
              fontSize: "0.95rem",
              color: "#333",
            }}
          >
            {sliderValue} px
          </div>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "500",
            }}
          >
            Other
          </label>

          <div>
            <div
              key="hide-timeline"
              style={{
                display: "flex",
                alignItems: "center",
                paddingRight: "1rem",
                fontSize: "14px",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginRight: "0.5rem" }}>Show All Tooltips at Once</span>
              <div
                style={{
                  display: "inline-block",
                  padding: "5px",
                  cursor: "pointer",
                }}
                onClick={() => setShowAllPointTooltips(!showAllPointTooltips)}
              >
                <input
                  type="checkbox"
                  checked={showAllPointTooltips}
                  onChange={() => {}} // dummy to silence warning
                  style={{
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <div
              key="hide-timeline"
              style={{
                display: "flex",
                alignItems: "center",
                paddingRight: "1rem",
                fontSize: "14px",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginRight: "0.5rem" }}>Hide Timeline Chart (Just show Trendlines)</span>
              <div
                style={{
                  display: "inline-block",
                  padding: "5px",
                  cursor: "pointer",
                }}
                onClick={() => setShowTimelineChart(!showTimelineChart)}
              >
                <input
                  type="checkbox"
                  checked={!showTimelineChart}
                  onChange={() => {}} // dummy to silence warning
                  style={{
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <div
              key="show-tooltip-images"
              style={{
                display: "flex",
                alignItems: "center",
                paddingRight: "1rem",
                fontSize: "14px",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginRight: "0.5rem" }}>Show Images on Tooltips</span>
              <div
                style={{
                  display: "inline-block",
                  padding: "5px",
                  cursor: "pointer",
                }}
                onClick={() => setShowTooltipImages(!showTooltipImages)}
              >
                <input
                  type="checkbox"
                  checked={showTooltipImages}
                  onChange={() => {}} // dummy to silence warning
                  style={{
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>
          <br />
          <button
            onClick={onDeselectAllTrendlines}
            style={{
              display: "block",
              margin: "10px auto",
              background: "#808080",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Deselect All Trendlines
          </button>
          <button
            onClick={onRestoreDefaults}
            style={{
              background: "#808080",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Restore Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

import { StyleSheet, View } from "react-native";
import React from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeContext } from "@/context/ThemeProvider";
import { ChartPoint } from "@/types/agency/AnalyticsInterfaces";
import { formatAxis, formatCompact, formatFull } from "./format";

type Props = {
  points: ChartPoint[];
  axisMax: number;
  highlightIndex: number;
  currency: string;
};

const PLOT_HEIGHT = 200;

/** Diagonal stripes laid over a bar. Extra stripes are clipped on narrow bars. */
const Stripes = ({ light }: { light: boolean }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {Array.from({ length: 8 }, (_, index) => (
      <View
        key={index}
        style={[
          styles.stripe,
          {
            left: index * 8 - 16,
            backgroundColor: light
              ? "rgba(255,255,255,0.28)"
              : "rgba(255,255,255,0.55)",
          },
        ]}
      />
    ))}
  </View>
);

const RentChart = ({ points, axisMax, highlightIndex, currency }: Props) => {
  const { currentTheme } = useThemeContext();
  const labelColor = useThemeColor({}, "icons");
  const gridColor = useThemeColor({}, "borders");
  const highlightColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  const barColor = currentTheme === "dark" ? "#3A3A3A" : "#E4E1F0";
  const ticks = [1, 0.8, 0.6, 0.4, 0.2, 0].map((step) =>
    Math.round(axisMax * step),
  );
  const barArea = PLOT_HEIGHT - 0;
  const compactCallout = points.length > 0;

  return (
    <View style={styles.chart}>
      <View style={styles.axis}>
        {ticks.map((tick) => (
          <StyledText key={tick} style={[styles.axisLabel, { color: labelColor }]}>
            {formatAxis(tick, axisMax)}
          </StyledText>
        ))}
      </View>

      <View style={styles.plotWrap}>
        <View style={styles.plot}>
          {ticks.map((tick) => (
            <View
              key={tick}
              style={[
                styles.gridLine,
                {
                  backgroundColor: gridColor,
                  top: (1 - tick / axisMax) * PLOT_HEIGHT,
                },
              ]}
            />
          ))}

          {points.map((point, index) => {
            const highlighted = index === highlightIndex;
            const barHeight = Math.max(8, (point.value / axisMax) * barArea);
            const atStart = index === 0;
            const atEnd = index === points.length - 1;

            return (
              <View
                key={`${point.label}-${index}`}
                style={[styles.column, highlighted && styles.columnFront]}
              >
                {highlighted && (
                  <View
                    style={[
                      styles.callout,
                      { bottom: barHeight + 4 },
                      atStart && styles.calloutStart,
                      atEnd && styles.calloutEnd,
                    ]}
                  >
                    <StyledText style={[styles.calloutText, { color: textColor }]}>
                      {compactCallout
                        ? formatCompact(point.value, currency)
                        : formatFull(point.value, currency)}
                    </StyledText>
                    <View
                      style={[styles.calloutTip, { borderTopColor: highlightColor }]}
                    />
                  </View>
                )}

                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: highlighted ? highlightColor : barColor,
                    },
                  ]}
                >
                  <Stripes light={highlighted} />
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.labels}>
          {points.map((point, index) => {
            const highlighted = index === highlightIndex;
            return (
              <StyledText
                key={`${point.label}-${index}`}
                numberOfLines={1}
                style={[
                  styles.barLabel,
                  {
                    color: highlighted ? textColor : labelColor,
                    fontSize: points.length >= 12 ? 9 : 11,
                    lineHeight: points.length >= 12 ? 12 : 14,
                    fontFamily: highlighted ? "BarlowMedium" : "BarlowRegular",
                  },
                ]}
              >
                {point.label}
              </StyledText>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default RentChart;

const styles = StyleSheet.create({
  chart: {
    flexDirection: "row",
    marginTop: 5,
  },

  axis: {
    width: 25,
    height: PLOT_HEIGHT,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 6,
  },

  axisLabel: {
    fontSize: 10,
    lineHeight: 13,
  },

  plotWrap: {
    flex: 1,
  },

  plot: {
    height: PLOT_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-end",
  },

  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },

  column: {
    flex: 1,
    height: PLOT_HEIGHT,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 2,
  },

  columnFront: {
    zIndex: 1,
  },

  bar: {
    width: "100%",
    borderRadius: 6,
    overflow: "hidden",
  },

  stripe: {
    position: "absolute",
    top: -30,
    width: 6,
    height: 280,
    transform: [{ rotate: "28deg" }],
  },

  labels: {
    flexDirection: "row",
    marginTop: 6,
  },

  barLabel: {
    flex: 1,
    textAlign: "center",
  },

  callout: {
    position: "absolute",
    alignItems: "center",
  },

  calloutStart: {
    left: 0,
    alignItems: "flex-start",
  },

  calloutEnd: {
    right: 0,
    alignItems: "flex-end",
  },

  calloutText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "BarlowMedium",
  },

  calloutTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});

'use client';

import React, { useLayoutEffect, memo } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

type NpvResult = {
  discountRate: number;
  netPresentValue: number;
};

interface NpvChartProps {
  data: NpvResult[];
}

function NpvChartComponent({ data }: NpvChartProps) {
  useLayoutEffect(() => {
    const root = am5.Root.new('chartdiv');

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
      })
    );

    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineY.set('visible', false);

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xAxis.children.push(
      am5.Label.new(root, {
        text: 'Discount Rate',
        x: am5.p50,
        centerX: am5.p50,
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    yAxis.children.push(
      am5.Label.new(root, {
        text: 'Net Present Value (NPV)',
        rotation: -90,
        y: am5.p50,
        centerY: am5.p50,
      })
    );

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'NPV',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'netPresentValue',
        valueXField: 'discountRate',
        tooltip: am5.Tooltip.new(root, {
          labelText:
            "Rate: {valueX.formatNumber('#.##%')}\nNPV: {valueY.formatNumber('#,###.00')}",
        }),
      })
    );

    series.data.setAll(data);
    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data]);

  return <div id="chartdiv" className="w-full h-96 border rounded-lg" />;
}

export const NpvChart = memo(NpvChartComponent);

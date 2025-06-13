import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Config } from '../types/config';

/**
 * This component is a bit of a mess. 
 * I just kept asking cursor to "make it faster" and "reduce lag"
 * The result was to basically not do anything in the React-recommended way.
 * Instead, this component updates the DOM imperatively.
 * 
 * If you want to see my older method for doing this (with more lag),
 * see CursorLineSimple, which I've kept around to make it more convenient
 * to switch back to it.
 */

type Props = {
  config: Config;
  totalHeight: number;
  xToYear: (x: number) => number;
  chartWidth: number;
};

export interface CursorLineRef {
  updatePosition: (x: number) => void;
  hide: () => void;
}

const CursorLine = forwardRef<CursorLineRef, Props>(({ 
  config,
  totalHeight,
  xToYear,
  chartWidth
}, ref) => {
  const rectRef = useRef<SVGRectElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const labelGroupRef = useRef<SVGGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const svgElementRef = useRef<SVGSVGElement | null>(null);

  // Store the SVG element reference once when component mounts
  useEffect(() => {
    if (rectRef.current && !svgElementRef.current) {
      svgElementRef.current = rectRef.current.closest('svg');
    }
  }, []);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    updatePosition: (x: number) => {
      if (lineRef.current && labelGroupRef.current && textRef.current) {
        // Only show cursor if within chart bounds
        if (x >= 0 && x <= chartWidth) {
          // Use SVG transforms for correct positioning - immediate updates!
          lineRef.current.setAttribute('transform', `translate(${x}, 0)`);
          lineRef.current.style.display = 'block';
          
          labelGroupRef.current.setAttribute('transform', `translate(${x}, ${config.layout.axisHeight})`);
          labelGroupRef.current.style.display = 'block';
          
          textRef.current.textContent = xToYear(x).toString();
        } else {
          // Hide cursor
          lineRef.current.style.display = 'none';
          labelGroupRef.current.style.display = 'none';
        }
      }
    },
    hide: () => {
      if (lineRef.current && labelGroupRef.current) {
        lineRef.current.style.display = 'none';
        labelGroupRef.current.style.display = 'none';
      }
    }
  }), [chartWidth, xToYear, config.layout.axisHeight]);

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    // Use the stored SVG element reference
    const svgElement = svgElementRef.current;
    if (svgElement && lineRef.current && labelGroupRef.current && textRef.current) {
      const point = svgElement.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      const svgPoint = point.matrixTransform(svgElement.getScreenCTM()?.inverse());
      const x = svgPoint.x;
      
      // Only show cursor if within chart bounds
      if (x >= 0 && x <= chartWidth) {
        // Use SVG transforms for correct positioning - immediate updates!
        lineRef.current.setAttribute('transform', `translate(${x}, 0)`);
        lineRef.current.style.display = 'block';
        
        labelGroupRef.current.setAttribute('transform', `translate(${x}, ${config.layout.axisHeight})`);
        labelGroupRef.current.style.display = 'block';
        
        textRef.current.textContent = xToYear(x).toString();
      } else {
        // Hide cursor
        lineRef.current.style.display = 'none';
        labelGroupRef.current.style.display = 'none';
      }
    }
  };

  const handleMouseLeave = () => {
    // Hide cursor elements directly
    if (lineRef.current && labelGroupRef.current) {
      lineRef.current.style.display = 'none';
      labelGroupRef.current.style.display = 'none';
    }
  };

  return (
    <g>
      {/* Cursor line - initially hidden, positioned at origin for SVG transform */}
      <line
        ref={lineRef}
        x1={0}
        y1={config.layout.axisHeight}
        x2={0}
        y2={totalHeight}
        stroke="#374151"
        strokeWidth="1"
        strokeDasharray="4 4"
        pointerEvents="none"
        style={{ display: 'none' }}
      />
      
      {/* Cursor label - initially hidden, positioned at origin for SVG transform */}
      <g 
        ref={labelGroupRef}
        style={{ display: 'none' }}
      >
        <rect
          id="cursor-line-rect-1"
          x="-20"
          y="8"
          width="40"
          height="20"
          fill="white"
          rx="4"
          pointerEvents="none"
        />
        <text
          ref={textRef}
          y="20"
          textAnchor="middle"
          fontSize="12"
          fill="#374151"
          pointerEvents="none"
        >
        </text>
      </g>
      
      {/* Invisible overlay to capture mouse events - MUST be last to be on top */}
      <rect
        id="cursor-line-rect-2"
        ref={rectRef}
        x={0}
        y={0}
        width={chartWidth}
        height={totalHeight}
        fill="transparent"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ pointerEvents: 'all' }}
      />
    </g>
  );
});

CursorLine.displayName = 'CursorLine';

export default CursorLine; 
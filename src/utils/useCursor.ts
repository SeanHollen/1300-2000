import { useState, useRef, useEffect } from 'react';
import { CursorLineRef } from '../components/GraphsComponents/CursorLine';

interface UseCursorProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  cursorLineRef: React.RefObject<CursorLineRef | null>;
  xToYear: (x: number) => number;
  modalOpen: boolean;
}

export const useCursor = ({ containerRef, cursorLineRef, xToYear, modalOpen }: UseCursorProps) => {
  const [cursorX, setCursorX] = useState<number | null>(null);
  const [debouncedCursorX, setDebouncedCursorX] = useState<number | null>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; scrollLeft: number } | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      
      if (isDragging && dragStart) {
        const deltaX = e.clientX - dragStart.x;
        document.documentElement.scrollLeft = dragStart.scrollLeft - deltaX;
      }
      
      const scrollLeft = containerRef.current.scrollLeft;
      const x = e.clientX - rect.left + scrollLeft;
      
      // Update cursor position directly via ref (no re-render!)
      cursorLineRef?.current?.updatePosition(x);
      
      // Update cursor position immediately for internal tracking
      setCursorX(x);
      
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      // Hide indices immediately when cursor starts moving
      setDebouncedCursorX(null);
      
      // Set debounced cursor position after cursor stops moving
      debounceTimeoutRef.current = setTimeout(() => {
        setDebouncedCursorX(x);
      }, 150);
      
      // Still update hovered year for other components that need it
      setHoveredYear(xToYear(x));
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current && !modalOpen) {
      // Check if the click target is an interactive element (has a cursor pointer style)
      const target = e.target as HTMLElement;
      const isInteractive = target.style.cursor === "pointer" || 
                           target.closest('[style*="cursor: pointer"]') ||
                           target.closest('.swimlane-segment');
      
      if (!isInteractive) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX,
          scrollLeft: document.documentElement.scrollLeft,
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleMouseLeave = () => {
    // Hide cursor via ref (no re-render!)
    cursorLineRef?.current?.hide();
    
    // Clear debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    
    setCursorX(null);
    setDebouncedCursorX(null);
    setHoveredYear(null);
    setIsDragging(false);
    setDragStart(null);
  };

  // Handle wheel scrolling - convert vertical to horizontal
  useEffect(() => {
    const container = containerRef.current as HTMLDivElement | null;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && !modalOpen) {
        e.preventDefault(); // Prevent default vertical scrolling
        document.documentElement.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => container.removeEventListener("wheel", handleWheel);
  }, [modalOpen]);

  // Handle global mouse up for drag operations
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mouseup", handleGlobalMouseUp);
      return () => document.removeEventListener("mouseup", handleGlobalMouseUp);
    }
  }, [isDragging]);

  return {
    cursorX,
    debouncedCursorX,
    hoveredYear,
    isDragging,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
  };
}; 
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ModuleContent } from '../types';

interface MindMapProps {
  modules: ModuleContent[];
}

interface NodeData {
  name: string;
  id?: string;
  children?: NodeData[];
}

export default function MindMap({ modules }: MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !modules.length) return;

    // Clear previous SVG content
    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll('*').remove();

    const data: NodeData = {
      name: "Literasi ICT Bisnis",
      children: modules.map(m => ({
        name: m.title,
        id: m.id,
        children: m.subTopics.map(st => ({ name: st.title }))
      }))
    };

    const width = 1000;
    const height = 800;
    const margin = { top: 40, right: 200, bottom: 40, left: 200 };

    // Create the tree layout
    const tree = d3.tree<NodeData>().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    const root = d3.hierarchy(data);
    tree(root);

    // Zoom container
    const g = svgElement.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svgElement.call(zoom);

    // Initial positioning
    const initialTransform = d3.zoomIdentity
      .translate(margin.left, margin.top)
      .scale(0.8);
    svgElement.call(zoom.transform, initialTransform);

    // Links (Curved Paths)
    g.selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", (d: any) => {
        if (d.source.depth === 0) return "#6366f1"; // Indigo
        return "#cbd5e1"; // Slate
      })
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 2)
      .attr("d", d3.linkHorizontal<any, any>()
        .x(d => d.y)
        .y(d => d.x));

    // Colors for depth 1 nodes (modules)
    const moduleColors = ["#4f46e5", "#7c3aed", "#0891b2", "#059669", "#d97706"];

    // Nodes container
    const node = g.selectAll(".node")
      .data(root.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    // Node shapes
    node.each(function(d: any) {
      const el = d3.select(this);
      
      if (d.depth === 0) {
        // Root node
        el.append("rect")
          .attr("x", -80)
          .attr("y", -20)
          .attr("width", 160)
          .attr("height", 40)
          .attr("rx", 20)
          .attr("fill", "#1e293b")
          .attr("stroke", "#4f46e5")
          .attr("stroke-width", 3);
          
        el.append("text")
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(d.data.name)
          .attr("fill", "white")
          .attr("style", "font-weight: bold; font-size: 14px;");
      } else if (d.depth === 1) {
        // Module nodes
        const color = moduleColors[root.children?.indexOf(d) || 0];
        
        el.append("rect")
          .attr("x", -10)
          .attr("y", -15)
          .attr("width", d.data.name.length * 8 + 30)
          .attr("height", 30)
          .attr("rx", 6)
          .attr("fill", "white")
          .attr("stroke", color)
          .attr("stroke-width", 2)
          .attr("class", "dark:fill-slate-800");

        el.append("text")
          .attr("dx", 15)
          .attr("dy", "0.35em")
          .text(d.data.name)
          .attr("fill", color)
          .attr("style", "font-weight: 600; font-size: 12px;");
      } else {
        // Subtopic nodes
        el.append("circle")
          .attr("r", 4)
          .attr("fill", "#94a3b8");

        el.append("text")
          .attr("dx", 10)
          .attr("dy", "0.35em")
          .text(d.data.name)
          .attr("class", "text-slate-600 dark:text-slate-400")
          .attr("style", "font-size: 10px;");
      }
    });

  }, [modules]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-[600px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl relative"
    >
      <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 pointer-events-none">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gunakan mouse untuk zoom & geser</p>
      </div>
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        className="cursor-move"
      ></svg>
    </div>
  );
}

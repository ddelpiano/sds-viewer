import React from 'react';
import { IconButton } from '@material-ui/core';
import GeppettoGraphVisualization from '@metacell/geppetto-meta-ui/graph-visualization/Graph';
import { staticGraphData } from './data.js';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import RefreshIcon from '@material-ui/icons/Refresh';
import LayersIcon from '@material-ui/icons/Layers';

const NODE_FONT = "8px sans-serif";
const ONE_SECOND = 1000;
const ZOOM_DEFAULT = 1;
const ZOOM_SENSITIVITY = .2;

const GraphViewer = (props) => {
  const graphRef = React.useRef(null);

  const handleNodeClick = (node, event) => {
    // TODO : To be replaced with call to redux action for selection
    graphRef.current.ggv.current.centerAt(node.x , node.y, ONE_SECOND);
    graphRef.current.ggv.current.zoom(2, ONE_SECOND);
  }

  const zoomIn = (event) => {
    let zoom = graphRef.current.ggv.current.zoom();
    let value = ZOOM_DEFAULT;
    if (zoom < 2 ){
      value = ZOOM_SENSITIVITY;
    }
    graphRef.current.ggv.current.zoom(zoom + value , ONE_SECOND/10);
  }

  const zoomOut = (event) => {
    let zoom = graphRef.current.ggv.current.zoom();
    let value = ZOOM_DEFAULT;
    if (zoom < 2 ){
      value = ZOOM_SENSITIVITY;
    }
    graphRef.current.ggv.current.zoom(zoom - value , ONE_SECOND/10);
  }

  const resetCamera = (event) => {
    graphRef.current.ggv.current.zoomToFit();
  }

  React.useEffect(() => {
    setTimeout( () => graphRef?.current?.ggv?.current?.zoomToFit(), ONE_SECOND/2);
  });

  return (
    <div className={"graph-view"}>
      <GeppettoGraphVisualization
        ref={graphRef}
        // Graph data with Nodes and Links to populate
        data={staticGraphData}
        // Create the Graph as 2 Dimensional
        d2={true}
        // td = Top Down, creates Graph with root at top
        dagMode="td"
        nodeRelSize={20}
        // Links color
        linkColor="black"
        // Link curvature, if target is to the left of source we give it a negative value, positive otherwise
        linkCurvature={ link => link.target.x < link.source.x ? -.2 : .2}
        // Allows updating link properties, as color and curvature. Without this, linkCurvature doesn't work.
        linkCanvasObjectMode={"replace"}
        onNodeClick = { (node,event) => handleNodeClick(node,event) }
        // Override drawing of canvas objects, draw an image as a node
        nodeCanvasObject={(node, ctx, globalScale) => {
          const size = 12;
          ctx.drawImage(node.img, node.x - size, node.y - (size* 1.5) , size *2, size * 2);

          ctx.font = NODE_FONT;
          ctx.textAlign = "center";
          ctx.textBaseline = 'middle';
          // Create Title in Node
          ctx.fillText(node.name,node.x, node.y + (size/2));

          node.fy = 100 * node.level;
        }}
        // Handles error on graph
        onDagError={loopNodeIds => {}}
        // Disable dragging of nodes
        enableNodeDrag={false}
        // Allow camera pan and zoom with mouse
        enableZoomPanInteraction={true}
        enablePointerInteraction={true}
        // React element for controls goes here
        controls = {
          <div className="graph-view_controls">
            <IconButton onClick={(e) => zoomIn()}><ZoomInIcon/></IconButton>
            <IconButton onClick={(e) => zoomOut()}><ZoomOutIcon/></IconButton>
            <IconButton onClick={(e) => resetCamera()}><RefreshIcon/></IconButton>
            <LayersIcon/>
          </div>
        }
      />
    </div>
  );
};

export default GraphViewer;

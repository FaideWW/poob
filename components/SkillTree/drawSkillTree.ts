import { AssetLoadedSkillTreeData } from "../../types/skilltree";

interface Position {
  x: number;
  y: number;
}

const randomFills = ["green", "blue", "yellow", "orange", "pink", "purple"];
let randomFillIndex = 0;

/**
 * createDrawSkillTree
 *
 * Accepts skill tree data and returns a function that, given a Canvas context and a target width and height, will draw the tree
 *
 */
export default function createDrawSkillTree(
  tree: AssetLoadedSkillTreeData
): (ctx: CanvasRenderingContext2D, width: number, height: number) => void {
  const zoomLevel = tree.imageZoomLevels[0];
  const background = tree.assets.Background2[zoomLevel];
  const groupIds = Object.keys(tree.groups);

  const nodeIds = Object.keys(tree.nodes);
  const nodePositions: Record<string, Position> = {};
  for (let i = 0; i < nodeIds.length; i += 1) {
    const nodeId = nodeIds[i];
    if (nodeId === "root") {
      // Root node is at origin
      nodePositions[nodeId] = { x: 0, y: 0 };
    } else {
      const node = tree.nodes[nodeId];
      if (!node.group) {
        // Cluster jewel nodes do not have groups or orbits, as they rely on jewel placement
      } else {
        const group = tree.groups[node.group];
        if (node.orbit === undefined || node.orbitIndex === undefined) {
          // Unsure what cases this is true, TODO
          console.log(
            `node ${nodeId} has no orbit or orbitIndex (orbit: ${node.orbit} orbitIndex: ${node.orbitIndex})`
          );
        } else {
          const orbitRadius = tree.constants.orbitRadii[node.orbit];
          const orbitAngle =
            (Math.PI * 3) / 2 +
            ((Math.PI * 2) / tree.constants.skillsPerOrbit[node.orbit]) *
              node.orbitIndex;

          nodePositions[nodeId] = {
            x: group.x + Math.cos(orbitAngle) * orbitRadius,
            y: group.y + Math.sin(orbitAngle) * orbitRadius,
          };
        }
      }
    }
  }

  return (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const backgroundPattern = ctx.createPattern(background, "repeat");
    if (backgroundPattern === null) {
      console.error("No background pattern could be created?");
      return;
    }
    ctx.fillStyle = backgroundPattern;
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    // Transform worldspace to cameraspace
    ctx.translate(centerX, centerY);
    ctx.scale(zoomLevel, zoomLevel);
    // ctx.translate(centerX, centerY);

    // Render groups (for reference, these will not appear in the final version)
    // Render nodes
    // ctx.strokeStyle = "white";
    // for (let groupIndex = 0; groupIndex < groupIds.length; groupIndex += 1) {
    //   const group = tree.groups[groupIds[groupIndex]];
    //   for (
    //     let orbitIndex = 0;
    //     orbitIndex < group.orbits.length;
    //     orbitIndex += 1
    //   ) {
    //     const orbit = group.orbits[orbitIndex];
    //     const radius = tree.constants.orbitRadii[orbit];
    //     ctx.beginPath();
    //     ctx.arc(group.x, group.y, radius, 0, Math.PI * 2);
    //     ctx.stroke();
    //   }
    // }

    ctx.strokeStyle = "red";
    ctx.fillStyle = "red";

    // Render nodes
    const drawableNodes = Object.keys(nodePositions);
    for (let nodeIndex = 0; nodeIndex < drawableNodes.length; nodeIndex += 1) {
      const nodeId = drawableNodes[nodeIndex];
      const node = tree.nodes[nodeId];

      const { x: nodeX, y: nodeY } = nodePositions[nodeId];

      if (node.out && nodeId !== "root") {
        ctx.lineWidth = 5;
        for (let pathIndex = 0; pathIndex < node.out.length; pathIndex += 1) {
          const endNodeId = node.out[pathIndex];
          // If the node is in the same group and group orbit, the path is an arc. Otherwise, it's a line.
          const endNode = tree.nodes[endNodeId];

          // If the path takes you from the main tree to the ascendancy tree (or vice versa), don't draw it
          // Also, don't draw paths to mastery nodes
          if (
            node.ascendancyName !== endNode.ascendancyName ||
            endNode.isMastery
          ) {
            continue;
          }

          const { x: endNodeX, y: endNodeY } = nodePositions[endNodeId];

          if (
            node.group === undefined ||
            node.orbit === undefined ||
            node.orbitIndex === undefined ||
            endNode.orbitIndex === undefined
          ) {
            console.log(
              `unable to draw arc between ${nodeId} and ${endNodeId}, no group/orbit/orbitIndex defined for one of them`
            );
          } else {
            if (node.group === endNode.group && node.orbit === endNode.orbit) {
              const group = tree.groups[node.group];
              const orbitRadius = tree.constants.orbitRadii[node.orbit];
              // Determine clockwise or anticlockwise based on orbit index (tbd)
              const nodeAngle =
                ((Math.PI * 2) / tree.constants.skillsPerOrbit[node.orbit]) *
                node.orbitIndex;
              const endNodeAngle =
                ((Math.PI * 2) / tree.constants.skillsPerOrbit[endNode.orbit]) *
                endNode.orbitIndex;
              const anticlockwise = isAnticlockwiseAngle(
                nodeAngle,
                endNodeAngle
              );
              if (endNodeId === "24256") {
                console.log(
                  `start: ${nodeId} (${
                    nodeAngle * (180 / Math.PI)
                  }) - end: ${endNodeId} (${
                    endNodeAngle * (180 / Math.PI)
                  }) - anticlockwise: ${anticlockwise}`
                );
              }
              ctx.beginPath();
              ctx.arc(
                group.x,
                group.y,
                orbitRadius,
                // In Canvas2D arc rendering, the arc radius begins at the
                // rightmost point of the circle (as opposed to in
                // SkillTreeData where the 0th orbit index is located at the
                // top of the circle), so we need to rotate
                (Math.PI * 3) / 2 + nodeAngle,
                (Math.PI * 3) / 2 + endNodeAngle,
                anticlockwise
              );
              ctx.stroke();
            } else {
              const distance = Math.sqrt(
                (endNodeX - nodeX) ** 2 + (endNodeY - nodeY) ** 2
              );
              if (distance > 5000) {
                console.error("long path detected between", node, endNode);
              }
              ctx.beginPath();
              ctx.moveTo(nodeX, nodeY);
              ctx.lineTo(endNodeX, endNodeY);
              ctx.stroke();
            }
          }
        }
      }

      ctx.beginPath();
      ctx.arc(nodeX, nodeY, 25, 0, Math.PI * 2);
      ctx.fill();
    }
  };
}

// An angle is anticlockwise if the shorter path from start to end is also anticlockwise.
// In other words:
// If the start of the arc is further along the circle (in the clockwise direction) than the end of the arc,
// including if the arc passes over the top of the circle (the "0" angle), it
// should be anticlockwise.
//
// We also need special handling for false positive detection when a clockwise
// arc passes over the top of the circle (if the start angle is in the top-left
// quadrant and the end angle is in the top-right quadrant)
//
function isAnticlockwiseAngle(startAngle: number, endAngle: number): boolean {
  if (
    (startAngle > endAngle ||
      (startAngle <= Math.PI / 2 && endAngle >= (Math.PI * 3) / 2)) &&
    !(startAngle >= (Math.PI * 3) / 2 && endAngle <= Math.PI / 2)
  )
    return true;
  return false;
}

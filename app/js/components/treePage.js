var React = require('react');
var D3Tree = require('./tree.js');

var treeData = [{
  id: 1,
  title: 'Smells like teen spirit',
  like: 2,
  genre: 'Grunge',
  forks: 3,
  author: 1,
  children: [
    {
      id: 2,
      title: 'Innagodidavida',
      like: 4,
      genre: 'Rock',
      forks: 2,
      author: 2,
      children: [
        {
          id: 3,
          title: 'Purple Haze',
          like: 7,
          genre: 'Rock',
          forks: 0,
          author: 3
        },
        {
          id: 666,
          title: 'In League with Satan',
          like: 666,
          genre: 'Metal',
          forks: 0,
          author: 666
        }
      ]
    },
    {
      id: 4,
      title: 'Tonight, Tonight',
      like: 8,
      genre: 'Grunge',
      forks: 0,
      author: 27
    },
    {
      id: 33,
      title: '33 222 1 222',
      genre: 'Jazz',
      like: 222,
      forks: 1,
      author: 222,
      children: [
        {
          id: 42,
          title: 'So long and thanks for all the fish',
          genre: 'Jazz',
          like: 42,
          forks: 0,
          author: 42
        }
      ]
    }
  ]
}];

// var treeData = [{
//        name: "flare",
//        children: [
//         {
//          name: "analytics",
//          children: [
//           {
//            name: "cluster",
//            children: [
//             {name: "AgglomerativeCluster", size: 3938},
//             {name: "CommunityStructure", size: 3812},
//             {name: "HierarchicalCluster", size: 6714},
//             {name: "MergeEdge", size: 743}
//            ]
//           },
//           {
//            name: "graph",
//            children: [
//             {name: "BetweennessCentrality", "size": 3534},
//             {name: "LinkDistance", size: 5731},
//             {name: "MaxFlowMinCut", size: 7840},
//             {name: "ShortestPaths", size: 5914},
//             {name: "SpanningTree", size: 3416}
//            ]
//           },
//           {
//            name: "optimization",
//            children: [
//             {name: "AspectRatioBanker", size: 7074}
//            ]
//           }
//          ]
//         },
//         {
//          name: "animate",
//          children: [
//           {name: "Easing", size: 17010},
//           {name: "FunctionSequence", size: 5842},
//           {
//            name: "interpolate",
//            children: [
//             {name: "ArrayInterpolator", size: 1983},
//             {name: "ColorInterpolator", size: 2047},
//             {name: "DateInterpolator", size: 1375},
//             {name: "Interpolator", size: 8746},
//             {name: "MatrixInterpolator", size: 2202},
//             {name: "NumberInterpolator", size: 1382},
//             {name: "ObjectInterpolator", size: 1629},
//             {name: "PointInterpolator", size: 1675},
//             {name: "RectangleInterpolator", size: 2042}
//            ]
//           },
//           {name: "ISchedulable", size: 1041},
//           {name: "Parallel", size: 5176},
//           {name: "Pause", size: 449},
//           {name: "Scheduler", size: 5593},
//           {name: "Sequence", size: 5534},
//           {name: "Transition", size: 9201},
//           {name: "Transitioner", size: 19975},
//           {name: "TransitionEvent", size: 1116},
//           {name: "Tween", size: 6006}
//          ]
//         },
//         {name: "data", size: 7000}
//        ]
//       }];

var Page = React.createClass({
  render: function() {
    return (
      <div>
        <D3Tree treeData={treeData} />
      </div>
    );
  }
});

module.exports = Page;
import Graphin, { Components, Behaviors, GraphinContext } from '@antv/graphin';
import type {
  GraphinData,
  TooltipValue,
  LegendChildrenProps,
  // NodeStyleLabel,
  ContextMenuValue,
} from '@antv/graphin';
import useStarsDataReq from 'src/data/use-cascade-starsdata';
import PieceCardInfo from './PieceCardInfo';
import styles from './index.module.less';
import clsx from 'clsx';
import { ReactComponent as SplashIcon } from 'src/assets/media/svg/icon-splash.svg';
import { useContext, useEffect, useRef } from 'react';
import PieceCardSearchView from './PieceCardSearch';
// import { icons } from 'antd/lib/image/PreviewGroup';

const { Tooltip, Legend, ContextMenu } = Components;

const { Hoverable, ActivateRelations } = Behaviors;

export default function G6(props: { cascadeId: string }) {
  useEffect(() => {
    document.oncontextmenu = () => {
      return false;
    };
    return () => {
      document.oncontextmenu = () => {
        return true;
      };
    };
  }, []);
  // const data = Utils.mock(10).tree().graphin();
  const { cascadeId } = props;
  // const graphinRef = useRef<any>();
  const { data } = useStarsDataReq({ cascadeId: cascadeId });

  let grapinData: GraphinData = { nodes: [], edges: [] };

  /** 实现break-words */
  const formatText = (
    input: string,
    maxCharsPerLine: number,
    maxLines: number
  ) => {
    const words = input.split(' ');
    let lines = [];
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length + word.length <= maxCharsPerLine) {
        currentLine += (currentLine === '' ? '' : ' ') + word;
      } else {
        if (lines.length > maxLines) {
          break;
        }
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine !== '') {
      lines.push(currentLine);
    }

    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      const lastLine = lines[maxLines - 1];
      lines[maxLines - 1] = lastLine.substring(0, maxCharsPerLine - 3) + '...';
    }

    return lines;
  };

  data?.nodes.forEach((node, index) => {
    // console.log('node.title.length', Math.floor(node.title.length / 13));
    // const colorIndex = Math.floor(Math.random() * colors.length);
    grapinData.nodes.push({
      id: node.id,
      label: node.title,
      preventOverlap: true,
      // type: 'custom-node',
      // type: node.tagInfos[0].tag,
      // status: { hover: true },

      data: {
        tag: node.tagInfos[0].tag,
        // uuid: node.uuid,
      },
      uuid: node.uuid,

      style: {
        // icon: {
        //   type: 'image',
        //   value: node.coverUrl,
        //   opacity: 1,
        //   size: 40 + 10 * node.downstreamCount,
        //   clip: {
        //     r: (40 + 10 * node.downstreamCount) / 2 - 4,
        //   },
        // },

        // icon: {
        //   type: 'font', // 指定图标为Font类型
        //   fontFamily: fontFamily, // 指定FontFamily
        //   value: icons.home, // 指定图标的值
        // },

        label: {
          value: formatText(node.title, 13, 2).join('\n'),
          fill: node.isRead ? '#8C8C8C' : '#231F20',
          // offset: [0, 0],
          fontSize: 14,
          // @ts-ignore  组件 未定义 强制使用
          fontWeight: 600,
          lineWidth: 4,
          fontFamily: 'Maven Pro',
          // lineHeight: 13,
        },
        keyshape: {
          size: 40 + 10 * node.downstreamCount,
          stroke: node.tagInfos[0].tagColor ? '' : '#0000000',
          fill: node.tagInfos[0].tagColor ?? '#ffffff',
          fillOpacity: node.timeLevel / 10,
          lineWidth: 4,
        },
        badges: node.featured
          ? [
              // {
              //   position: 'RT',
              //   type: 'text',
              //   value: 8,
              //   size: [20, 20],
              //   color: '#fff',
              //   fill: 'red',
              // },
              // {
              //   position: 'RT',
              //   type: 'font',
              //   fontFamily: fontFamily,
              //   value: icons.home,
              //   size: [20, 20],
              //   color: '#fff',
              //   fill: 'black',
              // },
              // {
              //   position: 'RT',
              //   type: 'image',
              //   value: '/src/assets/media/png/splashicon.png',
              //   size: [20, 20],
              //   color: '#fff',
              //   fill: 'red',
              // },
            ]
          : [],
        halo: {
          // stroke: 'black',
          // lineWidth: 3,
          // size: 40 + 10 * node.downstreamCount + 30,
        },
      },
    });
  });
  console.log('filter start:', data?.edges);
  let filterEdges = data?.edges.filter((edge, index) => {
    if (edge.source === edge.target) {
      console.log('edge.source', edge.source);

      return false;
    }
    return true;
  });
  console.log(filterEdges);
  filterEdges?.forEach((edge, index) => {
    grapinData.edges.push({
      ...edge,
      // status: { hover: true },

      style: {
        keyshape: {
          lineWidth: (edge.ratio * 100 - 1) / 20 + 1,
        },
        // animate: {
        //   type: 'circle-running',
        //   color: 'green',
        //   repeat: true,
        //   duration: 4000,
        // },
      },
    });
  });

  const defSpreingLen = (_edge: any, source: any, target: any) => {
    const nodeSize = 3;
    const Sdegree = 95;
    const Tdegree = 85;
    const minDegree = Math.min(Sdegree, Tdegree);
    return minDegree < 3 ? nodeSize * 5 : minDegree * nodeSize;
  };
  const layout = {
    type: 'gForce', // concentric
    animation: false,
    clusterNodeStrength: 1,
    leafCluster: true,
    preset: {
      // type: 'gForce',
    },
    linkDistance: defSpreingLen,
  };

  const defaultNodeStatusStyle = {
    status: {
      inactive: {
        // style: {
        keyshape: {},
        label: {},

        icon: {
          type: 'image',
          value: '',
          size: '0',
          opacity: 1,

          clip: {
            r: 4,
          },
          visible: false,
        },
        badges: [
          {
            position: 'RT',
            type: 'text',
            value: 8,
            size: [20, 20],
            color: '#fff',
            fill: 'red',
          },
          // {
          //   position: 'RT',
          //   type: 'font',
          //   fontFamily: fontFamily,
          //   value: icons.home,
          //   size: [20, 20],
          //   color: '#fff',
          //   fill: 'black',
          // },
          // {
          //   position: 'RT',
          //   type: 'image',
          //   value: '/src/assets/media/png/splashicon.png',
          //   size: [20, 20],
          //   color: '#fff',
          //   fill: 'red',
          // },
        ],
        halo: {},
        // },
      },
    },
  };
  return (
    <div
      className={clsx(
        'relative h-[calc(100%-40px)] w-[calc(100%-40px)]  m-[20px] mt-[0px] p-[10px] rounded-[10px] border-[1px] border-border-second shadow-shadow-second  overflow-hidde',
        styles.legend
      )}
    >
      <div className="absolute top-[25px] pointer-events-none select-none   right-[40px] z-[10]  h-[calc(100%-120px)]  overflow-hidde">
        <PieceCardSearchView data={data?.nodes} cascadeId={cascadeId} />
      </div>
      <>
        <Graphin
          // ref={graphinRef}
          style={{
            height: '100%',
            width: '100%',
            background: '#fff',
            fontWeight: '600 !important',
            fontFamily: 'Maven Pro',
          }}
          data={grapinData}
          // defaultNode={{
          //   status: {
          //     inactive: {
          //       // halo: {
          //       //   stroke: 'red',
          //       //   lineWidth: 5,
          //       //   // size: 0,
          //       // },
          //       keyshape: {
          //         stroke: '#0000000',
          //         fill: '#ffffff',
          //         fillOpacity: 1,
          //         lineWidth: 4,
          //         // size: 0,
          //       },

          //       icon: {
          //         type: 'image',
          //         value: '',
          //         size: 0,
          //         clip: { r: 1 },
          //         visible: false,
          //       },
          //       label: {
          //         visible: true,
          //       },
          //     },
          //   },
          // }}
          // nodeStateStyles={{
          //   status: {
          //     inactive: {
          //       // halo: {
          //       //   stroke: 'red',
          //       //   lineWidth: 5,
          //       //   // size: 0,
          //       // },
          //       keyshape: {
          //         stroke: '#0000000',
          //         fill: '#ffffff',
          //         fillOpacity: 1,
          //         lineWidth: 4,
          //         // size: 0,
          //       },
          //       icon: {
          //         type: 'image',
          //         value: '',
          //         size: 0,
          //         clip: { r: 1 },
          //         visible: false,
          //       },
          //     },
          //   },
          // }}
          renderer="SVG"
          layout={layout}
          minZoom={0.2}
          maxZoom={2}
          zoom={0.5}
          autoFollowWithForce={true}
          // fitView
          fitCenter
        >
          {/* <CustomComponents></CustomComponents> */}
          <Tooltip
            bindType="node"
            placement="auto"
            hasArrow={false}
            delay={{
              show: 300,
              hide: 500,
            }}
            style={{
              background: '#fff',
              width: '226px',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            {(value: TooltipValue) => {
              if (value.model) {
                const { model } = value;
                // console.log('model', value);

                return (
                  <PieceCardInfo
                    cascadeId={cascadeId}
                    pieceUuid={model.uuid as string}
                  />
                );
              }
            }}
          </Tooltip>

          <Legend bindType="node" sortKey="data.tag">
            {(renderProps: LegendChildrenProps) => {
              console.log('renderProps', renderProps);
              return (
                <Legend.Node
                  {...renderProps}
                  onChange={(checkedValue: any) => {
                    console.log('checkedValue', checkedValue);
                  }}
                ></Legend.Node>
              );
            }}
          </Legend>
          {/* <ContextMenu style={{ background: '#fff' }} bindType="node">
            {ContextmenuNode}
          </ContextMenu> */}
          <Hoverable bindType="node" />
          <Hoverable bindType="edge" />
          <ActivateRelations trigger="click" />
        </Graphin>
      </>
      <div
        className={`absolute flex flex-col justify-center items-center w-[190px]  h-[30px] 
        }] bottom-8 right-[40px]`}
      >
        <div
          className="h-[18px] w-[200px]"
          style={{
            background:
              'linear-gradient(270deg, #231F20 0%, rgba(207, 207, 207, 0.28) 100%)',
          }}
        ></div>
        <div className="flex justify-between  h-[10px] w-[190px] text-[14px] text-frist ">
          <div
          // style={{
          //   fontFamily: 'Maven Pro',
          //   fontWeight: 600,
          // }}
          >
            Old
          </div>
          <div>New</div>
        </div>
      </div>
    </div>
  );
}

import Graphin, { Components, Behaviors, GraphinContext } from '@antv/graphin';
import type {
  GraphinData,
  TooltipValue,
  LegendChildrenProps,
  // NodeStyleLabel,
} from '@antv/graphin';
import useStarsDataReq from 'src/data/use-cascade-starsdata';
import PieceCardInfo from './PieceCardInfo';
import styles from './index.module.less';
import clsx from 'clsx';
import { ReactComponent as SplashIcon } from 'src/assets/media/svg/icon-splash.svg';
import { useContext, useEffect, useRef } from 'react';
import PieceCardSearchView from './PieceCardSearch';
// import { icons } from 'antd/lib/image/PreviewGroup';

const { Tooltip, Legend } = Components;

const { Hoverable, ActivateRelations } = Behaviors;

export default function G6(props: { cascadeId: string }) {
  // const data = Utils.mock(10).tree().graphin();
  const { cascadeId } = props;
  // const graphinRef = useRef<any>();
  const { data } = useStarsDataReq({ cascadeId: cascadeId });
  // console.log(data);
  // const { graph } = useContext(GraphinContext);

  // useEffect(() => {
  //   if (graph) {
  //     // const {
  //     //   graph, // g6 的Graph实例
  //     //   apis, // Graphin 提供的API接口
  //     // } = graphinRef.current;
  //     console.log('ref', graph, graph.getNodes);
  //   }
  // }, [graph]);

  const CustomComponents = () => {
    // 只要包裹在Graphin内的组件，都可以通过Context获得Graphin提供的graph实例和apis
    const { graph } = useContext(GraphinContext);
    console.log('ref', graph.getNodes());
    // graph.getNodes()[0]._cfg?.model?.style.fontFamily = '';
    return null;
  };

  let grapinData: GraphinData = { nodes: [], edges: [] };

  data?.nodes.forEach((node, index) => {
    // const colorIndex = Math.floor(Math.random() * colors.length);
    grapinData.nodes.push({
      id: node.id,
      label: node.title,
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
        //   value: `https://avatars.githubusercontent.com/u/105033?v=4`,
        //   size: [20, 20],
        //   clip: {
        //     r: 10,
        //   },
        // },

        // icon: {
        //   type: 'font', // 指定图标为Font类型
        //   fontFamily: fontFamily, // 指定FontFamily
        //   value: icons.home, // 指定图标的值
        // },
        label: {
          value: node.title,
          fill: node.isRead ? '#8C8C8C' : '#231F20',
          offset: [0, 5],
          fontSize: 14,
          // @ts-ignore  组件 未定义 强制使用
          fontWeight: 600,
          lineWidth: 4,
          fontFamily: 'Maven Pro',
        },
        keyshape: {
          size: 40 + 10 * node.downstreamCount,
          stroke: '',
          fill: node.tagInfos[0].tagColor,
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
    const Sdegree = 50;
    const Tdegree = 40;
    const minDegree = Math.min(Sdegree, Tdegree);
    return minDegree < 3 ? nodeSize * 5 : minDegree * nodeSize;
  };
  const layout = {
    type: 'gForce', // concentric
    preset: {
      // type: 'gForce',
    },
    linkDistance: defSpreingLen,
  };
  const defaultNodeStatusStyle = {
    status: {
      hover: {},
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
        <PieceCardSearchView data={data?.nodes} cascadeId={cascadeId}/>
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
          layout={layout}
          fitView
          fitCenter
          // nodeStateStyles={{}}
        >
          <CustomComponents></CustomComponents>
          <Tooltip
            bindType="node"
            placement="auto"
            hasArrow={false}
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
                console.log('model', value);

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

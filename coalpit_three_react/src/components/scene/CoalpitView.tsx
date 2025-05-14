import React, {Fragment, useCallback, useMemo} from 'react'
import {Vector3} from "three";
import { inject, observer } from "mobx-react";
import {Node} from "../../models/models";
import SectionView from "./SectionView";
import {SCALE} from "../../shared/constants";
import {HorizonData, Point, SectionData} from "../../types/types";

const CoalpitView = inject("dataStore", "searchStore")(observer(({dataStore, searchStore}) => {
    let horizons: Array<HorizonData> = dataStore.horizonsWithSections;

    let setPoints = useCallback((point: Point) => {
        if (!searchStore.isSearchEnabled) {
            return;
        }
        if (!searchStore.startPoint) {
            searchStore.setStartPoint(point);
        } else if (!searchStore.endPoint) {
            searchStore.setEndPoint(point);
            dataStore.startSearchClosestWay(searchStore.startPoint, point)
        }
    }, [searchStore, dataStore])

    let showStartPoint: boolean = useMemo(() => {
        return !!searchStore.startPoint;
    }, [searchStore.startPoint])
    let showEndPoint: boolean = useMemo(() => {
        return !!searchStore.endPoint;
    }, [searchStore.endPoint])

     return (
         <>
             {
                 horizons?.map(({id, sections}: HorizonData) => {
                     return (
                         <Fragment key={id}>
                             {sections.map((section: SectionData) => {
                                 let startNode: Node = section.startNode;
                                 let endNode: Node = section.endNode;
                                 let v1: Vector3 = new Vector3(startNode.x, startNode.y, startNode.z);
                                 let v2: Vector3 = new Vector3(endNode.x, endNode.y, endNode.z);
                                 let thickness = section.thickness * SCALE;
                                 let selected = searchStore.isSearchEnabled && dataStore.nodesPath.includes(startNode.id) && dataStore.nodesPath.includes(endNode.id);
                                 return (
                                     <Fragment  key={section.id}>
                                        <SectionView
                                            start={v1}
                                            end={v2}
                                            thickness={thickness}
                                            isSearchEnabled={searchStore.isSearchEnabled}
                                            setPoint={setPoints}
                                            selected={selected}
                                        />
                                         {
                                            searchStore.isSearchEnabled
                                                ? (
                                                    <>
                                                        {showStartPoint
                                                            ? <mesh
                                                                position={[searchStore.startPoint.x, searchStore.startPoint.y, searchStore.startPoint.z]}>
                                                                <sphereGeometry
                                                                    args={[thickness / 2, 15, 15]}/>
                                                                <meshStandardMaterial color={'yellow'}/>
                                                            </mesh>
                                                        : <></>}
                                                        {showEndPoint
                                                            ? <mesh
                                                                position={[searchStore.endPoint.x, searchStore.endPoint.y, searchStore.endPoint.z]}>
                                                                <sphereGeometry
                                                                    args={[thickness / 2, 15, 15]}/>
                                                                <meshStandardMaterial color={'yellow'}/>
                                                            </mesh>
                                                            : <></>}
                                                    </>
                                                )
                                                : <></>
                                         }
                                     </Fragment>
                                 )
                             })}
                         </Fragment>
                     )
                 })
             }
         </>
     );
}));

export default CoalpitView;
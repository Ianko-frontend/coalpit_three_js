import React, {useCallback, useMemo} from 'react'
import {Vector3, DoubleSide, LineCurve3} from "three";
import {ThreeEvent} from "@react-three/fiber";
import {Point} from "../../types/types";
import {changeCoordinateSystem} from "../../shared/utils";

const SectionView = ({start, end, thickness, isSearchEnabled, setPoint, selected}:
                     {start: Vector3,end:Vector3, thickness: number, isSearchEnabled: boolean, setPoint: (point: Point) => void, selected: boolean}) => {
    let curve: LineCurve3 = useMemo<LineCurve3>(() => {
        let startVector = changeCoordinateSystem(start);
        let endVector = changeCoordinateSystem(end);
        return new LineCurve3(startVector, endVector);
    }, [start, end]);

    let handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
        if (isSearchEnabled) {
            let vector: Vector3 = e.point;
            setPoint({x: vector.x, y: vector.y, z: vector.z})
        }
    }, [isSearchEnabled, setPoint])

    return (
        <mesh onClick={handleClick}>
            <tubeGeometry args={[curve, 10, thickness, 8, false]}/>
            <meshStandardMaterial color={selected ? 'yellow' : '#3f7b9d'} side={DoubleSide}/>
        </mesh>
    );
};

export default SectionView;
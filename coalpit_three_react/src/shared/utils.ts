import {Vector3} from "three";
import {SCALE} from "./constants";

export function getElementValueByTagName(element: Element, tag: string): string {
    return element.getElementsByTagName(tag)[0].textContent ?? '';
}

export function changeCoordinateSystem(vector: Vector3): Vector3 {
    let center = new Vector3(32000, 32000, -800); // scratch
    return vector.clone().sub(center).multiplyScalar(SCALE);
}
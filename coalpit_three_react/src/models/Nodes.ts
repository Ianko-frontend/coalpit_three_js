import {getElementValueByTagName} from "../shared/utils";
import {IDENTIFIER_TAGS, NODE_TAGS} from "../shared/constants";
import {Node} from "./models";

export class Nodes {

    private static nodes: Map<string, Node> = new Map<string, Node>();

    static transformData(elements: HTMLCollectionOf<Element>): Map<string, Node> {
        for (let el of elements) {
            let id = getElementValueByTagName(el, IDENTIFIER_TAGS.ID);
            let guid = getElementValueByTagName(el, IDENTIFIER_TAGS.GUID);
            this.nodes.set(id, {
                id,
                guid,
                x: parseFloat(getElementValueByTagName(el, NODE_TAGS.X)),
                y: parseFloat(getElementValueByTagName(el, NODE_TAGS.Y)),
                z: parseFloat(getElementValueByTagName(el, NODE_TAGS.Z)),
            })
        }
        return this.nodes;
    }

    static getById(id: string): Node | undefined {
        return this.nodes.get(id);
    }

    static getAll(): Map<string, Node> {
        return this.nodes;
    }
}
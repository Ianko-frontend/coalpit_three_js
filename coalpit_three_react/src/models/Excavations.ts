import {getElementValueByTagName} from "../shared/utils";
import {EXCAVATION_TAGS, IDENTIFIER_TAGS} from "../shared/constants";
import {Excavation} from "./models";

export class Excavations {

    private static excavations: Map<string, Excavation> = new Map<string, Excavation>();

    static transformData(elements: HTMLCollectionOf<Element>): Map<string, Excavation> {
        for (let el of elements) {
            let id = getElementValueByTagName(el, IDENTIFIER_TAGS.ID);
            let guid = getElementValueByTagName(el, IDENTIFIER_TAGS.GUID);
            this.excavations.set(id, {
                id,
                guid,
                name: getElementValueByTagName(el, EXCAVATION_TAGS.NAME),
                objectId: getElementValueByTagName(el, EXCAVATION_TAGS.OBJECT_ID),
                sectionIds: getElementValueByTagName(el, EXCAVATION_TAGS.SECTIONS).split(','),
                excavationType: getElementValueByTagName(el, EXCAVATION_TAGS.EXCAVATION_TYPE),
            } )
        }
        return this.excavations
    }

    static getById(id: string): Excavation | undefined {
        return this.excavations.get(id);
    }

    static getAll(): Map<string, Excavation> {
        return this.excavations;
    }
}
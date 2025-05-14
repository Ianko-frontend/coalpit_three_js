import {getElementValueByTagName} from "../shared/utils";
import {HORIZON_TAGS, IDENTIFIER_TAGS} from "../shared/constants";
import {Horizon} from "./models";

export class Horizons {

    private static horizons: Map<string, Horizon> = new Map<string, Horizon>();

    static transformData(elements: HTMLCollectionOf<Element>): Map<string, Horizon> {
        for (let el of elements) {
            let id = getElementValueByTagName(el, IDENTIFIER_TAGS.ID);
            let guid = getElementValueByTagName(el, IDENTIFIER_TAGS.GUID);
            this.horizons.set(id, {
                id,
                guid,
                name: getElementValueByTagName(el, HORIZON_TAGS.NAME),
                isMine: getElementValueByTagName(el, HORIZON_TAGS.IS_MINE),
                objectId: getElementValueByTagName(el, HORIZON_TAGS.OBJECT_ID),
                altitude: Number(getElementValueByTagName(el, HORIZON_TAGS.ALTITUDE)),
                sectionIds: getElementValueByTagName(el, HORIZON_TAGS.SECTIONS).split(','),
            } )
        }
        return this.horizons;
    }

    static getById(id: string): Horizon | undefined {
        return this.horizons.get(id);
    }

    static getAll(): Map<string, Horizon> {
        return this.horizons;
    }
}
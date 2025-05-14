import {getElementValueByTagName} from "../shared/utils";
import {IDENTIFIER_TAGS, SECTION_TAGS} from "../shared/constants";
import {Section} from "./models";

export class Sections {

    private static sections: Map<string, Section> = new Map<string, Section>();

    static transformData(elements: HTMLCollectionOf<Element>): Map<string, Section>  {
        for (let el of elements) {
            let id = getElementValueByTagName(el, IDENTIFIER_TAGS.ID);
            let guid = getElementValueByTagName(el, IDENTIFIER_TAGS.GUID);
            this.sections.set(id, {
                id,
                guid,
                startNodeId: getElementValueByTagName(el, SECTION_TAGS.START_NODE_ID),
                endNodeId: getElementValueByTagName(el, SECTION_TAGS.END_NODE_ID),
                thickness: Number(getElementValueByTagName(el, SECTION_TAGS.THICKNESS)),
            } )
        }
        return this.sections
    }

    static getById(id: string): Section | undefined {
        return this.sections.get(id);
    }

    static getAll(): Map<string, Section> {
        return this.sections;
    }
}
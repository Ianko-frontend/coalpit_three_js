import {Section, Node, Excavation, Horizon} from "../models/models";

export type ParsedData = {
    nodes: Map<string, Node>,
    sections: Map<string, Section>,
    excavations: Map<string, Excavation>,
    horizons: Map<string, Horizon>,
}

export type SectionData = {
    id: string,
    thickness: number,
    startNode: Node,
    endNode: Node
}

export type HorizonData = {
    id: string,
    name: string,
    sections: Array<SectionData>
}

export type Point = {
    x: number,
    y: number,
    z: number
}
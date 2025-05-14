interface Identifier {
    id: string;
    guid: string;
}

export interface Node extends Identifier {
    x: number;
    y: number;
    z: number;
}

export interface Section extends Identifier {
    startNodeId: string;
    endNodeId: string;
    thickness: number;
}

export interface Excavation extends Identifier {
    sectionIds: string[];
    name: string;
    objectId: string;
    excavationType: string;
}

export interface Horizon extends Identifier {
    sectionIds: string[];
    name: string;
    objectId: string;
    altitude: number;
    isMine: string;
}
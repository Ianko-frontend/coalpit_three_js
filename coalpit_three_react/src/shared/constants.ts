export enum Entities {
    NODE = 'Node',
    SECTION = 'Section',
    EXCAVATION = 'Excavation',
    HORIZON = 'Horizon'
}

export enum IDENTIFIER_TAGS {
    ID = 'Id',
    GUID = 'Guid'
}

export enum NODE_TAGS {
    X = 'X',
    Y = 'Y',
    Z = 'Z'
}

export enum SECTION_TAGS {
    START_NODE_ID = 'StartNodeId',
    END_NODE_ID = 'EndNodeId',
    THICKNESS = 'Thickness'
}

export enum EXCAVATION_TAGS {
    SECTIONS = 'Sections',
    NAME = 'Name',
    OBJECT_ID = 'ObjectId',
    EXCAVATION_TYPE = 'ExcavationType'
}

export enum HORIZON_TAGS {
    SECTIONS = 'Sections',
    NAME = 'Name',
    OBJECT_ID = 'ObjectId',
    ALTITUDE = 'Altitude',
    IS_MINE = 'IsMine'
}

export const SCALE = 0.01;
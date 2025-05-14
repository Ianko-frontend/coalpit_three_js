import {action, makeObservable, observable } from "mobx";
import {getData} from "../api/data";
import {HorizonData, ParsedData, Point, SectionData} from "../types/types";
import {Section, Node, Excavation, Horizon} from "../models/models";
import {Entities} from "../shared/constants";
import {changeCoordinateSystem} from "../shared/utils";
import {Vector3} from "three";
import {Nodes} from "../models/Nodes";
import {Sections} from "../models/Sections";
import {Excavations} from "../models/Excavations";
import {Horizons} from "../models/Horizons";

class DataStore {
    isLoading: boolean = false;
    error: string | null = null;

    nodesGraph: Record<string, Record<string, number>> = {};
    path: number = 0;
    nodesPath: string[] = [];

    horizonsWithSections: Array<HorizonData> = []

    constructor() {
        makeObservable(this, {
            isLoading: observable,
            error: observable,
            horizonsWithSections: observable,

            loadData: action,
        })
    }

    async loadData(): Promise<void> {
        this.isLoading = true;
        this.error = null;
        try {
            const dataString: string = await getData();
            let {nodes, sections} = this.parse(dataString)

            this.horizonsWithSections = this.getHorizonsWithSections();
            this.nodesGraph = this.createGraph(Array.from(sections.values()), nodes);
        } catch (err) {
            this.error = 'Failed to parse XML';
            console.error(err);
        } finally {
            this.isLoading = false;
        }
    }

    private parse(dataString: string): ParsedData {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(dataString, 'text/xml');
        let nodes: Map<string, Node> = Nodes.transformData(xmlDoc.getElementsByTagName(Entities.NODE));
        let sections: Map<string, Section>  = Sections.transformData(xmlDoc.getElementsByTagName(Entities.SECTION));
        let excavations: Map<string, Excavation> = Excavations.transformData(xmlDoc.getElementsByTagName(Entities.EXCAVATION));
        let horizons: Map<string, Horizon>  = Horizons.transformData(xmlDoc.getElementsByTagName(Entities.HORIZON));
        return {
            nodes,
            sections,
            excavations,
            horizons,
        };
    }

    private createGraph(sections: Array<Section>, nodes: Map<string, Node>): Record<string, Record<string, number>> {
        let graph: Record<string, Record<string, number>> = {};
        for (let i: number = 0; i < sections.length; i++) {
            let section: Section = sections[i];
            let startNode: Node | undefined = nodes.get(section.startNodeId);
            let endNode: Node | undefined = nodes.get(section.endNodeId);
            let sectionLength: number = !startNode || !endNode
                ? Infinity
                : Math.sqrt(
                    Math.pow(endNode.x - startNode.x,2)
                    + Math.pow(endNode.y - startNode.y,2)
                    + Math.pow(Math.abs(endNode.z) - Math.abs(startNode.z),2)
                )
            if (!graph[section.startNodeId]) { graph[section.startNodeId] = {} }
            if (!graph[section.endNodeId]) { graph[section.endNodeId] = {} }
            graph[section.startNodeId][section.endNodeId] = sectionLength;
            graph[section.endNodeId][section.startNodeId] = sectionLength;
        }
        return graph;
    }

    private getHorizonsWithSections(): Array<HorizonData> {
        return Array.from(Horizons.getAll().values()).map((horizon: Horizon) => {
            return {
                id: horizon.id,
                name: horizon.name,
                sections: horizon.sectionIds.map((sectionId: string) => {
                    let section: Section | undefined = Sections.getById(sectionId);
                    if (!section) {
                        return undefined;
                    }
                    let startNode: Node | undefined = Nodes.getById(section.startNodeId);
                    let endNode: Node | undefined = Nodes.getById(section.endNodeId);
                    if (!startNode || !endNode) {
                        return undefined;
                    }
                    return {
                        thickness: section.thickness,
                        id: section.id,
                        startNode,
                        endNode
                    }
                }).filter(Boolean) as Array<SectionData>
            }
        })
    }

    private getLowestCostNode(queue: Set<string>, costs: Record<string, number>): string | undefined {
        let lowNode;
        let min: number = Infinity;
        for (const el of queue) {
            if (costs[el] < min) {
                min = costs[el];
                lowNode = el;
            }
        }
        return lowNode;
    };

    private dijkstra(startNodeId: string, endNodeId: string): {costs: Record<string, number>, nodesPath: string[]} {
        const parents:Record<string, string | null> = {};
        const costs: Record<string, number> = {}; // cost or distance between any nodes
        const queue: Set<string> = new Set<string>();

        for (let vert in this.nodesGraph) {
            if (vert === startNodeId) {
                costs[vert] = 0;
            } else {
                costs[vert] = Infinity;
            }
            queue.add(vert)
            parents[vert] = null;
        }

        while (queue.size) {
            let node: string = this.getLowestCostNode(queue, costs) ?? '';
            if (!node || costs[node] === Infinity) {
                break;
            }

            if (endNodeId === node) {
                let nodesPath: string[] = [];
                while (parents[node]){
                    nodesPath.push(node);
                    node = parents[node]!;
                }
                nodesPath.push(startNodeId);
                return {costs, nodesPath}
            }

            queue.delete(node);
            const cost: number = costs[node];
            for (let subNode in this.nodesGraph[node]) {
                const nextSubNodeValue: number = this.nodesGraph[node][subNode];
                const newCost: number = cost + nextSubNodeValue;
                if (costs[subNode] > newCost) {
                    costs[subNode] = newCost;
                    parents[subNode] = node;
                    queue.add(subNode)
                }
            }
        }
        return {costs, nodesPath: []};
    }

    private findCloseNode(point: Point): string | null {
        let min = Infinity;
        let foundNodeId: string|null = null;
        let nodes: Node[] = Array.from(Nodes.getAll().values());
        for (let i:number= 0; i<nodes.length; i++) {
            let currentNode:Node = nodes[i];
            let currentVector:Vector3 = new Vector3(point.x,point.y,point.z);
            let nodeVector = changeCoordinateSystem(new Vector3(currentNode.x, currentNode.y, currentNode.z)) // because points was in new coordinate system
            let distance = currentVector.distanceTo(nodeVector);
            if (distance < min) {
                min = distance;
                foundNodeId = currentNode.id;
            }
        }
        return foundNodeId;
    }

    startSearchClosestWay(startPoint: Point, endPoint: Point): void {
        if (!startPoint || !endPoint) {
            return;
        }
        let startNodeId: string | null = this.findCloseNode(startPoint);
        let endNodeId: string | null = this.findCloseNode(endPoint);
        let {costs, nodesPath} =  startNodeId && endNodeId ? this.dijkstra(startNodeId, endNodeId) : {costs: null, nodesPath: null};
        let pathValue: number = endNodeId && costs ? costs[endNodeId] : 0;
        this.path = pathValue
        this.nodesPath = nodesPath ?? [];
    }

    clearPaths() {
        this.nodesPath = [];
        this.path = 0;
    }
}

export const dataStore = new DataStore();


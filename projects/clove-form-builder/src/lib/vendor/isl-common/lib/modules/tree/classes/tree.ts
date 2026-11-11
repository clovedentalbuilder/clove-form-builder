import {TreeNode} from "./tree-node";

export class Tree {
  constructor(private _nodes: TreeNode[]) {}
  get nodes(): TreeNode[] {
    return this._nodes;
  }

  public add(node: TreeNode){
    this._nodes.push(node);
  }

  public addAll(nodes: TreeNode[]){
    this._nodes = [...nodes];
  }
}


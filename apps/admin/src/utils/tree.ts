import { chain } from 'ramda'

/**
 * Flatten an array containing a tree structure
 * @param {T[]} trees - An array containing a tree structure
 * @returns {T[]} - Flattened array
 */
export function flattenTrees<T extends { children?: T[]; id: string; parentId?: string }>(
  trees: T[] = [],
  parentId = '',
): T[] {
  return chain((node) => {
    node.parentId = parentId
    const children = node.children || []
    return [node, ...flattenTrees(children, node.id)]
  }, trees)
}

import { useRef } from "react";

import { OverrideBlockDecorator } from "../OverrideBlockDecorator";

import { BlockProps } from "../BlockProps";
import { useRendererContext } from "@/hooks/useRendererContext";
import { cs, getBlockParentPage } from "@/libs/renderer-utils";
import { RichText } from "./components/richText";
import { getPageTableOfContents } from "@/libs/renderer-utils/getPageTableOfContents";

const tocIndentLevelCache: {
  [blockId: string]: number;
} = {};

export function HeaderBlock(props: BlockProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const ctx = useRendererContext();
  const { page, overrideBlocks } = ctx;

  const { block, children, hideBlockId } = props;

  if (!block) {
    return null;
  }

  const blockId = hideBlockId ? "notion-block" : `notion-block-${block.id}`;

  if (!block.properties) return null;

  const blockColor = block.format?.block_color;
  const id = block.id;

  // we use a cache here because constructing the ToC is non-trivial
  let indentLevel = tocIndentLevelCache[block.id];
  let indentLevelClass: string = "";

  if (indentLevel === undefined) {
    const pageBlock = getBlockParentPage(block, page);

    if (pageBlock) {
      const toc = getPageTableOfContents(pageBlock, page);
      const tocItem = toc.find((tocItem) => tocItem.id === block.id);

      if (tocItem) {
        indentLevel = tocItem.indentLevel;
        tocIndentLevelCache[block.id] = indentLevel;
      }
    }
  }

  if (indentLevel !== undefined) {
    indentLevelClass = `notion-h-indent-${indentLevel}`;
  }

  const classNameStr = cs(
    "notion-h notion-h1",
    blockColor && `notion-${blockColor}`,
    indentLevelClass,
    blockId
  );

  const innerHeader = (
    <span>
      <div id={id} className="notion-header-anchor" />
      <span className="notion-h-title">
        <RichText value={block.properties.title} block={block} />
      </span>
    </span>
  );
  let headerBlock = null;

  headerBlock = (
    <OverrideBlockDecorator
      blockRef={ref}
      props={props}
      Block={overrideBlocks.Header}
    >
      <h2
        className={classNameStr}
        data-id={id}
        ref={ref}
        data-block-id={props.block.id}
      >
        {innerHeader}
      </h2>
    </OverrideBlockDecorator>
  );

  if (block.format?.toggleable) {
    return (
      <details
        className={cs("notion-toggle", blockId)}
        data-block-id={props.block.id}
      >
        <summary>{headerBlock}</summary>
        <div>{children}</div>
      </details>
    );
  } else {
    return headerBlock;
  }
}

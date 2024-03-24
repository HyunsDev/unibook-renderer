import {
  ComponentPropsWithRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { highlightElement } from "prismjs";
import { CodeBlock } from "@/types";
import { cs, getBlockTitle } from "@/libs/renderer-utils";
import { RichText } from "../components/Block/blocks/components/richText";

import "prismjs/components/prism-clike.min.js";
import "prismjs/components/prism-css-extras.min.js";
import "prismjs/components/prism-css.min.js";
import "prismjs/components/prism-javascript.min.js";
import "prismjs/components/prism-js-extras.min.js";
import "prismjs/components/prism-json.min.js";
import "prismjs/components/prism-jsx.min.js";
import "prismjs/components/prism-tsx.min.js";
import "prismjs/components/prism-typescript.min.js";
import "prismjs/components/prism-yaml.min.js";
import "prismjs/components/prism-bash.min.js";
import "prismjs/components/prism-go.min.js";
import "prismjs/components/prism-graphql.min.js";
import "prismjs/components/prism-haskell.min.js";
import "prismjs/components/prism-java.min.js";
import "prismjs/components/prism-lua.min.js";
import "prismjs/components/prism-markdown.min.js";
import "prismjs/components/prism-swift.min.js";
import "prismjs/components/prism-python.min.js";
import { CopyIcon } from "../components/icons/CopyIcon";

export interface CodeProps extends ComponentPropsWithRef<"div"> {
  block: CodeBlock;
  defaultLanguage?: string;
  className?: string;
}
export const Code = forwardRef<HTMLDivElement, CodeProps>(
  ({ block, defaultLanguage = "typescript", className }, ref) => {
    const [isCopied, setIsCopied] = useState(false);
    const copyTimeout = useRef<number>();

    const content = getBlockTitle(block);
    const language = (
      block.properties?.language?.[0]?.[0] || defaultLanguage
    ).toLowerCase();
    const caption = block.properties.caption;

    const codeRef = useRef<HTMLElement>(null);
    useEffect(() => {
      if (codeRef.current) {
        try {
          highlightElement(codeRef.current);
        } catch (err) {
          console.warn("prismjs highlight error", err);
        }
      }
    }, [codeRef]);

    const onClickCopyToClipboard = useCallback(() => {
      window.navigator.clipboard.writeText(content);
      setIsCopied(true);

      if (copyTimeout.current) {
        clearTimeout(copyTimeout.current);
        copyTimeout.current = undefined;
      }

      copyTimeout.current = setTimeout(() => {
        setIsCopied(false);
      }, 1200) as unknown as number;
    }, [content, copyTimeout]);

    return (
      <div ref={ref} className="notion-code-wrapper">
        <pre className={cs("notion-code", className)}>
          <div
            style={{
              height: "22px",
            }}
          />
          <div className="notion-code-header">
            <div className="notion-code-language">{language}</div>
            <div className="notion-code-action">
              <div
                className="notion-code-action-item"
                onClick={onClickCopyToClipboard}
              >
                <CopyIcon
                  style={{
                    width: "10px",
                    height: "10px",
                  }}
                />{" "}
                <span>{isCopied ? "Copied" : "Copy"}</span>
              </div>
            </div>
          </div>
          <code className={`language-${language}`} ref={codeRef}>
            {content}
          </code>
        </pre>

        {caption && (
          <figcaption className="notion-asset-caption">
            <RichText value={caption} block={block} />
          </figcaption>
        )}
      </div>
    );
  }
);
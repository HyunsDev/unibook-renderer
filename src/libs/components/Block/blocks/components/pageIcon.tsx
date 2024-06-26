import * as React from 'react';

import { DefaultPageIcon } from '@/components/icons/DefaultPageIcon';
import { useRendererContext } from '@/hooks/useRendererContext';
import { getBlockIcon, getBlockTitle } from '@/libs/renderer-utils';
import isUrl from '@/libs/renderer-utils/isURL';
import { Block, CalloutBlock, PageBlock } from '@/types';
import { cs } from '@/utils/cn';

import { LazyImage } from './lazyImage';

const isIconBlock = (value: Block): value is PageBlock | CalloutBlock => {
    return value.type === 'page' || value.type === 'callout';
};

export const PageIconImpl: React.FC<{
    block: Block;
    className?: string;
    inline?: boolean;
    hideDefaultIcon?: boolean;
    defaultIcon?: string;
}> = ({
    block,
    className,
    inline = true,
    hideDefaultIcon = false,
    defaultIcon,
}) => {
    const { darkMode, mapImageUrl } = useRendererContext();

    let isImage = false;
    let content = null;

    if (isIconBlock(block)) {
        const icon = getBlockIcon(block)?.trim() || defaultIcon;
        const title = getBlockTitle(block);

        if (icon && isUrl(icon)) {
            const url = mapImageUrl(icon, block);
            isImage = true;

            content = (
                <LazyImage
                    src={url}
                    alt={title || 'page icon'}
                    className={cs(className, 'unibook-page-icon')}
                />
            );
        } else if (icon && icon.startsWith('/icons/')) {
            const url =
                'https://www.notion.so' +
                icon +
                '?mode=' +
                (darkMode ? 'dark' : 'light');

            content = (
                <LazyImage
                    src={url}
                    alt={title || 'page icon'}
                    className={cs(className, 'unibook-page-icon')}
                />
            );
        } else if (!icon) {
            if (!hideDefaultIcon) {
                isImage = true;
                content = (
                    <DefaultPageIcon
                        className={cs(className, 'unibook-page-icon')}
                        alt={title ? title : 'page icon'}
                    />
                );
            }
        } else {
            isImage = false;
            content = (
                <span
                    className={cs(className, 'unibook-page-icon')}
                    role="img"
                    aria-label={icon}
                >
                    {icon}
                </span>
            );
        }
    }

    if (!content) {
        return null;
    }

    return (
        <div
            className={cs(
                inline ? 'unibook-page-icon-inline' : 'unibook-page-icon-hero',
                isImage ? 'unibook-page-icon-image' : 'unibook-page-icon-span'
            )}
        >
            {content}
        </div>
    );
};

export const PageIcon = React.memo(PageIconImpl);

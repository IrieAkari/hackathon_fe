import React from 'react';

/**
 * ツールチップを表示する関数。
 * 
 * @param description - 表示する説明。
 * @param event - マウスイベント。
 * @param setTooltip - ツールチップの内容をセットする関数。
 * @param setTooltipPosition - ツールチップの位置をセットする関数。
 */
export const showTooltip = (
    description: string,
    event: React.MouseEvent<HTMLSpanElement>,
    setTooltip: React.Dispatch<React.SetStateAction<string | null>>,
    setTooltipPosition: React.Dispatch<React.SetStateAction<{ top: number, left: number } | null>>
) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip(description);
    setTooltipPosition({ top: rect.top + window.scrollY + 50, left: rect.left + window.scrollX - 80 });
};

/**
 * ツールチップを非表示にする関数。
 * 
 * @param setTooltip - ツールチップの内容をセットする関数。
 * @param setTooltipPosition - ツールチップの位置をセットする関数。
 */
export const hideTooltip = (
    setTooltip: React.Dispatch<React.SetStateAction<string | null>>,
    setTooltipPosition: React.Dispatch<React.SetStateAction<{ top: number, left: number } | null>>
) => {
    setTooltip(null);
    setTooltipPosition(null);
};
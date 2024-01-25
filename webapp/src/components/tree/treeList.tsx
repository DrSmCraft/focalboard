import React, { useCallback } from "react";

import { FormattedMessage } from "react-intl";

import { IPropertyOption, IPropertyTemplate, Board, BoardGroup } from "../../blocks/board";
import { createBoardView, BoardView } from "../../blocks/boardView";
import { Card } from "../../blocks/card";

import "./tree.scss";
import { Utils } from "../../utils";
import TreeCard from "./treeCard";

type Props = {
    board: Board
    cards: Card[]
    matrix: { [p: string]: Card[] }
    card: Card | undefined
    visited: string[]
}


const TreeList = (props: Props): JSX.Element => {
    const { board, cards, matrix, card, visited } = props;
    if (card === undefined) {
        return <></>;
    }
    if (visited.includes(card.id as string)) {
        return <></>;
    } else {
        visited.push(card.id as string);
        return (

            <>
                <ul className="TreeList">
                    <li>
                        <TreeCard
                            board={board}
                            card={card}
                            visiblePropertyTemplates={[]}
                            isSelected={false}
                            visibleBadges={false}
                            readonly={false}
                            onDrop={function(srcCard: Card, dstCard: Card): void {
                            }}
                            showCard={function(cardId?: string | undefined): void {
                            }}
                            isManualSort={false} />

                        {matrix[card.id].map((n: Card) => {

                                return <TreeList
                                    board={board}
                                    cards={cards}
                                    matrix={matrix}
                                    card={n}
                                    visited={visited} />;
                            }
                        )

                        }
                    </li>
                </ul>

            </>

        );
    }
    ;
};

export default TreeList;

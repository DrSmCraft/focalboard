import React from "react";

import { Board } from "../../blocks/board";
import { Card } from "../../blocks/card";

import "./treeList.scss";
import TreeCard from "./treeCard";

type Props = {
    board: Board
    cards: Card[]
    matrix: { [p: string]: Card[] }
    card: Card | undefined
    visited: string[]
    root?: boolean
    onClick?: (e: React.MouseEvent, card: Card) => void
    onDrop?: (srcCard: Card, dstCard: Card) => void
    showCard?: (cardId?: string) => void

}


const TreeList = (props: Props): JSX.Element => {
    const { board, cards, matrix, card, visited, root, showCard, onClick, onDrop } = props;
    if (card === undefined) {
        return <></>;
    }
    if (visited.includes(card.id as string)) {
        return <></>;
    } else {
        visited.push(card.id as string);
        const classname: string = root ? "TreeList TreeListRoot" : "TreeList";
        return (
            <>
                <ul className={classname}>
                    <li>
                        <TreeCard
                            board={board}
                            card={card}
                            visiblePropertyTemplates={[]}
                            isSelected={false}
                            visibleBadges={false}
                            readonly={false}
                            onClick={onClick}
                            onDrop={onDrop}
                            showCard={showCard}
                            isManualSort={false} />

                        {matrix[card.id].map((n: Card) => {

                                return <TreeList
                                    board={board}
                                    cards={cards}
                                    matrix={matrix}
                                    card={n}
                                    visited={visited}
                                    root={false}
                                    onClick={onClick}
                                    onDrop={onDrop}
                                    showCard={showCard} />;
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

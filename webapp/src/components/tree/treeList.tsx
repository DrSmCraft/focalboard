import React from "react";

import { Board } from "../../blocks/board";
import { Card } from "../../blocks/card";

import "./treeList.scss";
import { useAppSelector } from "../../store/hooks";
import { getCard } from "../../store/cards";
import TreeCard from "./treeCard";

type Props = {
    board: Board
    cards: Card[]
    matrix: { [p: string]: Card[] }
    cardId: string
    visited: string[]
    root?: boolean
    onClick?: (e: React.MouseEvent, card: Card) => void
    onDrop?: (srcCard: Card, dstCard: Card) => void
    showCard?: (cardId?: string) => void

}


const TreeList = (props: Props): JSX.Element => {
    const { board, cards, matrix, cardId, visited, root, showCard, onClick, onDrop } = props;
    // if (card === undefined) {
    //     return <></>;
    // }
    // if (visited.includes(card.id as string)) {
    //     return <></>;
    // }
    // else {
    let selfVisited = visited.includes(cardId);
    const classname: string = root ? "TreeList TreeListRoot" : "TreeList";

    let card = useAppSelector(getCard(cardId));


    visited.push(cardId);
    let children = matrix[cardId].filter((c) => !visited.includes(c.id));


    return (
        <>
            {(selfVisited || card === undefined) ? <></> : <ul className={classname}>
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
                        isManualSort={false}
                        visited={visited} />

                    {/*<span>{card?.title}</span>*/}

                    {children.map((n: Card) => {

                        return (<TreeList
                            key={card?.id}
                            board={board}
                            cards={cards}
                            matrix={matrix}
                            cardId={n.id}
                            visited={visited}
                            root={false}
                            onClick={onClick}
                            onDrop={onDrop}
                            showCard={showCard}/>);

                        }
                    )
                    }
                </li>
            </ul>
            }

        </>

    );
    // }
    // ;
};

export default TreeList;
